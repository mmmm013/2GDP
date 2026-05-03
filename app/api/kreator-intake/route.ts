import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeTrackTitle(raw: string) {
  return String(raw || "")
    .replace(/\.(mp3|wav|m4a|aif|aiff|flac|txt|pdf|docx|png|jpg|jpeg)$/i, "")
    .replace(/^\s*\d{1,4}\s*[-–—]\s*/u, "")
    .replace(/^\s*(KLEIGH|KLE\$IGH|Music Maykers|Lloyd G Miller|Lloyd Miller|Elle Christine|G Putnam Music|Michael Clay)\s*[-–—]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function safeName(raw: string) {
  return String(raw || "file")
    .replace(/[^\w.\-() ]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 160);
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  const form = await req.formData();

  const kreatorName = String(form.get("kreator_name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const role = String(form.get("role") || "").trim();
  const rawTitle = String(form.get("song_title_raw") || "").trim();
  const cleanTitle =
    String(form.get("song_title_clean") || "").trim() || normalizeTrackTitle(rawTitle);
  const versionType = String(form.get("version_type") || "other").trim();
  const notes = String(form.get("notes") || "").trim();
  const files = form.getAll("files").filter((item): item is File => item instanceof File);

  if (!kreatorName || !email || !cleanTitle) {
    return NextResponse.json(
      { error: "Missing required intake fields: Kreator name, email, and song title." },
      { status: 400 }
    );
  }

  if (files.length === 0) {
    return NextResponse.json(
      { error: "Please upload at least one file." },
      { status: 400 }
    );
  }

  const intakeId = `4pe-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const supabase = getSupabase();

  const intake = {
    intake_id: intakeId,
    kreator_name: kreatorName,
    email,
    role,
    song_title_raw: rawTitle,
    song_title_clean: cleanTitle,
    version_type: versionType,
    notes,
    status: "admin_review_required",
    public_publish_allowed: false,
    created_at: new Date().toISOString(),
  };

  const uploadedFiles: Array<{
    original_name: string;
    storage_path: string | null;
    size: number;
    type: string;
  }> = [];

  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "4PE Intake page is installed, but Supabase environment variables are not available for file storage yet.",
        intake_id: intakeId,
        intake,
        files: files.map((file) => ({
          original_name: file.name,
          storage_path: null,
          size: file.size,
          type: file.type,
        })),
      },
      { status: 503 }
    );
  }

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const storagePath = `kreator-intake/${intakeId}/${safeName(file.name)}`;

    const { error } = await supabase.storage
      .from("creator-assets")
      .upload(storagePath, Buffer.from(bytes), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        {
          error: `Upload failed for ${file.name}: ${error.message}`,
          intake_id: intakeId,
          uploaded_files: uploadedFiles,
        },
        { status: 500 }
      );
    }

    uploadedFiles.push({
      original_name: file.name,
      storage_path: storagePath,
      size: file.size,
      type: file.type || "application/octet-stream",
    });
  }

  // Optional database insert. If the table does not exist yet, do not fail the file intake.
  const { error: dbError } = await supabase.from("kreator_intake").insert({
    ...intake,
    files: uploadedFiles,
  });

  return NextResponse.json({
    ok: true,
    intake_id: intakeId,
    status: "admin_review_required",
    public_publish_allowed: false,
    title_normalization: {
      raw: rawTitle,
      clean: cleanTitle,
    },
    files: uploadedFiles,
    database_note: dbError
      ? `Files uploaded. Database record not saved yet: ${dbError.message}`
      : "Database intake record saved.",
  });
}

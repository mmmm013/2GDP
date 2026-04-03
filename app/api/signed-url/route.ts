import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase env vars (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  if (!_client) _client = createClient(url, key);
  return _client;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path"); // e.g. "k_kut/<pix_pck_id>/Verse/K-KUT.mp3"
    const bucket = url.searchParams.get("bucket") || "media";
    const expires = Number(url.searchParams.get("expires") || 300); // seconds

    if (!path) {
      return NextResponse.json({ error: "Missing 'path' param" }, { status: 400 });
    }

    const { data, error } = await getClient().storage
      .from(bucket)
      .createSignedUrl(path, expires);

    if (error || !data) {
      console.error("Supabase signed url error", error);
      return NextResponse.json({ error: "Failed to create signed URL" }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (err) {
    console.error("signed-url error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

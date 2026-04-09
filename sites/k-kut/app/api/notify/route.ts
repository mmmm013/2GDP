import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let body: { email?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const email = (body.email || "").trim().toLowerCase();
  const note = (body.note || "").trim().slice(0, 200);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, message: "A valid email address is required." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    console.warn(
      "[K-KUT notify] Supabase env vars not configured. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
    return NextResponse.json(
      {
        success: false,
        message:
          "Notification service is not yet configured. " +
          "Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("notify_signups").insert({
    email,
    note: note || null,
    source: "k-kut.com",
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[K-KUT notify] Supabase insert error:", error.message);
    // If it's a duplicate, treat as success to avoid leaking info
    if (error.code === "23505") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { success: false, message: "Failed to save. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

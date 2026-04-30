import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase();

    const { data, error } = await supabase
      .schema("app") // ✅ FIXED SCHEMA
      .from("mks")
      .select(
        "id,title,phrase,phrase_type,source_title,keenness_score,emotion_level,search_tags,audio_url,status"
      )
      .or(
        `phrase.ilike.%${q}%,title.ilike.%${q}%,search_tags.ilike.%${q}%`
      )
      .in("status", ["approved", "needs_review"])
      .order("keenness_score", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      query: q,
      count: data?.length || 0,
      moments: data || []
    });
  } catch (err: any) {
    console.error("API crash:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
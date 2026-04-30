import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();

  const { data, error } = await supabase
    .from("mks")
    .select("id,title,phrase,phrase_type,source_title,keenness_score,emotion_level,search_tags,audio_url")
    .or(`phrase.ilike.%${q}%,title.ilike.%${q}%,search_tags.ilike.%${q}%`)
    .in("status", ["approved", "needs_review"])
    .order("keenness_score", { ascending: false })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    query: q,
    moments: data || []
  });
}

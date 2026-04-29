import pg from "pg";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const { Pool } = pg;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/kkut_dev";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase keys in .env.local");
}

let useKey = SUPABASE_KEY;
try {
  const ref = SUPABASE_URL.split("//")[1].split(".")[0];
  const payload = JSON.parse(Buffer.from((process.env.SUPABASE_SERVICE_ROLE_KEY || "").split(".")[1] || "", "base64url").toString() || "{}");
  if (payload.ref && payload.ref !== ref) {
    console.log("Service key/project mismatch detected. Using anon key for Supabase read.");
    useKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }
} catch {}
const supabase = createClient(SUPABASE_URL, useKey);
const db = new Pool({ connectionString: DATABASE_URL });

const q = (s) => `"${s}"`;
const has = (cols, name) => cols.includes(name);

async function getCols(table) {
  const r = await db.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema='app'
      AND table_name=$1
    ORDER BY ordinal_position
  `, [table]);
  return r.rows.map(x => x.column_name);
}

function supabaseOnly(url) {
  return typeof url === "string" && url.startsWith(SUPABASE_URL);
}

async function main() {
  console.log("\nSTEP 1 — INSPECT SCHEMA");

  const pixCols = await getCols("pix");
  const kutCols = await getCols("kuts");

  console.log("app.pix:", pixCols.join(", "));
  console.log("app.kuts:", kutCols.join(", "));

  if (!has(pixCols, "title")) throw new Error("app.pix missing title");
  
  const pixAudio = has(pixCols, "audio_url") ? "audio_url" :
    has(pixCols, "source_audio_url") ? "source_audio_url" : null;
  if (!pixAudio) throw new Error("app.pix missing audio_url/source_audio_url");


  const pixDuration =
    has(pixCols, "duration_ms") ? "duration_ms" :
    has(pixCols, "duration_sec") ? "duration_sec" :
    has(pixCols, "duration") ? "duration" :
    null;

  if (!pixDuration) throw new Error("app.pix missing duration column");

  if (!has(pixCols, "source_track_id")) {
    console.log("Adding app.pix.source_track_id...");
    await db.query(`ALTER TABLE app.pix ADD COLUMN source_track_id text`);
    await db.query(`CREATE UNIQUE INDEX IF NOT EXISTS pix_source_track_id_uq ON app.pix(source_track_id)`);
    pixCols.push("source_track_id");
  }

  if (!has(pixCols, "source_metadata")) {
    console.log("Adding app.pix.source_metadata...");
    await db.query(`ALTER TABLE app.pix ADD COLUMN source_metadata jsonb DEFAULT '{}'::jsonb`);
    pixCols.push("source_metadata");
  }

  console.log("\nSTEP 2 — FETCH SUPABASE STORAGE BUCKET");

  const bucket = "tracks";
  const { data: files, error } = await supabase.storage
    .from(bucket)
    .list("", { limit: 1000, sortBy: { column: "name", order: "asc" } });

  if (error) throw error;

  const tracks = files
    .filter(f => f.name && !f.name.startsWith("."))
    .map(f => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(f.name);
      return {
        id: f.id || f.name,
        title: f.name.replace(/\.[^.]+$/, ""),
        audio_url: data.publicUrl,
        duration_ms: 0,
        metadata: f
      };
    });

  console.log("Supabase storage tracks:", tracks.length);

  console.log("\nSTEP 3 — UPSERT tracks → app.pix");

  for (const t of tracks) {
    const sourceTrackId = String(t.id ?? t.track_id ?? t.title);
    const title = t.title;
    const audioUrl = t.audio_url ?? t.url ?? t.public_url;
    const duration = t.duration_ms ?? t.duration_sec ?? t.duration;

    if (!title) throw new Error(`Missing title: ${JSON.stringify(t)}`);
    if (!audioUrl) throw new Error(`Missing audio_url for ${title}`);
    if (!supabaseOnly(audioUrl)) throw new Error(`Non-Supabase URL for ${title}: ${audioUrl}`);
    if (duration == null) throw new Error(`Missing duration for ${title}`);

    await db.query(`
      INSERT INTO app.pix
        (source_track_id, title, ${q(pixAudio)}, ${q(pixDuration)}, source_metadata)
      VALUES
        ($1, $2, $3, $4, $5::jsonb)
      ON CONFLICT (source_track_id)
      DO UPDATE SET
        title = EXCLUDED.title,
        ${q(pixAudio)} = EXCLUDED.${q(pixAudio)},
        ${q(pixDuration)} = EXCLUDED.${q(pixDuration)},
        source_metadata = EXCLUDED.source_metadata
    `, [sourceTrackId, title, audioUrl, duration, JSON.stringify(t)]);
  }

  console.log("PIX sync complete.");

  console.log("\nSTEP 4 — PREP app.kuts baseline columns");

  const freshKutCols = await getCols("kuts");

  if (!has(freshKutCols, "pix_id")) {
    console.log("Adding app.kuts.pix_id...");
    await db.query(`ALTER TABLE app.kuts ADD COLUMN pix_id uuid`);
  }

  if (!has(freshKutCols, "kut_type")) {
    console.log("Adding app.kuts.kut_type...");
    await db.query(`ALTER TABLE app.kuts ADD COLUMN kut_type text DEFAULT 'baseline'`);
  }

  await db.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS kuts_one_baseline_per_pix_uq
    ON app.kuts(pix_id)
    WHERE kut_type = 'baseline'
  `);

  
  if (!has(await getCols("kuts"), "duration_ms")) {
    console.log("Adding app.kuts.duration_ms...");
    await db.query(`ALTER TABLE app.kuts ADD COLUMN duration_ms integer`);
  }

  const finalKutCols = await getCols("kuts");


  const kutDuration =
    has(finalKutCols, "duration_ms") ? "duration_ms" :
    has(finalKutCols, "duration_sec") ? "duration_sec" :
    has(finalKutCols, "duration") ? "duration" :
    null;

  if (!kutDuration) throw new Error("app.kuts missing duration column");
  if (!has(finalKutCols, "title")) throw new Error("app.kuts missing title");
  
  const kutAudio = has(finalKutCols, "audio_url") ? "audio_url" :
    has(finalKutCols, "source_audio_url") ? "source_audio_url" :
    has(finalKutCols, "pix_audio_url") ? "pix_audio_url" : null;
  if (!kutAudio) throw new Error("app.kuts missing audio_url/source_audio_url/pix_audio_url");


  const statusClause = has(finalKutCols, "status") ? ", status" : "";
  const statusValue = has(finalKutCols, "status") ? ", 'baseline'" : "";

  console.log("\nSTEP 5 — GENERATE baseline app.kuts");

  await db.query(`
    INSERT INTO app.kuts
      (pix_id, kut_type, title, ${q(kutAudio)}, ${q(kutDuration)}${statusClause})
    SELECT
      p.id,
      'baseline',
      p.title || ' — Baseline KUT',
      p.${q(pixAudio)},
      p.${q(pixDuration)}
      ${statusValue}
    FROM app.pix p
    WHERE p.${q(pixAudio)} IS NOT NULL
    ON CONFLICT (pix_id)
    WHERE kut_type = 'baseline'
    DO UPDATE SET
      title = EXCLUDED.title,
      ${q(kutAudio)} = EXCLUDED.${q(kutAudio)},
      ${q(kutDuration)} = EXCLUDED.${q(kutDuration)}
  `);

  console.log("Baseline KUT generation complete.");

  console.log("\nSTEP 6 — VALIDATION");

  const v = await db.query(`
    WITH
    pix_count AS (
      SELECT count(*)::int n FROM app.pix
    ),
    kut_count AS (
      SELECT count(*)::int n FROM app.kuts WHERE kut_type='baseline'
    ),
    pix_dupes AS (
      SELECT count(*)::int n
      FROM (
        SELECT source_track_id
        FROM app.pix
        GROUP BY source_track_id
        HAVING count(*) > 1
      ) x
    ),
    kut_dupes AS (
      SELECT count(*)::int n
      FROM (
        SELECT pix_id
        FROM app.kuts
        WHERE kut_type='baseline'
        GROUP BY pix_id
        HAVING count(*) > 1
      ) x
    ),
    missing_pix_audio AS (
      SELECT count(*)::int n
      FROM app.pix
      WHERE ${q(pixAudio)} IS NULL OR ${q(pixAudio)} = ''
    ),
    bad_pix_audio AS (
      SELECT count(*)::int n
      FROM app.pix
      WHERE ${q(pixAudio)} NOT LIKE $1
    ),
    missing_pix_duration AS (
      SELECT count(*)::int n
      FROM app.pix
      WHERE ${q(pixDuration)} IS NULL
    ),
    duration_mismatch AS (
      SELECT count(*)::int n
      FROM app.pix p
      JOIN app.kuts k ON k.pix_id = p.id AND k.kut_type='baseline'
      WHERE p.${q(pixDuration)} IS DISTINCT FROM k.${q(kutDuration)}
    )
    SELECT
      (SELECT n FROM pix_count) pix_count,
      (SELECT n FROM kut_count) baseline_kut_count,
      (SELECT n FROM pix_dupes) pix_duplicates,
      (SELECT n FROM kut_dupes) kut_duplicates,
      (SELECT n FROM missing_pix_audio) missing_pix_audio,
      (SELECT n FROM bad_pix_audio) non_supabase_pix_audio,
      (SELECT n FROM missing_pix_duration) missing_pix_duration,
      (SELECT n FROM duration_mismatch) duration_mismatch
  `, [`${SUPABASE_URL}%`]);

  console.table(v.rows);

  const row = v.rows[0];
  const pass =
    row.pix_count === row.baseline_kut_count &&
    row.pix_duplicates === 0 &&
    row.kut_duplicates === 0 &&
    row.missing_pix_audio === 0 &&
    row.non_supabase_pix_audio === 0 &&
    row.missing_pix_duration === 0 &&
    row.duration_mismatch === 0;

  console.log(pass ? "\n✅ PASS — REAL PIPELINE VALIDATED\n" : "\n❌ FAIL — SEE VALIDATION TABLE\n");

  await db.end();
  if (!pass) process.exit(1);
}

main().catch(async err => {
  console.error("\nPIPELINE ERROR:");
  console.error(err.message);
  await db.end().catch(() => {});
  process.exit(1);
});

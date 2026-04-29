import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const { Pool } = pg;
const db = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://localhost/kkut_dev" });

(async () => {
  console.log("STEP — GENERATE K-KUTs (KKs)");

  // create KK entries distinct from baseline
  const res = await db.query(`
    INSERT INTO app.kuts (pix_id, kut_type, title, audio_url, duration_ms, status)
    SELECT
      p.id,
      'kk',
      p.title || ' — KK',
      p.source_audio_url,
      p.duration_ms,
      'generated'
    FROM app.pix p
    WHERE NOT EXISTS (
      SELECT 1 FROM app.kuts k
      WHERE k.pix_id = p.id
      AND k.kut_type = 'kk'
    );
  `);

  console.log("KKs created:", res.rowCount);

  await db.end();
})();

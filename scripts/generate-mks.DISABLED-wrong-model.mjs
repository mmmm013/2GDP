import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const { Pool } = pg;
const db = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://localhost/kkut_dev" });

(async () => {
  console.log("GENERATE mini-KUTs (mKs) FROM K-KUTs");

  const res = await db.query(`
    INSERT INTO app.mks (
      title,
      audio_url,
      pix_audio_url,
      start_ms,
      end_ms,
      status,
      source_title
    )
    SELECT
      k.title || ' — mK',
      k.audio_url,
      k.pix_audio_url,
      k.start_ms,
      k.end_ms,
      'generated',
      k.source_track_title
    FROM app.kuts k
    WHERE k.kut_type = 'kk'
      AND NOT EXISTS (
        SELECT 1 FROM app.mks m
        WHERE m.source_title = k.source_track_title
          AND m.start_ms = k.start_ms
          AND m.end_ms = k.end_ms
      );
  `);

  console.log("mKs created:", res.rowCount);

  await db.end();
})();

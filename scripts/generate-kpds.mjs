import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const { Pool } = pg;
const db = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://localhost/kkut_dev" });

(async () => {
  console.log("GENERATE K-UPIDs (KPDs) FROM mKs");

  const res = await db.query(`
    INSERT INTO app.kuts (
      kut_type,
      product_type,
      title,
      audio_url,
      start_ms,
      end_ms,
      status,
      source_track_title
    )
    SELECT
      'kpd',
      'K-UPID',
      m.title || ' — KPD',
      m.audio_url,
      m.start_ms,
      m.end_ms,
      'generated',
      m.source_title
    FROM app.mks m
    WHERE m.status='generated'
      AND NOT EXISTS (
        SELECT 1 FROM app.kuts k
        WHERE k.kut_type='kpd'
          AND k.source_track_title = m.source_title
          AND k.start_ms = m.start_ms
          AND k.end_ms = m.end_ms
      );
  `);

  console.log("KPDs created:", res.rowCount);

  await db.end();
})();

import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const { Pool } = pg;
const db = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://localhost/kkut_dev" });

(async () => {
  console.log("GENERATE REAL K-KUTs FROM structure_map_sections");

  const res = await db.query(`
    INSERT INTO app.kuts (
      pix_id,
      kut_type,
      title,
      source_track_title,
      audio_url,
      source_audio_url,
      pix_audio_url,
      start_ms,
      end_ms,
      duration_ms,
      status,
      product_type
    )
    SELECT
      p.id,
      'kk',
      p.title || ' — ' || s.section_label,
      p.title,
      p.source_audio_url,
      p.source_audio_url,
      p.source_audio_url,
      s.start_ms,
      s.end_ms,
      s.end_ms - s.start_ms,
      'generated',
      'K-KUT'
    FROM app.structure_map_sections s
    JOIN app.pix p ON p.id = s.pix_id
    WHERE s.start_ms IS NOT NULL
      AND s.end_ms IS NOT NULL
      AND s.end_ms > s.start_ms
      AND NOT EXISTS (
        SELECT 1
        FROM app.kuts k
        WHERE k.pix_id = s.pix_id
          AND k.kut_type = 'kk'
          AND k.start_ms = s.start_ms
          AND k.end_ms = s.end_ms
      );
  `);

  console.log("REAL KKs created:", res.rowCount);

  await db.end();
})();

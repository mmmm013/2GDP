import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const { Pool } = pg;
const db = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://localhost/kkut_dev" });

const sections = [
  ["INTRO", "Intro", 1, 0, 12000],
  ["VERSE", "V1", 2, 12000, 35000],
  ["CHORUS", "Ch1", 3, 35000, 75000],
  ["VERSE", "V2", 4, 75000, 90000],
  ["CHORUS", "Ch2", 5, 90000, 115000],
  ["OUTRO", "Outro", 6, 115000, 140000],
];

(async () => {
  console.log("MAP ALL PIX WITHOUT SECTIONS");

  let created = 0;

  const pix = await db.query(`
    SELECT p.id
    FROM app.pix p
    WHERE NOT EXISTS (
      SELECT 1 FROM app.structure_map_sections s
      WHERE s.pix_id = p.id
    )
    ORDER BY p.title
  `);

  for (const p of pix.rows) {
    for (const [type, label, order, start, end] of sections) {
      await db.query(`
        INSERT INTO app.structure_map_sections
          (pix_id, section_type, section_label, section_order, start_ms, end_ms, section_status, template_applied, locked)
        VALUES
          ($1, $2, $3, $4, $5, $6, 'generated', true, false)
      `, [p.id, type, label, order, start, end]);
      created++;
    }
  }

  console.log("PIX mapped:", pix.rowCount);
  console.log("Sections created:", created);

  await db.end();
})();

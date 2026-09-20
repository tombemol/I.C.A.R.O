import type { NewLifeEvent } from '../types/lifeEvent';

const DATABASE_URL = 'sqlite:icaro.db';

function isTauriRuntime() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function getDatabase() {
  const { default: Database } = await import('@tauri-apps/plugin-sql');
  return Database.load(DATABASE_URL);
}

export async function upsertHealthEvidence(input: NewLifeEvent): Promise<void> {
  if (!isTauriRuntime()) return;

  const event = {
    ...input,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };

  const db = await getDatabase();
  await db.execute(
    `INSERT INTO life_event (
      id, event_date, event_type, source, attribute, attribute_points, quantity,
      unit, reference_id, dedupe_key, metadata_json, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT(dedupe_key) DO UPDATE SET
      quantity = excluded.quantity,
      unit = excluded.unit,
      metadata_json = excluded.metadata_json,
      created_at = excluded.created_at`,
    [
      event.id,
      event.eventDate,
      event.type,
      event.source,
      event.attribute,
      event.attributePoints,
      event.quantity,
      event.unit,
      event.referenceId,
      event.dedupeKey,
      JSON.stringify(event.metadata),
      event.createdAt,
    ],
  );
}

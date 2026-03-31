export type InventoryMetadata = {
  characterId: string | null;
};

export function parseInventoryMetadata(metadata: string | null): InventoryMetadata {
  if (!metadata) return { characterId: null };

  try {
    const parsed = JSON.parse(metadata) as { characterId?: unknown };
    const characterId = typeof parsed.characterId === "string" ? parsed.characterId : null;
    return { characterId };
  } catch {
    return { characterId: null };
  }
}

export function stringifyInventoryMetadata(value: InventoryMetadata): string | null {
  if (!value.characterId) return null;
  return JSON.stringify({ characterId: value.characterId });
}

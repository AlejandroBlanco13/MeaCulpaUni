/** Metadatos visuales deterministas por gremio (sin columnas extra en BD). */

export type GuildFaction =
  | "guerreros"
  | "hechiceros"
  | "asesinos"
  | "artesanos"
  | "clerigos"
  | "exploradores";

export type GuildRarity = "legendario" | "epico" | "raro";

export const FACTION_ORDER: GuildFaction[] = [
  "guerreros",
  "hechiceros",
  "asesinos",
  "artesanos",
  "clerigos",
  "exploradores",
];

export const FACTION_LABEL: Record<GuildFaction, string> = {
  guerreros: "Guerreros",
  hechiceros: "Hechiceros",
  asesinos: "Asesinos",
  artesanos: "Artesanos",
  clerigos: "Clérigos",
  exploradores: "Exploradores",
};

const TAG_POOLS: Record<GuildFaction, string[]> = {
  guerreros: ["Combate", "Defensa", "Honor", "Escudo", "Vanguardia"],
  hechiceros: ["Arcano", "Ritual", "Conjuro", "Sabiduría", "Etereo"],
  asesinos: ["Sigilo", "Sombra", "Emboscada", "Veneno", "Contrato"],
  artesanos: ["Oficio", "Forja", "Mercado", "Contrato", "Taller"],
  clerigos: ["Fe", "Luz", "Sanación", "Juramento", "Templo"],
  exploradores: ["Rutas", "Mapas", "Avanzadilla", "Naturaleza", "Avistamiento"],
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getFactionForGuild(id: string): GuildFaction {
  return FACTION_ORDER[hashString(id) % FACTION_ORDER.length];
}

export function getGuildDisplayLevel(id: string, name: string): number {
  const n = hashString(`${id}:${name}`);
  return 1 + (n % 20);
}

export function getGuildRarity(id: string, name: string): GuildRarity {
  const r = hashString(`${name}|${id}`) % 3;
  if (r === 0) return "legendario";
  if (r === 1) return "epico";
  return "raro";
}

export function getGuildTags(faction: GuildFaction, id: string): string[] {
  const pool = TAG_POOLS[faction];
  const start = hashString(id) % pool.length;
  const out: string[] = [];
  for (let k = 0; k < 3; k++) {
    out.push(pool[(start + k) % pool.length]);
  }
  const seen: Record<string, true> = {};
  const uniq: string[] = [];
  for (const t of out) {
    if (!seen[t]) {
      seen[t] = true;
      uniq.push(t);
    }
  }
  return uniq;
}

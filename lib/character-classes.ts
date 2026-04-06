import type { StaticImageData } from "next/image";
import barbaro from "@/app/IMG/Homepage/Personajes/barbaro.webp";
import bardo from "@/app/IMG/Homepage/Personajes/bardo.webp";
import brujo from "@/app/IMG/Homepage/Personajes/brujo.webp";
import clerigo from "@/app/IMG/Homepage/Personajes/clerigo.webp";
import druida from "@/app/IMG/Homepage/Personajes/druida.webp";
import explorador from "@/app/IMG/Homepage/Personajes/explorador.webp";
import guerrero from "@/app/IMG/Homepage/Personajes/guerrero.webp";
import hechicero from "@/app/IMG/Homepage/Personajes/hechicero.webp";
import mago from "@/app/IMG/Homepage/Personajes/mago.webp";
import monje from "@/app/IMG/Homepage/Personajes/monje.webp";
import paladin from "@/app/IMG/Homepage/Personajes/paladin.webp";
import picaro from "@/app/IMG/Homepage/Personajes/picaro.webp";
import profileplaceholder from "@/app/IMG/Homepage/Personajes/profileplaceholder.webp";

export type CharacterClassOption = {
  /** Valor guardado en `characters.class_type` */
  value: string;
  label: string;
  image: StaticImageData;
};

/** Orden de presentación; una entrada por archivo en `Personajes/` (excepto placeholder). */
export const CHARACTER_CLASSES: CharacterClassOption[] = [
  { value: "Bárbaro", label: "Bárbaro", image: barbaro },
  { value: "Bardo", label: "Bardo", image: bardo },
  { value: "Brujo", label: "Brujo", image: brujo },
  { value: "Clérigo", label: "Clérigo", image: clerigo },
  { value: "Druida", label: "Druida", image: druida },
  { value: "Explorador", label: "Explorador", image: explorador },
  { value: "Guerrero", label: "Guerrero", image: guerrero },
  { value: "Hechicero", label: "Hechicero", image: hechicero },
  { value: "Mago", label: "Mago", image: mago },
  { value: "Monje", label: "Monje", image: monje },
  { value: "Paladín", label: "Paladín", image: paladin },
  { value: "Pícaro", label: "Pícaro", image: picaro },
];

const stripDiacritics = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Textos antiguos del selector / BD → clase canónica actual */
const LEGACY_CLASS_TO_CANONICAL: Record<string, string> = {
  ladron: "Pícaro",
  clerigo: "Clérigo",
  paladin: "Paladín",
  barbaro: "Bárbaro",
  guerrero: "Guerrero",
  mago: "Mago",
  bardo: "Bardo",
  explorador: "Explorador",
  brujo: "Brujo",
  druida: "Druida",
  hechicero: "Hechicero",
  monje: "Monje",
  picaro: "Pícaro",
};

function canonicalClassLabel(classType: string | null | undefined): string | null {
  if (!classType?.trim()) return null;
  const raw = classType.trim();
  const exact = CHARACTER_CLASSES.find((c) => c.value === raw);
  if (exact) return exact.value;

  const lower = stripDiacritics(raw).toLowerCase();
  if (LEGACY_CLASS_TO_CANONICAL[lower]) return LEGACY_CLASS_TO_CANONICAL[lower];

  const fuzzy = CHARACTER_CLASSES.find(
    (c) => stripDiacritics(c.value).toLowerCase() === lower
  );
  return fuzzy?.value ?? null;
}

export function getPortraitForClass(classType: string | null | undefined): StaticImageData {
  const canonical = canonicalClassLabel(classType);
  if (!canonical) return profileplaceholder;
  const row = CHARACTER_CLASSES.find((c) => c.value === canonical);
  return row?.image ?? profileplaceholder;
}

/** Para estadísticas y texto: unifica variantes antiguas al nombre actual */
export function normalizeClassLabelForStats(classType: string | null | undefined): string {
  return canonicalClassLabel(classType) ?? "Sin clase";
}

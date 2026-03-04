import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const FREE_CHARACTER_SLOTS = 2;
export const GUILD_MAX_MEMBERS_DEFAULT = 10;

export function isPrincipiante(level: string) {
  return level === "principiante";
}

export function isExperimentado(level: string) {
  return level === "experimentado";
}

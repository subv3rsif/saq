export const LOOPS = ['nord', 'centre_nord', 'centre_sud', 'sud'] as const;
export type Loop = typeof LOOPS[number];

export function normalizeLoop(input: unknown): Loop | null {
  if (!input || typeof input !== 'string') return null;
  const v = input.trim().toLowerCase();
  return (LOOPS as readonly string[]).includes(v) ? (v as Loop) : null;
}

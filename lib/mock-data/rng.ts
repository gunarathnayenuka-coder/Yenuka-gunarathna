/**
 * Deterministic seeded PRNG so mock data is stable across server and client
 * renders (avoids Next.js hydration mismatches that Math.random() would cause).
 */
export function createRng(seed: number) {
  let state = seed >>> 0;
  return function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = ReturnType<typeof createRng>;

export function seededHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function rngFor(namespace: string): Rng {
  return createRng(seededHash(namespace) + 1);
}

export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randFloat(rng: Rng, min: number, max: number, decimals = 1): number {
  const value = rng() * (max - min) + min;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length) % items.length];
}

export function pickMany<T>(rng: Rng, items: readonly T[], count: number): T[] {
  const pool = [...items];
  const result: T[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}

export function chance(rng: Rng, probability: number): boolean {
  return rng() < probability;
}

/** ISO date string `daysAgo` days before the fixed reference "today". */
export function daysAgo(days: number): string {
  const d = new Date(REFERENCE_NOW);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

export function daysFromNow(days: number): string {
  return daysAgo(-days);
}

/** Fixed reference "now" so all generated relative dates are stable. */
export const REFERENCE_NOW = "2026-09-09T08:00:00.000Z";

export function makeId(prefix: string, index: number): string {
  return `${prefix}_${index.toString().padStart(4, "0")}`;
}

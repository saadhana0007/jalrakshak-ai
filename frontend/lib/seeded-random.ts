// Deterministic PRNG so mock data is identical on server render and client
// hydration (avoids Next.js hydration mismatches from Math.random()).
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededPick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function seededRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

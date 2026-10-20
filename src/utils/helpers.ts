// Local type alias — avoids a circular ESM import at runtime
type QAPairLocal = { askerId: string; answerId: string; round: 1 | 2 };

/** Fisher-Yates shuffle — returns a new array */
export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate a list of (asker → answerer) pairs so that:
 * - Each player asks exactly once
 * - No player asks themselves
 * - The assignment is random
 */
export function generateQAPairs(playerIds: string[], round: 1 | 2): QAPairLocal[] {
  const shuffled = shuffleArray(playerIds);
  // Create a derangement-ish assignment: asker[i] asks asker[(i+1) % n]
  return shuffled.map((askerId, i) => ({
    askerId,
    answerId: shuffled[(i + 1) % shuffled.length],
    round,
  }));
}

/** Pick a random element from an array */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a unique ID */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Format a number with leading zero */
export function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

import seedrandom from "seedrandom";

const generateSeed = () => {
  return Math.floor(Date.now() / (1000 * 60 * 5)).toString();
};

export function fisherYatesShuffle<T>(array: T[], seed?: string): T[] {
  const rng = seedrandom(seed || generateSeed());
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

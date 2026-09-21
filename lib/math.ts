/** Modulo that stays non-negative for negative `n`. */
export const mod = (n: number, m: number) => ((n % m) + m) % m;

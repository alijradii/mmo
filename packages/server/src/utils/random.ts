export const diceRoll = (sides: number) => {
  return Math.floor(Math.random() * sides) + 1;
};

export const randomizePercent = (n: number, percent: number) => {
  const variation = 1 + (Math.random() * 2 - 1) * (percent / 100);
  return Math.floor(n * variation);
};

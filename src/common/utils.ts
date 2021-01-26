export const getRandomInt = (max: number): number => Math.floor(Math.random() * Math.floor(max));
export const getRandomItem = <T>(items: T[]): T => items[getRandomInt(items.length)];

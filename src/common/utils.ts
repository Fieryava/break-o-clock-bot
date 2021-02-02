export const getRandomInt = (max: number): number => Math.floor(Math.random() * Math.floor(max));
export const getRandomItem = <T>(items: T[]): T => items[getRandomInt(items.length)];

export const millisecondsToSeconds = (milliseconds: number): number => milliseconds / 1000;
export const millisecondsToMinutes = (milliseconds: number): number => millisecondsToSeconds(milliseconds) / 60;
export const minutesToSeconds = (minutes: number): number => minutes * 60;
export const minutesToMilliseconds = (minutes: number): number => minutesToSeconds(minutes) * 1000;

export const minutesToStatus = (minutes: number): string => `${Math.floor(minutes)} min ${Math.floor((minutes * 60) % 60)} sec`;

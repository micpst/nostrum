import type { SyntheticEvent } from "react";
import type { User } from "@/app/lib/types/user";

export const shortenHash = (hash: string, length: number = 4): string => {
  if (hash.length <= length * 2) {
    return hash;
  }
  return (
    hash.substring(0, length) + "..." + hash.substring(hash.length - length)
  );
};

export function preventBubbling(
  callback?: ((...args: never[]) => unknown) | null,
  noPreventDefault?: boolean,
) {
  return (e: SyntheticEvent): void => {
    e.stopPropagation();
    if (!noPreventDefault) e.preventDefault();
    if (callback) callback();
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getUserName(user: User): string {
  return user.displayName || user.display_name || user.name || "";
}

export function validateProfileContent(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch (e) {
    return false;
  }
}

export const findMostFrequent = (
  items: string[],
  numItems: number = 3,
): string[] => {
  const frequencyMap = items.reduce((acc, item) => {
    const count = acc.get(item) || 0;
    acc.set(item, count + 1);
    return acc;
  }, new Map());

  return Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numItems)
    .map((item) => item[0]);
};

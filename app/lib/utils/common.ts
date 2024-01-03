import type { User } from "@/app/lib/types/user";

export const shortenHash = (hash: string, length: number = 4): string => {
  if (hash.length <= length * 2) {
    return hash;
  }
  return (
    hash.substring(0, length) + "..." + hash.substring(hash.length - length)
  );
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getUserName(user: User): string {
  return user.displayName || user.display_name || user.name || "";
}

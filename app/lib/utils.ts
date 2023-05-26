export const shortenHash = (hash: string, length: number = 4): string => {
  return (
    hash.substring(0, length) + "..." + hash.substring(hash.length - length)
  );
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

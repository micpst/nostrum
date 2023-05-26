import { useState, useEffect } from "react";

type UseExtension = {
  isAvailable: boolean;
};

export function useExtension(): UseExtension {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  useEffect(() => {
    if (window.nostr !== undefined) {
      setIsAvailable(true);
    }
  }, []);

  return { isAvailable };
}

import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [value, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    const item = window.localStorage.getItem(key);

    try {
      if (item) return JSON.parse(item);

      window.localStorage.setItem(key, JSON.stringify(initialValue));
    } catch (error) {
      console.log(error);
    }

    return initialValue;
  });

  const setValue = (newValue: T): void => {
    setStoredValue(newValue);

    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.log(error);
    }
  };

  return [value, setValue];
}

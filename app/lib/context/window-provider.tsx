"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type WindowSize = {
  width: number;
  height: number;
};

type WindowContext = WindowSize & {
  isMobile: boolean;
};

type WindowProviderProps = {
  children: ReactNode;
};

export const WindowContext = createContext<WindowContext | null>(null);

export default function WindowProvider({
  children,
}: WindowProviderProps): JSX.Element {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = (): void =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const value: WindowContext = {
    ...windowSize,
    isMobile: windowSize.width < 500,
  };

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindow(): WindowContext {
  const context = useContext(WindowContext);

  if (!context)
    throw new Error("useWindow must be used within an WindowProvider");

  return context;
}

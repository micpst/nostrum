import { useEffect, useState } from "react";

type WindowSize = {
  width: number;
  height: number;
};

type UseWindow = WindowSize & {
  isMobile: boolean;
};

export function useWindow(): UseWindow {
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

  return {
    ...windowSize,
    isMobile: windowSize.width < 500,
  };
}

"use client";

import type { ReactNode } from "react";
import { useWindow } from "@/app/context/window-provider";

function Aside({ children }: { children: ReactNode }) {
  const { width } = useWindow();

  if (width < 1024) return null;

  return <aside className="flex w-96 flex-col gap-4 p-4">{children}</aside>;
}

export default Aside;

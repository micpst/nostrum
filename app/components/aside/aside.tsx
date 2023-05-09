"use client";

import type { ReactNode } from "react";
import { useWindow } from "@/app/context/window-provider";

function Aside({ children }: { children: ReactNode }) {
  const { width } = useWindow();

  if (width < 1024) return null;

  return (
    <aside className="flex w-[30rem] flex-col gap-4 px-4 py-3 pt-1">
      <div className="sticky top-0 h-[50rem]">{children}</div>
    </aside>
  );
}

export default Aside;

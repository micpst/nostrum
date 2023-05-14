"use client";

import type { ReactNode } from "react";
import { useWindow } from "@/app/lib/context/window-provider";

function Aside({ children }: { children: ReactNode }) {
  const { width } = useWindow();

  if (width < 1024) return null;

  return (
    <aside className="w-[30rem]">
      <div className="flex flex-col gap-4 sticky top-0 h-[50rem] px-4 pt-1">
        {children}
      </div>
    </aside>
  );
}

export default Aside;

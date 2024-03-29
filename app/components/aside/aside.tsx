"use client";

import type { ReactNode } from "react";
import { useWindow } from "@/app/lib/hooks/useWindow";

function Aside({ children }: { children: ReactNode }) {
  const { width } = useWindow();

  if (width < 1024) return null;

  return (
    <aside className="w-[30rem]">
      <div className="flex flex-col gap-4 sticky top-0 px-4 pt-1.5">
        {children}
      </div>
    </aside>
  );
}

export default Aside;

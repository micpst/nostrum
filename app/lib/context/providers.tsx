"use client";

import type { ReactNode } from "react";
import RelayProvider from "@/app/lib/context/relay-provider";
import WindowProvider from "@/app/lib/context/window-provider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <WindowProvider>
      <RelayProvider>{children}</RelayProvider>
    </WindowProvider>
  );
}

export default Providers;

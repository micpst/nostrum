"use client";

import type { ReactNode } from "react";
import RelayProvider from "@/app/context/relay-provider";
import WindowProvider from "@/app/context/window-provider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <WindowProvider>
      <RelayProvider>{children}</RelayProvider>
    </WindowProvider>
  );
}

export default Providers;

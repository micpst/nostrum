"use client";

import type { ReactNode } from "react";
import RelayProvider from "@/app/lib/context/relay-provider";
import WindowProvider from "@/app/lib/context/window-provider";
import AuthProvider from "@/app/lib/context/auth-provider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RelayProvider>
        <WindowProvider>{children}</WindowProvider>
      </RelayProvider>
    </AuthProvider>
  );
}

export default Providers;

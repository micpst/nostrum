"use client";

import { ReactNode } from "react";
import RelayProvider from "@/app/context/relay-provider";

function Providers({ children }: { children: ReactNode }) {
  return <RelayProvider>{children}</RelayProvider>;
}

export default Providers;

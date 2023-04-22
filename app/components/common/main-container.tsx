import type { ReactNode } from "react";

function Main({ children }: { children: ReactNode }) {
  return <main className="flex min-h-screen w-full max-w-5xl">{children}</main>;
}

export default Main;

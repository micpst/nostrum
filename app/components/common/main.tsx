import type { ReactNode } from "react";

type MainProps = {
  children: ReactNode;
};

export function Main({ children }: MainProps): JSX.Element {
  return (
    <main className="flex w-[calc(100vw-4.5rem)] sm:w-[calc(100vw-7rem)] md:w-[calc(100vw-10rem)] lg:w-[calc(100vw-7rem)] min-h-screen max-w-[64rem]">
      {children}
    </main>
  );
}

export default Main;

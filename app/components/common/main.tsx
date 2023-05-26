import type { ReactNode } from "react";

type MainProps = {
  children: ReactNode;
};

export function Main({ children }: MainProps): JSX.Element {
  return (
    <main
      className="flex w-[calc(100vw-4.5rem)] max-w-[64rem] min-h-screen z-10
                 sm:w-[calc(100vw-7rem)] md:w-[calc(100vw-10rem)] lg:w-[calc(100vw-7rem)]"
    >
      {children}
    </main>
  );
}

export default Main;

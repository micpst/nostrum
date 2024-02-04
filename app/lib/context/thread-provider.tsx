import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { NoteEvent } from "@/app/lib/types/event";

type ThreadContext = {
  root: NoteEvent | null;
  isLoading: boolean;
};

export const ThreadContext = createContext<ThreadContext | null>(null);

type ThreadContextProviderProps = {
  value: ThreadContext;
  children: ReactNode;
};

export default function ThreadProvider({
  value,
  children,
}: ThreadContextProviderProps): JSX.Element {
  return (
    <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
  );
}

export function useThread(): ThreadContext {
  const context = useContext(ThreadContext);

  if (!context)
    throw new Error("useThread must be used within an ThreadProvider");

  return context;
}

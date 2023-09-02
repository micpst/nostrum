"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useNotes } from "@/app/lib/hooks/useNotes";
import type { RelayEvent } from "@/app/lib/types/event";

type ExploreContext = {
  notes: RelayEvent[];
  references: Map<string, RelayEvent>;
  isLoading: boolean;
  loadMore: () => Promise<void>;
};

type ExploreProviderProps = {
  children: ReactNode;
};

export const ExploreContext = createContext<ExploreContext | null>(null);

export default function ExploreProvider({ children }: ExploreProviderProps) {
  const { notes, references, isLoading, loadMore } = useNotes();

  const value: ExploreContext = {
    notes,
    references,
    isLoading,
    loadMore,
  };

  return (
    <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>
  );
}

export function useExplore(): ExploreContext {
  const context = useContext(ExploreContext);

  if (!context)
    throw new Error("useExplore must be used within an ExploreProvider");

  return context;
}

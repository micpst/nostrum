/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useRelay } from "@/app/lib/context/relay-provider";
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
  const { relays } = useRelay();
  const { notes, references, isLoading, init, loadMore } = useNotes({
    initPageSize: 20,
    pageSize: 10,
  });

  useEffect(() => {
    console.log("ExploreProvider: useEffect", relays);
    void init();
  }, [relays]);

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

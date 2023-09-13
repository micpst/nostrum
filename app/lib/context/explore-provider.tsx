"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useFeed } from "@/app/lib/hooks/useFeed";
import type { RelayEvent } from "@/app/lib/types/event";

type ExploreContext = {
  notes: RelayEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

type ExploreProviderProps = {
  children: ReactNode;
};

export const ExploreContext = createContext<ExploreContext | null>(null);

export default function ExploreProvider({ children }: ExploreProviderProps) {
  const { notes, isLoading, loadMoreRef } = useFeed({
    filter: { kinds: [1] },
  });

  const value: ExploreContext = {
    notes,
    isLoading,
    loadMoreRef,
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

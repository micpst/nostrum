"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useFollowing } from "@/app/lib/context/following-provider";
import { useFeed } from "@/app/lib/hooks/useFeed";
import type { RelayEvent } from "@/app/lib/types/event";

type HomeContext = {
  notes: RelayEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

type HomeProviderProps = {
  children: ReactNode;
};

export const HomeContext = createContext<HomeContext | null>(null);

export default function HomeProvider({ children }: HomeProviderProps) {
  const { following } = useFollowing();
  const { notes, isLoading, loadMoreRef } = useFeed({
    filter: { kinds: [1], authors: Array.from(following) },
  });

  const value: HomeContext = {
    notes,
    isLoading,
    loadMoreRef,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHome(): HomeContext {
  const context = useContext(HomeContext);

  if (!context) throw new Error("useHome must be used within an HomeProvider");

  return context;
}

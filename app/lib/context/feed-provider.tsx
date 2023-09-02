/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useFollowing } from "@/app/lib/context/following-provider";
import { useNotes } from "@/app/lib/hooks/useNotes";
import type { RelayEvent } from "@/app/lib/types/event";

type FeedContext = {
  notes: RelayEvent[];
  references: Map<string, RelayEvent>;
  isLoading: boolean;
  loadMore: () => Promise<void>;
};

type FeedProviderProps = {
  children: ReactNode;
};

export const FeedContext = createContext<FeedContext | null>(null);

export default function FeedProvider({ children }: FeedProviderProps) {
  const { publicKey } = useAuth();
  const { following } = useFollowing();
  const { notes, references, isLoading, loadMore, reset } = useNotes({
    filter: { authors: Array.from(following) },
  });

  useEffect(() => {
    if (!publicKey) reset();
  }, [publicKey]);

  const value: FeedContext = {
    notes,
    references,
    isLoading,
    loadMore,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed(): FeedContext {
  const context = useContext(FeedContext);

  if (!context) throw new Error("useFeed must be used within an FeedProvider");

  return context;
}
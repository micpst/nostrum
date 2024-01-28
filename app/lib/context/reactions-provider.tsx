/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useState } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import reactionService from "@/app/lib/services/reactionService";
import type { ProviderProps } from "@/app/lib/context/providers";
import type { RelayEvent } from "@/app/lib/types/event";

type ReactionsContext = {
  reactions: Map<string, string>;
  isLoading: Set<string>;
  fetchReactions: (eventIds: string[]) => Promise<void>;
  like: (event: RelayEvent) => Promise<void>;
  unlike: (event: RelayEvent) => Promise<void>;
};

export const ReactionsContext = createContext<ReactionsContext | null>(null);

export default function ReactionsProvider({ children }: ProviderProps) {
  const { publicKey } = useAuth();
  const { relays } = useRelay();

  const [reactions, setReactions] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState<Set<string>>(new Set());

  const fetchReactions = async (notesIds: string[]): Promise<void> => {
    const newNotesIds = notesIds.filter((id) => !reactions.has(id));
    if (!publicKey || newNotesIds.length === 0) return;

    setIsLoading((prev) => new Set([...prev, ...newNotesIds]));

    const newReactions = await reactionService.listNotesReactionsAsync({
      relays: Array.from(relays.values()),
      pubkey: publicKey,
      notesIds: newNotesIds,
    });

    setReactions((prev) => new Map([...prev, ...new Map(newReactions)]));
    setIsLoading((prev) => {
      const newLoading = new Set(prev);
      newNotesIds.forEach((id) => newLoading.delete(id));
      return newLoading;
    });
  };

  const like = async (note: RelayEvent): Promise<void> => {
    if (!publicKey) return;

    const likeEvent = await reactionService.createReactionAsync({
      relays: Array.from(relays.values()),
      pubkey: publicKey,
      noteToReact: note,
    });

    setReactions((prev) => new Map([...prev, [note.id, likeEvent.id]]));
  };

  const unlike = async (note: RelayEvent): Promise<void> => {
    const reactionId = reactions.get(note.id);
    if (!publicKey || !reactionId) return;

    await reactionService.deleteReactionAsync({
      relays: Array.from(relays.values()),
      pubkey: publicKey,
      reactionId,
    });

    setReactions((prev) => {
      const newReactions = new Map(prev);
      newReactions.delete(note.id);
      return newReactions;
    });
  };

  const value: ReactionsContext = {
    reactions,
    isLoading,
    fetchReactions,
    like,
    unlike,
  };

  return (
    <ReactionsContext.Provider value={value}>
      {children}
    </ReactionsContext.Provider>
  );
}

export function useReactions(): ReactionsContext {
  const context = useContext(ReactionsContext);

  if (!context)
    throw new Error("useReactions must be used within an ReactionsProvider");

  return context;
}

/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { nip25 } from "nostr-tools";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import NostrService from "@/app/lib/services/nostr";
import type { RelayEvent } from "@/app/lib/types/event";
import { User } from "@/app/lib/types/user";

type ReactionsContext = {
  reactions: Map<string, string>;
  isLoading: Set<string>;
  fetchReactions: (eventIds: string[]) => Promise<void>;
  like: (event: RelayEvent) => Promise<void>;
  unlike: (event: RelayEvent) => Promise<void>;
};

type ReactionsProviderProps = {
  children: ReactNode;
};

export const ReactionsContext = createContext<ReactionsContext | null>(null);

export default function ReactionsProvider({
  children,
}: ReactionsProviderProps) {
  const { publicKey } = useAuth();
  const { list, publish } = useRelay();

  const [reactions, setReactions] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState<Set<string>>(new Set());

  const fetchReactions = async (notesIds: string[]): Promise<void> => {
    const newNotesIds = notesIds.filter((id) => !reactions.has(id));

    if (publicKey === undefined || newNotesIds.length === 0) return;

    setIsLoading(new Set(newNotesIds));

    const events = await list({
      kinds: [7],
      authors: [publicKey],
      "#e": newNotesIds,
    });

    const newReactions = events
      .map((event) => {
        const pointer = nip25.getReactedEventPointer(event);
        return [pointer?.id, event.id];
      })
      .filter(([pointerId, eventId]) => !!pointerId) as [string, string][];

    setReactions((prev) => new Map([...prev, ...new Map(newReactions)]));
    setIsLoading(new Set());
  };

  const like = async (event: RelayEvent): Promise<void> => {
    if (!publicKey) return;

    const tags = event.tags.filter(
      (tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p")
    );
    tags.push(["e", event.id]);
    tags.push(["p", event.pubkey]);

    const likeEvent = await NostrService.createEvent(7, publicKey, "+", tags);
    if (likeEvent) {
      await publish(likeEvent);
      setReactions((prev) => new Map([...prev, [event.id, likeEvent.id]]));
    }
  };

  const unlike = async (event: RelayEvent): Promise<void> => {
    const reactionId = reactions.get(event.id);
    if (!publicKey || !reactionId) return;

    const tags = [["e", reactionId]];
    const deleteEvent = await NostrService.createEvent(5, publicKey, "", tags);

    if (deleteEvent) {
      await publish(deleteEvent);
      setReactions((prev) => {
        const newReactions = new Map(prev);
        newReactions.delete(event.id);
        return newReactions;
      });
    }
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

/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { nip18 } from "nostr-tools";
import { createContext, useContext, useState } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import NostrService from "@/app/lib/services/nostr";
import type { ProviderProps } from "@/app/lib/context/providers";
import type { RelayEvent } from "@/app/lib/types/event";

type RepostContext = {
  reposts: Map<string, string>;
  isLoading: Set<string>;
  fetchReposts: (eventIds: string[]) => Promise<void>;
  repost: (event: RelayEvent) => Promise<void>;
  unrepost: (event: RelayEvent) => Promise<void>;
};

export const RepostContext = createContext<RepostContext | null>(null);

export default function RepostProvider({ children }: ProviderProps) {
  const { publicKey } = useAuth();
  const { list, publish } = useRelay();

  const [reposts, setReposts] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState<Set<string>>(new Set());

  const fetchReposts = async (notesIds: string[]): Promise<void> => {
    const newNotesIds = notesIds.filter((id) => !reposts.has(id));

    if (publicKey === undefined || newNotesIds.length === 0) return;

    setIsLoading((prev) => new Set([...prev, ...newNotesIds]));

    const events = await list({
      kinds: [6],
      authors: [publicKey],
      "#e": newNotesIds,
    });

    const newReposts = events
      .map((event) => {
        const pointer = nip18.getRepostedEventPointer(event);
        return [pointer?.id, event.id];
      })
      .filter(([pointerId, eventId]) => !!pointerId) as [string, string][];

    setReposts((prev) => new Map([...prev, ...new Map(newReposts)]));
    setIsLoading((prev) => {
      const newLoading = new Set(prev);
      newNotesIds.forEach((id) => newLoading.delete(id));
      return newLoading;
    });
  };

  const repost = async (event: RelayEvent): Promise<void> => {
    if (!publicKey) return;

    const tags = event.tags.filter(
      (tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p")
    );
    tags.push(["e", event.id]);
    tags.push(["p", event.pubkey]);

    const repostEvent = await NostrService.createEvent(
      6,
      publicKey,
      event.content,
      tags
    );
    if (repostEvent) {
      await publish(repostEvent);
      setReposts((prev) => new Map([...prev, [event.id, repostEvent.id]]));
    }
  };

  const unrepost = async (event: RelayEvent): Promise<void> => {
    const repostId = reposts.get(event.id);
    if (!publicKey || !repostId) return;

    const tags = [["e", repostId]];
    const deleteEvent = await NostrService.createEvent(5, publicKey, "", tags);

    if (deleteEvent) {
      await publish(deleteEvent);
      setReposts((prev) => {
        const newRepost = new Map(prev);
        newRepost.delete(event.id);
        return newRepost;
      });
    }
  };

  const value: RepostContext = {
    reposts,
    isLoading,
    fetchReposts,
    repost,
    unrepost,
  };

  return (
    <RepostContext.Provider value={value}>{children}</RepostContext.Provider>
  );
}

export function useReposts(): RepostContext {
  const context = useContext(RepostContext);

  if (!context)
    throw new Error("useRepost must be used within an RepostProvider");

  return context;
}

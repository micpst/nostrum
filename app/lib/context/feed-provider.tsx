/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { Filter, Kind, parseReferences } from "nostr-tools";
import { createContext, useContext, useEffect, useState } from "react";
import type { EventPointer } from "nostr-tools/lib/nip19";
import type { ReactNode } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import type { RelayEvent } from "@/app/lib/types/event";

type FeedContext = {
  notes: RelayEvent[];
  references: Map<string, RelayEvent>;
  isLoading: boolean;
  setIsExplore: (isExplore: boolean) => void;
  loadNotes: () => Promise<void>;
};

type FeedProviderProps = {
  children: ReactNode;
  initPageSize?: number;
  pageSize?: number;
};

type FeedState = {
  notes: Map<string, RelayEvent>;
  references: Map<string, RelayEvent>;
  isLoading: boolean;
};

export const FeedContext = createContext<FeedContext | null>(null);

export default function FeedProvider({
  children,
  initPageSize = 20,
  pageSize = 10,
}: FeedProviderProps) {
  const { publicKey } = useAuth();
  const { addProfiles, isLoading } = useProfile();
  const { relays, list } = useRelay();

  const [isExplore, setIsExplore] = useState<boolean | undefined>(undefined);
  const [state, setState] = useState<FeedState>({
    notes: new Map(),
    references: new Map(),
    isLoading: false,
  });

  useEffect(() => {
    if (isExplore === undefined) return;
    setState({
      notes: new Map(),
      references: new Map(),
      isLoading: false,
    });
    void loadNotes();
  }, [isExplore]);

  useEffect(() => {
    if (isExplore === undefined) return;
    setState({
      notes: new Map(),
      references: new Map(),
      isLoading: false,
    });
  }, [relays]);

  const loadNotes = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const filter: Filter = {
      kinds: [Kind.Text],
      authors: !isExplore ? [] : undefined,
      limit: state.notes.size === 0 ? initPageSize : pageSize,
      until:
        state.notes.size > 0
          ? Array.from(state.notes.values()).slice(-1)[0].created_at
          : undefined,
    };

    const events = await list(relays, filter);
    const newNotes = events
      .filter((event) => !state.notes.has(event.id))
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, state.notes.size === 0 ? initPageSize : pageSize);

    const referencesIds = newNotes.flatMap(
      (note: RelayEvent) =>
        parseReferences(note)
          .map(({ event }: { event?: EventPointer }) => event && event.id)
          .filter((eventId?: string) => eventId) as string[]
    );

    const referencedNotes =
      referencesIds.length > 0
        ? await list(relays, {
            kinds: [Kind.Text],
            ids: referencesIds,
          })
        : [];

    const pubkeys = new Set([
      ...Array.from(newNotes.values()).map((note) => note.pubkey),
      ...referencedNotes.map((note) => note.pubkey),
    ]);
    await addProfiles(Array.from(pubkeys));

    setState((prev) => ({
      notes: new Map([
        ...prev.notes,
        ...new Map(newNotes.map((event) => [event.id, event])),
      ]),
      references: new Map([
        ...prev.references,
        ...new Map(referencedNotes.map((event) => [event.id, event])),
      ]),
      isLoading: false,
    }));
  };

  const value: FeedContext = {
    notes: Array.from(state.notes.values()),
    references: state.references,
    isLoading: state.isLoading || isLoading,
    setIsExplore,
    loadNotes,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed(): FeedContext {
  const context = useContext(FeedContext);

  if (!context) throw new Error("useFeed must be used within an FeedProvider");

  return context;
}

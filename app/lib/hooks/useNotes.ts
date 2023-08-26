/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from "react";
import { Kind, parseReferences } from "nostr-tools";
import type { Filter } from "nostr-tools";
import type { EventPointer } from "nostr-tools/lib/nip19";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import type { RelayEvent } from "@/app/lib/types/event";

type UseNotes = {
  notes: RelayEvent[];
  references: Map<string, RelayEvent>;
  isLoading: boolean;
  init: (filter?: Filter) => Promise<void>;
  loadMore: (filter?: Filter) => Promise<void>;
  reset: () => void;
};

type UseNotesProps = {
  initPageSize?: number;
  pageSize?: number;
};

type State = {
  notes: Map<string, RelayEvent>;
  references: Map<string, RelayEvent>;
  isLoading: boolean;
};

export function useNotes({
  initPageSize = 20,
  pageSize = 10,
}: UseNotesProps = {}): UseNotes {
  const { addProfiles, isLoading } = useProfile();
  const { relays, list, subscribe } = useRelay();

  const [state, setState] = useState<State>({
    notes: new Map(),
    references: new Map(),
    isLoading: false,
  });

  const reset = (): void => {
    setState({
      notes: new Map(),
      references: new Map(),
      isLoading: false,
    });
  };

  const init = async (filter?: Filter): Promise<void> => {
    setState({
      notes: new Map(),
      references: new Map(),
      isLoading: true,
    });

    const events = await list(relays, {
      kinds: [Kind.Text],
      limit: initPageSize,
      ...filter,
    });

    const newNotes = events
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, initPageSize);

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

    setState({
      notes: new Map(newNotes.map((event) => [event.id, event])),
      references: new Map(referencedNotes.map((event) => [event.id, event])),
      isLoading: false,
    });
  };

  const loadMore = async (filter?: Filter): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const events = await list(relays, {
      kinds: [Kind.Text],
      limit: pageSize,
      until:
        state.notes.size > 0
          ? Array.from(state.notes.values()).slice(-1)[0].created_at
          : undefined,
      ...filter,
    });

    const newNotes = events
      .filter((event) => !state.notes.has(event.id))
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, pageSize);

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

  return {
    notes: Array.from(state.notes.values()),
    references: state.references,
    isLoading: state.isLoading || isLoading,
    init,
    loadMore,
    reset,
  };
}

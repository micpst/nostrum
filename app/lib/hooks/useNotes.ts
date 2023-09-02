import { useState } from "react";
import { useDeepCompareEffect } from "react-use";
import { parseReferences } from "nostr-tools";
import type { Filter } from "nostr-tools";
import type { EventPointer } from "nostr-tools/lib/nip19";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useReactions } from "@/app/lib/context/reactions-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import type { RelayEvent } from "@/app/lib/types/event";

type UseNotes = {
  notes: RelayEvent[];
  references: Map<string, RelayEvent>;
  isLoading: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
};

type UseNotesProps = {
  filter?: Filter;
  initPageSize?: number;
  pageSize?: number;
};

type State = {
  notes: Map<string, RelayEvent>;
  references: Map<string, RelayEvent>;
  isLoading: boolean;
};

export function useNotes({
  filter = {},
  initPageSize = 20,
  pageSize = 10,
}: UseNotesProps = {}): UseNotes {
  const { addProfiles } = useProfile();
  const { fetchReactions } = useReactions();
  const { relays, list, subscribe } = useRelay();

  const [state, setState] = useState<State>({
    notes: new Map(),
    references: new Map(),
    isLoading: false,
  });

  useDeepCompareEffect(() => {
    void init();
  }, [initPageSize, filter, relays]);

  const reset = (): void => {
    setState({
      notes: new Map(),
      references: new Map(),
      isLoading: false,
    });
  };

  const init = async (): Promise<void> => {
    setState({
      notes: new Map(),
      references: new Map(),
      isLoading: true,
    });

    const events = await list({
      kinds: [1],
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
        ? await list({
            kinds: [1],
            ids: referencesIds,
          })
        : [];

    const authorPubkeys = new Set([
      ...newNotes.map((note) => note.pubkey),
      ...referencedNotes.map((note) => note.pubkey),
    ]);
    const noteIds = new Set([
      ...newNotes.map((note) => note.id),
      ...referencedNotes.map((note) => note.id),
    ]);

    await addProfiles(Array.from(authorPubkeys));
    await fetchReactions(Array.from(noteIds));

    setState({
      notes: new Map(newNotes.map((event) => [event.id, event])),
      references: new Map(referencedNotes.map((event) => [event.id, event])),
      isLoading: false,
    });
  };

  const loadMore = async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const events = await list({
      kinds: [1],
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
        ? await list({
            kinds: [1],
            ids: referencesIds,
          })
        : [];

    const authorPubkeys = new Set([
      ...Array.from(newNotes.values()).map((note) => note.pubkey),
      ...referencedNotes.map((note) => note.pubkey),
    ]);
    const noteIds = new Set([
      ...newNotes.map((note) => note.id),
      ...referencedNotes.map((note) => note.id),
    ]);

    await addProfiles(Array.from(authorPubkeys));
    await fetchReactions(Array.from(noteIds));

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
    isLoading: state.isLoading,
    loadMore,
    reset,
  };
}
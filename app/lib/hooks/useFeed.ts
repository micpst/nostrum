import type { Filter } from "nostr-tools";
import { useEffect } from "react";
import { useUnmount } from "react-use";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useReactions } from "@/app/lib/context/reactions-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import type { RelayEvent } from "@/app/lib/types/event";

type UseFeed = {
  notes: RelayEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

type UseFeedProps = {
  filter: Filter;
  initPageSize?: number;
  pageSize?: number;
};

export function useFeed(props: UseFeedProps): UseFeed {
  const { addProfiles, removeProfiles } = useProfile();
  const { fetchReactions } = useReactions();
  const {
    events: notes,
    newEvents: newNotes,
    isLoading,
    loadMoreRef,
  } = useInfiniteScroll(props);

  useEffect(() => {
    const pubkeys = Array.from(new Set(newNotes.map((note) => note.pubkey)));
    const ids = newNotes.map((note) => note.id);
    void addProfiles(pubkeys);
    void fetchReactions(ids);
  }, [newNotes]);

  useUnmount(() => {
    const pubkeys = notes.map((note) => note.pubkey);
    removeProfiles(pubkeys);
  });

  return {
    notes,
    isLoading,
    loadMoreRef,
  };
}

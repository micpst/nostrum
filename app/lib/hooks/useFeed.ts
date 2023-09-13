import type { Filter } from "nostr-tools";
import { useDeepCompareEffect } from "react-use";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useReactions } from "@/app/lib/context/reactions-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import { RelayEvent } from "@/app/lib/types/event";

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
  const { addProfiles } = useProfile();
  const { fetchReactions } = useReactions();
  const { events, newEvents, isLoading, loadMoreRef } =
    useInfiniteScroll(props);

  useDeepCompareEffect(() => {
    void loadData();
  }, [newEvents]);

  const loadData = async () => {
    const pubkeys = new Set(newEvents.map((note) => note.pubkey));
    const ids = new Set(newEvents.map((note) => note.id));

    addProfiles(Array.from(pubkeys));
    await fetchReactions(Array.from(ids));
  };

  return {
    notes: events,
    isLoading,
    loadMoreRef,
  };
}

import type { Filter } from "nostr-tools";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import { useEventsWithParents } from "@/app/lib/hooks/useEventsWithParents";
import { useNotesData } from "@/app/lib/hooks/useNotesData";
import type { NoteEvent } from "@/app/lib/types/event";

type UseFeed = {
  notes: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

type UseFeedProps = {
  filter: Filter;
  initPageSize?: number;
  pageSize?: number;
};

export function useFeed(props: UseFeedProps): UseFeed {
  const {
    state: { events: notes, isLoading },
    loadMoreRef,
  } = useInfiniteScroll({
    ...props,
    loadHook: useEventsWithParents,
  });

  useNotesData(notes);

  return {
    notes,
    isLoading,
    loadMoreRef,
  };
}

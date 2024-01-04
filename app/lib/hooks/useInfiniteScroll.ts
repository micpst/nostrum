import { useCallback, useRef, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import type { Filter } from "nostr-tools";
import { useNotes } from "@/app/lib/hooks/useNotes";
import type { NoteEvent } from "@/app/lib/types/event";

type UseInfiniteScrollProps = {
  filter: Filter;
  initPageSize?: number;
  pageSize?: number;
};

type UseInfiniteScroll = {
  events: NoteEvent[];
  newEvents: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

export function useInfiniteScroll({
  filter,
  initPageSize = 20,
  pageSize = 10,
}: UseInfiniteScrollProps): UseInfiniteScroll {
  const [_filter, setFilter] = useState<Filter>({
    ...filter,
    limit: initPageSize,
  });
  const { events, newEvents, isLoading } = useNotes(_filter);

  useDeepCompareEffect(() => {
    setFilter((prev) => ({
      ...prev,
      ...filter,
    }));
  }, [filter]);

  const intObserver: any = useRef();

  const loadMore = useCallback(async (): Promise<void> => {
    setFilter((prev) => ({
      ...prev,
      limit: pageSize,
      until: events.length > 0 ? events.slice(-1)[0].created_at : undefined,
    }));
  }, [events, pageSize]);

  const loadMoreRef = useCallback(
    (element: any): void => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((elements) => {
        if (elements[0].isIntersecting) void loadMore();
      });

      if (element) intObserver.current.observe(element);
    },
    [isLoading, loadMore]
  );

  return {
    events,
    newEvents,
    isLoading,
    loadMoreRef,
  };
}

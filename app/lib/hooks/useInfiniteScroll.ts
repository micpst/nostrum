import { useCallback, useRef, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import type { Filter } from "nostr-tools";

type HookState = {
  events: any[];
  newEvents: any[];
  isLoading: boolean;
};

type UseInfiniteScrollProps = {
  filter: Filter;
  loadHook: (filter: Filter) => HookState;
  initPageSize?: number;
  pageSize?: number;
};

type UseInfiniteScroll = {
  state: HookState;
  loadMoreRef: (note: any) => void;
};

export function useInfiniteScroll({
  filter,
  loadHook,
  initPageSize = 20,
  pageSize = 10,
}: UseInfiniteScrollProps): UseInfiniteScroll {
  const [_filter, setFilter] = useState<Filter>({
    ...filter,
    limit: initPageSize,
  });
  const state = loadHook(_filter);

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
      until:
        state.events.length > 0
          ? state.events.slice(-1)[0].created_at
          : undefined,
    }));
  }, [state.events, pageSize]);

  const loadMoreRef = useCallback(
    (element: any): void => {
      if (intObserver.current) {
        intObserver.current.disconnect();
      }
      intObserver.current = new IntersectionObserver(async (elements) => {
        if (elements[0].isIntersecting && !state.isLoading) {
          await loadMore();
        }
      });
      if (element) {
        intObserver.current.observe(element);
      }
    },
    [state.isLoading, loadMore]
  );

  return {
    state,
    loadMoreRef,
  };
}

import { useCallback, useRef } from "react";

type UseInfiniteScrollProps = {
  isLoading: boolean;
  loadMore: () => Promise<void>;
};

type LastElementRef = (note: any) => void;

export function useInfiniteScroll({
  isLoading,
  loadMore,
}: UseInfiniteScrollProps): LastElementRef {
  const intObserver: any = useRef();
  return useCallback(
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
}

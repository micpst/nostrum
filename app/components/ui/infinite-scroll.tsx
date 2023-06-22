import { Children, cloneElement, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Loading from "@/app/components/ui/loading";
import Error from "@/app/components/ui/error";

type InfiniteScrollProps = {
  children: ReactNode;
  elements: any;
  isLoading: boolean;
  loadMore: () => void;
};

function InfiniteScroll({
  children,
  elements,
  isLoading,
}: InfiniteScrollProps): JSX.Element {
  const intObserver = useRef();
  const lastNoteRef = useCallback(
    (note: any) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting) loadMore();
      });

      if (note) intObserver.current.observe(note);
    },
    [isLoading]
  );

  return (
    <>
      {!isLoading && !children.length && <Error />}
      {Children.map(children, (child, i) =>
        i !== children.length - 1
          ? child
          : cloneElement(child, {
              ref: lastNoteRef(i),
            })
      )}
      {isLoading && <Loading className="my-5" />}
    </>
  );
}

export default InfiniteScroll;

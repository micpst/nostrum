import { useCallback, useEffect, useRef, useState } from "react";
import { useNotesData } from "./useNotesData";
import type { NoteEvent } from "../types/event";

type UseInfiniteScroll = {
  notes: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

export function useInfiniteScroll(
  loadNextPage: (lastNote?: NoteEvent) => Promise<NoteEvent[]>
): UseInfiniteScroll {
  const intObserver: any = useRef();

  const [notes, setNotes] = useState<NoteEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reachedLimit, setReachedLimit] = useState<boolean>(false);

  useNotesData(notes);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setReachedLimit(false);

      const newNotes = await loadNextPage();
      if (newNotes.length === 0) {
        setReachedLimit(true);
      } else {
        setNotes(newNotes);
      }

      setIsLoading(false);
    })();
  }, [loadNextPage]);

  const loadMore = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    const newNotes = await loadNextPage(notes.at(-1));
    const uniqueNewNotes = newNotes.filter(
      (note) => !notes.some((n) => n.id === note.id)
    );

    if (uniqueNewNotes.length === 0) {
      setReachedLimit(true);
    } else {
      setNotes((prev) => [...prev, ...uniqueNewNotes]);
    }

    setIsLoading(false);
  }, [notes, loadNextPage]);

  const loadMoreRef = useCallback(
    (element: any): void => {
      if (intObserver.current) {
        intObserver.current.disconnect();
      }
      intObserver.current = new IntersectionObserver(async (elements) => {
        if (elements[0].isIntersecting && !isLoading && !reachedLimit) {
          await loadMore();
        }
      });
      if (element) {
        intObserver.current.observe(element);
      }
    },
    [isLoading, reachedLimit, loadMore]
  );

  return {
    notes,
    isLoading,
    loadMoreRef,
  };
}

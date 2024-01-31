import { useCallback } from "react";
import { useRelay } from "@/app/lib/context/relay-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScrollTemp";
import noteService from "@/app/lib/services/noteService";
import type { NoteEvent } from "@/app/lib/types/event";

type UseExploreFeed = {
  notes: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

export function useExploreFeed(): UseExploreFeed {
  const { relays } = useRelay();

  const loadExploreFeed = useCallback(
    async (lastNote?: NoteEvent): Promise<NoteEvent[]> => {
      return await noteService.listExploreNotesAsync({
        relays: Array.from(relays.values()),
        limit: 20,
        until: lastNote?.created_at,
      });
    },
    [relays]
  );

  return useInfiniteScroll(loadExploreFeed);
}

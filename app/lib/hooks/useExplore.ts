import { useCallback } from "react";
import { useRelay } from "@/app/lib/context/relay-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import noteService from "@/app/lib/services/noteService";
import type { NoteEvent } from "@/app/lib/types/event";

type UseExplore = {
  notes: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

export function useExplore(): UseExplore {
  const { relays } = useRelay();

  const loadNotes = useCallback(
    async (lastNote?: NoteEvent): Promise<NoteEvent[]> => {
      return await noteService.listExploreNotesAsync({
        relays: Array.from(relays.values()),
        limit: 20,
        until: lastNote?.created_at,
      });
    },
    [relays],
  );

  return useInfiniteScroll(loadNotes);
}

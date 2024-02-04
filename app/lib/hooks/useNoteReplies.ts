import { useCallback } from "react";
import { useRelay } from "@/app/lib/context/relay-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import noteService from "@/app/lib/services/noteService";
import type { NoteEvent } from "@/app/lib/types/event";

type UseNoteReplies = {
  notes: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

export function useNoteReplies(note?: NoteEvent | null): UseNoteReplies {
  const { relays } = useRelay();

  const loadNoteReplies = useCallback(
    async (lastNote?: NoteEvent): Promise<NoteEvent[]> => {
      if (!note) return [];

      return await noteService.listNoteRepliesAsync({
        relays: Array.from(relays.values()),
        noteId: note.id,
        limit: 20,
        until: lastNote?.likedAt,
      });
    },
    [relays, note],
  );

  return useInfiniteScroll(loadNoteReplies);
}

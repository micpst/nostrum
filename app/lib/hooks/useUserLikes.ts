import { useCallback } from "react";
import { useRelay } from "@/app/lib/context/relay-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import noteService from "@/app/lib/services/noteService";
import type { NoteEvent } from "@/app/lib/types/event";
import type { User } from "@/app/lib/types/user";

type UseUserLikes = {
  notes: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

export function useUserLikes(user?: User): UseUserLikes {
  const { relays } = useRelay();

  const loadNotes = useCallback(
    async (lastNote?: NoteEvent): Promise<NoteEvent[]> => {
      if (!user) return [];

      return await noteService.listUserLikedNotesAsync({
        relays: Array.from(relays.values()),
        pubkey: user.pubkey,
        limit: 20,
        until: lastNote?.likedAt,
      });
    },
    [relays, user],
  );

  return useInfiniteScroll(loadNotes);
}

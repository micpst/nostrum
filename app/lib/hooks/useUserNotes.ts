import { useCallback } from "react";
import { useRelay } from "@/app/lib/context/relay-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import noteService from "@/app/lib/services/noteService";
import type { NoteEvent } from "@/app/lib/types/event";
import type { User } from "@/app/lib/types/user";

type UseUserNotes = {
  notes: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

export function useUserNotes(user?: User): UseUserNotes {
  const { relays } = useRelay();

  const loadNotes = useCallback(
    async (lastNote?: NoteEvent): Promise<NoteEvent[]> => {
      if (!user) return [];

      return await noteService.listUserNotesAsync({
        relays: Array.from(relays.values()),
        pubkey: user.pubkey,
        limit: 20,
        until: lastNote?.repostedAt || lastNote?.created_at,
      });
    },
    [relays, user]
  );

  return useInfiniteScroll(loadNotes);
}

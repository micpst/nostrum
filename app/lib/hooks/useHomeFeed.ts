import { useCallback } from "react";
import { useFollowing } from "@/app/lib/context/following-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScrollTemp";
import noteService from "@/app/lib/services/noteService";
import type { NoteEvent } from "@/app/lib/types/event";

type UseHomeFeed = {
  notes: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

export function useHomeFeed(): UseHomeFeed {
  const { relays } = useRelay();
  const { following, isLoading: isLoadingFollowing } = useFollowing();

  const loadHomeFeed = useCallback(
    async (lastNote?: NoteEvent): Promise<NoteEvent[]> => {
      if (following.size === 0) return [];

      return await noteService.listHomeNotesAsync({
        relays: Array.from(relays.values()),
        pubkeys: Array.from(following.values()),
        limit: 20,
        until:
          lastNote?.repostedAt || lastNote?.likedAt || lastNote?.created_at,
      });
    },
    [relays, following]
  );

  const {
    notes,
    isLoading: isLoadingNotes,
    loadMoreRef,
  } = useInfiniteScroll(loadHomeFeed);

  return {
    notes,
    isLoading: isLoadingNotes || isLoadingFollowing,
    loadMoreRef,
  };
}

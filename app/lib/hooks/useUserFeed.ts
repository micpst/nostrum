import { useRelay } from "@/app/lib/context/relay-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScrollTemp";
import noteService from "@/app/lib/services/noteService";
import type { NoteEvent } from "@/app/lib/types/event";
import type { User } from "@/app/lib/types/user";

type UseUserFeed = {
  notes: NoteEvent[];
  isLoading: boolean;
  loadMoreRef: (note: any) => void;
};

export function useUserFeed(user?: User): UseUserFeed {
  const { relays } = useRelay();

  const loadUserFeed = async (lastNote?: NoteEvent): Promise<NoteEvent[]> => {
    if (!user) return [];

    return await noteService.listUserNotesAsync({
      relays: Array.from(relays.values()),
      pubkey: user.pubkey,
      limit: 20,
      until: lastNote?.repostedAt || lastNote?.created_at,
    });
  };

  return useInfiniteScroll(loadUserFeed);
}

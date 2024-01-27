import { useDeepCompareEffect, useUnmount } from "react-use";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useReactions } from "@/app/lib/context/reactions-provider";
import { useReposts } from "@/app/lib/context/repost-provider";
import type { RelayEvent } from "@/app/lib/types/event";

type UseNotesData = {
  notes: RelayEvent[];
  newNotes: RelayEvent[];
};

export function useNotesData({ notes, newNotes }: UseNotesData): void {
  const { add: addProfiles, remove: removeProfiles } = useProfile();
  const { fetchReactions } = useReactions();
  const { fetchReposts } = useReposts();

  useDeepCompareEffect(() => {
    if (newNotes.length === 0) return;

    const pubkeys = Array.from(new Set(newNotes.map((note) => note.pubkey)));
    const ids = newNotes.map((note) => note.id);

    void addProfiles(pubkeys);
    void fetchReactions(ids);
    void fetchReposts(ids);
  }, [newNotes]);

  useUnmount(() => {
    const pubkeys = Array.from(new Set(notes.map((note) => note.pubkey)));
    removeProfiles(pubkeys);
  });
}

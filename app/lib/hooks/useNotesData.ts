import { useRef } from "react";
import { useDeepCompareEffect, useUnmount } from "react-use";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useReactions } from "@/app/lib/context/reactions-provider";
import { useReposts } from "@/app/lib/context/repost-provider";
import type { RelayEvent } from "@/app/lib/types/event";

export function useNotesData(notes: RelayEvent[]): void {
  const { addProfiles, removeProfiles } = useProfile();
  const { fetchReactions } = useReactions();
  const { fetchReposts } = useReposts();

  const prevNotesRef = useRef<RelayEvent[]>([]);

  useDeepCompareEffect(() => {
    const newNotes = notes.filter(
      (note) =>
        !prevNotesRef.current.find((prevNote) => prevNote.id === note.id)
    );
    const removedNotes = prevNotesRef.current.filter(
      (prevNote) => !notes.find((note) => prevNote.id === note.id)
    );

    if (newNotes.length > 0) {
      const pubkeys = newNotes.map((note) => note.pubkey);
      const ids = newNotes.map((note) => note.id);

      addProfiles(pubkeys);
      void fetchReactions(ids);
      void fetchReposts(ids);
    }

    if (removedNotes.length > 0) {
      const pubkeys = removedNotes.map((note) => note.pubkey);
      removeProfiles(pubkeys);
    }

    prevNotesRef.current = notes;
  }, [notes]);

  useUnmount(() => {
    const pubkeys = notes.map((note) => note.pubkey);
    removeProfiles(pubkeys);
  });
}

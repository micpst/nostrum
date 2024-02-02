/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef } from "react";
import { useDeepCompareEffect, useUnmount } from "react-use";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useReactions } from "@/app/lib/context/reactions-provider";
import { useReposts } from "@/app/lib/context/repost-provider";
import type { RelayEvent } from "@/app/lib/types/event";

export function useNotesData(notes: RelayEvent[]): void {
  const { publicKey } = useAuth();
  const { addProfiles, removeProfiles } = useProfile();
  const { addReactions, removeReactions } = useReactions();
  const { addReposts, removeReposts } = useReposts();

  const prevNotesRef = useRef<RelayEvent[]>([]);

  useDeepCompareEffect(() => {
    const newNotes = notes.filter(
      (note) =>
        !prevNotesRef.current.find((prevNote) => prevNote.id === note.id),
    );
    const removedNotes = prevNotesRef.current.filter(
      (prevNote) => !notes.find((note) => prevNote.id === note.id),
    );

    if (newNotes.length > 0) {
      const pubkeys = newNotes.map((note) => note.pubkey);
      const ids = newNotes.map((note) => note.id);

      addProfiles(pubkeys);
      addReactions(ids);
      addReposts(ids);
    }

    if (removedNotes.length > 0) {
      const pubkeys = removedNotes.map((note) => note.pubkey);
      const ids = removedNotes.map((note) => note.id);

      removeProfiles(pubkeys);
      removeReactions(ids);
      removeReposts(ids);
    }

    prevNotesRef.current = notes;
  }, [notes]);

  useEffect(() => {
    if (publicKey) {
      const ids = notes.map((note) => note.id);

      addReactions(ids);
      addReposts(ids);

      return () => {
        removeReactions(ids);
        removeReposts(ids);
      };
    }
  }, [publicKey]);

  useUnmount(() => {
    const pubkeys = notes.map((note) => note.pubkey);
    const ids = notes.map((note) => note.id);

    removeProfiles(pubkeys);
    removeReactions(ids);
    removeReposts(ids);
  });
}

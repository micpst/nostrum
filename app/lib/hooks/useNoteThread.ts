import { useState } from "react";
import { useMount } from "react-use";
import { useRelay } from "@/app/lib/context/relay-provider";
import { useNotesData } from "@/app/lib/hooks/useNotesData";
import noteService from "@/app/lib/services/noteService";
import type { NoteEvent } from "@/app/lib/types/event";

type UseNoteThread = {
  note: NoteEvent | null;
  parent: NoteEvent | null;
  isLoading: boolean;
};

export function useNoteThread(noteId?: string): UseNoteThread {
  const { relays } = useRelay();

  const [note, setNote] = useState<NoteEvent | null>(null);
  const [parent, setParent] = useState<NoteEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useMount(() => {
    if (!noteId) return;
    (async () => {
      setIsLoading(true);
      const notes = await noteService.listNoteWithParentAsync({
        relays: Array.from(relays.values()),
        noteId,
      });

      if (notes.length == 2) {
        setParent(notes[0]);
        setNote(notes[1]);
      } else if (notes.length == 1) {
        setNote(notes[0]);
      }
      setIsLoading(false);
    })();
  });

  useNotesData([note, parent].filter(Boolean) as NoteEvent[]);

  return {
    note,
    parent,
    isLoading,
  };
}

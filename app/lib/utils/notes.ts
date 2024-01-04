import type { NoteEvent } from "@/app/lib/types/event";

export function combineNotes(...notes: NoteEvent[][]): NoteEvent[] {
  const combinedNotes = new Map(
    notes
      .reduce((acc, val) => acc.concat(val), [])
      .sort((a, b) => b.created_at - a.created_at)
      .map((event) => [event.id, event])
  );
  return Array.from(combinedNotes.values());
}

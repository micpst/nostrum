"use client";

import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useThread } from "@/app/lib/context/thread-provider";
import { useEvents } from "@/app/lib/hooks/useEvents";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import { useNotesData } from "@/app/lib/hooks/useNotesData";

function NotePage(): JSX.Element | undefined {
  const { root } = useThread();

  const {
    state: { events: notes, newEvents: newNotes, isLoading },
    loadMoreRef,
  } = useInfiniteScroll({
    filter: { kinds: [1], "#e": [root?.id || ""] },
    loadHook: useEvents,
  });

  useNotesData({ notes, newNotes });

  if (!root) return undefined;

  return (
    <>
      <Note event={root} />
      {notes.map((note, i) =>
        i === notes.length - 5 ? (
          <Note ref={loadMoreRef} key={note.id} event={note} />
        ) : (
          <Note key={note.id} event={note} />
        )
      )}
      {isLoading ? <Loading className="my-5" /> : undefined}
    </>
  );
}

export default NotePage;

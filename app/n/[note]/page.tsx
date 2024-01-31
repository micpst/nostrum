"use client";

import type { JSX } from "react";
import Note from "@/app/components/note/note";
import Loading from "@/app/components/ui/loading";
import { useThread } from "@/app/lib/context/thread-provider";
import { useEvents } from "@/app/lib/hooks/useEvents";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import { useNotesData } from "@/app/lib/hooks/useNotesData";

function NotePage(): JSX.Element {
  const { root } = useThread();

  const {
    state: { events: notes, isLoading },
    loadMoreRef,
  } = useInfiniteScroll({
    filter: { kinds: [1], "#e": [root?.id || ""] },
    loadHook: useEvents,
  });

  useNotesData(notes);

  if (!root) return <></>;

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
      {isLoading ? <Loading className="my-5" /> : null}
    </>
  );
}

export default NotePage;

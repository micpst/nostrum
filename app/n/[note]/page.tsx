"use client";

import type { JSX } from "react";
import Note from "@/app/components/note/note";
import Loading from "@/app/components/ui/loading";
import { useThread } from "@/app/lib/context/thread-provider";
import { useNoteReplies } from "@/app/lib/hooks/useNoteReplies";

function NotePage(): JSX.Element {
  const { root } = useThread();
  const { notes, isLoading, loadMoreRef } = useNoteReplies(root);

  if (!root) return <></>;

  return (
    <>
      <Note event={root} expanded />
      {notes.map((note, i) =>
        i === notes.length - 5 ? (
          <Note ref={loadMoreRef} key={note.id} event={note} />
        ) : (
          <Note key={note.id} event={note} />
        ),
      )}
      {isLoading ? <Loading className="my-5" /> : null}
    </>
  );
}

export default NotePage;

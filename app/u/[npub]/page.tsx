"use client";

import { ReactNode, useCallback, useEffect, useRef } from "react";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import Note from "@/app/components/note/note";
import { useNotes } from "@/app/lib/hooks/useEvents";
import { useUser } from "@/app/lib/context/user-provider";

function ProfilePage(): JSX.Element | undefined {
  const { notes, isLoading, loadMore } = useNotes();
  const { user } = useUser();

  const filter = {
    authors: [user?.pubkey || ""],
  };

  const intObserver: any = useRef();
  const lastNoteRef = useCallback(
    (note: any) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting) void loadMore(filter);
      });

      if (note) intObserver.current.observe(note);
    },
    [isLoading]
  );

  useEffect(() => {
    void loadMore(filter);
  }, []);

  if (!user) return undefined;

  return (
    <section>
      {!isLoading && !notes.length ? (
        <Error />
      ) : (
        notes.map((note, i) =>
          i === notes.length - 5 ? (
            <Note ref={lastNoteRef} key={note.id} event={note} />
          ) : (
            <Note key={note.id} event={note} />
          )
        )
      )}
      {isLoading ? <Loading className="my-5" /> : undefined}
    </section>
  );
}

export default ProfilePage;

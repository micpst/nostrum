"use client";

import { useCallback, useEffect, useRef } from "react";
import Header from "@/app/components/common/header";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useFeed } from "@/app/lib/context/feed-provider";

function ExplorePage() {
  const { notes, isLoading, setIsExplore, loadNotes } = useFeed();

  useEffect(() => {
    void setIsExplore(true);
  }, []);

  const intObserver: any = useRef();
  const lastNoteRef = useCallback(
    (note: any) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting) void loadNotes();
      });

      if (note) intObserver.current.observe(note);
    },
    [isLoading]
  );

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header title="Explore" />
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
        {isLoading ? <Loading className="my-5" /> : null}
      </section>
    </div>
  );
}

export default ExplorePage;

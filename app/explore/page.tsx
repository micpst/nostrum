"use client";

import Header from "@/app/components/common/header";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useFeed } from "@/app/lib/hooks/useFeed";

function ExplorePage() {
  const { notes, isLoading, loadMoreRef } = useFeed({
    filter: { kinds: [1] },
  });

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header title="Explore" />
      <section>
        {!isLoading && !notes.length ? (
          <Error />
        ) : (
          notes.map((note, i) =>
            i === notes.length - 5 ? (
              <Note
                ref={loadMoreRef}
                key={note.id}
                parentNote={note.parent}
                event={note}
              />
            ) : (
              <Note key={note.id} parentNote={note.parent} event={note} />
            )
          )
        )}
        {isLoading ? <Loading className="my-5" /> : null}
      </section>
    </div>
  );
}

export default ExplorePage;

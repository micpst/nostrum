"use client";

import Header from "@/app/components/common/header";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useFollowing } from "@/app/lib/context/following-provider";
import withAuth from "@/app/lib/hoc/with-auth";
import { useFeed } from "@/app/lib/hooks/useFeed";

function HomePage() {
  const { following, isLoading: isLoadingFollowing } = useFollowing();
  const {
    notes,
    isLoading: isLoadingNotes,
    loadMoreRef,
  } = useFeed({ filter: { kinds: [1], authors: Array.from(following) } });

  const isLoading = isLoadingFollowing || isLoadingNotes;

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header title="Home" />
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

export default withAuth(HomePage);

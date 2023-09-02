"use client";

import Header from "@/app/components/common/header";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useFeed } from "@/app/lib/context/feed-provider";
import withAuth from "@/app/lib/hoc/with-auth";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";

function HomePage() {
  const { notes, isLoading, loadMore } = useFeed();
  const lastNoteRef = useInfiniteScroll({ isLoading, loadMore });

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header title="Home" />
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

export default withAuth(HomePage);

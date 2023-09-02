"use client";

import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import Note from "@/app/components/note/note";
import { useUser } from "@/app/lib/context/user-provider";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import { useNotes } from "@/app/lib/hooks/useNotes";

function ProfilePage(): JSX.Element | undefined {
  const { user } = useUser();
  const { notes, isLoading, loadMore } = useNotes({
    filter: {
      authors: [user?.pubkey || ""],
    },
  });
  const lastNoteRef = useInfiniteScroll({ isLoading, loadMore });

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

"use client";

import type { JSX } from "react";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useUser } from "@/app/lib/context/user-provider";
import { useUserLikes } from "@/app/lib/hooks/useUserLikes";

function LikesPage(): JSX.Element {
  const { user } = useUser();
  const { notes, isLoading, loadMoreRef } = useUserLikes(user);

  if (!user) return <></>;

  return (
    <section>
      {!isLoading && !notes.length ? (
        <Error />
      ) : (
        notes.map((note, i) =>
          i === notes.length - 5 ? (
            <Note ref={loadMoreRef} key={note.id} event={note} />
          ) : (
            <Note key={note.id} event={note} />
          ),
        )
      )}
      {isLoading ? <Loading className="my-5" /> : null}
    </section>
  );
}

export default LikesPage;

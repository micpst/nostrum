"use client";

import type { JSX } from "react";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useUser } from "@/app/lib/context/user-provider";
import { useUserNotes } from "@/app/lib/hooks/useUserNotes";

function ProfilePage(): JSX.Element {
  const { user } = useUser();
  const { notes, isLoading, loadMoreRef } = useUserNotes(user);

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

export default ProfilePage;

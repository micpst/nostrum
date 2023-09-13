"use client";

import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import Note from "@/app/components/note/note";
import { useUser } from "@/app/lib/context/user-provider";
import { useFeed } from "@/app/lib/hooks/useFeed";

function ProfilePage(): JSX.Element | undefined {
  const { user } = useUser();
  const { notes, isLoading, loadMoreRef } = useFeed({
    filter: { kinds: [1], authors: [user?.pubkey || ""] },
  });

  if (!user) return undefined;

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
          )
        )
      )}
      {isLoading ? <Loading className="my-5" /> : undefined}
    </section>
  );
}

export default ProfilePage;

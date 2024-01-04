"use client";

import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useReposts } from "@/app/lib/context/repost-provider";
import { useUser } from "@/app/lib/context/user-provider";
import { useFeed } from "@/app/lib/hooks/useFeed";
import { combineNotes } from "@/app/lib/utils/notes";

function ProfilePage(): JSX.Element | undefined {
  const { user } = useUser();
  const { reposts, isLoading: isLoadingReposts } = useReposts();
  const {
    notes: userNotes,
    isLoading: isLoadingUserNotes,
    loadMoreRef: loadMoreUserNotesRef,
  } = useFeed({
    filter: {
      kinds: [1],
      authors: [user?.pubkey || ""],
    },
  });
  const {
    notes: userRepostedNotes,
    isLoading: isLoadingUserRepostedNotes,
    loadMoreRef: loadMoreUserRepostedNotesRef,
  } = useFeed({
    filter: {
      kinds: [1],
      ids: [...reposts.keys()],
    },
  });

  const isLoading = isLoadingUserNotes || isLoadingUserRepostedNotes;
  const loadMoreRef = loadMoreUserNotesRef || loadMoreUserRepostedNotesRef;
  const notes = combineNotes(userNotes, userRepostedNotes);

  if (!user) return undefined;

  return (
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
      {isLoading ? <Loading className="my-5" /> : undefined}
    </section>
  );
}

export default ProfilePage;

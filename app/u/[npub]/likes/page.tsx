"use client";

import { nip25 } from "nostr-tools";
import React, { useMemo } from "react";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useUser } from "@/app/lib/context/user-provider";
import { useFeed } from "@/app/lib/hooks/useFeed";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";

function LikesPage(): React.JSX.Element | undefined {
  const { user } = useUser();

  const {
    newEvents: newReactions,
    isLoading: isLoadingReactions,
    loadMoreRef,
  } = useInfiniteScroll({
    filter: { kinds: [7], authors: [user?.pubkey || ""] },
  });

  const notesIds = useMemo(
    () =>
      newReactions
        .map((event) => nip25.getReactedEventPointer(event)?.id)
        .filter((eventId) => !!eventId) as string[],
    [newReactions]
  );

  const { notes, isLoading: isLoadingFeed } = useFeed({
    filter: {
      kinds: [1],
      ids: notesIds,
    },
  });

  const isLoading = isLoadingReactions || isLoadingFeed;

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

export default LikesPage;

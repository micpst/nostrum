"use client";

import { Kind } from "nostr-tools";
import Header from "@/app/components/common/header";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";

function ExplorePage() {
  const filter = {
    kinds: [Kind.Text],
  };
  const options = {
    initialSize: 40,
    stepSize: 20,
  };

  const { events, loading } = useInfiniteScroll(filter, options);

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header title="Explore" sticky border />
      <section>
        {!loading && !events.length ? (
          <Error />
        ) : (
          events.map((event) => <Note key={event.id} event={event} />)
        )}
        {loading && <Loading className="mt-5" />}
      </section>
    </div>
  );
}

export default ExplorePage;

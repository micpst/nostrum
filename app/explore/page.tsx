"use client";

import Header from "@/app/components/common/header";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";

function Explore() {
  const filter = {
    kinds: [1],
  };
  const options = {
    initialSize: 50,
    stepSize: 30,
  };

  const { events, loading } = useInfiniteScroll(filter, options);

  console.log(events);

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header title="Explore" />
      <section>
        {loading ? (
          <Loading className="mt-5" />
        ) : !events ? (
          <Error />
        ) : (
          events.map((event) => <Note key={event.id} event={event} />)
        )}
      </section>
    </div>
  );
}

export default Explore;

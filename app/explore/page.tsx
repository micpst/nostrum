"use client";

import Header from "@/app/components/common/header";
import Note from "@/app/components/note/note";
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
        {events.map((event) => (
          <Note key={event.id} event={event} />
        ))}
        {loading && <div>Loading...</div>}
      </section>
    </div>
  );
}

export default Explore;

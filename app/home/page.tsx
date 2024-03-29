"use client";

import type { JSX } from "react";
import Header from "@/app/components/common/header";
import Note from "@/app/components/note/note";
import Error from "@/app/components/ui/error";
import Loading from "@/app/components/ui/loading";
import withAuth from "@/app/lib/hoc/with-auth";
import { useHome } from "@/app/lib/hooks/useHome";

function HomePage(): JSX.Element {
  const { notes, isLoading, loadMoreRef } = useHome();

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header title="Home" />
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
    </div>
  );
}

export default withAuth(HomePage);

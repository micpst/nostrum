"use client";

import { useRouter } from "next/navigation";
import { nip19 } from "nostr-tools";
import type { ReactNode } from "react";
import Header from "@/app/components/common/header";
import Loading from "@/app/components/ui/loading";
import ThreadProvider from "@/app/lib/context/thread-provider";
import { useEvents } from "@/app/lib/hooks/useEvents";
import { useNotesData } from "@/app/lib/hooks/useNotesData";

function NoteLayout({
  params,
  children,
}: {
  params: { note: string };
  children: ReactNode;
}) {
  let noteId = "";
  let isNoteValid = true;
  try {
    noteId = nip19.decode(params.note).data.toString();
  } catch (e) {
    isNoteValid = false;
  }

  const { back } = useRouter();
  const {
    events: notes,
    newEvents: newNotes,
    isLoading,
  } = useEvents({
    kinds: [1],
    ids: [noteId],
    limit: 1,
  });

  useNotesData({ notes, newNotes });

  const root = notes[0];
  const value = {
    root,
    isLoading,
  };

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header title="Note" useActionButton action={back} />
      <section>
        {!root ? (
          isLoading ? (
            <Loading className="mt-5" />
          ) : (
            <>
              <div className="flex flex-col gap-8">
                <div className="p-8 text-center">
                  <p className="text-3xl font-bold">This note doesn’t exist</p>
                  <p className="text-light-secondary">
                    Try searching for another.
                  </p>
                </div>
              </div>
            </>
          )
        ) : (
          <ThreadProvider value={value}>{children}</ThreadProvider>
        )}
      </section>
    </div>
  );
}

export default NoteLayout;

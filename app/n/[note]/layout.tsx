"use client";

import { useRouter } from "next/navigation";
import { nip19 } from "nostr-tools";
import type { ReactNode } from "react";
import Header from "@/app/components/common/header";
import Note from "@/app/components/note/note";
import Loading from "@/app/components/ui/loading";
import ThreadProvider from "@/app/lib/context/thread-provider";
import { useNoteThread } from "@/app/lib/hooks/useNoteThread";

type NoteLayoutProps = {
  params: { note: string };
  children: ReactNode;
};

function NoteLayout({ params, children }: NoteLayoutProps) {
  const { back } = useRouter();

  let noteId = "";
  let isNoteValid = true;
  try {
    noteId = nip19.decode(params.note).data.toString();
  } catch (e) {
    isNoteValid = false;
  }

  const { note, parent, isLoading } = useNoteThread(noteId);

  const value = {
    root: note,
    isLoading,
  };

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header title="Note" useActionButton action={back} />
      <section>
        {!note ? (
          isLoading ? (
            <Loading className="mt-5" />
          ) : (
            <div className="flex flex-col gap-8">
              <div className="p-8 text-center">
                <p className="text-3xl font-bold">This note doesn’t exist</p>
                <p className="text-light-secondary">
                  Try searching for another.
                </p>
              </div>
            </div>
          )
        ) : (
          <>
            {parent ? (
              <Note event={parent} expanded inThread parentNote />
            ) : null}
            <Note event={note} expanded inThread />
            <ThreadProvider value={value}>{children}</ThreadProvider>
          </>
        )}
      </section>
    </div>
  );
}

export default NoteLayout;

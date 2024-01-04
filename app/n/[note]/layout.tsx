"use client";

import { useRouter } from "next/navigation";
import { nip19 } from "nostr-tools";
import { useDeepCompareEffect } from "react-use";
import type { ReactNode } from "react";
import { useProfile } from "@/app/lib/context/profile-provider";
import ThreadProvider from "@/app/lib/context/thread-provider";
import Header from "@/app/components/common/header";
import Loading from "@/app/components/ui/loading";
import { useEvents } from "@/app/lib/hooks/useEvents";

function NoteLayout({
  params,
  children,
}: {
  params: { note: string };
  children: ReactNode;
}) {
  let note = "";
  let isNoteValid = true;
  try {
    note = nip19.decode(params.note).data.toString();
  } catch (e) {
    isNoteValid = false;
  }

  const { back } = useRouter();
  const { add: addProfiles, remove: removeProfiles } = useProfile();
  const { newEvents, isLoading } = useEvents({
    kinds: [1],
    ids: [note],
  });

  const root = newEvents[0];

  useDeepCompareEffect(() => {
    if (root) {
      addProfiles([root.pubkey]);
      return () => removeProfiles([root.pubkey]);
    }
  }, [root]);

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

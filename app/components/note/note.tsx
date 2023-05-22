"use client";

import cn from "clsx";
import { nip19 } from "nostr-tools";
import NoteContent from "@/app/components/note/note-content";
import NoteDate from "@/app/components/note/note-date";
import NoteRelays from "@/app/components/note/note-relays";
import NoteStats from "@/app/components/note/note-stats";
import UserAvatar from "@/app/components/user/user-avatar";
import UserName from "@/app/components/user/user-name";
import UserNpub from "@/app/components/user/user-npub";
import UserTooltip from "@/app/components/user/user-tooltip";
import type { RelayEvent } from "@/app/lib/types/event";

export type NoteProps = {
  event: RelayEvent;
  parentNote?: boolean;
};

function Note({ event, parentNote }: NoteProps) {
  const npub = nip19.npubEncode(event.pubkey);

  return (
    <article
      className={cn(
        `accent-tab hover:bg-dark-primary/30 relative flex flex-col gap-y-4 px-4 py-3 
         outline-none duration-200 cursor-pointer`,
        parentNote ? "mt-0.5 pt-2.5 pb-0" : "border-b border-light-border"
      )}
    >
      <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
        <div className="flex flex-col items-center gap-2">
          <UserTooltip npub={npub}>
            <UserAvatar
              src="/assets/default_profile.png"
              alt={npub}
              npub={npub}
            />
          </UserTooltip>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex justify-between gap-2 text-light-secondary">
            <div className="flex gap-1 truncate xs:overflow-visible xs:whitespace-normal">
              <UserTooltip npub={npub}>
                <UserName
                  name="test"
                  npub={npub}
                  verified={true}
                  className="text-light-primary"
                />
              </UserTooltip>
              <UserTooltip npub={npub}>
                <UserNpub npub={npub} />
              </UserTooltip>
              <NoteDate noteLink={""} createdAt={event.created_at * 1000} />
              <NoteRelays noteLink={""} relays={event.relays} />
            </div>
          </div>
          <NoteContent event={event} />
          <div className="mt-3 flex flex-col gap-2">
            <NoteStats
              // reply={reply}
              userId={event.pubkey}
              isOwner={false}
              noteId={event.id}
              userLikes={[]}
              userReplies={0}
              userReposts={[]}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default Note;

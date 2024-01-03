"use client";

import cn from "clsx";
import { nip19 } from "nostr-tools";
import { forwardRef } from "react";
import NoteContent from "@/app/components/note/note-content";
import NoteDate from "@/app/components/note/note-date";
import NoteRelays from "@/app/components/note/note-relays";
import NoteStats from "@/app/components/note/note-stats";
import UserAvatar from "@/app/components/user/user-avatar";
import UserName from "@/app/components/user/user-name";
import UserNpub from "@/app/components/user/user-npub";
import UserTooltip from "@/app/components/user/user-tooltip";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useProfile } from "@/app/lib/context/profile-provider";
import type { RelayEvent } from "@/app/lib/types/event";

export type NoteProps = {
  event: RelayEvent;
  parentNote?: boolean;
};

const Note = forwardRef(
  ({ event, parentNote, ...rest }: NoteProps, ref: any) => {
    const { publicKey } = useAuth();
    const { profiles } = useProfile();

    const npub = nip19.npubEncode(event.pubkey);
    const author = profiles.get(event.pubkey);
    const isOwner = publicKey === event.pubkey;

    return (
      <article
        className={cn(
          `accent-tab hover:bg-dark-primary/30 relative flex flex-col gap-y-4 px-4 py-3 
         outline-none duration-200 cursor-pointer`,
          parentNote ? "mt-0.5 pt-2.5 pb-0" : "border-b border-light-border"
        )}
        {...rest}
        ref={ref}
      >
        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
          <div className="flex flex-col items-center gap-2">
            <UserTooltip>
              <UserAvatar src={author?.picture} pubkey={event.pubkey} />
            </UserTooltip>
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex justify-between gap-2 text-light-secondary">
              <div className="flex gap-1 truncate xs:overflow-visible xs:whitespace-normal">
                <UserTooltip>
                  {author && (
                    <UserName
                      name={
                        author.displayName || author.display_name || author.name
                      }
                      pubkey={event.pubkey}
                      verified={author.verified}
                      className="text-light-primary"
                    />
                  )}
                </UserTooltip>
                <UserTooltip>
                  <UserNpub pubkey={event.pubkey} />
                </UserTooltip>
                <NoteDate noteLink={""} createdAt={event.created_at * 1000} />
                <NoteRelays noteLink={""} relays={event.relays} />
              </div>
            </div>
            <NoteContent event={event} />
            <div className="mt-3 flex flex-col gap-2">
              <NoteStats isOwner={isOwner} note={event} />
            </div>
          </div>
        </div>
      </article>
    );
  }
);

Note.displayName = "Note";

export default Note;

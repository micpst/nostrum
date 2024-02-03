"use client";

import cn from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { nip19 } from "nostr-tools";
import { forwardRef } from "react";
import Modal from "@/app/components/modal/modal";
import NoteReplyModal from "@/app/components/modal/note-replay-modal";
import NoteContent from "@/app/components/note/note-content";
import NoteDate from "@/app/components/note/note-date";
import NoteRelays from "@/app/components/note/note-relays";
import NoteStats from "@/app/components/note/note-stats";
import NoteStatus from "@/app/components/note/note-status";
import UserAvatar from "@/app/components/user/user-avatar";
import UserName from "@/app/components/user/user-name";
import UserNpub from "@/app/components/user/user-npub";
import UserTooltip from "@/app/components/user/user-tooltip";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useReposts } from "@/app/lib/context/reposts-provider";
import { useModal } from "@/app/lib/hooks/useModal";
import { useUserData } from "@/app/lib/hooks/useUserData";
import type { NoteEvent } from "@/app/lib/types/event";

interface INoteProps {
  event: NoteEvent;
  expanded?: boolean;
  inThread?: boolean;
  modal?: boolean;
  parentNote?: boolean;
}

const Note = forwardRef(
  (
    { event, expanded, inThread, modal, parentNote, ...rest }: INoteProps,
    ref: any,
  ) => {
    const { publicKey } = useAuth();
    const { open, openModal, closeModal } = useModal();
    const { reposts } = useReposts();
    const { push } = useRouter();

    const noteUrl = `/n/${nip19.noteEncode(event.id)}`;

    const author = useUserData(event.pubkey)!;
    const parent = useUserData(event.parent?.pubkey);
    const reposter = useUserData(event.repostedBy);

    const isOwner = publicKey === event.pubkey;
    const isNoteRepostedByUser = !!reposts.get(event.id)?.length;
    const isNoteReposted = isNoteRepostedByUser || !!event.repostedBy;

    const repostedBy = [
      isNoteRepostedByUser ? "You" : undefined,
      publicKey !== reposter?.pubkey ? reposter?.nameId : undefined,
    ].filter(Boolean);

    return (
      <article {...rest} ref={ref}>
        <Modal
          className="flex items-start justify-center"
          modalClassName="bg-main-background rounded-2xl max-w-xl w-full my-8 overflow-hidden"
          open={open}
          closeModal={closeModal}
        >
          <NoteReplyModal note={event} closeModal={closeModal} />
        </Modal>
        <div
          className={cn(
            `accent-tab hover:bg-dark-primary/30 relative flex flex-col gap-y-4 px-4 py-3 
             outline-none duration-200 cursor-pointer`,
            parentNote ? "mt-0.5 pt-2.5 pb-0" : "border-b border-light-border",
          )}
          onClick={() => push(noteUrl)}
        >
          <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
            {!modal && isNoteReposted ? (
              <NoteStatus>
                <Link
                  href={author.url}
                  onClick={(e) => e.stopPropagation()}
                  className="custom-underline truncate text-sm font-bold"
                >
                  {repostedBy.join(" and ")} reposted
                </Link>
              </NoteStatus>
            ) : null}
            <div className="flex flex-col items-center gap-2">
              <UserTooltip modal={modal}>
                <UserAvatar src={author?.picture} pubkey={event.pubkey} />
              </UserTooltip>
              {parentNote ? (
                <i className="hover-animation h-full w-0.5 bg-light-line-reply dark:bg-dark-line-reply" />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex justify-between gap-2 text-light-secondary">
                <div className="flex gap-1 truncate xs:overflow-visible xs:whitespace-normal">
                  <UserTooltip modal={modal}>
                    {author && (
                      <UserName
                        name={author.name}
                        pubkey={author.pubkey}
                        verified={author.verified}
                        className="text-light-primary"
                      />
                    )}
                  </UserTooltip>
                  <UserTooltip modal={modal}>
                    <UserNpub pubkey={event.pubkey} />
                  </UserTooltip>
                  <NoteDate
                    noteLink={noteUrl}
                    createdAt={event.created_at * 1000}
                  />
                  <NoteRelays noteLink={noteUrl} relays={event.relays} />
                </div>
              </div>
              {modal || (parent && !inThread) ? (
                <p
                  className={cn(
                    "text-light-secondary dark:text-dark-secondary",
                    modal && "order-1 my-2",
                  )}
                >
                  Replying to{" "}
                  <Link
                    href={modal ? author.url : (parent?.url as string)}
                    onClick={(e) => e.stopPropagation()}
                    className="custom-underline text-main-accent truncate"
                  >
                    @{modal ? author.nameId : parent!.nameId}
                  </Link>
                </p>
              ) : null}
              <NoteContent event={event} expanded={expanded} />
              <div className="mt-3 flex flex-col gap-2">
                {!modal ? (
                  <NoteStats
                    isOwner={isOwner}
                    note={event}
                    openModal={openModal}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  },
);

Note.displayName = "Note";

export default Note;

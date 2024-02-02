"use client";

import cn from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { nip19 } from "nostr-tools";
import { forwardRef } from "react";
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
import { useProfile } from "@/app/lib/context/profile-provider";
import { useReposts } from "@/app/lib/context/repost-provider";
import { getUserName, shortenHash } from "@/app/lib/utils/common";
import type { RelayEvent } from "@/app/lib/types/event";
import Modal from "@/app/components/modal/modal";
import { useModal } from "@/app/lib/hooks/useModal";
import NoteReplyModal from "@/app/components/modal/note-replay-modal";

export type NoteProps = {
  event: RelayEvent;
  modal?: boolean;
  parentNote?: boolean;
};

const Note = forwardRef(
  ({ event, modal, parentNote, ...rest }: NoteProps, ref: any) => {
    const { publicKey } = useAuth();
    const { open, openModal, closeModal } = useModal();
    const { profiles } = useProfile();
    const { reposts } = useReposts();
    const { push } = useRouter();

    const npub = nip19.npubEncode(event.pubkey);
    const note = nip19.noteEncode(event.id);
    const author = profiles.get(event.pubkey);
    const shortNpub = shortenHash(npub, 4);
    const authorUsername = author ? getUserName(author) : "";
    const isOwner = publicKey === event.pubkey;
    const isNoteReposted = !!reposts.get(event.id)?.length;

    return (
      <article
        className={cn(
          `accent-tab hover:bg-dark-primary/30 relative flex flex-col gap-y-4 px-4 py-3 
         outline-none duration-200 cursor-pointer`,
          parentNote ? "mt-0.5 pt-2.5 pb-0" : "border-b border-light-border",
        )}
        {...rest}
        ref={ref}
        onClick={() => push(`/n/${note}`)}
      >
        <Modal
          className="flex items-start justify-center"
          modalClassName="bg-main-background rounded-2xl max-w-xl w-full my-8 overflow-hidden"
          open={open}
          closeModal={closeModal}
        >
          <NoteReplyModal note={event} closeModal={closeModal} />
        </Modal>
        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
          {modal
            ? null
            : isNoteReposted && (
                <NoteStatus>
                  <Link
                    href={`/u/${npub}`}
                    onClick={(e) => e.stopPropagation()}
                    className="custom-underline truncate text-sm font-bold"
                  >
                    You reposted
                  </Link>
                </NoteStatus>
              )}
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
                      name={authorUsername}
                      pubkey={event.pubkey}
                      verified={author.verified}
                      className="text-light-primary"
                    />
                  )}
                </UserTooltip>
                <UserTooltip modal={modal}>
                  <UserNpub pubkey={event.pubkey} />
                </UserTooltip>
                <NoteDate noteLink={""} createdAt={event.created_at * 1000} />
                <NoteRelays noteLink={""} relays={event.relays} />
              </div>
            </div>
            {modal && (
              <p
                className={cn(
                  "text-light-secondary dark:text-dark-secondary",
                  modal && "order-1 my-2",
                )}
              >
                Replying to{" "}
                <Link
                  href={`/u/${npub}`}
                  onClick={(e) => e.stopPropagation()}
                  className="custom-underline text-main-accent truncate"
                >
                  @{authorUsername || shortNpub}
                </Link>
              </p>
            )}
            <NoteContent event={event} />
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
      </article>
    );
  },
);

Note.displayName = "Note";

export default Note;

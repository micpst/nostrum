"use client";

import Link from "next/link";
import { nip19 } from "nostr-tools";
import type { Event } from "nostr-tools";
import UserName from "@/app/components/user/user-name";
import UserNpub from "@/app/components/user/user-npub";
import UserTooltip from "@/app/components/user/user-tooltip";
import UserAvatar from "@/app/components/user/user-avatar";

export type PostProps = {
  event: Event;
};

function Post({ event }: PostProps) {
  const npub = nip19.npubEncode(event.pubkey);
  return (
    <Link
      href=""
      className="accent-tab hover-card relative flex flex-col
             gap-y-4 px-4 py-3 outline-none duration-200"
    >
      <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
        <div className="flex flex-col items-center gap-2">
          <UserTooltip npub={npub}>
            <UserAvatar src="/assets/default_profile.png" alt={npub} npub={npub} />
          </UserTooltip>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex justify-between gap-2 text-light-secondary dark:text-dark-secondary">
            <div className="flex gap-1 truncate xs:overflow-visible xs:whitespace-normal">
              <UserTooltip npub={npub}>
                <UserName
                  name="test"
                  npub={npub}
                  verified={true}
                  className="text-light-primary dark:text-dark-primary"
                />
              </UserTooltip>
              <UserTooltip npub={npub}>
                <UserNpub npub={npub} />
              </UserTooltip>
            </div>
          </div>
          <p className="whitespace-pre-line break-words">{event.content}</p>
        </div>
      </div>
    </Link>
  );
}

export default Post;

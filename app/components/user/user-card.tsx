import { nip19 } from "nostr-tools";
import UserAvatar from "@/app/components/user/user-avatar";
import FollowButton from "@/app/components/ui/follow-button";
import UserName from "@/app/components/user/user-name";
import UserTooltip from "@/app/components/user/user-tooltip";
import { getUserName, shortenHash } from "@/app/lib/utils/common";
import type { User } from "@/app/lib/types/user";

export default function UserCard({ user }: { user: User }): JSX.Element {
  const { pubkey, picture, verified } = user;
  const npub = nip19.npubEncode(pubkey);
  const shortNpub = shortenHash(npub, 7);
  return (
    <div
      className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4
                   py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
    >
      <UserTooltip avatar>
        <UserAvatar src={picture} pubkey={pubkey} />
      </UserTooltip>
      <div className="flex items-center justify-between gap-2 truncate xs:overflow-visible">
        <div className="flex flex-col justify-center truncate xs:overflow-visible xs:whitespace-normal">
          <UserTooltip>
            <UserName
              className="-mb-1"
              name={getUserName(user)}
              pubkey={pubkey}
              verified={verified}
            />
          </UserTooltip>
          <div className="flex items-center gap-1 text-light-secondary">
            <p className="truncate">{shortNpub}</p>
          </div>
        </div>
        <FollowButton userTargetPubkey={pubkey} />
      </div>
    </div>
  );
}

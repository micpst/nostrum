import { nip19 } from "nostr-tools";
import UserName from "@/app/components/user/user-name";
import { shortenHash } from "@/app/lib/utils/common";
import type { User } from "@/app/lib/types/user";

type UserDetailsProps = Pick<
  User,
  | "pubkey"
  | "nip05"
  | "about"
  | "name"
  | "displayName"
  | "display_name"
  | "verified"
>;

function UserDetails({
  pubkey,
  nip05,
  about,
  name,
  displayName,
  display_name,
  verified,
}: UserDetailsProps): JSX.Element {
  const npub = nip19.npubEncode(pubkey);
  const shortNpub = shortenHash(npub, 13);
  const username = displayName || display_name || name || "";

  return (
    <>
      <div>
        {username ? (
          <UserName
            className="-mb-1 text-xl"
            iconClassName="w-6 h-6"
            name={username}
            verified={verified}
          />
        ) : undefined}
        <div className="flex items-center gap-1 text-light-secondary">
          {verified && nip05 ? <p>{nip05}</p> : null}
        </div>
        <div className="flex items-center gap-1 text-light-secondary">
          <p>{shortNpub}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {about ? (
          <p className="whitespace-pre-line break-words">{about}</p>
        ) : undefined}
      </div>
    </>
  );
}

export default UserDetails;

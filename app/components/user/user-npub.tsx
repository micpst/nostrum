import cn from "clsx";
import Link from "next/link";
import { shortenHash } from "@/app/lib/utils";
import { nip19 } from "nostr-tools";

type UserNpubProps = {
  pubkey: string;
  npubLength?: number;
  className?: string;
  disableLink?: boolean;
};

function UserNpub({
  pubkey,
  npubLength,
  className,
  disableLink,
}: UserNpubProps): JSX.Element {
  const npub = nip19.npubEncode(pubkey);
  const shortNpub = shortenHash(npub, npubLength);

  return (
    <Link
      href={`user/${pubkey}`}
      className={cn(
        "truncate text-light-secondary underline decoration-transparent outline-none hover:decoration-inherit focus-visible:decoration-inherit",
        className,
        disableLink && "pointer-events-none"
      )}
      tabIndex={disableLink ? -1 : 0}
    >
      {shortNpub}
    </Link>
  );
}

export default UserNpub;

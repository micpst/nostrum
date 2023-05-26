import cn from "clsx";
import Link from "next/link";
import { shortenHash } from "@/app/lib/utils";

type UserNpubProps = {
  npub: string;
  npubLength?: number;
  className?: string;
  disableLink?: boolean;
};

function UserNpub({
  npub,
  npubLength,
  className,
  disableLink,
}: UserNpubProps): JSX.Element {
  const shortNpub = shortenHash(npub, npubLength);
  return (
    <Link
      href={`/${npub}`}
      className={cn(
        "truncate text-light-secondary",
        className,
        disableLink && "pointer-events-none"
      )}
      tabIndex={-1}
    >
      {shortNpub}
    </Link>
  );
}

export default UserNpub;

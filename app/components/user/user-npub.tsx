import cn from "clsx";
import Link from "next/link";
import { shortenHash } from "@/app/lib/utils";

type UserNpubProps = {
  npub: string;
  className?: string;
  disableLink?: boolean;
};

function UserNpub({
  npub,
  className,
  disableLink,
}: UserNpubProps): JSX.Element {
  const shortNpub = shortenHash(npub);
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
      @{shortNpub}
    </Link>
  );
}

export default UserNpub;

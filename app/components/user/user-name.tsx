import cn from "clsx";
import Link from "next/link";
import CustomIcon from "@/app/components/ui/icon";
import { nip19 } from "nostr-tools";

type UserNameProps = {
  name: string;
  verified: boolean;
  pubkey?: string;
  className?: string;
  iconClassName?: string;
  tag?: keyof JSX.IntrinsicElements;
};

function UserName({
  name,
  pubkey,
  className,
  iconClassName,
  verified,
  tag,
}: UserNameProps): JSX.Element {
  const OuterTag = pubkey ? Link : "div";
  const CustomTag = tag ? tag : "p";

  return (
    <OuterTag
      href={pubkey ? `/u/${nip19.npubEncode(pubkey)}` : ""}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "flex items-center gap-1 truncate font-bold decoration-transparent outline-none hover:decoration-inherit focus-visible:decoration-inherit",
        className,
        pubkey && "underline"
      )}
      tabIndex={pubkey ? 0 : -1}
    >
      <CustomTag className="truncate">{name}</CustomTag>
      {verified && (
        <i>
          <CustomIcon
            className={cn("fill-main-accent", iconClassName ?? "h-5 w-5")}
            iconName="BadgeIcon"
            solid
          />
        </i>
      )}
    </OuterTag>
  );
}

export default UserName;

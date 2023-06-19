import cn from "clsx";
import Link from "next/link";
import CustomIcon from "@/app/components/ui/icon";

type UserNameProps = {
  name: string;
  verified: boolean;
  pubkey: string;
  className?: string;
  iconClassName?: string;
};

function UserName({
  name,
  pubkey,
  className,
  iconClassName,
  verified,
}: UserNameProps): JSX.Element {
  return (
    <Link
      href={`user/${pubkey}`}
      className={cn(
        "flex items-center gap-1 truncate font-bold underline decoration-transparent outline-none hover:decoration-inherit focus-visible:decoration-inherit",
        className
      )}
      tabIndex={pubkey ? 0 : -1}
    >
      <p className="truncate">{name}</p>
      {verified && (
        <i>
          <CustomIcon
            className={cn("fill-main-accent", iconClassName ?? "h-5 w-5")}
            iconName="BadgeIcon"
            solid
          />
        </i>
      )}
    </Link>
  );
}

export default UserName;

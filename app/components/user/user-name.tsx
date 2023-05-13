import cn from "clsx";
import Link from "next/link";
import CustomIcon from "@/app/components/ui/icon";

type UserNameProps = {
  name: string;
  verified: boolean;
  npub?: string;
  className?: string;
  iconClassName?: string;
};

function UserName({
  name,
  npub,
  className,
  iconClassName,
  verified,
}: UserNameProps): JSX.Element {
  return (
    <Link
      href={npub ? `/${npub}` : "#"}
      className={cn(
        "flex items-center gap-1 truncate font-bold",
        npub ? "custom-underline" : "pointer-events-none",
        className
      )}
      tabIndex={npub ? 0 : -1}
    >
      <p className="truncate">{name}</p>
      {verified && (
        <i>
          <CustomIcon
            className={cn("fill-violet-700", iconClassName ?? "h-5 w-5")}
            iconName="BadgeIcon"
            solid
          />
        </i>
      )}
    </Link>
  );
}

export default UserName;

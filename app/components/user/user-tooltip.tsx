import cn from "clsx";
import { useWindow } from "@/app/lib/context/window-provider";
import type { ReactNode } from "react";
import type { User } from "@/app/lib/types/user";

type UserTooltipProps = Pick<User, "npub"> & {
  modal?: boolean;
  avatar?: boolean;
  children: ReactNode;
};

function UserTooltip({
  npub,
  modal,
  avatar,
  children,
}: UserTooltipProps): JSX.Element {
  const { isMobile } = useWindow();

  if (isMobile || modal) return <>{children}</>;

  return (
    <div
      className={cn(
        "group relative self-start text-light-primary",
        avatar ? "[&>div]:translate-y-2" : "grid [&>div]:translate-y-7"
      )}
    >
      {children}
    </div>
  );
}

export default UserTooltip;

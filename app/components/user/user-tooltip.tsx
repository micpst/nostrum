import cn from "clsx";
import type { ReactNode } from "react";
import { useWindow } from "@/app/lib/hooks/useWindow";

type UserTooltipProps = {
  modal?: boolean;
  avatar?: boolean;
  children: ReactNode;
};

function UserTooltip({
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

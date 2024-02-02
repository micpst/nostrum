import cn from "clsx";
import type { ReactNode } from "react";
import Button from "@/app/components/ui/button";
import type { IconName } from "@/app/components/ui/icon";
import CustomIcon from "@/app/components/ui/icon";
import ToolTip from "@/app/components/ui/tool-tip";

type HeaderProps = {
  tip?: string;
  title?: string;
  disableSticky?: boolean;
  children?: ReactNode;
  iconName?: IconName;
  useActionButton?: boolean;
  action?: () => void;
  className?: string;
};

function Header({
  tip,
  title,
  disableSticky,
  className,
  children,
  useActionButton,
  action,
  iconName,
}: HeaderProps): JSX.Element {
  return (
    <header
      className={cn(
        "hover-animation even z-10 bg-main-background/60 px-3 py-4 backdrop-blur-md",
        className ?? "flex items-center gap-6",
        !disableSticky && "sticky top-0",
      )}
    >
      {useActionButton && (
        <Button
          className="dark-bg-tab group relative p-2 hover:bg-light-primary/10 active:bg-light-primary/20"
          onClick={action}
        >
          <CustomIcon
            className="h-5 w-5"
            iconName={iconName ?? "ArrowLeftIcon"}
          />
          <ToolTip tip={tip ?? "Back"} />
        </Button>
      )}
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      {children}
    </header>
  );
}

export default Header;

import cn from "clsx";

import CustomIcon from "@/app/components/ui/icon";
import { formatNumber } from "@/app/lib/date";
import type { IconName } from "@/app/components/ui/icon";

type NoteOptionProps = {
  tip: string;
  stats?: number;
  iconName: IconName;
  disabled?: boolean;
  className: string;
  iconClassName: string;
  onClick?: (...args: unknown[]) => unknown;
};

function NoteOption({
  stats,
  disabled,
  iconName,
  className,
  iconClassName,
  onClick,
}: NoteOptionProps): JSX.Element {
  return (
    <button
      className={cn(
        `group flex items-center gap-1.5 p-0 transition-none
         disabled:cursor-not-allowed inner:transition inner:duration-200`,
        disabled && "cursor-not-allowed",
        className
      )}
      onClick={onClick}
    >
      <CustomIcon
        className={cn(
          "fill-light-secondary h-9 w-9 rounded-full p-2 not-italic group-focus-visible:ring-2",
          iconClassName
        )}
        iconName={iconName}
      />
      {stats ? (
        <div className="overflow-hidden">
          <p className="text-sm">{formatNumber(stats as number)}</p>
        </div>
      ) : undefined}
    </button>
  );
}

export default NoteOption;

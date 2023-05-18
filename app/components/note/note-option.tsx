import cn from "clsx";
import CustomIcon from "@/app/components/ui/icon";
import type { IconName } from "@/app/components/ui/icon";

type PostOptionProps = {
  tip: string;
  move?: number;
  stats?: number;
  iconName: IconName;
  disabled?: boolean;
  className: string;
  viewTweet?: boolean;
  iconClassName: string;
  onClick?: (...args: unknown[]) => unknown;
};

function NoteOption({
  tip,
  move,
  stats,
  disabled,
  iconName,
  className,
  viewTweet,
  iconClassName,
  onClick,
}: PostOptionProps): JSX.Element {
  return (
    <button
      className={cn(
        `group flex items-center gap-1.5 p-0 transition-none
         disabled:cursor-not-allowed inner:transition inner:duration-200`,
        disabled && "cursor-not-allowed",
        className
      )}
    >
      <i
        className={cn(
          "relative rounded-full p-2 not-italic group-focus-visible:ring-2",
          iconClassName
        )}
      >
        <CustomIcon
          className={viewTweet ? "h-6 w-6" : "h-5 w-5"}
          iconName={iconName}
        />
      </i>
      {/*{!viewTweet && (*/}
      {/*  <NumberStats move={move as number} stats={stats as number} />*/}
      {/*)}*/}
    </button>
  );
}

export default NoteOption;

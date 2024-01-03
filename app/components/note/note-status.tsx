import type { ReactNode } from "react";
import CustomIcon from "@/app/components/ui/icon";

type TweetStatusProps = {
  children: ReactNode;
};

export default function NoteStatus({
  children,
}: TweetStatusProps): JSX.Element {
  return (
    <div className="col-span-2 grid grid-cols-[48px,1fr] gap-3 text-light-secondary dark:text-dark-secondary">
      <i className="justify-self-end">
        <CustomIcon
          className="h-4 w-4 fill-light-secondary dark:fill-dark-secondary"
          iconName="ArrowPathRoundedSquareIcon"
        />
      </i>
      {children}
    </div>
  );
}

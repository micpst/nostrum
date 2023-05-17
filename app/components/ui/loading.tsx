import cn from "clsx";
import CustomIcon from "@/app/components/ui/icon";

type LoadingProps = {
  className?: string;
  iconClassName?: string;
};

function Loading({ className, iconClassName }: LoadingProps): JSX.Element {
  return (
    <div className={cn("flex justify-center", className ?? "p-4")}>
      <CustomIcon
        className={cn("text-main-accent", iconClassName ?? "h-7 w-7")}
        iconName="SpinnerIcon"
      />
    </div>
  );
}

export default Loading;

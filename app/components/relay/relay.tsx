import CustomIcon from "@/app/components/ui/icon";
import { useRelay } from "@/app/lib/context/relay-provider";

type RelayProps = {
  url: string;
};

function Relay({ url }: RelayProps) {
  const { removeRelay } = useRelay();

  const name = url.replace("wss://", "");

  return (
    <div className="flex gap-4 items-center justify-between px-4 py-3 w-full accent-tab hover:bg-light-secondary/5">
      <div className="flex flex-1 items-center gap-3.5">
        <CustomIcon
          iconName="GlobeIcon"
          className="fill-light-secondary w-5 h-5"
        />
        <span>{name}</span>
      </div>
      <button
        className="rounded-full hover:bg-accent-pink/10 focus-visible:bg-accent-pink/10"
        onClick={() => removeRelay(url)}
      >
        <CustomIcon iconName="MinusIcon" className="fill-accent-pink w-6 h-6" />
      </button>
    </div>
  );
}

export default Relay;

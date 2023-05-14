import cn from "clsx";
import { useState } from "react";
import { useRelay } from "@/app/lib/context/relay-provider";

type RelayButtonProps = {
  url: string;
  fallback?: string;
};

function RelayButton({ url, fallback }: RelayButtonProps) {
  const { relayUrl } = useRelay();

  const isActive = relayUrl === url;
  const fullName = url.replace("wss://", "");
  const name = fullName.replace("relay.", "");

  const [src, setSrc] = useState<string | undefined>(
    `https://${name}/favicon.ico`
  );

  const onError = () => setSrc(fallback);

  return (
    <button className="flex gap-4 items-center w-full accent-tab hover-animatio px-4 py-3 hover:bg-light-primary/5">
      <img
        className={cn(
          "h-12 w-12 rounded-full overflow-hidden",
          isActive && "ring-2 ring-offset-2 ring-violet-700"
        )}
        src={src}
        alt={name}
        onError={onError}
      />
      <span className={cn(isActive && "font-bold text-violet-700")}>
        {fullName}
      </span>
    </button>
  );
}

export default RelayButton;

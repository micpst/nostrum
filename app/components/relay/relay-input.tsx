"use client";

import cn from "clsx";
import { utils } from "nostr-tools";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import CustomIcon from "@/app/components/ui/icon";
import { useRelay } from "@/app/lib/context/relay-provider";

function RelayInput() {
  const { addRelay } = useRelay();
  const [relayUrl, setRelayUrl] = useState("");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!relayUrl) return;

    try {
      const url = utils.normalizeURL(`wss://${relayUrl}`);
      addRelay(url);
    } catch (e) {
      return;
    }

    setRelayUrl("");
  };

  return (
    <form
      className="group flex items-center justify-between gap-4 px-4 py-3"
      onSubmit={handleSubmit}
    >
      <input
        className="flex-1 bg-transparent outline-none placeholder:text-light-secondary"
        type="text"
        placeholder="Add relay"
        autoFocus
        value={relayUrl}
        onChange={(e) => setRelayUrl(e.target.value)}
      />
      <button
        className={cn(
          "rounded-full disabled:fill-gray-400 fill-accent-green ",
          relayUrl &&
            "hover:bg-accent-green/10 focus-visible:bg-accent-green/10"
        )}
        type="submit"
        disabled={!relayUrl}
      >
        <CustomIcon iconName="PlusIcon" className="w-6 h-6" />
      </button>
    </form>
  );
}

export default RelayInput;

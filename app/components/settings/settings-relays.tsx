"use client";

import Relay from "@/app/components/relay/relay";
import RelayInput from "@/app/components/relay/relay-input";
import { useRelay } from "@/app/lib/context/relay-provider";

function SettingsRelays() {
  const { relays } = useRelay();
  return (
    <>
      <RelayInput />
      {relays.map((relay, i) => (
        <Relay key={i} url={relay} />
      ))}
      {relays.length === 0 && (
        <div className="flex items-center justify-center mt-6 text-light-secondary">
          No relays added yet
        </div>
      )}
    </>
  );
}

export default SettingsRelays;

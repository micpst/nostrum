"use client";

import Link from "next/link";
import RelayButton from "@/app/components/relay/relay-button";
import { useRelay } from "@/app/lib/context/relay-provider";

function Relays() {
  const { activeRelay, allRelays, connect } = useRelay();
  return (
    <section className="rounded-2xl bg-gray-100">
      <div className="px-4 py-3">
        <h2 className="text-xl font-bold">Your relays</h2>
      </div>
      {allRelays.slice(0, 3).map((relay, i) => (
        <RelayButton key={i} url={relay} />
      ))}
      <Link
        href="/settings/relays"
        className="custom-button hover-animatio hover:bg-light-primary/5 block
                   w-full px-4 py-3 rounded-b-2xl text-violet-700"
      >
        Show more
      </Link>
    </section>
  );
}

export default Relays;

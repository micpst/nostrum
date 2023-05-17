"use client";

import Link from "next/link";

function Relays() {
  return (
    <section className="rounded-2xl bg-gray-100">
      <div className="px-4 py-3">
        <h2 className="text-xl font-bold">Current relay</h2>
      </div>
      <Link
        href="/settings/relays"
        className="hover:bg-light-primary/5 block w-full px-4 py-3 rounded-b-2xl text-violet-700"
      >
        Change relay
      </Link>
    </section>
  );
}

export default Relays;

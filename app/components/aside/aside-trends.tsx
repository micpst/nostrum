"use client";

import Link from "next/link";
import { useAuth } from "@/app/lib/context/auth-provider";

function AsideTrends(): JSX.Element | null {
  const { publicKey } = useAuth();

  return (
    <section className="rounded-2xl bg-gray-100">
      <div className="px-4 py-3">
        <h2 className="text-xl font-extrabold">Trends</h2>
      </div>
      <Link
        href="/trends"
        className="hover:bg-light-primary/5 block w-full px-4 py-3 rounded-b-2xl text-main-accent"
      >
        Show more
      </Link>
    </section>
  );
}

export default AsideTrends;

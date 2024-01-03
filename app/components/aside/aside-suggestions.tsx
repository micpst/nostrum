"use client";

import Link from "next/link";
import Loading from "@/app/components/ui/loading";
import { useSuggestions } from "@/app/lib/context/suggestion-provider";
import { useProfile } from "@/app/lib/context/profile-provider";
import { UserCard } from "@/app/components/user/user-card";
import type { User } from "@/app/lib/types/user";

function AsideSuggestions(): JSX.Element {
  const { profiles, isLoading: isLoadingProfiles } = useProfile();
  const { suggestions, isLoading: isLoadingSuggestions } = useSuggestions();

  const isLoading =
    isLoadingSuggestions ||
    suggestions.some((pubkey) => isLoadingProfiles.has(pubkey));

  return (
    <section className="rounded-2xl bg-gray-100">
      <div className="px-4 py-3">
        <h2 className="text-xl font-extrabold">Who to follow</h2>
      </div>
      {isLoading ? (
        <Loading className="my-5" />
      ) : (
        <>
          {suggestions
            .filter((pubkey) => profiles.has(pubkey))
            .map((pubkey) => (
              <UserCard user={profiles.get(pubkey) as User} key={pubkey} />
            ))}
          <Link
            href="/connect"
            className="hover:bg-light-primary/5 block w-full px-4 py-3 rounded-b-2xl text-main-accent"
          >
            Show more
          </Link>
        </>
      )}
    </section>
  );
}

export default AsideSuggestions;

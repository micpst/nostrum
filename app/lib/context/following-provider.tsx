/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import NostrService from "@/app/lib/services/nostr";

type FollowingContext = {
  following: Set<string>;
  follow: (pubkey: string) => Promise<void>;
  unfollow: (pubkey: string) => Promise<void>;
};

type FollowingProviderProps = {
  children: ReactNode;
};

export const FollowingContext = createContext<FollowingContext | null>(null);

export default function FollowingProvider({
  children,
}: FollowingProviderProps) {
  const { publicKey } = useAuth();
  const { relays, list, publish } = useRelay();
  const [following, setFollowing] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (publicKey === undefined) setFollowing(new Set());
    else void fetchFollowing();
  }, [publicKey, relays]);

  const fetchFollowing = async (): Promise<void> => {
    if (publicKey === undefined) return;

    const events = await list({
      kinds: [3],
      authors: [publicKey],
    });

    const following = events
      .flatMap((event) => event.tags)
      .filter((tag) => tag[0] === "p")
      .map((tag) => tag[1]);

    setFollowing(new Set(following));
  };

  const follow = async (pubkey: string): Promise<void> => {
    if (!pubkey || !publicKey) return;

    const newContacts = [...following, pubkey];
    const tags = newContacts.map((contact) => ["p", contact]);
    const event = await NostrService.createEvent(3, publicKey, "", tags);

    if (event) await publish(event);
    setFollowing(new Set(newContacts));
  };

  const unfollow = async (pubkey: string): Promise<void> => {
    if (!pubkey || !publicKey) return;

    const newContacts = Array.from(following).filter(
      (contact) => contact !== pubkey
    );
    const tags = newContacts.map((contact) => ["p", contact]);
    const event = await NostrService.createEvent(3, publicKey, "", tags);

    if (event) await publish(event);
    setFollowing(new Set(newContacts));
  };

  const value: FollowingContext = {
    following,
    follow,
    unfollow,
  };

  return (
    <FollowingContext.Provider value={value}>
      {children}
    </FollowingContext.Provider>
  );
}

export function useFollowing(): FollowingContext {
  const context = useContext(FollowingContext);

  if (!context)
    throw new Error("useFollowing must be used within an FollowingProvider");

  return context;
}

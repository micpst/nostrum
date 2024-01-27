/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import followingService from "@/app/lib/services/followingService";
import type { ProviderProps } from "@/app/lib/context/providers";

type FollowingContext = {
  following: Set<string>;
  isLoading: boolean;
  follow: (pubkey: string) => Promise<void>;
  unfollow: (pubkey: string) => Promise<void>;
};

export const FollowingContext = createContext<FollowingContext | null>(null);

export default function FollowingProvider({ children }: ProviderProps) {
  const { publicKey } = useAuth();
  const { relays } = useRelay();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [following, setFollowing] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!publicKey) setFollowing(new Set());
    else void fetchFollowing();
  }, [publicKey, relays]);

  const fetchFollowing = async (): Promise<void> => {
    if (!publicKey) return;

    setIsLoading(true);

    const following = await followingService.listFollowingAsync({
      relays: Array.from(relays.values()),
      pubkey: publicKey,
    });

    setFollowing(new Set(following));
    setIsLoading(false);
  };

  const follow = async (pubkey: string): Promise<void> => {
    if (!pubkey || !publicKey) return;

    const newFollowing = [...following, pubkey];
    await followingService.publishFollowingAsync({
      relays: Array.from(relays.values()),
      pubkey: publicKey,
      followings: newFollowing,
    });

    setFollowing(new Set(newFollowing));
  };

  const unfollow = async (pubkey: string): Promise<void> => {
    if (!pubkey || !publicKey) return;

    const newFollowing = Array.from(following).filter(
      (following) => following !== pubkey
    );
    await followingService.publishFollowingAsync({
      relays: Array.from(relays.values()),
      pubkey: publicKey,
      followings: newFollowing,
    });

    setFollowing(new Set(newFollowing));
  };

  const value: FollowingContext = {
    following,
    isLoading,
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

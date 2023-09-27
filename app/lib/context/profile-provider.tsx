/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { nip05 } from "nostr-tools";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import type { User } from "@/app/lib/types/user";

type ProfileContext = {
  profiles: Map<string, User>;
  isLoading: Set<string>;
  addProfiles: (pubkeys: string[]) => void;
  removeProfiles: (pubkeys: string[]) => void;
  setProfile: (profile: User) => void;
};

type ProfileProviderProps = {
  children: ReactNode;
};

export const ProfileContext = createContext<ProfileContext | null>(null);

const defaultProfile: User = {
  pubkey: "",
  name: "",
  about: "",
  picture: "",
  banner: "",
  nip05: "",
  verified: false,
};

export default function ProfileProvider({ children }: ProfileProviderProps) {
  const { publicKey } = useAuth();
  const { relays, list } = useRelay();

  const [profiles, setProfiles] = useState<Map<string, User>>(new Map());
  const [isLoading, setIsLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (publicKey === undefined) return;
    void addProfiles([publicKey]);
    return () => removeProfiles([publicKey]);
  }, [publicKey, relays]);

  const addProfiles = async (pubkeys: string[]) => {
    const authors = pubkeys.filter(
      (pubkey) => !profiles.has(pubkey) || !isLoading.has(pubkey)
    );

    if (authors.length === 0) return;

    setIsLoading((prev) => new Set([...prev, ...authors]));

    const events = await list({
      kinds: [0],
      authors,
    });

    const profilesQuery = events.map(async (event) => {
      const parsed = JSON.parse(event.content);
      const pointer = await nip05.queryProfile(parsed?.nip05 || "");
      return [
        event.pubkey,
        {
          ...parsed,
          verified: pointer?.pubkey === event.pubkey,
          pubkey: event.pubkey,
        },
      ] as [string, User];
    });

    const newProfiles = await Promise.all(profilesQuery);

    const defaults: [string, User][] = authors.map((pubkey) => [
      pubkey,
      { ...defaultProfile, pubkey },
    ]);

    setProfiles((prev) => new Map([...prev, ...defaults, ...newProfiles]));
    setIsLoading((prev) => {
      const newLoading = new Set(prev);
      authors.forEach((author) => newLoading.delete(author));
      return newLoading;
    });
  };

  const removeProfiles = (pubkeys: string[]) => {
    setProfiles((prev) => {
      const newProfiles = new Map(prev);
      pubkeys.forEach((pubkey) => newProfiles.delete(pubkey));
      return newProfiles;
    });
  };

  const setProfile = async (data: User): Promise<void> => {
    const pointer = await nip05.queryProfile(data.nip05 || "");
    const newProfile: [string, User] = [
      data.pubkey,
      { ...data, verified: pointer?.pubkey === data.pubkey },
    ];
    setProfiles((prev) => new Map([...prev, newProfile]));
  };

  const value: ProfileContext = {
    profiles,
    isLoading,
    addProfiles,
    removeProfiles,
    setProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContext {
  const context = useContext(ProfileContext);

  if (!context)
    throw new Error("useProfile must be used within an ProfileProvider");

  return context;
}

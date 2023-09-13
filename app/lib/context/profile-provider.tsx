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

type ProfilesState = {
  profiles: Map<string, User>;
  isLoading: Set<string>;
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
  const [state, setState] = useState<ProfilesState>({
    profiles: new Map(),
    isLoading: new Set(),
  });

  useEffect(() => {
    if (publicKey === undefined) return;
    void addProfiles([publicKey]);
    return () => removeProfiles([publicKey]);
  }, [publicKey]);

  useEffect(() => {
    void addProfiles(Array.from(state.profiles.keys()));
  }, [relays]);

  const addProfiles = async (pubkeys: string[]) => {
    const authors = pubkeys.filter((pubkey) => !state.profiles.has(pubkey));

    if (authors.length === 0) return;

    setState((prev) => ({
      ...prev,
      isLoading: new Set(authors),
    }));

    const defaultProfiles = authors.map(
      (pubkey) => [pubkey, { ...defaultProfile, pubkey }] as [string, User]
    );

    const events = await list({
      kinds: [0],
      authors,
    });

    const profiles = await Promise.all(
      events.map(async (event) => {
        const parsed = JSON.parse(event.content);
        const profile = await nip05.queryProfile(parsed?.nip05 || "");
        return [
          event.pubkey,
          {
            ...parsed,
            verified: profile?.pubkey === event.pubkey,
            pubkey: event.pubkey,
          },
        ] as [string, User];
      })
    );

    setState((prev) => ({
      profiles: new Map([...prev.profiles, ...defaultProfiles, ...profiles]),
      isLoading: new Set(),
    }));
  };

  const setProfile = async (data: User): Promise<void> => {
    const profile = await nip05.queryProfile(data.nip05 || "");
    setState((prev) => ({
      ...prev,
      profiles: new Map([
        ...prev.profiles,
        [
          data.pubkey,
          {
            ...data,
            verified: profile?.pubkey === data.pubkey,
          },
        ],
      ]),
    }));
  };

  const removeProfiles = (pubkeys: string[]) => {
    setState((prev) => {
      const newProfiles = new Map(prev.profiles);
      pubkeys.forEach((pubkey) => newProfiles.delete(pubkey));
      return { ...prev, profiles: newProfiles };
    });
  };

  const value: ProfileContext = {
    ...state,
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

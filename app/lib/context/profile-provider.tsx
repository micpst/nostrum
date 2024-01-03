/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { nip05 } from "nostr-tools";
import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import {
  addProfiles,
  reloadProfiles,
  removeProfiles,
  updateProfiles,
} from "@/app/lib/actions/profiles";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import profilesReducer from "@/app/lib/reducers/profilesReducer";
import {
  groupEventsByPubkey,
  selectMostFrequentEvent,
} from "@/app/lib/utils/events";
import type { ProfileState } from "@/app/lib/reducers/profilesReducer";
import type { User } from "@/app/lib/types/user";
import type { RelayEvent } from "@/app/lib/types/event";

type ProfileContext = {
  profiles: Map<string, User>;
  isLoading: Set<string>;
  add: (pubkeys: string[]) => void;
  remove: (pubkeys: string[]) => void;
  set: (profile: User) => void;
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

const initialState: ProfileState = {
  profiles: new Map(),
  refCounter: new Map(),
  isLoading: new Set(),
};

export default function ProfileProvider({ children }: ProfileProviderProps) {
  const { publicKey } = useAuth();
  const { relays, list } = useRelay();
  const [state, dispatch] = useReducer(profilesReducer, initialState);

  useEffect(() => {
    if (publicKey === undefined) return;
    void add([publicKey]);
    return () => remove([publicKey]);
  }, [publicKey]);

  useEffect(() => {
    if (publicKey === undefined) return;
    void reload([publicKey]);
  }, [relays]);

  const listProfiles = async (authors: string[]): Promise<User[]> => {
    const events = await list({
      kinds: [0],
      authors,
    });

    const groupedEvents = groupEventsByPubkey(events);

    const selectedEvents = Array.from(groupedEvents.values())
      .filter((eventsForPubkey) => eventsForPubkey.length)
      .map((eventsForPubkey) =>
        selectMostFrequentEvent(eventsForPubkey)
      ) as RelayEvent[];

    const profilesQuery = selectedEvents.map(async (event) => {
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

    const defaultProfiles = authors.map((pubkey) => [
      pubkey,
      { ...defaultProfile, pubkey },
    ]) as [string, User][];

    return Array.from(new Map([...defaultProfiles, ...newProfiles]).values());
  };

  const add = async (pubkeys: string[]): Promise<void> => {
    const action = addProfiles(pubkeys);
    const { isLoading } = profilesReducer(state, action);
    const authors = Array.from(isLoading);

    dispatch(action);

    if (!authors.length) return;

    const profiles = await listProfiles(authors);

    dispatch(updateProfiles(profiles));
  };

  const reload = async (pubkeys: string[]): Promise<void> => {
    const action = reloadProfiles(pubkeys);
    const { isLoading } = profilesReducer(state, action);
    const authors = Array.from(isLoading);

    dispatch(action);

    if (!authors.length) return;

    const profiles = await listProfiles(authors);

    dispatch(updateProfiles(profiles));
  };

  const remove = (pubkeys: string[]): void => {
    dispatch(removeProfiles(pubkeys));
  };

  const set = async (data: User): Promise<void> => {
    const pointer = await nip05.queryProfile(data.nip05 || "");
    const newProfile = { ...data, verified: pointer?.pubkey === data.pubkey };
    dispatch(updateProfiles([newProfile]));
  };

  const value: ProfileContext = {
    profiles: state.profiles,
    isLoading: state.isLoading,
    add,
    remove,
    set,
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

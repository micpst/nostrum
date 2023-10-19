/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { nip05 } from "nostr-tools";
import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import profileReducer from "@/app/lib/reducers/profileReducer";
import { groupEventsByPubkey, selectMostFrequentEvent } from "@/app/lib/utils";
import type { ProfileState } from "@/app/lib/reducers/profileReducer";
import type { User } from "@/app/lib/types/user";
import type { RelayEvent } from "@/app/lib/types/event";

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

const initialState: ProfileState = {
  profiles: new Map(),
  refCounter: new Map(),
  isLoading: new Set(),
};

export default function ProfileProvider({ children }: ProfileProviderProps) {
  const { publicKey } = useAuth();
  const { relays, list } = useRelay();

  const [state, dispatch] = useReducer(profileReducer, initialState);

  useEffect(() => {
    if (publicKey === undefined) return;
    void addProfiles([publicKey]);
    return () => removeProfiles([publicKey]);
  }, [publicKey]);

  useEffect(() => {
    if (publicKey === undefined) return;
    void reloadProfiles([publicKey]);
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

  const addProfiles = async (pubkeys: string[]): Promise<void> => {
    const action = { type: "ADD_PROFILES", pubkeys };
    const { isLoading } = profileReducer(state, action);
    const authors = Array.from(isLoading);

    dispatch(action);

    if (!authors.length) return;

    const profiles = await listProfiles(authors);

    dispatch({
      type: "UPDATE_PROFILES",
      profiles,
    });
  };

  const reloadProfiles = async (pubkeys: string[]): Promise<void> => {
    const action = { type: "RELOAD_PROFILES", pubkeys };
    const { isLoading } = profileReducer(state, action);
    const authors = Array.from(isLoading);

    dispatch(action);

    if (!authors.length) return;

    const profiles = await listProfiles(authors);

    dispatch({
      type: "UPDATE_PROFILES",
      profiles,
    });
  };

  const removeProfiles = (pubkeys: string[]): void => {
    dispatch({ type: "REMOVE_PROFILES", pubkeys });
  };

  const setProfile = async (data: User): Promise<void> => {
    const pointer = await nip05.queryProfile(data.nip05 || "");
    const newProfile = { ...data, verified: pointer?.pubkey === data.pubkey };
    dispatch({
      type: "UPDATE_PROFILES",
      profiles: [newProfile],
    });
  };

  const value: ProfileContext = {
    profiles: state.profiles,
    isLoading: state.isLoading,
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

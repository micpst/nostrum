/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect } from "react";
import { createReducer, useDeepCompareEffect } from "react-use";
import { thunk } from "redux-thunk";
import {
  addProfilesAsync,
  reloadProfilesAsync,
  removeProfiles as removeProfilesAction,
  updateProfileAsync,
} from "@/app/lib/actions/profilesActions";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import profilesReducer from "@/app/lib/reducers/profilesReducer";
import type { ProviderProps } from "@/app/lib/context/providers";
import type {
  ProfileAction,
  ProfileState,
} from "@/app/lib/reducers/profilesReducer";
import type { EditableUserData, User } from "@/app/lib/types/user";

type ProfileContext = {
  profiles: Map<string, User>;
  isLoading: Set<string>;
  addProfiles: (pubkeys: string[]) => void;
  removeProfiles: (pubkeys: string[]) => void;
  reloadProfiles: (pubkeys: string[]) => void;
  setProfile: (profile: EditableUserData) => void;
};

const initialState: ProfileState = {
  profiles: new Map(),
  refCounter: new Map(),
  isLoading: new Set(),
};

const useReducer = createReducer<ProfileAction, ProfileState>(thunk);

export const ProfileContext = createContext<ProfileContext | null>(null);

export default function ProfileProvider({ children }: ProviderProps) {
  const { publicKey } = useAuth();
  const { relays } = useRelay();
  const [{ profiles, isLoading }, dispatch]: [ProfileState, any] = useReducer(
    profilesReducer,
    initialState,
  );

  useEffect(() => {
    if (publicKey) {
      void addProfiles([publicKey]);
      return () => removeProfiles([publicKey]);
    }
  }, [publicKey]);

  useDeepCompareEffect(() => {
    if (publicKey) {
      void reloadProfiles([publicKey]);
    }
  }, [Array.from(relays.keys())]);

  const setProfile = (data: EditableUserData): void => {
    if (!publicKey) return;
    dispatch(
      updateProfileAsync({
        relays: Array.from(relays.values()),
        pubkey: publicKey,
        data,
      }),
    );
  };

  const addProfiles = (pubkeys: string[]): void => {
    dispatch(
      addProfilesAsync({
        relays: Array.from(relays.values()),
        pubkeys,
      }),
    );
  };

  const reloadProfiles = (pubkeys: string[]): void => {
    dispatch(
      reloadProfilesAsync({
        relays: Array.from(relays.values()),
        pubkeys,
      }),
    );
  };

  const removeProfiles = (pubkeys: string[]): void => {
    dispatch(removeProfilesAction(pubkeys));
  };

  const value: ProfileContext = {
    profiles,
    isLoading,
    addProfiles,
    removeProfiles,
    setProfile,
    reloadProfiles,
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

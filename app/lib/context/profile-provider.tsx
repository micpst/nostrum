/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect } from "react";
import { thunk } from "redux-thunk";
import { createReducer, useDeepCompareEffect } from "react-use";
import {
  addProfilesAsync,
  reloadProfilesAsync,
  removeProfiles,
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
  add: (pubkeys: string[]) => void;
  remove: (pubkeys: string[]) => void;
  set: (profile: EditableUserData) => void;
  reload: (pubkeys: string[]) => void;
};

export const ProfileContext = createContext<ProfileContext | null>(null);

const initialState: ProfileState = {
  profiles: new Map(),
  refCounter: new Map(),
  isLoading: new Set(),
};

const useReducer = createReducer<ProfileAction, ProfileState>(thunk);

export default function ProfileProvider({ children }: ProviderProps) {
  const { publicKey } = useAuth();
  const { relays } = useRelay();
  const [{ profiles, isLoading }, dispatch]: [ProfileState, any] = useReducer(
    profilesReducer,
    initialState
  );

  useEffect(() => {
    if (publicKey) {
      void add([publicKey]);
      return () => remove([publicKey]);
    }
  }, [publicKey]);

  useDeepCompareEffect(() => {
    if (publicKey) {
      void reload([publicKey]);
    }
  }, [relays]);

  const set = (data: EditableUserData): void => {
    if (!publicKey) return;
    dispatch(
      updateProfileAsync({
        relays: Array.from(relays.values()),
        pubkey: publicKey,
        data,
      })
    );
  };

  const add = (pubkeys: string[]): void => {
    dispatch(
      addProfilesAsync({
        relays: Array.from(relays.values()),
        pubkeys,
      })
    );
  };

  const reload = (pubkeys: string[]): void => {
    dispatch(
      reloadProfilesAsync({
        relays: Array.from(relays.values()),
        pubkeys,
      })
    );
  };

  const remove = (pubkeys: string[]): void => {
    dispatch(removeProfiles(pubkeys));
  };

  const value: ProfileContext = {
    profiles,
    isLoading,
    add,
    remove,
    set,
    reload,
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

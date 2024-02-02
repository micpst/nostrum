"use client";

import { createContext, useContext } from "react";
import { createReducer } from "react-use";
import { thunk } from "redux-thunk";
import {
  addRepostAsync,
  addRepostsAsync,
  removeRepostAsync,
  removeReposts as removeRepostsAction,
} from "@/app/lib/actions/repostsActions";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import repostsReducer from "@/app/lib/reducers/repostsReducer";
import type { ProviderProps } from "@/app/lib/context/providers";
import type {
  RepostsAction,
  RepostsState,
} from "@/app/lib/reducers/repostsReducer";
import type { RelayEvent } from "@/app/lib/types/event";

interface IRepostsContext {
  reposts: Map<string, string[]>;
  isLoading: Set<string>;
  addReposts: (notesIds: string[]) => void;
  removeReposts: (notesIds: string[]) => void;
  repost: (note: RelayEvent) => void;
  unrepost: (note: RelayEvent) => void;
}

const initialState: RepostsState = {
  reposts: new Map(),
  isLoading: new Set(),
};

const useReducer = createReducer<RepostsAction, RepostsState>(thunk);

export const RepostsContext = createContext<IRepostsContext | null>(null);

export default function RepostsProvider({ children }: ProviderProps) {
  const { publicKey } = useAuth();
  const { relays } = useRelay();
  const [{ reposts, isLoading }, dispatch]: [RepostsState, any] = useReducer(
    repostsReducer,
    initialState,
  );

  const addReposts = (notesIds: string[]): void => {
    if (!publicKey) return;
    dispatch(
      addRepostsAsync({
        relays: Array.from(relays.values()),
        pubkey: publicKey,
        notesIds: notesIds,
      }),
    );
  };

  const removeReposts = (notesIds: string[]): void => {
    if (!publicKey) return;
    dispatch(removeRepostsAction(notesIds));
  };

  const repost = (note: RelayEvent): void => {
    if (!publicKey) return;
    dispatch(
      addRepostAsync({
        relays: Array.from(relays.values()),
        pubkey: publicKey,
        noteToRepost: note,
      }),
    );
  };

  const unrepost = (note: RelayEvent): void => {
    if (!publicKey) return;
    dispatch(
      removeRepostAsync({
        relays: Array.from(relays.values()),
        pubkey: publicKey,
        noteToRepost: note,
      }),
    );
  };

  const value: IRepostsContext = {
    reposts,
    isLoading,
    addReposts,
    removeReposts,
    repost,
    unrepost,
  };

  return (
    <RepostsContext.Provider value={value}>{children}</RepostsContext.Provider>
  );
}

export function useReposts(): IRepostsContext {
  const context = useContext(RepostsContext);

  if (!context)
    throw new Error("useRepost must be used within an RepostProvider");

  return context;
}

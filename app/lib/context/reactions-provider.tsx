"use client";

import { createContext, useContext } from "react";
import { createReducer } from "react-use";
import { thunk } from "redux-thunk";
import {
  addReactionAsync,
  addReactionsAsync,
  removeReactionAsync,
  removeReactions as removeReactionsAction,
} from "@/app/lib/actions/reactionsActions";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import reactionsReducer from "@/app/lib/reducers/reactionsReducer";
import type { ProviderProps } from "@/app/lib/context/providers";
import type {
  ReactionsAction,
  ReactionsState,
} from "@/app/lib/reducers/reactionsReducer";
import type { RelayEvent } from "@/app/lib/types/event";

interface IReactionsContext {
  reactions: Map<string, string[]>;
  isLoading: Set<string>;
  addReactions: (notesIds: string[]) => void;
  removeReactions: (notesIds: string[]) => void;
  like: (note: RelayEvent) => void;
  unlike: (note: RelayEvent) => void;
}

const initialState: ReactionsState = {
  reactions: new Map(),
  isLoading: new Set(),
};

const useReducer = createReducer<ReactionsAction, ReactionsState>(thunk);

export const ReactionsContext = createContext<IReactionsContext | null>(null);

export default function ReactionsProvider({ children }: ProviderProps) {
  const { publicKey } = useAuth();
  const { relays } = useRelay();
  const [{ reactions, isLoading }, dispatch]: [ReactionsState, any] =
    useReducer(reactionsReducer, initialState);

  const addReactions = (notesIds: string[]): void => {
    if (!publicKey) return;
    dispatch(
      addReactionsAsync({
        relays: Array.from(relays.values()),
        pubkey: publicKey,
        notesIds: notesIds,
      }),
    );
  };

  const removeReactions = (notesIds: string[]): void => {
    if (!publicKey) return;
    dispatch(removeReactionsAction(notesIds));
  };

  const like = (note: RelayEvent): void => {
    if (!publicKey) return;
    dispatch(
      addReactionAsync({
        relays: Array.from(relays.values()),
        pubkey: publicKey,
        noteToReact: note,
      }),
    );
  };

  const unlike = (note: RelayEvent): void => {
    if (!publicKey) return;
    dispatch(
      removeReactionAsync({
        relays: Array.from(relays.values()),
        pubkey: publicKey,
        noteToReact: note,
      }),
    );
  };

  const value: IReactionsContext = {
    reactions,
    isLoading,
    addReactions,
    removeReactions,
    like,
    unlike,
  };

  return (
    <ReactionsContext.Provider value={value}>
      {children}
    </ReactionsContext.Provider>
  );
}

export function useReactions(): IReactionsContext {
  const context = useContext(ReactionsContext);

  if (!context)
    throw new Error("useReactions must be used within an ReactionsProvider");

  return context;
}

/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import NostrService from "@/app/lib/services/nostr";
import { RelayEvent } from "@/app/lib/types/event";

type ReactionsContext = {
  reactions: Set<string>;
  fetchReactions: (eventIds: string[]) => Promise<void>;
  like: (eventId: string) => Promise<void>;
  unlike: (eventId: string) => Promise<void>;
};

type ReactionsProviderProps = {
  children: ReactNode;
};

export const ReactionsContext = createContext<ReactionsContext | null>(null);

export default function ReactionsProvider({
  children,
}: ReactionsProviderProps) {
  const { publicKey } = useAuth();
  const { list, publish } = useRelay();
  const [reactions, setReactions] = useState<Set<string>>(new Set());

  const fetchReactions = async (notesIds: string[]): Promise<void> => {
    if (publicKey === undefined) return;

    console.log(notesIds);

    // const events = await list({
    //   kinds: [7],
    //   authors: [publicKey],
    //   "#e": notesIds,
    // });
    //
    // console.log(events);

    // const reactions = events
    //   .flatMap((event) => event.tags)
    //   .filter((tag) => tag[0] === "p")
    //   .map((tag) => tag[1]);

    // setReactions(new Set(Reactions));
  };

  const like = async (pubkey: string): Promise<void> => {
    console.log("like", pubkey);
    // if (!pubkey || !publicKey) return;
    //
    // let tags = event.tags.filter(tag => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"));
    // tags.push(["e", liked.id]);
    // tags.push(["p", liked.pubkey]);
    //
    //
    // let tags = [
    //     ["e", liked.id],
    //     ["p", liked.pubkey],
    // ]
    //
    // let ev = {
    //   content: "+",
    //   pubkey: pubkey,
    //   kind: 7,
    //   tags: tags,
    //
    // const newContacts = [...Reactions, pubkey];
    // const tags = newContacts.map((contact) => ["p", contact]);
    // const event = await NostrService.createEvent(3, publicKey, "", tags);
    //
    // if (event) await publish(event);
    // setReactions(new Set(newContacts));
  };

  const unlike = async (pubkey: string): Promise<void> => {
    console.log("unlike", pubkey);
    // if (!pubkey || !publicKey) return;
    //
    // const newContacts = Array.from(Reactions).filter(
    //   (contact) => contact !== pubkey
    // );
    // const tags = newContacts.map((contact) => ["p", contact]);
    // const event = await NostrService.createEvent(3, publicKey, "", tags);
    //
    // if (event) await publish(event);
    // setReactions(new Set(newContacts));
  };

  const value: ReactionsContext = {
    reactions,
    fetchReactions,
    like,
    unlike,
  };

  return (
    <ReactionsContext.Provider value={value}>
      {children}
    </ReactionsContext.Provider>
  );
}

export function useReactions(): ReactionsContext {
  const context = useContext(ReactionsContext);

  if (!context)
    throw new Error("useReactions must be used within an ReactionsProvider");

  return context;
}

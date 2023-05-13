/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import { relayInit } from "nostr-tools";
import type { Event, Filter, Relay } from "nostr-tools";
import { RELAYS } from "@/app/lib/constants";

type RelayContext = {
  allRelays: string[];
  setAllRelays: Dispatch<SetStateAction<string[]>>;
  activeRelay: Relay | undefined;
  setActiveRelay: Dispatch<SetStateAction<Relay | undefined>>;
  relayUrl: string;
  setRelayUrl: Dispatch<SetStateAction<string>>;
  connect: (newRelayUrl: string) => Promise<Relay | undefined>;
  connectedRelays: Set<Relay>;
  setConnectedRelays: Dispatch<SetStateAction<Set<Relay>>>;
  publish: (
    relays: string[],
    event: Event,
    onOk: () => void,
    onSeen: () => void,
    onFailed: () => void
  ) => void;
  subscribe: (
    relays: string[],
    filter: Filter,
    onEvent: (event: Event) => void,
    onEOSE: () => void
  ) => void;
};

type RelayProviderProps = {
  children: ReactNode;
};

export const RelayContext = createContext<RelayContext | null>(null);

export default function RelayProvider({ children }: RelayProviderProps) {
  const [allRelays, setAllRelays] = useState<string[]>(RELAYS);
  const [relayUrl, setRelayUrl] = useState<string>(RELAYS[0]);
  const [activeRelay, setActiveRelay] = useState<Relay>();
  const [connectedRelays, setConnectedRelays] = useState<Set<Relay>>(new Set());

  useEffect(() => {
    connect(relayUrl);
  }, [relayUrl]);

  useEffect(() => {
    console.log("NEW ACTIVE RELAY IS:", activeRelay);
  }, [activeRelay]);

  useEffect(() => {
    console.log("CONNECTED RELAYS URE:", connectedRelays);
  }, [connectedRelays]);

  const connect = async (newRelayUrl: string) => {
    console.log("connecting to relay:", newRelayUrl);
    if (!newRelayUrl) return;

    let relay: Relay;
    let existingRelay: Relay | undefined;
    if (connectedRelays.size > 0) {
      existingRelay = Array.from(connectedRelays).find(
        (r) => r.url === newRelayUrl
      );
    }

    if (existingRelay) {
      console.log("info", `✅ nostr (${newRelayUrl}): Already connected!`);
      relay = existingRelay;
      setActiveRelay(relay);
    } else {
      console.log("NEWING UP A RELAY");
      relay = relayInit(newRelayUrl);

      await relay.connect();

      relay.on("connect", () => {
        console.log("info", `✅ nostr (${newRelayUrl}): Connected!`);
        if (relayUrl === relay.url) {
          setActiveRelay(relay);
          const isRelayInSet = Array.from(connectedRelays).some(
            (r) => r.url === relay.url
          );

          if (!isRelayInSet) {
            setConnectedRelays(new Set([...connectedRelays, relay]));
          }
        }
      });

      relay.on("disconnect", () => {
        console.log("warn", `🚪 nostr (${newRelayUrl}): Connection closed.`);
        setConnectedRelays(
          new Set([...connectedRelays].filter((r) => r.url !== relay.url))
        );
      });

      relay.on("error", () => {
        console.log("error", `❌ nostr (${newRelayUrl}): Connection error!`);
      });
    }

    return relay;
  };

  const publish = async (
    relays: string[],
    event: Event,
    onOk: () => void,
    onSeen: () => void,
    onFailed: () => void
  ) => {
    console.log("publishing to relays:", relays);
    for (const url of relays) {
      const relay = await connect(url);

      if (!relay) return;

      let pub = relay.publish(event);

      pub.on("ok", () => {
        console.log(`${url} has accepted our event`);
        onOk();
      });

      // pub.on("seen", () => {
      //   console.log(`we saw the event on ${url}`);
      //   onSeen();
      //   // relay.close();
      // });

      pub.on("failed", (reason: any) => {
        console.log(`failed to publish to ${url}: ${reason}`);
        onFailed();
        // relay.close();
      });
    }
  };

  const subscribe = async (
    relays: string[],
    filter: Filter,
    onEvent: (event: Event) => void,
    onEOSE: () => void
  ) => {
    for (const url of relays) {
      const relay = await connect(url);

      if (!relay) return;

      let sub = relay.sub([filter]);

      sub.on("event", (event: Event) => {
        // console.log("we got the event we wanted:", event);
        onEvent(event);
      });

      sub.on("eose", () => {
        // console.log("we've reached the end:");
        sub.unsub();
        onEOSE();
        // relay.close();
      });
    }
  };

  const value: RelayContext = {
    allRelays,
    setAllRelays,
    activeRelay,
    setActiveRelay,
    relayUrl,
    setRelayUrl,
    connect,
    connectedRelays,
    setConnectedRelays,
    publish,
    subscribe,
  };

  return (
    <RelayContext.Provider value={value}>{children}</RelayContext.Provider>
  );
}

export function useRelay(): RelayContext {
  const context = useContext(RelayContext);

  if (!context)
    throw new Error("useRelay must be used within an RelayProvider");

  return context;
}

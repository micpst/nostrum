/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CountPayload, relayInit } from "nostr-tools";
import type { Event, Filter, Relay } from "nostr-tools";
import { RELAYS } from "@/app/lib/constants";
import { useLocalStorage } from "@/app/lib/hooks/useLocalStorage";

type RelayContext = {
  relays: string[];
  addRelay: (relay?: string) => void;
  removeRelay: (relay: string) => void;
  resetRelays: () => void;
  connect: (url?: string) => Promise<Relay | undefined>;
  connectedRelays: Relay[];
  disconnectedRelays: Relay[];
  count: (
    relays: string[],
    filter: Filter,
    onCount: (event: CountPayload, url: string) => void
  ) => void;
  publish: (
    relays: string[],
    event: Event,
    onOk: (url: string) => void,
    onFailed: (url: string) => void
  ) => void;
  subscribe: (
    relays: string[],
    filter: Filter,
    onEvent: (event: Event, url: string) => void,
    onEOSE: (url: string) => void
  ) => void;
};

type RelayProviderProps = {
  children: ReactNode;
};

export const RelayContext = createContext<RelayContext | null>(null);

export default function RelayProvider({ children }: RelayProviderProps) {
  const [relays, setRelays] = useLocalStorage<string[]>("relays", RELAYS);
  const [connectedRelays, setConnectedRelays] = useState<Relay[]>([]);
  const [disconnectedRelays, setDisconnectedRelays] = useState<Relay[]>([]);

  useEffect(() => {
    relays.forEach((relay) => connect(relay));
  }, [relays]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      disconnectedRelays.forEach((relay) => relay.connect());
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  const resetRelays = (): void => {
    setRelays(RELAYS);
  };

  const addRelay = (relay?: string): void => {
    if (!relay) return;
    if (relays.includes(relay)) return;
    setRelays([...relays, relay.trim()]);
  };

  const removeRelay = (relay: string): void => {
    const newRelays = relays.filter((r: string) => r !== relay);
    setRelays(newRelays);
  };

  const connect = async (url?: string): Promise<Relay | undefined> => {
    if (!url) return;

    const existingRelay = connectedRelays.find((r) => r.url === url);
    if (existingRelay) return existingRelay;

    const relay = relayInit(url);

    await relay.connect();

    relay.on("connect", () => {
      setConnectedRelays((prev) => {
        const isConnected = prev.some((r) => r.url === relay.url);
        return isConnected ? prev : [...prev, relay];
      });
      setDisconnectedRelays((prev) => prev.filter((r) => r.url !== relay.url));
    });

    relay.on("disconnect", () => {
      setDisconnectedRelays((prev) => {
        const isDisconnected = prev.some((r) => r.url === relay.url);
        return isDisconnected ? prev : [...prev, relay];
      });
      setConnectedRelays((prev) => prev.filter((r) => r.url !== relay.url));
    });

    relay.on("error", () => {
      setDisconnectedRelays((prev) => {
        const isDisconnected = prev.some((r) => r.url === relay.url);
        return isDisconnected ? prev : [...prev, relay];
      });
      setConnectedRelays((prev) => prev.filter((r) => r.url !== relay.url));
    });

    return relay;
  };

  const publish = async (
    relays: string[],
    event: Event,
    onOk: (url: string) => void,
    onFailed: (url: string) => void
  ) => {
    for (const url of relays) {
      const relay = await connect(url);
      if (!relay) continue;

      const pub = relay.publish(event);

      pub.on("ok", () => onOk(url));

      pub.on("failed", (reason: any) => onFailed(url));
    }
  };

  const subscribe = async (
    relays: string[],
    filter: Filter,
    onEvent: (event: Event, url: string) => void,
    onEOSE: (url: string) => void
  ) => {
    for (const url of relays) {
      const relay = await connect(url);
      if (!relay) return;

      const sub = relay.sub([filter]);

      sub.on("event", (event: Event) => onEvent(event, url));

      sub.on("eose", () => {
        sub.unsub();
        onEOSE(url);
      });
    }
  };

  const count = async (
    relays: string[],
    filter: Filter,
    onCount: (event: CountPayload, url: string) => void
  ) => {
    for (const url of relays) {
      const relay = await connect(url);
      if (!relay) return;

      const sub = await relay.sub([filter], { verb: "COUNT" });

      const timeout = setTimeout(() => {
        sub.unsub();
      }, 2000);

      sub.on("count", (event: CountPayload) => {
        clearTimeout(timeout);
        onCount(event, url);
      });
    }
  };

  const value: RelayContext = {
    relays,
    addRelay,
    removeRelay,
    resetRelays,
    connectedRelays,
    disconnectedRelays,
    connect,
    count,
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

/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { relayInit } from "nostr-tools";
import { createContext, useContext, useEffect, useState } from "react";
import type { Event, Filter, Relay } from "nostr-tools";
import type { ReactNode } from "react";
import { RELAYS } from "@/app/lib/constants";
import NostrService from "@/app/lib/services/nostr";
import type { RelayEvent } from "@/app/lib/types/event";

type RelayContext = {
  relays: string[];
  addRelay: (url: string) => void;
  list: (filter: Filter) => Promise<RelayEvent[]>;
  publish: (event: Event) => Promise<RelayEvent>;
  removeRelay: (url: string) => void;
  resetRelays: () => void;
  subscribe: (filter: Filter, onEvent: (event: RelayEvent) => void) => void;
};

type RelayProviderProps = {
  children: ReactNode;
};

export const RelayContext = createContext<RelayContext | null>(null);

export default function RelayProvider({ children }: RelayProviderProps) {
  const [relays, setRelays] = useState<Map<string, Relay>>(() => {
    const relays = NostrService.getRelays();
    return new Map(relays.map((r) => [r.url, r]));
  });

  useEffect(() => {
    const connect = async (relay: Relay): Promise<void> => {
      try {
        await relay.connect();
      } catch (e) {}
    };

    relays.forEach((relay) => void connect(relay));
    const timeout = setInterval(
      () => relays.forEach((relay) => void connect(relay)),
      10_000
    );
    return () => clearInterval(timeout);
  }, [relays]);

  const resetRelays = (): void => {
    NostrService.resetRelays();
    setRelays(new Map(RELAYS.map((url) => [url, relayInit(url)])));
  };

  const addRelay = (url: string): void => {
    const trimmedUrl = url.trim();
    if (relays.has(trimmedUrl)) return;

    const relay = relayInit(trimmedUrl);

    setRelays((prev) => {
      NostrService.setRelays([...prev.values(), relay]);
      return new Map([...prev, [relay.url, relay]]);
    });
  };

  const removeRelay = (url: string): void => {
    const relay = relays.get(url);
    if (!relay) return;

    relay.close();
    setRelays((prev) => {
      prev.delete(url);
      NostrService.setRelays(Array.from(prev.values()));
      return new Map(prev);
    });
  };

  const publish = async (event: Event): Promise<RelayEvent> => {
    const selectedRelays = Array.from(relays.values());
    return NostrService.publishEvent(selectedRelays, event);
  };

  const subscribe = (
    filter: Filter,
    onEvent: (event: RelayEvent) => void
  ): void => {
    const selectedRelays = Array.from(relays.values());
    NostrService.subscribeEvents(selectedRelays, filter, onEvent);
  };

  const list = async (filter: Filter): Promise<RelayEvent[]> => {
    const selectedRelays = Array.from(relays.values());
    return NostrService.listEvents(selectedRelays, filter);
  };

  const value: RelayContext = {
    relays: Array.from(relays.keys()),
    addRelay,
    list,
    publish,
    removeRelay,
    resetRelays,
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

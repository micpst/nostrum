/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { relayInit } from "nostr-tools";
import { createContext, useContext, useEffect, useState } from "react";
import type { Event, Filter, Relay } from "nostr-tools";
import { DEFAULT_RELAYS } from "@/app/lib/constants";
import nostrService from "@/app/lib/services/nostrService";
import relayService from "@/app/lib/services/relayService";
import type { ProviderProps } from "@/app/lib/context/providers";
import type { RelayEvent } from "@/app/lib/types/event";

type RelayContext = {
  relays: Map<string, Relay>;
  addRelay: (url: string) => void;
  list: (filter: Filter) => Promise<RelayEvent[]>;
  publish: (event: Event) => Promise<RelayEvent>;
  removeRelay: (url: string) => void;
  resetRelays: () => void;
  subscribe: (filter: Filter, onEvent: (event: RelayEvent) => void) => void;
};

export const RelayContext = createContext<RelayContext | null>(null);

export default function RelayProvider({ children }: ProviderProps) {
  const [relays, setRelays] = useState<Map<string, Relay>>(() => {
    const relays = relayService.getRelaysLocal();
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
    relayService.resetRelaysLocal();
    setRelays(new Map(DEFAULT_RELAYS.map((url) => [url, relayInit(url)])));
  };

  const addRelay = (url: string): void => {
    const trimmedUrl = url.trim();
    if (relays.has(trimmedUrl)) return;

    const relay = relayInit(trimmedUrl);

    setRelays((prev) => {
      relayService.setRelaysLocal([...prev.values(), relay]);
      return new Map([...prev, [relay.url, relay]]);
    });
  };

  const removeRelay = (url: string): void => {
    const relay = relays.get(url);
    if (!relay) return;

    relay.close();
    setRelays((prev) => {
      prev.delete(url);
      relayService.setRelaysLocal(Array.from(prev.values()));
      return new Map(prev);
    });
  };

  const publish = async (event: Event): Promise<RelayEvent> => {
    const selectedRelays = Array.from(relays.values());
    return nostrService.publishEvent(selectedRelays, event);
  };

  const subscribe = (
    filter: Filter,
    onEvent: (event: RelayEvent) => void
  ): void => {
    const selectedRelays = Array.from(relays.values());
    nostrService.subscribeEvents(selectedRelays, filter, onEvent);
  };

  const list = async (filter: Filter): Promise<RelayEvent[]> => {
    const selectedRelays = Array.from(relays.values());
    return nostrService.listEvents(selectedRelays, filter);
  };

  const value: RelayContext = {
    relays,
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

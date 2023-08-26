/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { relayInit, verifySignature } from "nostr-tools";
import { createContext, useContext, useEffect, useState } from "react";
import type { Event, Filter, Relay } from "nostr-tools";
import type { ReactNode } from "react";
import NostrService from "@/app/lib/services/nostr";
import type { RelayEvent } from "@/app/lib/types/event";

type RelayContext = {
  relays: string[];
  addRelay: (url: string) => void;
  removeRelay: (url: string) => void;
  resetRelays: () => void;
  list: (relays: string[], filter: Filter) => Promise<RelayEvent[]>;
  publish: (relays: string[], event: Event) => Promise<RelayEvent>;
  subscribe: (
    relays: string[],
    filter: Filter,
    onEvent: (event: RelayEvent) => void
  ) => void;
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

    relays.forEach(async (relay) => await connect(relay));
    const timeout = setInterval(
      () => relays.forEach(async (relay) => await connect(relay)),
      10_000
    );
    return () => clearInterval(timeout);
  }, [relays]);

  const resetRelays = (): void => {
    // setRelays(RELAYS);
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

  const publish = async (
    urls: string[],
    event: Event,
    timeout: number = 3000
  ): Promise<RelayEvent> => {
    const publishedEvent: RelayEvent = {
      ...event,
      relays: [],
    };
    const selectedRelays: Relay[] = urls
      .filter((url: string) => relays.has(url))
      .map((url: string) => relays.get(url) as Relay);

    return new Promise<RelayEvent>((resolve) => {
      selectedRelays.forEach((relay) => {
        const pub = relay.publish(event);

        pub.on("ok", () => {
          publishedEvent.relays.push(relay.url);
          if (publishedEvent.relays.length === selectedRelays.length)
            return resolve(publishedEvent);
        });

        pub.on("failed", (reason: any) => {
          publishedEvent.relays.push(relay.url);
          if (publishedEvent.relays.length === selectedRelays.length)
            return resolve(publishedEvent);
        });
      });
    });
  };

  const subscribe = (
    urls: string[],
    filter: Filter,
    onEvent: (event: RelayEvent) => void
  ): void => {
    urls
      .filter((url: string) => relays.has(url))
      .map((url: string) => relays.get(url) as Relay)
      .forEach((relay: Relay) => {
        relay
          .sub([filter])
          .on("event", (event: Event) =>
            onEvent({ ...event, relays: [relay.url] })
          );
      });
  };

  const list = async (
    urls: string[],
    filter: Filter
  ): Promise<RelayEvent[]> => {
    const newEvents: Map<string, RelayEvent> = new Map();
    const selectedRelays: Relay[] = urls
      .filter((url: string) => relays.has(url))
      .map((url: string) => relays.get(url) as Relay);

    await Promise.all(
      selectedRelays.map(async (relay: Relay) => {
        const events = await relay.list([filter]);
        events
          .filter((e) => verifySignature(e))
          .forEach((e) => {
            const ev = newEvents.get(e.id);
            newEvents.set(e.id, {
              ...e,
              relays: [...(ev?.relays ?? []), relay.url],
            });
          });
      })
    );

    return Array.from([...newEvents.values()]);
  };

  const value: RelayContext = {
    relays: Array.from(relays.keys()),
    addRelay,
    removeRelay,
    resetRelays,
    list,
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

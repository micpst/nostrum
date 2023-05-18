/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import type { Event, Filter } from "nostr-tools";
import { useRelay } from "@/app/lib/context/relay-provider";
import type { RelayEvent } from "@/app/lib/types/event";

type UseEvents = {
  events: Map<string, RelayEvent> | undefined;
  loading: Map<string, boolean>;
};

export function useEvents(filter: Filter): UseEvents {
  const { until } = filter;

  const { relays, subscribe } = useRelay();

  const [events, setEvents] = useState<Map<string, RelayEvent> | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<Map<string, boolean>>(
    new Map(relays.map((relay) => [relay, false]))
  );

  useEffect(() => {
    const getEvents = (): void => {
      let newEvents: Map<string, RelayEvent> = new Map();

      const onEvent = (event: Event, url: string): void => {
        const ev = newEvents.get(event.id);
        if (ev) newEvents.set(event.id, { ...ev, relays: [...ev.relays, url] });
        else newEvents.set(event.id, { ...event, relays: [url] });
      };

      const onEOSE = (url: string): void => {
        setEvents(newEvents);
        setLoading((prev) => new Map(prev.set(url, false)));
      };

      setEvents(undefined);
      setLoading(new Map(relays.map((relay) => [relay, true])));
      subscribe(relays, filter, onEvent, onEOSE);
    };

    getEvents();
  }, [until, relays]);

  return { events, loading };
}

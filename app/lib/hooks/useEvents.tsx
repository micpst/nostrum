/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import type { Event, Filter } from "nostr-tools";
import { useRelay } from "@/app/lib/context/relay-provider";

type UseEvents = {
  events: Event[] | null;
  loading: boolean;
};

export function useEvents(filter: Filter): UseEvents {
  const { until } = filter;

  const { relays, subscribe } = useRelay();
  const [events, setEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getEvents = (): void => {
      let newEvents: Event[] = [];

      const onEvent = (event: Event): void => {
        newEvents.push(event);
      };

      const onEOSE = (): void => {
        setEvents(newEvents);
        setLoading(false);
      };

      setEvents(null);
      setLoading(true);
      subscribe(relays, filter, onEvent, onEOSE);
    };

    getEvents();
  }, [until, relays]);

  return { events, loading };
}

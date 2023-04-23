import { useState, useEffect } from "react";
import type { Event, Filter } from "nostr-tools";
import { useRelay } from "@/app/context/relay-provider";

type UseEvents = {
  events: Event[] | null;
  loading: boolean;
};

export function useEvents(filter: Filter): UseEvents {
  const { until } = filter;

  const { subscribe, relayUrl } = useRelay();
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
      subscribe([relayUrl], filter, onEvent, onEOSE);
    };

    getEvents();
  }, [until, relayUrl]);

  return { events, loading };
}

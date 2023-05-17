/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import type { Event, Filter } from "nostr-tools";
import { useRelay } from "@/app/lib/context/relay-provider";
import { useEvents } from "@/app/lib/hooks/useEvents";

type InfiniteScroll = {
  events: Event[];
  loading: boolean;
};

type InfiniteScrollOption = {
  initialSize?: number;
  stepSize?: number;
};

export function useInfiniteScroll(
  filter: Filter,
  options?: InfiniteScrollOption
): InfiniteScroll {
  const { initialSize = 10, stepSize = 10 } = options ?? {};

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [eventsTotal, setEventsTotal] = useState<number>(initialSize);
  const [eventsLimit, setEventsLimit] = useState<number>(initialSize);
  const [eventsUntil, setEventsUntil] = useState<number | undefined>(undefined);

  const { relayUrl } = useRelay();
  const { events, loading } = useEvents({
    ...filter,
    limit: eventsLimit,
    until: eventsUntil,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.innerHeight + document.documentElement.scrollTop;
      if (Math.ceil(scrollTop) !== document.documentElement.offsetHeight)
        return;
      setEventsTotal((prev: number) => prev + stepSize);
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (allEvents.length > 0) {
      const lastEvent = allEvents.slice(-1)[0];
      setEventsUntil(lastEvent.created_at);
      setEventsLimit(stepSize);
    }
  }, [eventsTotal]);

  useEffect(() => {
    if (!events) return;
    setAllEvents((prev) => [...prev, ...events]);
  }, [events]);

  useEffect(() => {
    setAllEvents([]);
  }, [relayUrl]);

  return { events: allEvents, loading };
}

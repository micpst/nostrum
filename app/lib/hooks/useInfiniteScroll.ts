/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import type { Filter } from "nostr-tools";
import { useEvents } from "@/app/lib/hooks/useEvents";
import type { RelayEvent } from "@/app/lib/types/event";

type InfiniteScroll = {
  events: RelayEvent[];
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

  const [allEvents, setAllEvents] = useState<RelayEvent[]>([]);
  const [loadingFinished, setLoadingFinished] = useState<boolean>(true);
  const [eventsTotal, setEventsTotal] = useState<number>(initialSize);
  const [eventsLimit, setEventsLimit] = useState<number>(initialSize);
  const [eventsUntil, setEventsUntil] = useState<number | undefined>(undefined);

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
    setLoadingFinished(!Array.from(loading.values()).some((value) => value));
  }, [loading]);

  useEffect(() => {
    if (!events) return;

    const allEvents = Array.from(events.values())
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, eventsLimit);

    setAllEvents((prev) => [...prev, ...allEvents]);
  }, [loadingFinished]);

  return {
    events: allEvents,
    loading: !loadingFinished,
  };
}

import type { Filter } from "nostr-tools";
import { useMemo, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import { useRelay } from "@/app/lib/context/relay-provider";
import type { RelayEvent } from "@/app/lib/types/event";

type UseEvents = {
  events: RelayEvent[];
  newEvents: RelayEvent[];
  isLoading: boolean;
};

export function useEvents(filter: Filter = {}): UseEvents {
  const { relays, list } = useRelay();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allEvents, setAllEvents] = useState<Map<string, RelayEvent>>(
    new Map()
  );
  const [newEvents, setNewEvents] = useState<RelayEvent[]>([]);

  useDeepCompareEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      const events = await list(filter);
      const newEvents = new Map(
        events
          .filter((event) => !allEvents.has(event.id))
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, filter.limit)
          .map((event) => [event.id, event])
      );

      setAllEvents((prev) => new Map([...prev, ...newEvents]));
      setNewEvents(Array.from(newEvents.values()));
      setIsLoading(false);
    })();
  }, [filter, relays]);

  return useMemo<UseEvents>(
    () => ({
      events: Array.from(allEvents.values()),
      newEvents,
      isLoading,
    }),
    [allEvents, newEvents, isLoading]
  );
}

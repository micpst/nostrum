import type { Filter } from "nostr-tools";
import { useState } from "react";
import { useDeepCompareEffect } from "react-use";
import { useRelay } from "@/app/lib/context/relay-provider";
import type { RelayEvent } from "@/app/lib/types/event";

type UseEvents = {
  events: RelayEvent[];
  newEvents: RelayEvent[];
  isLoading: boolean;
};

type State = {
  events: Map<string, RelayEvent>;
  newEvents: Map<string, RelayEvent>;
  isLoading: boolean;
};

export function useEvents(filter: Filter = {}): UseEvents {
  const { relays, list, subscribe } = useRelay();
  const [state, setState] = useState<State>({
    events: new Map(),
    newEvents: new Map(),
    isLoading: false,
  });

  useDeepCompareEffect(() => {
    void loadEvents();
  }, [filter, relays]);

  const loadEvents = async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const events = await list(filter);

    const newEvents = events
      .filter((event) => !state.events.has(event.id))
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, filter.limit);

    setState((prev) => ({
      events: new Map([
        ...prev.events,
        ...new Map(newEvents.map((event) => [event.id, event])),
      ]),
      newEvents: new Map(newEvents.map((event) => [event.id, event])),
      isLoading: false,
    }));
  };

  return {
    events: Array.from(state.events.values()),
    newEvents: Array.from(state.newEvents.values()),
    isLoading: state.isLoading,
  };
}

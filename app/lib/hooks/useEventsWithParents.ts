import { useState } from "react";
import { useDeepCompareEffect } from "react-use";
import type { Filter } from "nostr-tools";
import { useRelay } from "@/app/lib/context/relay-provider";
import { groupEventsByParent } from "@/app/lib/utils/events";
import type { NoteEvent } from "@/app/lib/types/event";

type UseEventsWithParents = {
  events: NoteEvent[];
  newEvents: NoteEvent[];
  isLoading: boolean;
};

export function useEventsWithParents(
  filter: Filter = {}
): UseEventsWithParents {
  const { list } = useRelay();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allEvents, setAllEvents] = useState<Map<string, NoteEvent>>(new Map());
  const [newEvents, setNewEvents] = useState<NoteEvent[]>([]);

  useDeepCompareEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      const events = await list(filter);
      const newEvents = new Map(
        events
          .filter((event) => !allEvents.has(event.id))
          .map((event) => [event.id, event as NoteEvent])
      );

      const newEventsByParent = groupEventsByParent(
        Array.from(newEvents.values())
      );
      Array.from(newEventsByParent.keys()).forEach(
        (parent) =>
          parent && allEvents.has(parent) && newEventsByParent.delete(parent)
      );
      const parentsIds = Array.from(newEventsByParent.keys()).filter(
        (id) => id
      ) as string[];

      const parentEvents = await list({
        kinds: [1],
        ids: parentsIds,
      });
      const newParentEvents = new Map(
        parentEvents.map((event) => [
          event.id,
          { ...event, parent: true } as NoteEvent,
        ])
      );

      const childToParent: Map<string, string | undefined> = new Map();

      Array.from(newEventsByParent).forEach(([parent, events]) => {
        if (events.length > 1 && parent) {
          events = events.sort((a, b) => b.created_at - a.created_at);
          events = events.slice(0, 1);
        }
        events.forEach((event) => {
          childToParent.set(event.id, parent);
        });
      });

      const childToParentSorted = new Map(
        [...childToParent.entries()].sort(
          (a, b) =>
            (newEvents.get(b[0]) as NoteEvent).created_at -
            (newEvents.get(a[0]) as NoteEvent).created_at
        )
      );

      const selectedEvents = Array.from(childToParentSorted).flatMap(
        ([child, parent]) =>
          parent && newParentEvents.has(parent)
            ? [newParentEvents.get(parent), newEvents.get(child)]
            : [newEvents.get(child)]
      ) as NoteEvent[];

      setAllEvents(
        (prev) =>
          new Map([
            ...prev,
            ...new Map(selectedEvents.map((event) => [event.id, event])),
          ])
      );
      setNewEvents(Array.from(selectedEvents.values()));
      setIsLoading(false);
    })();
  }, [filter]);

  return {
    events: Array.from(allEvents.values()),
    newEvents,
    isLoading,
  };
}

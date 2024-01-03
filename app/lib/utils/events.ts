import type { RelayEvent } from "@/app/lib/types/event";

export function groupEventsByPubkey(
  events: RelayEvent[]
): Map<string, RelayEvent[]> {
  return events.reduce((acc, event) => {
    const pubkeyEvents = acc.get(event.pubkey);
    if (!pubkeyEvents?.length) acc.set(event.pubkey, [event]);
    else pubkeyEvents.push(event);
    return acc;
  }, new Map());
}

export function selectMostFrequentEvent(
  events: RelayEvent[]
): RelayEvent | undefined {
  const idCounts = events.reduce((acc, event) => {
    const count = acc.get(event.id) || 0;
    acc.set(event.id, count + 1);
    return acc;
  }, new Map());

  const ids = Array.from(idCounts.keys());
  const mostFrequentId = ids.reduce(
    (prevId, currId) =>
      idCounts.get(currId) >= idCounts.get(prevId) ? currId : prevId,
    ids[0]
  );

  return events.find((event) => event.id === mostFrequentId);
}

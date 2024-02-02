import type { RelayEvent } from "@/app/lib/types/event";

export const getTagValues = (name: string, tags: string[][]): string | null => {
  const itemTag = tags.filter((tag: string[]) => tag[0] === name).at(-1);
  const [, item] = itemTag || [null, null];
  return item;
};

export function isReply(event: RelayEvent): boolean {
  return !!getTagValues("e", event.tags) && !!getTagValues("p", event.tags);
}

export function groupEventsByParent(
  events: RelayEvent[],
): Map<string | undefined, RelayEvent[]> {
  return events.reduce((acc, event) => {
    const parent = getTagValues("e", event.tags);
    const pubkeyEvents = acc.get(parent);
    if (!pubkeyEvents?.length) acc.set(parent, [event]);
    else pubkeyEvents.push(event);
    return acc;
  }, new Map());
}

export function groupEventsByPubkey(
  events: RelayEvent[],
): Map<string, RelayEvent[]> {
  return events.reduce((acc, event) => {
    const pubkeyEvents = acc.get(event.pubkey);
    if (!pubkeyEvents?.length) acc.set(event.pubkey, [event]);
    else pubkeyEvents.push(event);
    return acc;
  }, new Map());
}

export function selectMostFrequentEvent(
  events: RelayEvent[],
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
    ids[0],
  );

  return events.find((event) => event.id === mostFrequentId);
}

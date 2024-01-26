import { verifySignature } from "nostr-tools";
import type { Event, Filter, Relay } from "nostr-tools";
import type { RelayEvent } from "@/app/lib/types/event";

interface NostrService {
  createEvent: (
    kind: number,
    pubkey: string,
    content?: string,
    tags?: string[][]
  ) => Promise<Event>;
  listEvents: (relays: Relay[], filter: Filter) => Promise<RelayEvent[]>;
  publishEvent: (
    relays: Relay[],
    event: Event,
    timeout?: number
  ) => Promise<RelayEvent>;
  subscribeEvents: (
    relays: Relay[],
    filter: Filter,
    onEvent: (event: RelayEvent) => void
  ) => void;
}

async function createEvent(
  kind: number,
  pubkey: string,
  content: string = "",
  tags: string[][] = []
): Promise<Event> {
  const event = await window.nostr?.signEvent({
    kind,
    pubkey,
    content,
    tags,
    created_at: Math.floor(Date.now() / 1000),
  });

  if (event === undefined) throw new Error("failed to sign event");
  if (!verifySignature(event)) throw new Error("failed to verify event");

  return event;
}

async function listEvents(
  relays: Relay[],
  filter: Filter
): Promise<RelayEvent[]> {
  const newEvents: Map<string, RelayEvent> = new Map();
  await Promise.all(
    relays.map(async (relay: Relay) => {
      const events = await relay.list([filter]);
      events.forEach((e) => {
        const ev = newEvents.get(e.id);
        newEvents.set(e.id, {
          ...e,
          relays: [...(ev?.relays ?? []), relay.url],
        });
      });
    })
  );
  return Array.from([...newEvents.values()]);
}

async function publishEvent(
  relays: Relay[],
  event: Event,
  timeout: number = 1_500
): Promise<RelayEvent> {
  const urls = await Promise.all(
    relays.map(
      (relay) =>
        new Promise<string | void>(async (resolve) => {
          try {
            const timeoutId = setTimeout(() => resolve(), timeout);
            await relay.publish(event);
            clearTimeout(timeoutId);
            resolve(relay.url);
          } catch (err) {
            resolve();
          }
        })
    )
  );
  return {
    ...event,
    relays: urls.filter((url) => !!url) as string[],
  };
}

function subscribeEvents(
  relays: Relay[],
  filter: Filter,
  onEvent: (event: RelayEvent) => void
): void {
  relays.forEach((relay: Relay) => {
    relay
      .sub([filter])
      .on("event", (event: Event) =>
        onEvent({ ...event, relays: [relay.url] })
      );
  });
}

const NostrService: NostrService = {
  createEvent,
  listEvents,
  publishEvent,
  subscribeEvents,
};

export default NostrService;

import { relayInit, verifySignature } from "nostr-tools";
import type { Event, Filter, Relay, UnsignedEvent } from "nostr-tools";
import { RELAYS } from "@/app/lib/constants";
import { RelayEvent } from "@/app/lib/types/event";

type NostrService = {
  createEvent: (
    kind: number,
    pubkey: string,
    content?: string,
    tags?: string[][]
  ) => Promise<Event | undefined>;
  getRelays: () => Relay[];
  listEvents: (relays: Relay[], filter: Filter) => Promise<RelayEvent[]>;
  publishEvent: (relays: Relay[], event: Event) => Promise<RelayEvent>;
  resetRelays: () => void;
  setRelays: (relays: Relay[]) => void;
  signEvent: (event: UnsignedEvent) => Promise<Event | undefined>;
  subscribeEvents: (
    relays: Relay[],
    filter: Filter,
    onEvent: (event: RelayEvent) => void
  ) => void;
};

async function createEvent(
  kind: number,
  pubkey: string,
  content: string = "",
  tags: string[][] = []
): Promise<Event | undefined> {
  const event = await signEvent({
    kind,
    pubkey,
    content,
    tags,
    created_at: Math.floor(Date.now() / 1000),
  });
  return event && verifySignature(event) ? event : undefined;
}

async function signEvent(event: UnsignedEvent): Promise<Event | undefined> {
  let signedEvent: Event | undefined;
  try {
    signedEvent = await window.nostr?.signEvent(event);
  } catch (err: any) {
    console.error("signing event failed");
  }
  return signedEvent;
}

function getRelays(): Relay[] {
  if (typeof window === "undefined") return [];

  const urls = window.localStorage.getItem("relays");

  if (urls === null) {
    window.localStorage.setItem("relays", JSON.stringify(RELAYS));
    return RELAYS.map((url: string) => relayInit(url));
  }

  try {
    return JSON.parse(urls, (key, value) =>
      typeof value === "string" ? relayInit(value) : value
    );
  } catch (err) {
    console.error("failed to parse relays from local storage");
    return [];
  }
}

function setRelays(relays: Relay[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    "relays",
    JSON.stringify(relays.map((relay) => relay.url))
  );
}

function resetRelays(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("relays", JSON.stringify(RELAYS));
}

async function listEvents(
  relays: Relay[],
  filter: Filter
): Promise<RelayEvent[]> {
  const newEvents: Map<string, RelayEvent> = new Map();
  await Promise.all(
    relays.map(async (relay: Relay) => {
      const events = await relay.list([filter]);
      events
        .filter((e) => verifySignature(e))
        .forEach((e) => {
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
  event: Event
): Promise<RelayEvent> {
  const urls = await Promise.all(
    relays.map(async (relay) => {
      try {
        await relay.publish(event);
        return relay.url;
      } catch (err) {}
    })
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
  getRelays,
  listEvents,
  publishEvent,
  resetRelays,
  setRelays,
  subscribeEvents,
  signEvent,
};

export default NostrService;

import { relayInit, verifySignature } from "nostr-tools";
import type { Event, Relay, UnsignedEvent } from "nostr-tools";
import { RELAYS } from "@/app/lib/constants";

type NostrService = {
  createEvent: (
    kind: number,
    pubkey: string,
    content?: string,
    tags?: string[][]
  ) => Promise<Event | undefined>;
  signEvent: (event: UnsignedEvent) => Promise<Event | undefined>;
  getRelays: () => Relay[];
  setRelays: (relays: Relay[]) => void;
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

const NostrService: NostrService = {
  createEvent,
  signEvent,
  getRelays,
  setRelays,
};

export default NostrService;

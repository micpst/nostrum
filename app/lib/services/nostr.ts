import { getEventHash, validateEvent, verifySignature } from "nostr-tools";
import type { Event, UnsignedEvent } from "nostr-tools";

type NostrService = {
  createEvent: (
    kind: number,
    pubkey: string,
    content: string,
    tags?: string[][]
  ) => Promise<Event | undefined>;
  signEvent: (event: UnsignedEvent) => Promise<Event | undefined>;
};

async function createEvent(
  kind: number,
  pubkey: string,
  content: string,
  tags: string[][] = []
): Promise<Event | undefined> {
  const event: UnsignedEvent = {
    kind,
    pubkey,
    content,
    tags,
    created_at: Math.floor(Date.now() / 1000),
  };

  const signedEvent = await signEvent(event);

  return signedEvent &&
    validateEvent(signedEvent) &&
    verifySignature(signedEvent)
    ? signedEvent
    : undefined;
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

const NostrService: NostrService = {
  createEvent,
  signEvent,
};

export default NostrService;

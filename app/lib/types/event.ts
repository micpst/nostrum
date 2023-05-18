import type { Event } from "nostr-tools";

export type RelayEvent = Event & {
  relays: string[];
};

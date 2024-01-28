import type { Event } from "nostr-tools";

export type RelayEvent = Event & {
  relays: string[];
};

export type NoteEvent = RelayEvent & {
  parent: boolean;
  likedAt?: number;
  repostedAt?: number;
};

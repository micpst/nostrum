import type { Event } from "nostr-tools";

export type RelayEvent = Event & {
  relays: string[];
};

export type NoteEvent = RelayEvent & {
  likedAt?: number;
  likedBy?: string;
  parent?: {
    id: string;
    pubkey: string;
  };
  repostedAt?: number;
  repostedBy?: string;
};

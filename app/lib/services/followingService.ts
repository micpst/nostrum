import type { Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import type { RelayEvent } from "@/app/lib/types/event";

export type ListFollowingRequest = {
  relays: Relay[];
  pubkey: string;
};

export type PublishFollowingRequest = {
  relays: Relay[];
  pubkey: string;
  followings: string[];
};

interface FollowingService {
  listFollowingAsync(request: ListFollowingRequest): Promise<string[]>;
  publishFollowingAsync(request: PublishFollowingRequest): Promise<RelayEvent>;
}

async function listFollowingAsync({
  relays,
  pubkey,
}: ListFollowingRequest): Promise<string[]> {
  const events = await nostrService.listEvents(relays, {
    kinds: [3],
    authors: [pubkey],
  });
  return events
    .flatMap((event) => event.tags)
    .filter((tag) => tag[0] === "p")
    .map((tag) => tag[1]);
}

async function publishFollowingAsync({
  relays,
  pubkey,
  followings,
}: PublishFollowingRequest): Promise<RelayEvent> {
  const tags = followings.map((following) => ["p", following]);
  const event = await nostrService.createEvent(3, pubkey, "", tags);
  return await nostrService.publishEvent(relays, event);
}

const FollowingsService: FollowingService = {
  listFollowingAsync,
  publishFollowingAsync,
};

export default FollowingsService;

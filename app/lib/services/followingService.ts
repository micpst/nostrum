import type { Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostr";

export type ListRequest = {
  relays: Relay[];
  pubkey: string;
};

export type PublishRequest = {
  relays: Relay[];
  pubkey: string;
  followings: string[];
};

interface FollowingService {
  listFollowingAsync(request: ListRequest): Promise<string[]>;
  publishFollowingAsync(request: PublishRequest): Promise<void>;
}

async function listFollowingAsync({
  relays,
  pubkey,
}: ListRequest): Promise<string[]> {
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
}: PublishRequest): Promise<void> {
  const tags = followings.map((following) => ["p", following]);
  const event = await nostrService.createEvent(3, pubkey, "", tags);
  await nostrService.publishEvent(relays, event);
}

const FollowingsService: FollowingService = {
  listFollowingAsync,
  publishFollowingAsync,
};

export default FollowingsService;

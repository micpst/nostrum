import { nip18 } from "nostr-tools";
import type { Event, Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import type { RelayEvent } from "@/app/lib/types/event";

export type ListRepostsRequest = {
  relays: Relay[];
  authorPubkey: string;
  eventsIds: string[];
};

export type CreateRepostRequest = {
  relays: Relay[];
  authorPubkey: string;
  eventToRepost: Event;
};

export type DeleteRepostRequest = {
  relays: Relay[];
  authorPubkey: string;
  repostId: string;
};

interface RepostService {
  listRepostsAsync(request: ListRepostsRequest): Promise<[string, string][]>;
  createRepostAsync(request: CreateRepostRequest): Promise<RelayEvent>;
  deleteRepostAsync(request: DeleteRepostRequest): Promise<RelayEvent>;
}

async function listRepostsAsync({
  relays,
  authorPubkey,
  eventsIds,
}: ListRepostsRequest): Promise<[string, string][]> {
  const events = await nostrService.listEvents(relays, {
    kinds: [6],
    authors: [authorPubkey],
    "#e": eventsIds,
  });
  return events
    .map((event) => {
      const pointer = nip18.getRepostedEventPointer(event);
      return [pointer?.id, event.id];
    })
    .filter(([pointerId, eventId]) => !!pointerId) as [string, string][];
}

async function createRepostAsync({
  relays,
  authorPubkey,
  eventToRepost,
}: CreateRepostRequest): Promise<RelayEvent> {
  const tags = eventToRepost.tags.filter(
    (tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p")
  );
  tags.push(["e", eventToRepost.id]);
  tags.push(["p", eventToRepost.pubkey]);

  const repostEvent = await nostrService.createEvent(
    6,
    authorPubkey,
    eventToRepost.content,
    tags
  );
  return await nostrService.publishEvent(relays, repostEvent);
}

async function deleteRepostAsync({
  relays,
  authorPubkey,
  repostId,
}: DeleteRepostRequest): Promise<RelayEvent> {
  const tags = [["e", repostId]];
  const deleteEvent = await nostrService.createEvent(5, authorPubkey, "", tags);
  return await nostrService.publishEvent(relays, deleteEvent);
}

const RepostService: RepostService = {
  listRepostsAsync,
  createRepostAsync,
  deleteRepostAsync,
};

export default RepostService;

import { nip25 } from "nostr-tools";
import type { Event, Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import type { RelayEvent } from "@/app/lib/types/event";

export type ListReactionsRequest = {
  relays: Relay[];
  pubkey: string;
  eventsIds: string[];
};

export type CreateReactionRequest = {
  relays: Relay[];
  pubkey: string;
  eventToReact: Event;
};

export type DeleteReactionRequest = {
  relays: Relay[];
  pubkey: string;
  reactionId: string;
};

interface ReactionService {
  listReactionsAsync(
    request: ListReactionsRequest
  ): Promise<[string, string][]>;
  createReactionAsync(request: CreateReactionRequest): Promise<RelayEvent>;
  deleteReactionAsync(request: DeleteReactionRequest): Promise<RelayEvent>;
}

async function listReactionsAsync({
  relays,
  pubkey,
  eventsIds,
}: ListReactionsRequest): Promise<[string, string][]> {
  const events = await nostrService.listEvents(relays, {
    kinds: [7],
    authors: [pubkey],
    "#e": eventsIds,
  });
  return events
    .map((event) => {
      const pointer = nip25.getReactedEventPointer(event);
      return [pointer?.id, event.id];
    })
    .filter(([pointerId, eventId]) => !!pointerId) as [string, string][];
}

async function createReactionAsync({
  relays,
  pubkey,
  eventToReact,
}: CreateReactionRequest): Promise<RelayEvent> {
  const tags = eventToReact.tags.filter(
    (tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p")
  );
  tags.push(["e", eventToReact.id]);
  tags.push(["p", eventToReact.pubkey]);

  const likeEvent = await nostrService.createEvent(7, pubkey, "+", tags);
  return await nostrService.publishEvent(relays, likeEvent);
}

async function deleteReactionAsync({
  relays,
  pubkey,
  reactionId,
}: DeleteReactionRequest): Promise<RelayEvent> {
  const tags = [["e", reactionId]];
  const deleteEvent = await nostrService.createEvent(5, pubkey, "", tags);
  return await nostrService.publishEvent(relays, deleteEvent);
}

const ReactionService: ReactionService = {
  listReactionsAsync,
  createReactionAsync,
  deleteReactionAsync,
};

export default ReactionService;

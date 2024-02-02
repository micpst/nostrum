import { nip25 } from "nostr-tools";
import type { Event, Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import type { RelayEvent } from "@/app/lib/types/event";

export type ListReactionsRequest = {
  relays: Relay[];
  pubkey: string;
  limit?: number;
  until?: number;
  notesIds?: string[];
};

export type ListNotesReactionsRequest = {
  relays: Relay[];
  pubkey: string;
  notesIds: string[];
};

export type ListUserReactionsRequest = {
  relays: Relay[];
  pubkey: string;
  limit?: number;
  until?: number;
};

export type CreateReactionRequest = {
  relays: Relay[];
  pubkey: string;
  noteToReact: Event;
};

export type DeleteReactionRequest = {
  relays: Relay[];
  pubkey: string;
  reactionId: string;
};

interface ReactionService {
  listReactionsAsync(request: ListReactionsRequest): Promise<RelayEvent[]>;
  listNotesReactionsAsync(
    request: ListNotesReactionsRequest,
  ): Promise<[string, string][]>;
  listUserReactionsAsync(
    request: ListUserReactionsRequest,
  ): Promise<RelayEvent[]>;
  createReactionAsync(request: CreateReactionRequest): Promise<RelayEvent>;
  deleteReactionAsync(request: DeleteReactionRequest): Promise<RelayEvent>;
}

async function listReactionsAsync({
  relays,
  pubkey,
  limit,
  until,
  notesIds,
}: ListReactionsRequest): Promise<RelayEvent[]> {
  return await nostrService.listEvents(relays, {
    kinds: [7],
    authors: [pubkey],
    limit,
    until,
    "#e": notesIds,
  });
}

async function listNotesReactionsAsync({
  relays,
  pubkey,
  notesIds,
}: ListReactionsRequest): Promise<[string, string][]> {
  const reactionEvents = await listReactionsAsync({
    relays,
    pubkey,
    notesIds,
  });
  return reactionEvents
    .map((event) => [nip25.getReactedEventPointer(event)?.id, event.id])
    .filter(([pointerId, eventId]) => !!pointerId) as [string, string][];
}

async function listUserReactionsAsync({
  relays,
  pubkey,
  limit,
  until,
}: ListUserReactionsRequest): Promise<RelayEvent[]> {
  const reactionEvents = await listReactionsAsync({
    relays,
    pubkey,
    limit,
    until,
  });
  return reactionEvents
    .filter((event) => nip25.getReactedEventPointer(event)?.id)
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, limit);
}

async function createReactionAsync({
  relays,
  pubkey,
  noteToReact,
}: CreateReactionRequest): Promise<RelayEvent> {
  const tags = noteToReact.tags.filter(
    (tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"),
  );
  tags.push(["e", noteToReact.id]);
  tags.push(["p", noteToReact.pubkey]);

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
  listNotesReactionsAsync,
  listUserReactionsAsync,
  createReactionAsync,
  deleteReactionAsync,
};

export default ReactionService;

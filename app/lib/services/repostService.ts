import { nip18 } from "nostr-tools";
import type { Event, Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import type { RelayEvent } from "@/app/lib/types/event";

export type ListRepostsRequest = {
  relays: Relay[];
  pubkey: string;
  limit?: number;
  until?: number;
  notesIds?: string[];
};

export type ListNotesRepostsRequest = {
  relays: Relay[];
  pubkey: string;
  notesIds: string[];
};

export type ListUserRepostsRequest = {
  relays: Relay[];
  pubkey: string;
  limit?: number;
  until?: number;
};

export type CreateRepostRequest = {
  relays: Relay[];
  pubkey: string;
  noteToRepost: RelayEvent;
};

export type DeleteRepostRequest = {
  relays: Relay[];
  pubkey: string;
  repostId: string;
};

interface RepostService {
  listRepostsAsync(request: ListRepostsRequest): Promise<RelayEvent[]>;
  listNotesRepostsAsync(
    request: ListNotesRepostsRequest
  ): Promise<[string, string][]>;
  listUserRepostsAsync(request: ListUserRepostsRequest): Promise<RelayEvent[]>;
  createRepostAsync(request: CreateRepostRequest): Promise<RelayEvent>;
  deleteRepostAsync(request: DeleteRepostRequest): Promise<RelayEvent>;
}

async function listRepostsAsync({
  relays,
  pubkey,
  limit,
  until,
  notesIds,
}: ListRepostsRequest): Promise<RelayEvent[]> {
  return await nostrService.listEvents(relays, {
    kinds: [6],
    authors: [pubkey],
    limit,
    until,
    "#e": notesIds,
  });
}

async function listNotesRepostsAsync({
  relays,
  pubkey,
  notesIds,
}: ListNotesRepostsRequest): Promise<[string, string][]> {
  const repostEvents = await listRepostsAsync({
    relays,
    pubkey,
    notesIds,
  });
  return repostEvents
    .map((event) => [nip18.getRepostedEventPointer(event)?.id, event.id])
    .filter(([pointerId, eventId]) => !!pointerId) as [string, string][];
}

async function listUserRepostsAsync({
  relays,
  pubkey,
  limit,
  until,
}: ListUserRepostsRequest): Promise<RelayEvent[]> {
  const repostEvents = await listRepostsAsync({
    relays,
    pubkey,
    limit,
    until,
  });
  return repostEvents
    .filter((event) => nip18.getRepostedEventPointer(event)?.id)
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, limit);
}

async function createRepostAsync({
  relays,
  pubkey,
  noteToRepost,
}: CreateRepostRequest): Promise<RelayEvent> {
  const tags = noteToRepost.tags.filter(
    (tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p")
  );
  tags.push(["e", noteToRepost.id]);
  tags.push(["p", noteToRepost.pubkey]);

  const repostEvent = await nostrService.createEvent(
    6,
    pubkey,
    noteToRepost.content,
    tags
  );
  return await nostrService.publishEvent(relays, repostEvent);
}

async function deleteRepostAsync({
  relays,
  pubkey,
  repostId,
}: DeleteRepostRequest): Promise<RelayEvent> {
  const tags = [["e", repostId]];
  const deleteEvent = await nostrService.createEvent(5, pubkey, "", tags);
  return await nostrService.publishEvent(relays, deleteEvent);
}

const RepostService: RepostService = {
  listRepostsAsync,
  listUserRepostsAsync,
  listNotesRepostsAsync,
  createRepostAsync,
  deleteRepostAsync,
};

export default RepostService;

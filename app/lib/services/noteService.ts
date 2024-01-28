import { nip18, nip25 } from "nostr-tools";
import type { Filter, Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import reactionService from "@/app/lib/services/reactionService";
import repostService from "@/app/lib/services/repostService";
import { combineNotes } from "@/app/lib/utils/notes";
import type { NoteEvent, RelayEvent } from "@/app/lib/types/event";

export type ListNotesRequest = {
  relays: Relay[];
  filter?: Filter;
};

export type ListUserNotesRequest = {
  relays: Relay[];
  pubkey: string;
  limit?: number;
  until?: number;
};

export type CreateNoteRequest = {
  relays: Relay[];
  pubkey: string;
  content: string;
};

export type CreateNoteReplyRequest = {
  relays: Relay[];
  pubkey: string;
  content: string;
  parentId: string;
};

interface NoteService {
  listNotesAsync(request: ListNotesRequest): Promise<NoteEvent[]>;
  listRootNotesAsync(request: ListNotesRequest): Promise<NoteEvent[]>;
  listUserNotesAsync(request: ListUserNotesRequest): Promise<NoteEvent[]>;
  listUserLikedNotesAsync(request: ListUserNotesRequest): Promise<NoteEvent[]>;
  listUserRepostedNotesAsync(
    request: ListUserNotesRequest
  ): Promise<NoteEvent[]>;
  createNoteAsync(request: CreateNoteRequest): Promise<RelayEvent>;
  createNoteReplyAsync(request: CreateNoteReplyRequest): Promise<RelayEvent>;
}

async function listNotesAsync({
  relays,
  filter,
}: ListNotesRequest): Promise<NoteEvent[]> {
  const notes = await nostrService.listEvents(relays, {
    kinds: [1],
    ...filter,
  });
  return notes.map((note) => ({ ...note, parent: false }));
}

async function listRootNotesAsync({
  relays,
  filter,
}: ListNotesRequest): Promise<NoteEvent[]> {
  // TODO: temporary solution, should be fixed with fetching with note parents
  return await listNotesAsync({
    relays,
    filter,
  });
}

async function listUserNotesAsync({
  relays,
  pubkey,
  limit,
  until,
}: ListUserNotesRequest): Promise<NoteEvent[]> {
  const userRepostedNotes = await listUserRepostedNotesAsync({
    relays,
    pubkey,
    limit,
    until,
  });
  const userNotes = await listNotesAsync({
    relays,
    filter: { authors: [pubkey], limit, until },
  });
  return combineNotes(userRepostedNotes, userNotes).slice(0, limit);
}

async function listUserLikedNotesAsync({
  relays,
  pubkey,
  limit,
  until,
}: ListUserNotesRequest): Promise<NoteEvent[]> {
  const userReactions = await reactionService.listUserReactionsAsync({
    relays,
    pubkey,
    limit,
    until,
  });
  const userReactionsMap = new Map(
    userReactions.map((reaction) => [
      nip25.getReactedEventPointer(reaction)?.id,
      reaction,
    ]) as [string, RelayEvent][]
  );
  const likedNotesIds = Array.from(userReactionsMap.keys());
  const likedNotes = await listNotesAsync({
    relays,
    filter: { ids: likedNotesIds },
  });
  return likedNotes.map((note) => ({
    ...note,
    likedAt: userReactionsMap.get(note.id)?.created_at as number,
  }));
}

async function listUserRepostedNotesAsync({
  relays,
  pubkey,
  limit,
  until,
}: ListUserNotesRequest): Promise<NoteEvent[]> {
  const userReposts = await repostService.listUserRepostsAsync({
    relays,
    pubkey,
    limit,
    until,
  });
  const userRepostsMap = new Map(
    userReposts.map((repost) => [
      nip18.getRepostedEventPointer(repost)?.id,
      repost,
    ]) as [string, RelayEvent][]
  );
  const repostedNotesIds = Array.from(userRepostsMap.keys());
  const repostedNotes = await listNotesAsync({
    relays,
    filter: { ids: repostedNotesIds },
  });
  return repostedNotes.map((note) => ({
    ...note,
    repostedAt: userRepostsMap.get(note.id)?.created_at as number,
  }));
}

async function createNoteAsync({
  relays,
  pubkey,
  content,
}: CreateNoteRequest): Promise<RelayEvent> {
  const noteEvent = await nostrService.createEvent(1, pubkey, content, []);
  return await nostrService.publishEvent(relays, noteEvent);
}

async function createNoteReplyAsync({
  relays,
  pubkey,
  content,
  parentId,
}: CreateNoteReplyRequest): Promise<RelayEvent> {
  const tags = [["e", parentId]];
  const replyEvent = await nostrService.createEvent(1, pubkey, content, tags);
  return await nostrService.publishEvent(relays, replyEvent);
}

const NoteService: NoteService = {
  listNotesAsync,
  listRootNotesAsync,
  listUserNotesAsync,
  listUserLikedNotesAsync,
  listUserRepostedNotesAsync,
  createNoteAsync,
  createNoteReplyAsync,
};

export default NoteService;

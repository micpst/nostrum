import { nip18, nip25 } from "nostr-tools";
import type { Filter, Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import reactionService from "@/app/lib/services/reactionService";
import repostService from "@/app/lib/services/repostService";
import { getTagValues, isReply } from "@/app/lib/utils/events";
import { combineNotes } from "@/app/lib/utils/notes";
import type { NoteEvent, RelayEvent } from "@/app/lib/types/event";

export type ListNotesRequest = {
  relays: Relay[];
  filter?: Filter;
};

export type ListNoteWithParentRequest = {
  relays: Relay[];
  noteId: string;
};

export type ListNoteRepliesRequest = {
  relays: Relay[];
  noteId: string;
  limit?: number;
  until?: number;
};

export type ListUserNotesRequest = {
  relays: Relay[];
  pubkey: string;
  limit?: number;
  until?: number;
};

export type ListHomeNotesRequest = {
  relays: Relay[];
  pubkeys: string[];
  limit?: number;
  until?: number;
};

export type ListExploreNotesRequest = {
  relays: Relay[];
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
  listNoteRepliesAsync(request: ListNoteRepliesRequest): Promise<NoteEvent[]>;
  listNoteWithParentAsync(
    request: ListNoteWithParentRequest,
  ): Promise<NoteEvent[]>;
  listExploreNotesAsync(request: ListExploreNotesRequest): Promise<NoteEvent[]>;
  listHomeNotesAsync(request: ListHomeNotesRequest): Promise<NoteEvent[]>;
  listUserNotesAsync(request: ListUserNotesRequest): Promise<NoteEvent[]>;
  listUserLikedNotesAsync(request: ListUserNotesRequest): Promise<NoteEvent[]>;
  listUserRepostedNotesAsync(
    request: ListUserNotesRequest,
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
  return notes.map((note) => ({
    ...note,
    parent: isReply(note)
      ? {
          id: getTagValues("e", note.tags) as string,
          pubkey: getTagValues("p", note.tags) as string,
        }
      : undefined,
  }));
}

async function listRootNotesAsync({
  relays,
  filter,
}: ListNotesRequest): Promise<NoteEvent[]> {
  const notes = await listNotesAsync({
    relays,
    filter,
  });
  return notes.filter((note) => !note.parent);
}

async function listNoteWithParentAsync({
  relays,
  noteId,
}: ListNoteWithParentRequest): Promise<NoteEvent[]> {
  const [note] = await listNotesAsync({
    relays,
    filter: { ids: [noteId] },
  });

  if (!note) return [];
  if (!note.parent) return [note];

  const [parentNote] = await listNotesAsync({
    relays,
    filter: { ids: [note.parent.id] },
  });

  if (!parentNote) return [note];

  return [parentNote, note];
}

async function listNoteRepliesAsync({
  relays,
  noteId,
  limit,
  until,
}: ListNoteRepliesRequest): Promise<NoteEvent[]> {
  const noteReplies = await listNotesAsync({
    relays,
    filter: { "#e": [noteId], limit, until },
  });
  return noteReplies.slice(0, limit);
}

async function listHomeNotesAsync({
  relays,
  pubkeys,
  limit,
  until,
}: ListHomeNotesRequest): Promise<NoteEvent[]> {
  const usersRepostedNotes = await Promise.all(
    pubkeys.map(async (pubkey) =>
      listUserRepostedNotesAsync({
        relays,
        pubkey,
        limit,
        until,
      }),
    ),
  );
  const usersNotes = await listRootNotesAsync({
    relays,
    filter: { authors: pubkeys, limit, until },
  });
  return combineNotes(usersRepostedNotes.flat(), usersNotes).slice(0, limit);
}

async function listExploreNotesAsync({
  relays,
  limit,
  until,
}: ListExploreNotesRequest): Promise<NoteEvent[]> {
  const rootNotes = await listRootNotesAsync({
    relays,
    filter: { limit, until },
  });
  return rootNotes.slice(0, limit);
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
    ]) as [string, RelayEvent][],
  );
  const likedNotesIds = Array.from(userReactionsMap.keys());
  const likedNotes = await listNotesAsync({
    relays,
    filter: { ids: likedNotesIds },
  });
  return likedNotes.map((note) => ({
    ...note,
    likedBy: userReactionsMap.get(note.id)?.pubkey,
    likedAt: userReactionsMap.get(note.id)?.created_at,
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
    ]) as [string, RelayEvent][],
  );
  const repostedNotesIds = Array.from(userRepostsMap.keys());
  const repostedNotes = await listNotesAsync({
    relays,
    filter: { ids: repostedNotesIds },
  });
  return repostedNotes.map((note) => ({
    ...note,
    repostedBy: userRepostsMap.get(note.id)?.pubkey,
    repostedAt: userRepostsMap.get(note.id)?.created_at,
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
  listNoteRepliesAsync,
  listNoteWithParentAsync,
  listExploreNotesAsync,
  listHomeNotesAsync,
  listUserNotesAsync,
  listUserLikedNotesAsync,
  listUserRepostedNotesAsync,
  createNoteAsync,
  createNoteReplyAsync,
};

export default NoteService;

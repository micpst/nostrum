import type { Filter, Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import type { RelayEvent } from "@/app/lib/types/event";

export type ListNotesRequest = {
  relays: Relay[];
  filter?: Filter;
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
  listNotesAsync(request: ListNotesRequest): Promise<RelayEvent[]>;
  createNoteAsync(request: CreateNoteRequest): Promise<RelayEvent>;
  createNoteReplyAsync(request: CreateNoteReplyRequest): Promise<RelayEvent>;
}

async function listNotesAsync({
  relays,
  filter,
}: ListNotesRequest): Promise<RelayEvent[]> {
  return await nostrService.listEvents(relays, {
    kinds: [1],
    ...filter,
  });
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
  createNoteAsync,
  createNoteReplyAsync,
};

export default NoteService;

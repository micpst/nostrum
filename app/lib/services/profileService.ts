import { nip05 } from "nostr-tools";
import type { Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import {
  groupEventsByPubkey,
  selectMostFrequentEvent,
} from "@/app/lib/utils/events";
import type { RelayEvent } from "@/app/lib/types/event";
import type { EditableUserData, User } from "@/app/lib/types/user";

export type ListProfilesRequest = {
  relays: Relay[];
  pubkeys: string[];
};

export type PublishProfileRequest = {
  relays: Relay[];
  pubkey: string;
  data: EditableUserData;
};

interface ProfileService {
  listProfilesAsync(request: ListProfilesRequest): Promise<User[]>;
  publishProfileAsync(request: PublishProfileRequest): Promise<RelayEvent>;
}

const defaultProfile: User = {
  pubkey: "",
  name: "",
  about: "",
  picture: "",
  banner: "",
  nip05: "",
  verified: false,
};

async function listProfilesAsync({
  relays,
  pubkeys,
}: ListProfilesRequest): Promise<User[]> {
  const events = await nostrService.listEvents(relays, {
    kinds: [0],
    authors: pubkeys,
  });

  const groupedEvents = groupEventsByPubkey(events);

  const selectedEvents = Array.from(groupedEvents.values())
    .filter((eventsForPubkey) => eventsForPubkey.length)
    .map((eventsForPubkey) =>
      selectMostFrequentEvent(eventsForPubkey)
    ) as RelayEvent[];

  const profilesQuery = selectedEvents.map(async (event) => {
    const parsed = JSON.parse(event.content);
    const pointer = await nip05.queryProfile(parsed?.nip05 || "");
    return [
      event.pubkey,
      {
        ...parsed,
        verified: pointer?.pubkey === event.pubkey,
        pubkey: event.pubkey,
      },
    ] as [string, User];
  });

  const newProfiles = await Promise.all(profilesQuery);

  const defaultProfiles = pubkeys.map((pubkey) => [
    pubkey,
    { ...defaultProfile, pubkey },
  ]) as [string, User][];

  return Array.from(new Map([...defaultProfiles, ...newProfiles]).values());
}

async function publishProfileAsync({
  relays,
  pubkey,
  data,
}: PublishProfileRequest): Promise<RelayEvent> {
  const content = JSON.stringify(data);
  const event = await nostrService.createEvent(0, pubkey, content);
  return await nostrService.publishEvent(relays, event);
}

const ProfileService: ProfileService = {
  listProfilesAsync,
  publishProfileAsync,
};

export default ProfileService;

import { nip05 } from "nostr-tools";
import type { Relay } from "nostr-tools";
import nostrService from "@/app/lib/services/nostrService";
import { validateProfileContent } from "@/app/lib/utils/common";
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

  const groupedEvents = groupEventsByPubkey(
    events.filter((event) => validateProfileContent(event.content))
  );

  const selectedEvents = Array.from(groupedEvents.values()).map(
    (eventsForPubkey) => selectMostFrequentEvent(eventsForPubkey)
  ) as RelayEvent[];

  const newProfiles = await Promise.all(
    selectedEvents.map(async (event) => {
      const data = JSON.parse(event.content);
      const pointer = await nip05.queryProfile(data?.nip05 || "");
      return {
        ...data,
        verified: pointer?.pubkey === event.pubkey,
        pubkey: event.pubkey,
      };
    })
  );

  return pubkeys.map((pubkey) => ({
    ...defaultProfile,
    ...newProfiles.find((profile) => profile.pubkey === pubkey),
    pubkey,
  }));
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

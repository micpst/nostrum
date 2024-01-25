import { nip05 } from "nostr-tools";
import type { Relay } from "nostr-tools";
import NostrService from "@/app/lib/services/nostr";
import {
  groupEventsByPubkey,
  selectMostFrequentEvent,
} from "@/app/lib/utils/events";
import type { RelayEvent } from "@/app/lib/types/event";
import type { User } from "@/app/lib/types/user";

export type Request = {
  relays: Relay[];
  pubkeys: string[];
};

interface ProfilesService {
  listProfilesAsync(request: Request): Promise<User[]>;
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
}: Request): Promise<User[]> {
  const events = await NostrService.listEvents(relays, {
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

const ProfilesService: ProfilesService = {
  listProfilesAsync,
};

export default ProfilesService;

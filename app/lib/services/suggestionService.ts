import followingService from "@/app/lib/services/followingService";
import { findMostFrequent } from "@/app/lib/utils/common";
import type { Relay } from "nostr-tools";

export type ListSuggestionsRequest = {
  relays: Relay[];
  pubkeys: string[];
};

interface SuggestionService {
  listSuggestionsAsync(request: ListSuggestionsRequest): Promise<string[]>;
}

async function listSuggestionsAsync({
  relays,
  pubkeys,
}: ListSuggestionsRequest): Promise<string[]> {
  const following = await Promise.all(
    pubkeys.map((pubkey) =>
      followingService.listFollowingAsync({ relays, pubkey }),
    ),
  );
  return findMostFrequent(
    following.flat().filter((pubkey) => !pubkeys.includes(pubkey)),
  );
}

const SuggestionService: SuggestionService = {
  listSuggestionsAsync,
};

export default SuggestionService;

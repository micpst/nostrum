import { nip05 } from "nostr-tools";
import profilesService from "@/app/lib/services/profileService";
import type {
  ProfileAction,
  ProfileState,
} from "@/app/lib/reducers/profilesReducer";
import type {
  ListProfilesRequest,
  PublishProfileRequest,
} from "@/app/lib/services/profileService";
import type { RelayEvent } from "@/app/lib/types/event";
import type { User } from "@/app/lib/types/user";

function addProfiles(pubkeys: string[]): ProfileAction {
  return {
    type: "ADD_PROFILES",
    pubkeys,
  };
}

export function removeProfiles(pubkeys: string[]): ProfileAction {
  return {
    type: "REMOVE_PROFILES",
    pubkeys,
  };
}

function reloadProfiles(pubkeys: string[]): ProfileAction {
  return {
    type: "RELOAD_PROFILES",
    pubkeys,
  };
}

export function updateProfiles(profiles: User[]): ProfileAction {
  return {
    type: "UPDATE_PROFILES",
    profiles,
  };
}

export function addProfilesAsync({
  relays,
  pubkeys,
}: ListProfilesRequest): (dispatch: any, getState: () => ProfileState) => void {
  return async (dispatch, getState) => {
    const prevLoading = new Set(getState().isLoading);

    dispatch(addProfiles(pubkeys));

    const newPubkeys = Array.from(getState().isLoading).filter(
      (pubkey) => !prevLoading.has(pubkey),
    );
    const profiles = await profilesService.listProfilesAsync({
      relays,
      pubkeys: newPubkeys,
    });

    dispatch(updateProfiles(profiles));
  };
}

export function updateProfileAsync({
  relays,
  pubkey,
  data,
}: PublishProfileRequest): (
  dispatch: any,
  getState: () => ProfileState,
) => Promise<RelayEvent> {
  return async (dispatch) => {
    const pointer = await nip05.queryProfile(data.nip05 || "");
    const extendedData = {
      ...data,
      verified: pointer?.pubkey === pubkey,
    };

    const profileEvent = await profilesService.publishProfileAsync({
      relays,
      pubkey,
      data: extendedData,
    });

    if (profileEvent.relays.length > 0) {
      dispatch(updateProfiles([{ ...extendedData, pubkey }]));
    }

    return profileEvent;
  };
}

export function reloadProfilesAsync(
  request: ListProfilesRequest,
): (dispatch: any, getState: () => ProfileState) => void {
  return async (dispatch, getState) => {
    dispatch(reloadProfiles(request.pubkeys));
    const profiles = await profilesService.listProfilesAsync(request);
    dispatch(updateProfiles(profiles));
  };
}

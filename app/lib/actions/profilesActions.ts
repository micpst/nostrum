import profilesService, {
  PublishProfileRequest,
} from "@/app/lib/services/profileService";
import type {
  ProfileAction,
  ProfileState,
} from "@/app/lib/reducers/profilesReducer";
import type { ListProfilesRequest } from "@/app/lib/services/profileService";
import type { User } from "@/app/lib/types/user";
import { nip05 } from "nostr-tools";

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
  profilesPubkeys,
}: ListProfilesRequest): (dispatch: any, getState: () => ProfileState) => void {
  return async (dispatch, getState) => {
    const prevLoading = new Set(getState().isLoading);

    dispatch(addProfiles(profilesPubkeys));

    const newPubkeys = Array.from(getState().isLoading).filter(
      (pubkey) => !prevLoading.has(pubkey)
    );
    const profiles = await profilesService.listProfilesAsync({
      relays,
      profilesPubkeys: newPubkeys,
    });

    dispatch(updateProfiles(profiles));
  };
}

export function updateProfileAsync({
  relays,
  authorPubkey,
  profileData,
}: PublishProfileRequest): (
  dispatch: any,
  getState: () => ProfileState
) => void {
  return async (dispatch, getState) => {
    const pointer = await nip05.queryProfile(profileData.nip05 || "");
    const newProfile = {
      ...profileData,
      verified: pointer?.pubkey === authorPubkey,
    };

    await profilesService.publishProfileAsync({
      relays,
      authorPubkey,
      profileData: newProfile,
    });

    dispatch(updateProfiles([{ ...newProfile, pubkey: authorPubkey }]));
  };
}

export function reloadProfilesAsync(
  request: ListProfilesRequest
): (dispatch: any, getState: () => ProfileState) => void {
  return async (dispatch, getState) => {
    dispatch(reloadProfiles(request.profilesPubkeys));
    const profiles = await profilesService.listProfilesAsync(request);
    dispatch(updateProfiles(profiles));
  };
}

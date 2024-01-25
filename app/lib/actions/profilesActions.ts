import profilesService from "@/app/lib/services/profilesServices";
import type {
  ProfileAction,
  ProfileState,
} from "@/app/lib/reducers/profilesReducer";
import type { Request } from "@/app/lib/services/profilesServices";
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

export function addProfilesAsync(
  request: Request
): (dispatch: any, getState: () => ProfileState) => void {
  return async (dispatch, getState) => {
    const prevLoading = new Set(getState().isLoading);

    dispatch(addProfiles(request.pubkeys));

    const pubkeys = Array.from(getState().isLoading).filter(
      (pubkey) => !prevLoading.has(pubkey)
    );
    const profiles = await profilesService.listProfilesAsync({
      relays: request.relays,
      pubkeys,
    });

    dispatch(updateProfiles(profiles));
  };
}

export function reloadProfilesAsync(
  request: Request
): (dispatch: any, getState: () => ProfileState) => void {
  return async (dispatch, getState) => {
    dispatch(reloadProfiles(request.pubkeys));
    const profiles = await profilesService.listProfilesAsync(request);
    dispatch(updateProfiles(profiles));
  };
}

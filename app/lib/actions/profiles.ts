import type { ProfileAction } from "@/app/lib/reducers/profilesReducer";
import type { User } from "@/app/lib/types/user";

export function addProfiles(pubkeys: string[]): ProfileAction {
  return {
    type: "ADD_PROFILES",
    pubkeys,
  };
}

export function updateProfiles(profiles: User[]): ProfileAction {
  return {
    type: "UPDATE_PROFILES",
    profiles,
  };
}

export function removeProfiles(pubkeys: string[]): ProfileAction {
  return {
    type: "REMOVE_PROFILES",
    pubkeys,
  };
}

export function reloadProfiles(pubkeys: string[]): ProfileAction {
  return {
    type: "RELOAD_PROFILES",
    pubkeys,
  };
}

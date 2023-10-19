import type { User } from "@/app/lib/types/user";

export type ProfileState = {
  profiles: Map<string, User>;
  refCounter: Map<string, number>;
  isLoading: Set<string>;
};

export type ProfileAction = {
  type: string;
  pubkeys?: string[];
  profiles?: User[];
};

export default function profileReducer(
  state: ProfileState,
  action: ProfileAction
): ProfileState {
  switch (action.type) {
    case "ADD_PROFILES": {
      if (!action.pubkeys) return state;

      const refCounter = new Map(state.refCounter);
      const isLoading = new Set(state.isLoading);

      action.pubkeys.forEach((pubkey) =>
        refCounter.set(pubkey, (refCounter.get(pubkey) || 0) + 1)
      );
      action.pubkeys.forEach(
        (pubkey) => refCounter.get(pubkey) == 1 && isLoading.add(pubkey)
      );

      return {
        ...state,
        refCounter,
        isLoading,
      };
    }
    case "UPDATE_PROFILES": {
      if (!action.profiles) return state;

      const isLoading = new Set(state.isLoading);
      const profiles = new Map(state.profiles);

      action.profiles.forEach((profile) => isLoading.delete(profile.pubkey));
      action.profiles.forEach((profile) =>
        profiles.set(profile.pubkey, profile)
      );

      return {
        ...state,
        profiles,
        isLoading,
      };
    }
    case "REMOVE_PROFILES": {
      if (!action.pubkeys) return state;

      const refCounter = new Map(state.refCounter);
      const profiles = new Map(state.profiles);

      const pubkeysToDecrement = action.pubkeys.filter(
        (pubkey) => (refCounter.get(pubkey) || 0) > 1
      );
      const pubkeysToRemove = action.pubkeys.filter(
        (pubkey) => (refCounter.get(pubkey) || 2) <= 1
      );

      pubkeysToDecrement.forEach((pubkey) =>
        refCounter.set(pubkey, (refCounter.get(pubkey) || 0) - 1)
      );
      pubkeysToRemove.forEach((pubkey) => {
        refCounter.delete(pubkey);
        profiles.delete(pubkey);
      });

      return {
        ...state,
        profiles,
        refCounter,
      };
    }
    case "RELOAD_PROFILES": {
      if (!action.pubkeys) return state;

      const profiles = new Map(state.profiles);
      const isLoading = new Set(state.isLoading);

      action.pubkeys.forEach((pubkey) => {
        profiles.delete(pubkey);
        isLoading.add(pubkey);
      });

      return {
        ...state,
        profiles,
        isLoading,
      };
    }
  }
  throw Error(`Unknown action: ${action.type}`);
}

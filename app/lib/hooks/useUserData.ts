import { User } from "@/app/lib/types/user";
import { nip19 } from "nostr-tools";
import { useProfile } from "@/app/lib/context/profile-provider";
import { getUserName, shortenHash } from "@/app/lib/utils/common";

export type UseUserData = User & {
  npub: string;
  nameId: string;
  url: string;
};

export function useUserData(pubkey?: string): UseUserData | null {
  const { profiles } = useProfile();

  if (!pubkey) {
    return null;
  }

  const user = profiles.get(pubkey);
  const npub = nip19.npubEncode(pubkey);
  const name = user ? getUserName(user) : "";

  return {
    pubkey,
    about: "",
    picture: "",
    verified: false,
    ...user,
    npub,
    name,
    nameId: name || shortenHash(npub, 4),
    url: `/u/${npub}`,
  };
}

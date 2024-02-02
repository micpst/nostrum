import { relayInit } from "nostr-tools";
import type { Relay } from "nostr-tools";
import { DEFAULT_RELAYS } from "@/app/lib/constants";

interface RelayService {
  getRelaysLocal: () => Relay[];
  setRelaysLocal: (relays: Relay[]) => void;
  resetRelaysLocal: () => void;
}

function getRelaysLocal(): Relay[] {
  if (typeof window === "undefined") return [];

  const urls = window.localStorage.getItem("relays");

  if (urls === null) {
    window.localStorage.setItem("relays", JSON.stringify(DEFAULT_RELAYS));
    return DEFAULT_RELAYS.map((url: string) => relayInit(url));
  }

  try {
    return JSON.parse(urls, (key, value) =>
      typeof value === "string" ? relayInit(value) : value,
    );
  } catch (err) {
    return [];
  }
}

function setRelaysLocal(relays: Relay[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    "relays",
    JSON.stringify(relays.map((relay) => relay.url)),
  );
}

function resetRelaysLocal(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("relays", JSON.stringify(DEFAULT_RELAYS));
}

const RelayService: RelayService = {
  getRelaysLocal,
  resetRelaysLocal,
  setRelaysLocal,
};

export default RelayService;

/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import { DEFAULT_SUGGESTIONS } from "@/app/lib/constants";
import { useFollowing } from "@/app/lib/context/following-provider";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import suggestionService from "@/app/lib/services/suggestionService";
import type { ProviderProps } from "@/app/lib/context/providers";

type SuggestionContext = {
  suggestions: string[];
  isLoading: boolean;
};

export const SuggestionContext = createContext<SuggestionContext | null>(null);

export default function SuggestionProvider({ children }: ProviderProps) {
  const { following } = useFollowing();
  const { add, remove } = useProfile();
  const { relays } = useRelay();

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useDeepCompareEffect(() => {
    const fetchSuggestions = async (): Promise<void> => {
      setIsLoading(true);

      const suggestions = await suggestionService.listSuggestionsAsync({
        relays: Array.from(relays.values()),
        pubkeys: Array.from(following),
      });

      if (suggestions.length < 3) {
        const defaultSuggestions = DEFAULT_SUGGESTIONS.filter(
          (pubkey) => !following.has(pubkey)
        );
        suggestions.push(
          ...defaultSuggestions.slice(0, 3 - suggestions.length)
        );
      }

      setSuggestions(suggestions);
      setIsLoading(false);
    };
    void fetchSuggestions();
  }, [Array.from(following), Array.from(relays.keys())]);

  useEffect(() => {
    add(suggestions);
    return () => remove(suggestions);
  }, [suggestions]);

  const value: SuggestionContext = {
    suggestions,
    isLoading,
  };

  return (
    <SuggestionContext.Provider value={value}>
      {children}
    </SuggestionContext.Provider>
  );
}

export function useSuggestions(): SuggestionContext {
  const context = useContext(SuggestionContext);

  if (!context)
    throw new Error("useSuggestion must be used within an SuggestionProvider");

  return context;
}

/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import { DEFAULT_FOLLOWINGS } from "@/app/lib/constants";
import { useProfile } from "@/app/lib/context/profile-provider";
import { useRelay } from "@/app/lib/context/relay-provider";
import type { ProviderProps } from "@/app/lib/context/providers";

type SuggestionContext = {
  suggestions: string[];
  isLoading: boolean;
};

export const SuggestionContext = createContext<SuggestionContext | null>(null);

export default function SuggestionProvider({ children }: ProviderProps) {
  const { relays } = useRelay();
  const { add, remove, reload } = useProfile();

  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_FOLLOWINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    add(suggestions);
    return () => remove(suggestions);
  }, []);

  useDeepCompareEffect(() => {
    void reload(suggestions);
  }, [relays]);

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

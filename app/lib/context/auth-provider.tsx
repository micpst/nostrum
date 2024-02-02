/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/app/lib/hooks/useLocalStorage";
import type { ProviderProps } from "@/app/lib/context/providers";

type AuthContext = {
  isConnected: boolean;
  isLoading: boolean;
  publicKey: string | null;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthProvider({ children }: ProviderProps) {
  const [isConnected, setIsConnected] = useLocalStorage<boolean>(
    "connected",
    false,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    if (window.nostr === undefined) {
      setIsConnected(false);
      setIsLoading(false);
      return;
    }

    if (isConnected) {
      window.nostr
        .getPublicKey()
        .then((publicKey: string) => setPublicKey(publicKey))
        .catch(() => setIsConnected(false))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (): void => {
    if (window.nostr === undefined) return;

    window.nostr
      .getPublicKey()
      .then((publicKey: string) => {
        setPublicKey(publicKey);
        setIsConnected(true);
      })
      .catch(() => {
        setIsConnected(false);
      });
  };

  const logout = (): void => {
    setIsConnected(false);
    setPublicKey(null);
  };

  const value: AuthContext = {
    isConnected,
    isLoading,
    publicKey,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
}

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "@/app/lib/hooks/useLocalStorage";

type AuthContext = {
  isConnected: boolean;
  isLoading: boolean;
  publicKey: string | undefined;
  login: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthProvider({
  children,
}: AuthProviderProps): JSX.Element {
  const [isConnected, setIsConnected] = useLocalStorage<boolean>(
    "connected",
    false
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isConnected) {
      if (typeof window.nostr === "undefined") {
        setIsConnected(false);
        return;
      }

      setIsLoading(true);

      nostr
        .getPublicKey()
        .then((publicKey: string) => {
          setPublicKey(publicKey);
          setIsConnected(true);
        })
        .catch(() => {
          setIsConnected(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const login = (): void => {
    setIsLoading(true);

    if (typeof window.nostr !== "undefined") {
      nostr
        .getPublicKey()
        .then((publicKey: string) => {
          setPublicKey(publicKey);
          setIsConnected(true);
        })
        .catch(() => {
          setIsConnected(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const value: AuthContext = {
    isConnected,
    isLoading,
    publicKey,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
}

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { User } from "@/app/lib/types/user";

type UserContext = {
  user?: User;
  isLoading: boolean;
};

export const UserContext = createContext<UserContext | null>(null);

type UserContextProviderProps = {
  value: UserContext;
  children: ReactNode;
};

export default function UserProvider({
  value,
  children,
}: UserContextProviderProps): JSX.Element {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContext {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUser must be used within an UserProvider");

  return context;
}

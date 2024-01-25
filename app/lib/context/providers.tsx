"use client";

import type { JSX, ReactNode } from "react";
import AuthProvider from "@/app/lib/context/auth-provider";
import FollowingProvider from "@/app/lib/context/following-provider";
import ProfileProvider from "@/app/lib/context/profile-provider";
import ReactionsProvider from "@/app/lib/context/reactions-provider";
import RelayProvider from "@/app/lib/context/relay-provider";
import RepostProvider from "@/app/lib/context/repost-provider";
import SuggestionProvider from "@/app/lib/context/suggestion-provider";

export type ProviderProps = {
  children: ReactNode;
};

type BaseProvider = (props: ProviderProps) => JSX.Element;

const buildProvidersTree = (componenetsWithProps: BaseProvider[]) => {
  const initialComponent = ({ children }: ProviderProps) => <>{children}</>;
  return componenetsWithProps.reduce((AccumulatedComponents, Provider) => {
    // eslint-disable-next-line react/display-name
    return ({ children }) => (
      <AccumulatedComponents>
        <Provider>{children}</Provider>
      </AccumulatedComponents>
    );
  }, initialComponent);
};

const Providers = buildProvidersTree([
  AuthProvider,
  RelayProvider,
  ProfileProvider,
  FollowingProvider,
  ReactionsProvider,
  RepostProvider,
  SuggestionProvider,
]);

export default Providers;

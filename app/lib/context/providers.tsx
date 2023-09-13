"use client";

import type { ReactNode } from "react";
import AuthProvider from "@/app/lib/context/auth-provider";
import ExploreProvider from "@/app/lib/context/explore-provider";
import HomeProvider from "@/app/lib/context/home-provider";
import FollowingProvider from "@/app/lib/context/following-provider";
import ProfileProvider from "@/app/lib/context/profile-provider";
import ReactionsProvider from "@/app/lib/context/reactions-provider";
import RelayProvider from "@/app/lib/context/relay-provider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RelayProvider>
        <ProfileProvider>
          <FollowingProvider>
            <ReactionsProvider>
              <HomeProvider>
                <ExploreProvider>{children}</ExploreProvider>
              </HomeProvider>
            </ReactionsProvider>
          </FollowingProvider>
        </ProfileProvider>
      </RelayProvider>
    </AuthProvider>
  );
}

export default Providers;

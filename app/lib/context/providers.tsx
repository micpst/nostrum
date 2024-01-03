"use client";

import type { ReactNode } from "react";
import AuthProvider from "@/app/lib/context/auth-provider";
import FollowingProvider from "@/app/lib/context/following-provider";
import ProfileProvider from "@/app/lib/context/profile-provider";
import ReactionsProvider from "@/app/lib/context/reactions-provider";
import RelayProvider from "@/app/lib/context/relay-provider";
import RepostProvider from "@/app/lib/context/repost-provider";
import SuggestionProvider from "@/app/lib/context/suggestion-provider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RelayProvider>
        <ProfileProvider>
          <FollowingProvider>
            <ReactionsProvider>
              <RepostProvider>
                <SuggestionProvider>{children}</SuggestionProvider>
              </RepostProvider>
            </ReactionsProvider>
          </FollowingProvider>
        </ProfileProvider>
      </RelayProvider>
    </AuthProvider>
  );
}

export default Providers;

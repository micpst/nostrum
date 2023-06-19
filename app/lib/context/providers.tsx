"use client";

import type { ReactNode } from "react";
import AuthProvider from "@/app/lib/context/auth-provider";
import FeedProvider from "@/app/lib/context/feed-provider";
import ProfileProvider from "@/app/lib/context/profile-provider";
import RelayProvider from "@/app/lib/context/relay-provider";
import WindowProvider from "@/app/lib/context/window-provider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RelayProvider>
        <ProfileProvider>
          <FeedProvider>
            <WindowProvider>{children}</WindowProvider>
          </FeedProvider>
        </ProfileProvider>
      </RelayProvider>
    </AuthProvider>
  );
}

export default Providers;

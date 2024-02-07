"use client";

import LoginButton from "@/app/components/login/login-button";
import LoginLink from "@/app/components/login/login-link";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useWindow } from "@/app/lib/hooks/useWindow";

function BottomBar(): JSX.Element | null {
  const { publicKey } = useAuth();
  const { width } = useWindow();

  if (publicKey) return null;

  return (
    <div className="fixed bottom-0 w-full bg-main-accent text-dark-primary py-3 z-30">
      <div className="flex items-center justify-center lg:justify-between mx-4 lg:mx-[calc(100vw/2-500px)]">
        {width > 1024 && (
          <div>
            <div>
              <span className="font-bold text-2xl">
                The social network you control
              </span>
            </div>
            <div>
              <span className="text-md">
                Your very own social network for your friends and business.
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-4 w-full max-w-[25rem]">
          <LoginButton
            text="Login"
            className="flex-1 bg-white text-black border-white"
          />
          <LoginLink
            text="Learn more"
            href="https://guides.getalby.com/user-guide/v/alby-account-and-browser-extension/alby-browser-extension/features/nostr"
            className="flex-1 bg-main-accent border-white"
          />
        </div>
      </div>
    </div>
  );
}

export default BottomBar;

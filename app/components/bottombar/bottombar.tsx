"use client";

import LoginButton from "@/app/components/login/login-button";
import LoginLink from "@/app/components/login/login-link";
import { useWindow } from "@/app/lib/context/window-provider";
import { useAuth } from "@/app/lib/context/auth-provider";

function BottomBar(): JSX.Element | null {
  const { publicKey, login } = useAuth();
  const { width } = useWindow();

  if (publicKey) return null;

  return (
    <div className="fixed bottom-0 w-full bg-violet-700 text-dark-primary py-3">
      <div className="flex items-center justify-center lg:justify-between lg:mx-[calc(75vw/5)] 2xl:mx-[calc(75vw/3)]">
        {width > 1024 && (
          <div>
            <div>
              <span className="font-bold text-2xl">
                Let your voice be heard
              </span>
            </div>
            <div>
              <span className="text-md">
                People on Nostr are free and equal.
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-4 w-full max-w-[25rem]">
          <LoginButton
            text="Login"
            className="flex-1 bg-white text-black border-white"
            onClick={login}
          />
          <LoginLink
            text="Learn more"
            href="https://guides.getalby.com/overall-guide/alby-browser-extension/features/nostr"
            className="flex-1 bg-violet-700 border-white"
          />
        </div>
      </div>
    </div>
  );
}

export default BottomBar;

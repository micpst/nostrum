"use client";

import LoginButton from "@/app/components/login/login-button";
import LoginLink from "@/app/components/login/login-link";
import { useAuth } from "@/app/lib/context/auth-provider";

function AsideLogin(): JSX.Element | null {
  const { publicKey, login } = useAuth();

  if (publicKey) return null;

  return (
    <section className="px-4 py-3 rounded-2xl bg-gray-100">
      <div className="pb-3">
        <h2 className="text-xl font-extrabold">New to Nostr?</h2>
      </div>
      <div className="pb-3">
        <span className="text-light-secondary">Sign up now and be free!</span>
      </div>
      <div className="flex flex-col gap-4">
        <LoginButton
          text="Login with Extension"
          className="bg-black text-white"
          onClick={login}
        />
        <LoginLink
          text="Learn more"
          href="https://guides.getalby.com/overall-guide/alby-browser-extension/features/nostr"
          className="bg-white text-black"
        />
      </div>
    </section>
  );
}

export default AsideLogin;

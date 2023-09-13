"use client";

import { useRouter } from "next/navigation";
import { nip19 } from "nostr-tools";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useProfile } from "@/app/lib/context/profile-provider";
import UserProvider from "@/app/lib/context/user-provider";
import { shortenHash } from "@/app/lib/utils";
import Header from "@/app/components/common/header";
import FollowButton from "@/app/components/ui/follow-button";
import Loading from "@/app/components/ui/loading";
import UserDetails from "@/app/components/user/user-details";
import UserEditProfile from "@/app/components/user/user-edit-profile";
import UserHeader from "@/app/components/user/user-header";
import UserHomeAvatar from "@/app/components/user/user-home-avatar";
import UserHomeCover from "@/app/components/user/user-home-cover";
import UserNav from "@/app/components/user/user-nav";

function ProfileLayout({
  params,
  children,
}: {
  params: { npub: string };
  children: ReactNode;
}) {
  const { publicKey } = useAuth();
  const { profiles, isLoading, addProfiles, removeProfiles } = useProfile();
  const { back } = useRouter();

  let pubkey = "";
  let isPubkeyValid = true;
  try {
    pubkey = nip19.decode(params.npub).data.toString();
  } catch (e) {
    isPubkeyValid = false;
  }

  const shortNpub = shortenHash(params.npub, 10);
  const isOwner = publicKey === pubkey;
  const user = profiles.get(pubkey);
  const userLoading = isLoading.has(pubkey);

  const coverData = user?.banner
    ? {
        src: user?.banner,
        alt: "banner",
      }
    : undefined;

  const userData = user?.picture ? { src: user.picture } : {};

  const value = {
    user,
    isLoading: userLoading,
  };

  useEffect(() => {
    if (isPubkeyValid && !profiles.has(pubkey) && pubkey !== publicKey) {
      void addProfiles([pubkey]);
      return () => removeProfiles([pubkey]);
    }
  }, []);

  return (
    <UserProvider value={value}>
      <div className="w-full max-w-[40rem] border-x border-light-border">
        <Header useActionButton action={back}>
          <UserHeader />
        </Header>
        <section>
          {!user || userLoading ? (
            <Loading className="mt-5" />
          ) : !isPubkeyValid ? (
            <>
              <UserHomeCover />
              <div className="flex flex-col gap-8">
                <div className="relative flex flex-col gap-3 px-4 py-3">
                  <UserHomeAvatar />
                  <p className="text-xl font-bold">@{shortNpub}</p>
                </div>
                <div className="p-8 text-center">
                  <p className="text-3xl font-bold">
                    This account doesn’t exist
                  </p>
                  <p className="text-light-secondary">
                    Try searching for another.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <UserHomeCover coverData={coverData} />
              <div className="relative flex flex-col gap-3 px-4 py-3">
                <div className="flex justify-between">
                  <UserHomeAvatar {...userData} />
                  {isOwner ? (
                    <UserEditProfile />
                  ) : (
                    <div className="flex gap-2 self-start">
                      <FollowButton userTargetPubkey={pubkey} />
                    </div>
                  )}
                </div>
                {user ? <UserDetails {...user} /> : undefined}
              </div>
            </>
          )}
        </section>
        {user ? (
          <>
            <UserNav />
            {children}
          </>
        ) : undefined}
      </div>
    </UserProvider>
  );
}

export default ProfileLayout;

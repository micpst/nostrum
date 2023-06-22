"use client";

import type { ReactNode } from "react";
import { nip19 } from "nostr-tools";
import { useEffect } from "react";
import { useProfile } from "@/app/lib/context/profile-provider";
import Header from "@/app/components/common/header";
import UserHomeCover from "@/app/components/user/user-home-cover";
import UserHomeAvatar from "@/app/components/user/user-home-avatar";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useRouter } from "next/navigation";
import FollowButton from "@/app/components/ui/follow-button";
import UserEditProfile from "@/app/components/user/user-edit-profile";
import Loading from "@/app/components/ui/loading";
import { shortenHash } from "@/app/lib/utils";
import UserDetails from "@/app/components/user/user-details";
import UserHeader from "@/app/components/user/user-header";
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
  const profile = profiles.get(pubkey);

  const coverData = profile?.banner
    ? {
        src: profile?.banner,
        alt: "banner",
      }
    : undefined;

  const profileData = profile?.picture
    ? {
        src: profile?.picture,
        alt: "avatar",
      }
    : undefined;

  useEffect(() => {
    if (isPubkeyValid && !profiles.has(pubkey)) {
      void addProfiles([pubkey]);
      return () => removeProfiles([pubkey]);
    }
  }, []);

  return (
    <div className="w-full max-w-[40rem] border-x border-light-border">
      <Header sticky border useActionButton action={back}>
        <UserHeader profile={profile} isLoading={isLoading} />
      </Header>
      <section>
        {isLoading && !profile ? (
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
                <p className="text-3xl font-bold">This account doesn’t exist</p>
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
                <UserHomeAvatar profileData={profileData} />
                {isOwner ? (
                  <UserEditProfile />
                ) : (
                  <div className="flex gap-2 self-start">
                    <FollowButton />
                  </div>
                )}
              </div>
              <UserDetails pubkey={pubkey} {...profile} />
            </div>
          </>
        )}
      </section>
      {profile ? (
        <>
          <UserNav />
          {children}
        </>
      ) : null}
    </div>
  );
}

export default ProfileLayout;

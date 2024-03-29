"use client";

import { nip19 } from "nostr-tools";
import Logo from "@/app/components/common/logo";
import Input from "@/app/components/input/input";
import Modal from "@/app/components/modal/modal";
import SidebarLink from "@/app/components/sidebar/sidebar-link";
import SidebarProfile from "@/app/components/sidebar/sidebar-profile";
import CustomIcon from "@/app/components/ui/icon";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useModal } from "@/app/lib/hooks/useModal";
import type { IconName } from "@/app/components/ui/icon";

export type NavLink = {
  href: string;
  linkName: string;
  iconName: IconName;
  public?: boolean;
};

const navLinks: Readonly<NavLink[]> = [
  {
    href: "/home",
    linkName: "Home",
    iconName: "HomeIcon",
  },
  {
    href: "/explore",
    linkName: "Explore",
    iconName: "HashtagIcon",
    public: true,
  },
  {
    href: "/settings",
    linkName: "Settings",
    iconName: "CogIcon",
    public: true,
  },
];

function Sidebar(): JSX.Element {
  const { publicKey } = useAuth();
  const { open, openModal, closeModal } = useModal();

  const npub = nip19.npubEncode(publicKey || "");

  return (
    <header
      className="flex flex-col items-center md:items-end xl:items-start z-20
                 w-[4.5rem] sm:w-[7rem] md:w-[10rem] lg:w-[7rem] xl:w-[17rem] px-2 lg:px-4"
    >
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden"
        open={open}
        closeModal={closeModal}
      >
        <Input closeModal={closeModal} />
      </Modal>
      <div className="flex flex-col justify-between fixed top-0 min-h-screen py-1">
        <div className="flex flex-col gap-2 items-center xl:items-start">
          <Logo />
          <nav className="flex flex-col gap-1">
            {navLinks
              .filter((linkData) => linkData.public || !!publicKey)
              .map((linkData) => (
                <SidebarLink {...linkData} key={linkData.href} />
              ))}
            {publicKey && (
              <SidebarLink
                href={`/u/${npub}`}
                linkName="Profile"
                iconName="ProfileIcon"
              />
            )}
          </nav>
          {publicKey && (
            <button
              className="rounded-full mt-2 p-3 bg-main-accent text-lg font-bold text-white
                       outline-none transition hover:brightness-90 active:brightness-75
                       xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75 xl:w-11/12"
              onClick={openModal}
            >
              <CustomIcon
                className="block h-6 w-6 fill-white xl:hidden"
                iconName="PenIcon"
              />
              <p className="hidden xl:block">Publish</p>
            </button>
          )}
        </div>
        <SidebarProfile />
      </div>
    </header>
  );
}

export default Sidebar;

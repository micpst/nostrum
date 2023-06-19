"use client";

import Logo from "@/app/components/common/logo";
import SidebarLink from "@/app/components/sidebar/sidebar-link";
import SidebarProfile from "@/app/components/sidebar/sidebar-profile";
import type { IconName } from "@/app/components/ui/icon";
import { useAuth } from "@/app/lib/context/auth-provider";
import CustomIcon from "@/app/components/ui/icon";

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

  return (
    <header
      className="flex flex-col items-center md:items-end xl:items-start z-20
                 w-[4.5rem] sm:w-[7rem] md:w-[10rem] lg:w-[7rem] xl:w-[17rem] px-2 lg:px-4"
    >
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
                href={`user/${publicKey}`}
                linkName="Profile"
                iconName="ProfileIcon"
              />
            )}
          </nav>
          {publicKey && (
            <button
              className="rounded-full p-3 bg-main-accent text-lg font-bold text-white
                       outline-none transition hover:brightness-90 active:brightness-75
                       xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75 xl:w-11/12"
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

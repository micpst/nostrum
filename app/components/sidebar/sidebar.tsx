"use client";

import Logo from "@/app/components/common/logo";
import SidebarLink from "@/app/components/sidebar/sidebar-link";
import type { IconName } from "@/app/components/ui/icon";
import { useAuth } from "@/app/lib/context/auth-provider";

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
    <header className="flex flex-col w-[4.5rem] sm:w-[7rem] md:w-[10rem] lg:w-[7rem] xl:w-[17rem] items-center md:items-end xl:items-start">
      <div className="flex flex-col px-2 py-1 lg:px-4 xs:py-3 gap-2 fixed top-0 items-center xl:items-start">
        <Logo />
        <nav className="flex items-center justify-around flex-col gap-1 xs:justify-center">
          {navLinks
            .filter((linkData) => linkData.public || !!publicKey)
            .map((linkData) => (
              <SidebarLink {...linkData} key={linkData.href} />
            ))}
        </nav>
      </div>
    </header>
  );
}

export default Sidebar;

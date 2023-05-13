"use client";

import Logo from "@/app/components/common/logo";
import SidebarLink from "@/app/components/sidebar/sidebar-link";
import type { IconName } from "@/app/components/ui/icon";

export type NavLink = {
  href: string;
  linkName: string;
  iconName: IconName;
};

const navLinks: Readonly<NavLink[]> = [
  {
    href: "/explore",
    linkName: "Explore",
    iconName: "HashtagIcon",
  },
  {
    href: "/settings",
    linkName: "Settings",
    iconName: "CogIcon",
  },
];

function Sidebar() {
  return (
    <header className="flex flex-col w-[4.5rem] sm:w-[7rem] md:w-[10rem] lg:w-[7rem] xl:w-[17rem] items-center md:items-end xl:items-start">
      <div className="flex flex-col px-2 py-1 lg:px-4 xs:py-3 gap-2 fixed top-0 items-center xl:items-start">
        <Logo />
        <nav className="flex items-center justify-around flex-col xs:justify-center xl:block">
          {navLinks.map((linkData) => (
            <SidebarLink {...linkData} key={linkData.href} />
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Sidebar;

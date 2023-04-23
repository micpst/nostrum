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
    <header className="flex fixed top-0 left-0 border-r">
      <div className="flex flex-col justify-between w-full xs:w-auto xl:w-60 px-2 lg:px-4 py-1 xs:py-3">
        <div className="flex flex-col justify-center gap-2 items-center xl:items-start">
          <Logo />
          <nav className="flex items-center justify-around flex-col xs:justify-center xl:block">
            {navLinks.map((linkData) => (
              <SidebarLink {...linkData} key={linkData.href} />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Sidebar;

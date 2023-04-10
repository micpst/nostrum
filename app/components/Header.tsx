"use client";

import HeaderLink from "@/app/components/HeaderLink";
import Logo from "@/app/components/Logo";
import Cog from "@/app/icons/Cog";
import Hashtag from "@/app/icons/Hashtag";

export type NavLink = {
  href: string;
  linkName: string;
  Icon: any;
};

const navLinks: Readonly<NavLink[]> = [
  {
    href: "/explore",
    linkName: "Explore",
    Icon: Hashtag,
  },
  {
    href: "/settings",
    linkName: "Settings",
    Icon: Cog,
  },
];

function Header() {
  return (
    <header className="flex xl:justify-end xs:w-20 xl:w-full lg:max-w-none xl:max-w-xs border-r">
      <div className="flex flex-col justify-between w-full xs:w-auto xl:w-60 px-2 lg:px-4 py-0 xs:py-3">
        <div className="flex flex-col justify-center gap-2 items-center xl:items-start">
          <Logo />
          <nav className="flex items-center justify-around flex-col xs:justify-center xl:block">
            {navLinks.map((linkData) => (
              <HeaderLink {...linkData} key={linkData.href} />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

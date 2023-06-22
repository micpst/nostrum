"use client";

import cn from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/app/components/settings/settings-list";
import CustomIcon from "@/app/components/ui/icon";

type SettingsLinkProps = NavLink;

function SettingsLink({ href, linkName }: SettingsLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between px-4 py-3 text-light-secondary hover:bg-light-secondary/5",
        isActive && "bg-light-secondary/5 border-r-2 border-main-accent"
      )}
    >
      <span>{linkName}</span>
      <CustomIcon
        iconName="ArrowRightIcon"
        className="fill-light-secondary w-5 h-5"
      />
    </Link>
  );
}

export default SettingsLink;

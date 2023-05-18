import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomIcon from "@/app/components/ui/icon";
import type { NavLink } from "@/app/components/sidebar/sidebar";

function SidebarLink({ href, linkName, iconName }: NavLink) {
  const pathname = usePathname();
  const isActive = pathname.includes(href);
  const textClass = isActive ? "font-bold" : "";

  return (
    <Link
      href={href}
      className="flex items-center self-start gap-4 p-3 xl:pr-7 rounded-full hover:bg-gray-100 text-xl"
    >
      <CustomIcon iconName={iconName} solid={isActive} />
      <span className={`${textClass} hidden xl:inline`}>{linkName}</span>
    </Link>
  );
}

export default SidebarLink;

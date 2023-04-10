import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/app/components/Header";

function HeaderLink({ href, linkName, Icon }: NavLink) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const iconClass = isActive ? "stroke-1" : "";
  const textClass = isActive ? "font-bold" : "";

  return (
    <div className="flex py-1 outline-none">
      <Link
        href={href}
        className="flex items-center self-start gap-4 p-3 xl:pr-7 rounded-full hover:bg-gray-100 text-xl"
      >
        <Icon className={iconClass} size="1.75rem" />
        <span className={`${textClass} hidden xl:inline`}>{linkName}</span>
      </Link>
    </div>
  );
}
export default HeaderLink;

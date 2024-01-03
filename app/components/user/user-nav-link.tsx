import Link from "next/link";
import cn from "clsx";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/app/components/user/user-nav";

function UserNavLink({ linkName, href }: NavLink): JSX.Element {
  const pathname = usePathname();
  const [, , npub, path = ""] = pathname.split("/");
  const isActive = path === href;

  return (
    <Link
      href={`/u/${npub}/${href}`}
      scroll={false}
      className="hover-animation main-tab dark-bg-tab flex flex-1 justify-center hover:bg-light-primary/10"
    >
      <div className="px-6 md:px-8">
        <p
          className={cn(
            "flex flex-col gap-3 whitespace-nowrap font-medium pt-3 transition-colors duration-200",
            isActive
              ? "text-light-primary [&>i]:scale-100 [&>i]:opacity-100"
              : "text-light-secondary"
          )}
        >
          {linkName}
          <i className="h-1 scale-50 rounded-full bg-main-accent opacity-0 transition duration-200" />
        </p>
      </div>
    </Link>
  );
}

export default UserNavLink;

import cn from "clsx";
import UserNavLink from "@/app/components/user/user-nav-link";

export type NavLink = {
  href: string;
  linkName: string;
};

const navLinks: Readonly<NavLink[]> = [
  { linkName: "Notes", href: "" },
  { linkName: "Likes", href: "likes" },
];

function UserNav(): JSX.Element {
  return (
    <nav
      className={cn(
        `hover-animation flex justify-between overflow-y-auto
         border-b border-light-border`
      )}
    >
      {navLinks.map((link) => (
        <UserNavLink key={link.linkName} {...link} />
      ))}
    </nav>
  );
}

export default UserNav;

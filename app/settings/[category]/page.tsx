"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/common/header";
import { navLinks } from "@/app/components/settings/settings-list";
import NotFound from "@/app/components/ui/not-found";

function CategoryPage() {
  const pathname = usePathname();
  const navLink = navLinks.find((link) => link.href === pathname);

  if (!navLink) return <NotFound />;

  return (
    <>
      <Header title={navLink.linkName} />
      <navLink.Component />
    </>
  );
}

export default CategoryPage;

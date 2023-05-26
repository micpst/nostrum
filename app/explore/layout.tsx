import type { Metadata } from "next";
import type { ReactNode } from "react";
import Aside from "@/app/components/aside/aside";
import AsideLogin from "@/app/components/aside/aside-login";

export const metadata: Metadata = {
  title: "Explore / Nostrum",
};

function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Aside>
        <AsideLogin />
      </Aside>
    </>
  );
}

export default ExploreLayout;

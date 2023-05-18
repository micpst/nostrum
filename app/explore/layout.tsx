import type { ReactNode } from "react";
import Aside from "@/app/components/aside/aside";
import Relays from "@/app/components/aside/relays";

export const metadata = {
  title: "Explore / Nostrum",
};

function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Aside>
        <Relays />
      </Aside>
    </>
  );
}

export default ExploreLayout;

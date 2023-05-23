import type { ReactNode } from "react";
import Aside from "@/app/components/aside/aside";

export const metadata = {
  title: "Home / Nostrum",
};

function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Aside>
        <></>
      </Aside>
    </>
  );
}

export default HomeLayout;

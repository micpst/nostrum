"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function IndexPage(): void {
  const { replace } = useRouter();

  useEffect(() => {
    void replace("/explore");
  }, []);
}

export default IndexPage;

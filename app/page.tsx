"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/lib/context/auth-provider";

function IndexPage(): void {
  const { replace } = useRouter();
  const { publicKey } = useAuth();

  useEffect(() => {
    const href = publicKey ? "/home" : "/explore";
    void replace(href);
  }, []);
}

export default IndexPage;

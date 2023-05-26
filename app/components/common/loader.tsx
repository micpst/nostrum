"use client";

import { useEffect, useState } from "react";
import Placeholder from "@/app/components/common/placeholder";
import { useAuth } from "@/app/lib/context/auth-provider";
import { sleep } from "@/app/lib/utils";

const Loader = ({ children }: any) => {
  const [pending, setPending] = useState<boolean>(true);
  const { isLoading } = useAuth();

  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      setPending(true);

      if (!isLoading) {
        await sleep(1000);
        setPending(false);
      }
    };

    void checkLogin();
  }, [isLoading]);

  if (pending) return <Placeholder />;

  return children;
};

export default Loader;

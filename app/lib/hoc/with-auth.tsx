"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/context/auth-provider";

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const { publicKey } = useAuth();
    const { replace } = useRouter();

    if (!publicKey) {
      void replace("/explore");
      return null;
    }

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;

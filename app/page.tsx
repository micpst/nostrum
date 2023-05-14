"use client";

import { useRouter } from "next/navigation";

function Index(): void {
  const { replace } = useRouter();
  void replace("/explore");
}

export default Index;

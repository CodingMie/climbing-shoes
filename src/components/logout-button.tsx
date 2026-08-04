"use client";

import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "onClick"
>;

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        await signOut();
        router.push("/");
        router.refresh();
      }}
      {...props}
    >
      {children ?? "退出"}
    </Button>
  );
}

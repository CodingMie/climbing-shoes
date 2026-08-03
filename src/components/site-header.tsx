import Link from "next/link";
import { getSession } from "@/lib/session";
import { LogoutButton } from "./logout-button";

export async function SiteHeader() {
  const session = await getSession();
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-semibold">
          攀岩鞋试穿体验平台
        </Link>
        {session ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {session.user.username ?? session.user.name}
            </span>
            <LogoutButton />
          </div>
        ) : (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="hover:underline">
              登录
            </Link>
            <Link href="/register" className="hover:underline">
              注册
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

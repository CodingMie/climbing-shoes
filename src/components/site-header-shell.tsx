"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, Mountains, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const desktopLinkClass =
  "text-body transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const mobileRowClass =
  "flex items-center justify-between gap-3 border-b border-border px-4 py-[13px] transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring active:scale-[0.98]";

const mobileTagClass = "font-mono text-[11px] text-muted-foreground";

export function SiteHeaderShell({ username }: { username: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-background">
      <div className="flex h-[60px] items-center justify-between border-b border-border px-4 md:px-7">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="flex size-[26px] shrink-0 items-end justify-center overflow-hidden rounded-lg bg-pine">
            <Mountains
              weight="fill"
              className="size-[18px] translate-y-[3.5px] text-sidebar-primary-foreground"
            />
          </span>
          <span className="flex flex-col">
            <span className="font-heading text-[14.5px] leading-[1.25] font-bold tracking-[0.01em]">
              攀岩鞋试穿体验平台
            </span>
            <span className="-mt-px hidden font-mono text-[9px] font-medium tracking-[0.22em] text-muted-foreground md:block">
              TRIAL · FIT · LOG
            </span>
          </span>
        </Link>

        <nav
          aria-label="主导航"
          className="hidden items-center gap-[22px] md:flex"
        >
          <Link href="/shoes" className={desktopLinkClass}>
            鞋库
          </Link>
          <span aria-hidden className="h-4 w-px bg-hairline-strong" />
          {username ? (
            <>
              <Link
                href={`/u/${username}`}
                className={cn(desktopLinkClass, "font-bold")}
              >
                {username}
              </Link>
              <Link href="/settings/profile" className={desktopLinkClass}>
                脚型档案
              </Link>
              <LogoutButton size="sm" />
            </>
          ) : (
            <>
              <Link href="/login" className={desktopLinkClass}>
                登录
              </Link>
              <Button size="sm" asChild>
                <Link href="/register">注册</Link>
              </Button>
            </>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X className="size-5" strokeWidth={1.5} />
          ) : (
            <List className="size-5" strokeWidth={1.5} />
          )}
        </Button>
      </div>

      {menuOpen && (
        <nav
          id="site-menu"
          aria-label="菜单"
          className="bg-background md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <Link href="/shoes" className={cn(mobileRowClass, "text-sm")}>
            鞋库
            <span className={mobileTagClass}>SHOES</span>
          </Link>
          {username ? (
            <>
              <Link
                href={`/u/${username}`}
                className={cn(mobileRowClass, "text-sm font-bold")}
              >
                {username}
                <span className={mobileTagClass}>PROFILE</span>
              </Link>
              <Link
                href="/settings/profile"
                className={cn(mobileRowClass, "text-sm")}
              >
                脚型档案
                <span className={mobileTagClass}>FOOT DATA</span>
              </Link>
              <LogoutButton
                className={cn(
                  mobileRowClass,
                  "h-auto w-full justify-between py-[13px] font-normal",
                )}
              >
                退出
                <span className={mobileTagClass}>SIGN OUT</span>
              </LogoutButton>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(mobileRowClass, "text-sm")}>
                登录
                <span className={mobileTagClass}>SIGN IN</span>
              </Link>
              <Link
                href="/register"
                className={cn(mobileRowClass, "text-sm font-bold text-primary")}
              >
                注册
                <span className={mobileTagClass}>SIGN UP</span>
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

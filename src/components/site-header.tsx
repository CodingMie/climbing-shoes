import { getSession } from "@/lib/session";
import { SiteHeaderShell } from "./site-header-shell";

export async function SiteHeader() {
  const session = await getSession();
  return (
    <SiteHeaderShell
      username={session ? (session.user.username ?? session.user.name) : null}
    />
  );
}

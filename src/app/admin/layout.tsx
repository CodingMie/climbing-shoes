import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-[22px] md:px-7 md:pb-11 md:pt-8">
      {children}
    </main>
  );
}

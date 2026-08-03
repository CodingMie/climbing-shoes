import type { Metadata } from "next";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "个人设置",
};

export default async function SettingsProfilePage() {
  const session = await requireUser();
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold">个人设置</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        已登录：{session.user.name}。脚型档案编辑即将上线。
      </p>
    </main>
  );
}

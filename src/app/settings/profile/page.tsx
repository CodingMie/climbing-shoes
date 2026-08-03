import type { Metadata } from "next";
import { FootProfileForm } from "@/components/settings/foot-profile-form";
import { getFootProfile } from "@/lib/foot-profile";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "脚型档案",
};

export default async function SettingsProfilePage() {
  const session = await requireUser();
  const profile = getFootProfile(session.user.id);
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold">脚型档案</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {session.user.name}
        ，完善你的脚型数据，写测评时它将作为尺码与合脚度的参考基准。
      </p>
      <div className="mt-8">
        <FootProfileForm profile={profile} />
      </div>
    </main>
  );
}

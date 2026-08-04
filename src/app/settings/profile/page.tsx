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
      <span className="micro-label">FOOT PROFILE</span>
      <h1 className="mt-1.5 text-[26px] font-black tracking-[-0.01em]">
        脚型档案
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {session.user.name}
        ，完善你的脚型数据，写测评时它将作为尺码与合脚度的参考基准。
      </p>
      <div className="mt-6">
        <FootProfileForm profile={profile} />
      </div>
    </main>
  );
}

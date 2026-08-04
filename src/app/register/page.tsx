import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "注册",
};

export default function RegisterPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto w-full max-w-[400px] rounded-lg border border-border bg-card px-7 py-14">
        <span className="micro-label">SIGN UP</span>
        <h1 className="mt-1.5 text-2xl font-black">创建账号</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          注册后即可记录与分享试穿体验
        </p>
        <div className="mt-[22px]">
          <RegisterForm />
        </div>
        <p className="mt-[18px] text-center text-label text-muted-foreground">
          已有账号？
          <Link
            href="/login"
            className="font-bold text-foreground underline underline-offset-[3px]"
          >
            登录
          </Link>
        </p>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "登录",
};

export default function LoginPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto w-full max-w-[400px] rounded-lg border border-border bg-card px-7 py-14">
        <span className="micro-label">SIGN IN</span>
        <h1 className="mt-1.5 text-2xl font-black">登录</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          使用用户名或邮箱登录
        </p>
        <div className="mt-[22px]">
          <LoginForm />
        </div>
        <p className="mt-[18px] text-center text-label text-muted-foreground">
          还没有账号？
          <Link
            href="/register"
            className="font-bold text-foreground underline underline-offset-[3px]"
          >
            注册
          </Link>
        </p>
      </div>
    </main>
  );
}

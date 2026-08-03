"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signUp } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线")
    .min(3, "用户名至少 3 个字符")
    .max(30, "用户名最长 30 个字符"),
  email: z.email("邮箱格式不正确"),
  password: z.string().min(8, "密码至少 8 个字符"),
});

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const parsed = registerSchema.safeParse({ username, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "输入有误，请检查后重试");
      return;
    }
    setSubmitting(true);
    const { error: signUpError } = await signUp.email({
      name: username,
      email,
      password,
      username,
    });
    if (signUpError) {
      setError(authErrorMessage(signUpError));
      setSubmitting(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">用户名</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          placeholder="3-30 位字母、数字或下划线"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "注册中…" : "注册"}
      </Button>
    </form>
  );
}

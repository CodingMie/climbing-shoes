"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const identifier = String(form.get("identifier") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const { error: signInError } = identifier.includes("@")
      ? await signIn.email({ email: identifier, password })
      : await signIn.username({ username: identifier, password });
    if (signInError) {
      setError(authErrorMessage(signInError));
      setSubmitting(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3.5">
      <div className="grid gap-1.5">
        <Label htmlFor="identifier">用户名或邮箱</Label>
        <Input id="identifier" name="identifier" autoComplete="username" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">密码</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? (
        <p role="alert" className="text-label text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "登录中…" : "登录"}
      </Button>
    </form>
  );
}

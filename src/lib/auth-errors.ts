const AUTH_ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "该邮箱已被注册",
  USER_ALREADY_EXISTS: "该邮箱已被注册",
  USERNAME_IS_ALREADY_TAKEN: "该用户名已被占用",
  INVALID_EMAIL_OR_PASSWORD: "邮箱或密码错误",
  INVALID_USERNAME_OR_PASSWORD: "用户名或密码错误",
  INVALID_EMAIL: "邮箱格式不正确",
  INVALID_USERNAME: "用户名只能包含字母、数字和下划线",
  USERNAME_TOO_SHORT: "用户名至少 3 个字符",
  USERNAME_TOO_LONG: "用户名最长 30 个字符",
  PASSWORD_TOO_SHORT: "密码至少 8 个字符",
  PASSWORD_TOO_LONG: "密码过长",
  USER_NOT_FOUND: "用户不存在",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "账号不存在",
};

export function authErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : undefined;
  return (code && AUTH_ERROR_MESSAGES[code]) || "操作失败，请稍后重试";
}

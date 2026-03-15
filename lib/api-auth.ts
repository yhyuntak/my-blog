import { auth } from "@/auth";

export type AuthResult =
  | { authorized: true; method: "session" | "api-key" | "dev-bypass" }
  | { authorized: false; error: string };

/**
 * 관리자 인증 체크 (세션 OR API 키 OR 개발 우회)
 */
export async function checkAdminAuth(request: Request): Promise<AuthResult> {
  // 1. 개발 환경 우회
  const bypassAuth =
    process.env.NODE_ENV === "development" &&
    process.env.DEV_BYPASS_AUTH === "true";
  if (bypassAuth) {
    return { authorized: true, method: "dev-bypass" };
  }

  // 2. API 키 인증
  const apiKey = process.env.BLOG_API_KEY;
  if (apiKey) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      if (token === apiKey) {
        return { authorized: true, method: "api-key" };
      }
    }
  }

  // 3. 세션 인증
  const session = await auth();
  if (session?.user?.role === "admin") {
    return { authorized: true, method: "session" };
  }

  return { authorized: false, error: "Unauthorized" };
}

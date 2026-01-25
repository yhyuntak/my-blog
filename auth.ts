import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) =>
  email.trim()
) || [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // 관리자 이메일 체크해서 role 설정
        const isAdmin = user.email && adminEmails.includes(user.email);
        session.user.role = isAdmin ? "admin" : user.role || "user";
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      // 처음 로그인 시 또는 관리자 이메일이면 DB에 role 업데이트
      if (user.email && adminEmails.includes(user.email)) {
        try {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "admin" },
          });
        } catch (error) {
          console.error("Failed to update user role:", error);
        }
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

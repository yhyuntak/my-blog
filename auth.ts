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
      githubUsername?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    githubUsername?: string | null;
  }
}

const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) =>
  email.trim()
) || [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // 관리자 이메일 체크해서 role 설정
        const isAdmin = user.email && adminEmails.includes(user.email);
        session.user.role = isAdmin ? "admin" : user.role || "user";
        session.user.githubUsername = user.githubUsername;
      }
      return session;
    },
  },
  debug: true,
  events: {
    async signIn({ user, account, profile }) {
      // GitHub 로그인 시 username과 image 저장
      if (account?.provider === "github" && profile && user.email) {
        try {
          const githubUsername = (profile as any).login || null;
          const githubImage = (profile as any).avatar_url || null;
          await prisma.user.update({
            where: { email: user.email },
            data: {
              githubUsername,
              ...(githubImage && { image: githubImage })
            },
          });
        } catch (error) {
          console.error("Failed to update GitHub data:", error);
        }
      }

      // Google 로그인 시 image 저장 및 githubUsername 제거
      if (account?.provider === "google" && profile && user.email) {
        try {
          const googleImage = (profile as any).picture || null;
          await prisma.user.update({
            where: { email: user.email },
            data: {
              ...(googleImage && { image: googleImage }),
              githubUsername: null, // Google 로그인 시 GitHub username 제거
            },
          });
        } catch (error) {
          console.error("Failed to update Google data:", error);
        }
      }

      // 관리자 이메일 체크해서 role 업데이트
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

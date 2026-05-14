import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

// Declare Extended Role Typings for NextAuth Core Ecosystem
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"]
  }
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ LOGIN FAIL: Missing credentials");
            throw new Error("Invalid credentials");
          }

          const email = credentials.email.toLowerCase().trim();
          console.log(`🔍 AUTH ATTEMPT: ${email}`);

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user?.password) {
            console.log(`❌ LOGIN FAIL: User not found -> ${email}`);
            throw new Error("Invalid credentials");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            console.log(`❌ LOGIN FAIL: Password mismatch -> ${email}`);
            throw new Error("Invalid credentials");
          }

          console.log(`✅ LOGIN SUCCESS: ${email} (Role: ${user.role})`);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("🔥 NEXTAUTH AUTH ERROR:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_mode_only",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

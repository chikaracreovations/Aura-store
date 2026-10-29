import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          const email = user.email.toLowerCase().trim();
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email,
                name: user.name || "Google User",
                role: "USER",
              },
            });
            console.log(`✅ GOOGLE AUTH: New user created -> ${email}`);
          } else {
            console.log(`✅ GOOGLE AUTH: Existing user signed in -> ${email}`);
          }
        } catch (error) {
          console.error("🔥 GOOGLE AUTH ERROR:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email.toLowerCase().trim() },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      } else if (user) {
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

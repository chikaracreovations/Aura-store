import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../../lib/prisma";

export const metadata = {
  title: "Operator Command Console | AURA.",
  description: "Administrative master access node."
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 🔑 Level 1: Immediate session validation
  if (!session || !session.user?.email) {
    console.log("🛡️ BLOCKED: Anonymous Guest attempted admin access.");
    redirect("/");
  }

  // 👑 Level 2: Bulletproof Real-Time Database Verification (Immune to session caching)
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    console.log(`🛡️ BLOCKED: User '${session.user.email}' lacks required 'ADMIN' status in database. Detected state: '${dbUser?.role || 'N/A'}'`);
    redirect("/");
  }

  console.log(`🔓 AUTHORIZED: Admin dashboard entry permitted for: ${session.user.email}`);

  return (
    <>
      {children}
    </>
  );
}

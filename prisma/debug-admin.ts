import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking database for master@aura.store...");
  const user = await prisma.user.findUnique({
    where: { email: "master@aura.store" },
  });

  if (user) {
    console.log("✅ USER FOUND:");
    console.log(`- Email: ${user.email}`);
    console.log(`- Role:  ${user.role}`);
    console.log(`- Has Password: ${!!user.password}`);
  } else {
    console.log("❌ USER NOT FOUND IN DATABASE");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  });

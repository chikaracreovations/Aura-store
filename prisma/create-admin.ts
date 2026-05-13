import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@aura.com";
  const adminPass = "AuraAdmin2026!";
  
  console.log(`🚀 Provisioning Master Admin Credential for: ${adminEmail}`);

  // Hash the password just like standard auth
  const hashedPassword = await bcrypt.hash(adminPass, 10);

  // Upsert or Create the Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: "ADMIN"
    },
    create: {
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("\n=========================================");
  console.log("👑 MASTER ADMIN ACCOUNT SUCCESSFULLY SYNCED");
  console.log("=========================================");
  console.log(`📧 Email:    ${adminUser.email}`);
  console.log(`🔑 Password: ${adminPass}`);
  console.log("=========================================\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Admin creation failure:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

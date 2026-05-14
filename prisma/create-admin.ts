import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "master@aura.store";
  const adminPass = "AuraMaster2026!";
  
  console.log(`🚀 Provisioning NEW Master Admin Credential for: ${adminEmail}`);

  // Hash the password
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
  console.log("👑 NEW ADMIN ACCOUNT SUCCESSFULLY SYNCED");
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

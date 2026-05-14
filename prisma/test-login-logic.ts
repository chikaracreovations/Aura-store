import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function testLogin() {
  const email = "master@aura.store";
  const password = "AuraMaster2026!";

  console.log(`🧪 Testing Login for ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    console.log("❌ User not found in DB");
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (isMatch) {
    console.log("✅ PASSWORD MATCHES PERFECTLY!");
  } else {
    console.log("❌ PASSWORD DOES NOT MATCH DB HASH!");
    console.log(`DB Hash: ${user.password}`);
  }
}

testLogin().then(() => prisma.$disconnect());

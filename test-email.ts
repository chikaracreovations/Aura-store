import { dispatchOrderNotifications } from "./src/lib/notifications";
import { resolve } from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env") });

async function main() {
  console.log("🚀 Firing Live Production SMTP Test to:", process.env.SMTP_USER);
  
  const dummyOrder = {
    id: "TEST-" + Math.random().toString(36).substring(7).toUpperCase(),
    total: 21498.00,
    shippingAddress: "123 Test Avenue, Mumbai, MH",
    phone: "+91 98765 43210"
  };

  const dummyUser = {
    name: "Ansh Chikara",
    email: process.env.SMTP_USER || "fallback@test.com"
  };

  const dummyItems = [
    {
      id: "prod_1",
      name: "Midnight Onyx Stealth Parka",
      price: 12999.00,
      quantity: 1
    },
    {
      id: "prod_2",
      name: "AURA V1 Obsidian Sneakers",
      price: 8499.00,
      quantity: 1
    }
  ];

  const result = await dispatchOrderNotifications(dummyOrder, dummyUser, dummyItems);

  if (result.success) {
    console.log("✅ EMAIL DISPATCHED SUCCESSFULLY!");
  } else {
    console.error("❌ EMAIL FAILED TO SEND:", result.error);
    process.exit(1);
  }
}

main();

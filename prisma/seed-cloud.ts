import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Midnight Onyx Stealth Parka",
    description: "An ultra-premium, lightweight, weatherproof parka built for modern urban explorers. Designed with a structured silhouette, waterproof seams, and tactical storage utility.",
    features: "Weatherproof Gore-Tex fabric\nMatte onyx finish with silent zippers\nThermal-regulating internal insulation\n7 hidden utility pockets",
    price: 12999.00,
    category: "Tech",
    stock: 24,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "AURA V1 Obsidian Sneakers",
    description: "The pinnacle of athletic luxury. Hand-stitched mesh panels atop a custom impact-absorbing carbon fiber sole for unparalleled daily performance.",
    features: "Carbon-weave performance sole\nFull-grain black leather trim\nHigh-traction architectural tread\nSignature AURA comfort padding",
    price: 8499.00,
    category: "Footwear",
    stock: 42,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Cobalt Tailored Silhouette Suit",
    description: "Exquisite double-breasted blazer and tailored trouser combo in deep midnight cobalt. Sculpted to emphasize modern architecture and clean body lines.",
    features: "Super 120s Italian merino wool\nHand-tailored structure lining\nSlim-cut sculptural silhouette\nCustom horn buttons",
    price: 15999.00,
    category: "Outerwear",
    stock: 15,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Ivory Mulberry Silk Dress",
    description: "Breathtaking minimalism. An elegant sleeveless column gown spun from 100% authentic premium mulberry silk, falling beautifully to the floor.",
    features: "100% Premium Mulberry Silk\nNatural organic off-white dye\nSleek cowl neckline\nFlowing low-impact side slit",
    price: 11499.00,
    category: "Occasion",
    stock: 18,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Titanium Minimalist Chrono",
    description: "A masterpiece of timekeeping engineering. Aerospace-grade titanium framing enclosing a silent solar-powered Japanese motion movement.",
    features: "Pure Aerospace Titanium case\nSapphire scratch-proof glass\nWater-resistant up to 50M\nGenuine Italian leather strap",
    price: 18999.00,
    category: "Accessories",
    stock: 10,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Urban Nomad Canvas Tote",
    description: "Heavy-duty waxed canvas reinforced with industrial rivets and luxurious full-grain leather handles. Ideal for elite daily transits.",
    features: "Heavy 24oz Waxed Canvas\nFull-grain tan bridle leather\nCopper reinforced rivets\nFits up to a 16-inch Macbook",
    price: 4299.00,
    category: "Accessories",
    stock: 30,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Sleek Carbon Cyber-Backpack",
    description: "A futuristic modular backpack featuring carbon fiber reinforcement panels and magnetic Fidlock access buckles for technical commutes.",
    features: "Matte carbon armor plating\nFidlock V-Buckle systems\nAnti-theft RFID back pocket\nFully expandable main cavity",
    price: 9500.00,
    category: "Tech",
    stock: 25,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Phantom Knit Runner X",
    description: "Ethereal light performance sneakers. Features adaptive 3D-knitted weave that moulds perfectly to the contours of your stride.",
    features: "3D Adaptive Knit mesh\nHigh-impact responsive foam\nSock-like tailored grip\nReflective evening safety decals",
    price: 7800.00,
    category: "Footwear",
    stock: 35,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Aeon Matte Gold Aviators",
    description: "Timeless silhouettes forged with modern precision. Matte gold aerospace framing fitted with fully polarized, anti-glare luxury lenses.",
    features: "Handcrafted 18k Gold Electroplating\nPremium Polarization Lenses\nFeatherweight architecture\nSignature leather hard-case",
    price: 6999.00,
    category: "Accessories",
    stock: 20,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
  }
];

const reviewers = [
  { name: "Aarav Sharma", email: "aarav.sharma@review.com" },
  { name: "Priya Patel", email: "priya.patel@review.com" },
  { name: "Rohan Malhotra", email: "rohan.malhotra@review.com" },
  { name: "Anjali Verma", email: "anjali.verma@review.com" },
  { name: "Kabir Kapoor", email: "kabir.kapoor@review.com" },
  { name: "Meera Reddy", email: "meera.reddy@review.com" },
  { name: "Aditya Singh", email: "aditya.singh@review.com" },
  { name: "Ishita Iyer", email: "ishita.iyer@review.com" }
];

const reviewComments = [
  "The fabric quality is absolutely top-notch. Felt incredibly premium from the moment I unboxed it!",
  "Excellent fit and super comfortable for daily wear. Truly impressed with the stitching finish.",
  "Exceeded my expectations! Delivered incredibly fast to Mumbai, and the packaging was luxury grade.",
  "Beautiful silhouette and very stylish. Already received multiple compliments at my office party!",
  "Perfect color representation as shown in the images. High-quality material that is soft and breathable.",
  "Highly recommended. Accurate sizing and the craftsmanship is top-tier. Worth every single rupee!",
  "Extremely comfortable for all-day wear. The modern fit is perfect for casual and semi-formal outings.",
  "Incredible attention to detail. One of the best purchases I've made online recently! Kudos to the team."
];

async function main() {
  console.log("🚀 Syncing High-End Cloud Database Seeder on Supabase...");

  // 1. Insert Products
  console.log("📦 Inserting Premium Inventory Catalog...");
  const dbProducts = [];
  for (const p of products) {
    const createdProd = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        features: p.features,
        price: p.price,
        category: p.category,
        stock: p.stock,
        isFeatured: p.isFeatured,
        imageUrl: p.imageUrl,
        isPhysical: true
      }
    });
    dbProducts.push(createdProd);
  }
  console.log(`✅ Successfully seeded ${dbProducts.length} luxury products.`);

  // 2. Create Reviewer User Records
  console.log("👤 Syncing premium reviewer user records...");
  const dbUsers = [];
  for (const user of reviewers) {
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        role: "USER"
      }
    });
    dbUsers.push(upsertedUser);
  }
  console.log(`✅ Synced ${dbUsers.length} customer reviewer accounts.`);

  // 3. Assign 2-3 high-quality reviews per product
  console.log("💬 Generating glowing Indian reviews ecosystem...");
  let reviewsCreatedCount = 0;
  const highRatings = [4, 5, 5, 5, 4, 5];

  for (const prod of dbProducts) {
    const shuffledUsers = [...dbUsers].sort(() => 0.5 - Math.random());
    const reviewLimit = Math.floor(Math.random() * 2) + 2; // 2 to 3 per product

    for (let i = 0; i < reviewLimit; i++) {
      const reviewer = shuffledUsers[i];
      const randomRating = highRatings[Math.floor(Math.random() * highRatings.length)];
      const randomComment = reviewComments[Math.floor(Math.random() * reviewComments.length)];

      await prisma.review.create({
        data: {
          productId: prod.id,
          userId: reviewer.id,
          rating: randomRating,
          comment: randomComment
        }
      });
      reviewsCreatedCount++;
    }
  }

  console.log(`💎 GLORIOUS COMPLETION! Generated ${reviewsCreatedCount} customer reviews on Cloud DB!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

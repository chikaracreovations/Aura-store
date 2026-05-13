import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

const highRatings = [4, 5, 5, 5, 4, 5]; // Weighted heavily towards 5 stars for premium feel

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
  console.log("🚀 Launching Indian Reviews Seeding Protocol...");

  // 1. Create Reviewer User Records
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
  console.log(`✅ Synced ${dbUsers.length} premium reviewer accounts.`);

  // 2. Retrieve Existing Catalog Products
  const products = await prisma.product.findMany();
  console.log(`📂 Found ${products.length} catalog items waiting for reviews.`);

  if (products.length === 0) {
    console.log("⚠️ Warning: Catalog is empty. Add products before assigning reviews!");
    return;
  }

  // 3. Flush existing dummy reviews to prevent infinite duplicates
  const deleteCount = await prisma.review.deleteMany({
    where: {
      userId: { in: dbUsers.map(u => u.id) }
    }
  });
  console.log(`🧹 Purged ${deleteCount.count} legacy test reviews.`);

  // 4. Assign 2-3 high-quality reviews per product
  let reviewsCreatedCount = 0;
  for (const prod of products) {
    // Randomize reviewer indexes to mix-and-match dynamically
    const shuffledUsers = [...dbUsers].sort(() => 0.5 - Math.random());
    const reviewLimit = Math.floor(Math.random() * 2) + 2; // Gives 2 to 3 reviews per product

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

  console.log(`💎 Success! Inserted ${reviewsCreatedCount} authentic Indian reviews across the catalog!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

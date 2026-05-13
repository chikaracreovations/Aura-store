import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment, imageUrl } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json({ error: "Product ID and Rating are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment || "",
        imageUrl: imageUrl || null,
        productId,
        userId: user.id
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error posting review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

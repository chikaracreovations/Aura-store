import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized: Session missing" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Administrator access required" }, { status: 403 });
    }

    const data = await req.json();
    
    // Simple validation
    if (!data.name || !data.price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    // Process comma-separated images into array
    const imageArray = data.images
      ? data.images.split(",").map((url: string) => url.trim()).filter((url: string) => url.length > 0)
      : [];

    // If the old imageUrl field was sent but not images, fallback to that (for backward compatibility)
    if (imageArray.length === 0 && data.imageUrl) {
      imageArray.push(data.imageUrl);
    }

    const product = await prisma.product.create({
      data: {
        id: data.id && data.id.trim().length > 0 ? data.id.trim() : undefined,
        name: data.name,
        price: parseFloat(data.price),
        description: data.description || "",
        features: data.features || "",
        category: data.category || "Uncategorized",
        imageUrl: imageArray.length > 0 ? imageArray[0] : null,
        stock: parseInt(data.stock) || 0,
        isPhysical: data.isPhysical !== undefined ? data.isPhysical : true,
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
        images: {
          create: imageArray.map((url: string) => ({ url }))
        }
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

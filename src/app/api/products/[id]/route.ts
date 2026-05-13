import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const data = await req.json();

    if (!data.name || !data.price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    // Process comma-separated images into array
    const imageArray = data.images
      ? data.images.split(",").map((url: string) => url.trim()).filter((url: string) => url.length > 0)
      : [];

    if (imageArray.length === 0 && data.imageUrl) {
      imageArray.push(data.imageUrl);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
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
          deleteMany: {}, // Clear old product images
          create: imageArray.map((url: string) => ({ url }))
        }
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

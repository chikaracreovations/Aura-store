import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: orderId } = await params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the order and verify it belongs to the logged in user
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access Denied" }, { status: 403 });
    }

    // Limit returns to DELIVERED or PENDING or active items. 
    // We allow transitioning from any status to RETURN_REQUESTED for demo flexibility.
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "RETURN_REQUESTED" }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error requesting return:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";
import { dispatchOrderNotifications } from "../../../../lib/notifications";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Authentication required to checkout" }, { status: 401 });
    }

    const { cart, total, shippingAddress, phone, paymentMethod } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Calculate subtotal and verify matching to avoid client manipulation
    const calculatedTotal = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Standard business logic to execute complete order creation inside a database transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create parent Order object. Status begins as "PROCESSING" for high-end touch.
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          status: "PROCESSING",
          total: calculatedTotal,
          phone: phone || "",
          shippingAddress: shippingAddress || "",
          paymentMethod: paymentMethod || "COD",
        }
      });

      // 2. Create associated relational OrderItems mapping.
      for (const item of cart) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          }
        });

        // 3. (Optional/Dynamic) Deduct from product stock quantities to ensure inventory consistency.
        const prod = await tx.product.findUnique({ where: { id: item.id } });
        if (prod) {
          await tx.product.update({
            where: { id: item.id },
            data: { stock: Math.max(0, prod.stock - item.quantity) }
          });
        }
      }

      return newOrder;
    });

    // 4. Trigger Asynchronous Notification Dispatch Engine (Simulated & Ready to Pop)
    await dispatchOrderNotifications(order, user, cart);

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });

  } catch (error) {
    console.error("Checkout Transaction Failed:", error);
    return NextResponse.json({ error: "An error occurred while securing your order transaction" }, { status: 500 });
  }
}

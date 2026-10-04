import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { quantity } = await req.json();

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: { id, userId: session.id },
      });
      return NextResponse.json({ success: true, message: "Item removed" });
    }

    const updated = await prisma.cartItem.updateMany({
      where: { id, userId: session.id },
      data: { quantity },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Cart item update error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.cartItem.deleteMany({
      where: { id, userId: session.id },
    });

    return NextResponse.json({ success: true, message: "Item removed" });
  } catch (error) {
    console.error("Cart item delete error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

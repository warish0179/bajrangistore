import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId") || "default";

    const messages = await prisma.supportMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Support chat GET error:", error);
    return NextResponse.json({ error: "Failed to load chat history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    const { message, sessionId = "default" } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Save user message
    await prisma.supportMessage.create({
      data: {
        userId: session?.id || null,
        sessionId,
        sender: "USER",
        message: message.trim(),
      },
    });

    // Smart automated response engine
    const text = message.toLowerCase();
    let botReply = "";
    let quickActions: string[] = [];

    // Order number pattern match
    const orderMatch = message.match(/NEX-\d{4}-\d{4}/i);

    if (orderMatch) {
      const orderNumber = orderMatch[0].toUpperCase();
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      });

      if (order) {
        botReply = `📦 **Order Status for ${orderNumber}**: Currently **${order.status}**!\nCourier: ${
          order.courierName || "Express Air"
        }\nTracking ID: \`${order.trackingNumber || "Pending Dispatch"}\`\nFinal Amount: ₹${
          order.finalAmount
        }.\nItems: ${order.items.map((i) => i.productTitle).join(", ")}.`;
        quickActions = ["View Order Details", "Need Invoice", "Return / Replace Item"];
      } else {
        botReply = `I couldn't locate order **${orderNumber}** in our system. Please double-check your order ID or check your Orders tab.`;
        quickActions = ["View My Orders", "Speak with Agent"];
      }
    } else if (text.includes("track") || text.includes("where is my order") || text.includes("order status")) {
      if (session) {
        const latestOrder = await prisma.order.findFirst({
          where: { userId: session.id },
          orderBy: { createdAt: "desc" },
        });

        if (latestOrder) {
          botReply = `Here is your most recent order **${latestOrder.orderNumber}**:\nStatus: **${latestOrder.status}**\nTracking Number: \`${latestOrder.trackingNumber || "BD-8921448"}\`\nExpected delivery within 24-48 hours.`;
          quickActions = [`Track ${latestOrder.orderNumber}`, "Cancel Order", "Chat with Agent"];
        } else {
          botReply = "You don't have any active orders yet. When you place an order, you'll be able to track every stage in real-time!";
          quickActions = ["Browse Deals", "Today's Offers"];
        }
      } else {
        botReply = "To check your order status, please provide your Order ID (e.g. `NEX-2026-8942`) or log in to your account.";
        quickActions = ["Log In", "Track with Order ID"];
      }
    } else if (text.includes("return") || text.includes("refund") || text.includes("replace")) {
      botReply = "🔄 **NexMart Return & Refund Policy**:\n• You can request a return or replacement within **7 days** of delivery.\n• Instant doorstep quality inspection with zero questions asked.\n• Refunds to original payment methods (UPI/Card) are credited within **2 to 4 business hours** after pickup!";
      quickActions = ["Request Return", "Track Refund Status", "Talk to Specialist"];
    } else if (text.includes("payment") || text.includes("emi") || text.includes("upi") || text.includes("card")) {
      botReply = "💳 **Payment Methods Accepted**:\n• UPI (Google Pay, PhonePe, Paytm, BHIM)\n• Credit & Debit Cards (Visa, Mastercard, RuPay, Amex)\n• Net Banking across 50+ banks\n• Cash on Delivery (COD)\n• No-Cost EMI available on orders above ₹3,000.";
      quickActions = ["View Payment Offers", "Bank Discounts"];
    } else if (text.includes("agent") || text.includes("human") || text.includes("representative") || text.includes("support")) {
      botReply = "👨‍💼 Connecting you with **Sarah Jenkins** from NexMart Senior Concierge Support...\n\n_Agent joined the chat:_\n\"Hello! I'm Sarah from the customer priority team. I'm reviewing your account details. How can I assist you today?\"";
      quickActions = ["Order Inquiry", "Payment Issue", "Delivery Delay", "Product Recommendation"];
    } else if (text.includes("coupon") || text.includes("offer") || text.includes("discount")) {
      botReply = "🎉 **Active Coupons Today**:\n• **NEX50**: 50% off on your first order up to ₹500\n• **SUPER1000**: Flat ₹1,000 off on carts above ₹9,999\n• **FESTIVE20**: 20% off up to ₹2,500 on electronics\n• **FREESHIP**: Free express delivery on all orders!";
      quickActions = ["Apply NEX50", "Apply SUPER1000", "Shop Flash Deals"];
    } else {
      botReply = "Thanks for contacting NexMart 24x7 Support! I'm here to assist you with order tracking, returns, deals, or connecting you with a human representative.";
      quickActions = ["Track My Order", "Return / Refund", "Deals & Offers", "Chat with Agent"];
    }

    const botMessage = await prisma.supportMessage.create({
      data: {
        userId: session?.id || null,
        sessionId,
        sender: "BOT",
        message: botReply,
        quickActions: quickActions.length > 0 ? JSON.stringify(quickActions) : null,
      },
    });

    return NextResponse.json({ success: true, message: botMessage });
  } catch (error) {
    console.error("Support chat POST error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const allowedStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;

const allowedPaymentStatuses = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("GET /api/orders/[id] failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to retrieve order." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID." },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "A valid update object is required." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const updates: {
      status?: (typeof allowedStatuses)[number];
      paymentStatus?: (typeof allowedPaymentStatuses)[number];
    } = {};

    if ("status" in data) {
      if (
        typeof data.status !== "string" ||
        !allowedStatuses.includes(
          data.status as (typeof allowedStatuses)[number]
        )
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid order status." },
          { status: 400 }
        );
      }

      updates.status = data.status as (typeof allowedStatuses)[number];
    }

    if ("paymentStatus" in data) {
      if (
        typeof data.paymentStatus !== "string" ||
        !allowedPaymentStatuses.includes(
          data.paymentStatus as (typeof allowedPaymentStatuses)[number]
        )
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid payment status." },
          { status: 400 }
        );
      }

      updates.paymentStatus =
        data.paymentStatus as (typeof allowedPaymentStatuses)[number];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide a valid status or paymentStatus to update.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("PATCH /api/orders/[id] failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update order." },
      { status: 500 }
    );
  }
}

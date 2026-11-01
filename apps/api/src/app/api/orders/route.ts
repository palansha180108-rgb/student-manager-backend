
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export const runtime = "nodejs";

type RequestedItem = {
  productId: string;
  quantity: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  try {
    await connectToDatabase();

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET /api/orders failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to retrieve orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isObject(body)) {
      return NextResponse.json(
        { success: false, message: "A valid order object is required." },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, items } = body;

    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof customerEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()) ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid customer details and at least one order item are required.",
        },
        { status: 400 }
      );
    }

    const requestedItems: RequestedItem[] = [];

    for (const item of items) {
      if (
        !isObject(item) ||
        typeof item.productId !== "string" ||
        !mongoose.isValidObjectId(item.productId) ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Each item needs a valid productId and an integer quantity from 1 to 100.",
          },
          { status: 400 }
        );
      }

      requestedItems.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    await connectToDatabase();

    const productIds = [...new Set(requestedItems.map((item) => item.productId))];
    const products = await Product.find({
      _id: { $in: productIds },
      isAvailable: true,
    }).lean();

    const productMap = new Map(
      products.map((product) => [product._id.toString(), product])
    );

    const orderItems = [];

    for (const requested of requestedItems) {
      const product = productMap.get(requested.productId);

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: "A requested product was not found or is unavailable.",
          },
          { status: 400 }
        );
      }

      const unitPrice = product.price;
      const subtotal = unitPrice * requested.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: requested.quantity,
        unitPrice,
        subtotal,
      });
    }

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    const orderNumber = `CCD-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    const order = await Order.create({
      orderNumber,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      items: orderItems,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
    });

    return NextResponse.json(
      { success: true, order },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create order." },
      { status: 500 }
    );
  }
}

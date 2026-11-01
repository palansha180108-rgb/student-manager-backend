import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Sale from "@/models/Sale";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    const sales = await Sale.find({})
      .sort({ recordedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: sales.length,
      sales,
    });
  } catch (error) {
    console.error("Failed to load sales:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load sales." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productId = String(body.productId ?? "");
    const quantity = Number(body.quantity);

    if (
      !mongoose.isValidObjectId(productId) ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Select a valid product and a whole quantity of at least 1.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findById(productId).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    if (product.isAvailable !== true) {
  return NextResponse.json(
    {
      success: false,
      message: "This product is not currently available.",
    },
    { status: 409 }
  );
}

    const unitPrice = Number(product.price);

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return NextResponse.json(
        { success: false, message: "The product price is invalid." },
        { status: 500 }
      );
    }

    const sale = await Sale.create({
      productId: product._id,
      itemName: product.name,
      quantity,
      unitPrice,
      total: unitPrice * quantity,
      recordedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "Sale recorded successfully.", sale },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to record sale:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record sale." },
      { status: 500 }
    );
  }
}


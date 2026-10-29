
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isValidId(id: string) {
  return mongoose.isValidObjectId(id);
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("GET /api/products/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to retrieve product." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "A valid product object is required." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const updates: Record<string, string | number | boolean> = {};

    if ("name" in data) {
      if (typeof data.name !== "string" || !data.name.trim()) {
        return NextResponse.json(
          { success: false, message: "Name must be a non-empty string." },
          { status: 400 }
        );
      }
      updates.name = data.name.trim();
    }

    if ("category" in data) {
      if (typeof data.category !== "string" || !data.category.trim()) {
        return NextResponse.json(
          { success: false, message: "Category must be a non-empty string." },
          { status: 400 }
        );
      }
      updates.category = data.category.trim();
    }

    if ("price" in data) {
      if (
        typeof data.price !== "number" ||
        !Number.isFinite(data.price) ||
        data.price < 0
      ) {
        return NextResponse.json(
          { success: false, message: "Price must be a non-negative number." },
          { status: 400 }
        );
      }
      updates.price = data.price;
    }

    if ("description" in data) {
      if (typeof data.description !== "string") {
        return NextResponse.json(
          { success: false, message: "Description must be a string." },
          { status: 400 }
        );
      }
      updates.description = data.description.trim();
    }

    if ("imageUrl" in data) {
      if (typeof data.imageUrl !== "string") {
        return NextResponse.json(
          { success: false, message: "Image URL must be a string." },
          { status: 400 }
        );
      }
      updates.imageUrl = data.imageUrl.trim();
    }

    if ("isAvailable" in data) {
      if (typeof data.isAvailable !== "boolean") {
        return NextResponse.json(
          { success: false, message: "isAvailable must be true or false." },
          { status: 400 }
        );
      }
      updates.isAvailable = data.isAvailable;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "Provide at least one valid field to update." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("PATCH /api/products/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/products/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete product." },
      { status: 500 }
    );
  }
}

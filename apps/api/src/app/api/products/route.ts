
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find().sort({ name: 1 }).lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET /api/products failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to retrieve products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "A valid product object is required." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const { name, category, price } = data;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, category, and a non-negative numeric price are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      price,
      description:
        typeof data.description === "string" ? data.description.trim() : "",
      imageUrl: typeof data.imageUrl === "string" ? data.imageUrl.trim() : "",
      isAvailable:
        typeof data.isAvailable === "boolean" ? data.isAvailable : true,
    });

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products failed:", error);

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      return NextResponse.json(
        { success: false, message: "The product data failed validation." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Unable to create product." },
      { status: 500 }
    );
  }
}

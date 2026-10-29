
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import InventoryItem from "@/models/InventoryItem";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    // Read existing inventory records, including older records
    // that don't yet have the isActive field.
    const items = await InventoryItem.find({
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    })
      .sort({ name: 1 })
      .lean();

    const normalizedItems = items.map((item) => {
      const record = item as typeof item & {
        stock?: number;
        minimum?: number;
      };

      return {
        ...record,
        quantity: record.quantity ?? record.stock ?? 0,
        lowStockThreshold:
          record.lowStockThreshold ?? record.minimum ?? 5,
        isActive: record.isActive ?? true,
      };
    });

    return NextResponse.json({
      success: true,
      count: normalizedItems.length,
      items: normalizedItems,
    });
  } catch (error) {
    console.error("GET /api/inventory failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to retrieve inventory." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "A valid inventory item is required." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const { name, unit } = data;
    const quantity = data.quantity ?? 0;
    const lowStockThreshold = data.lowStockThreshold ?? 5;
    const costPerUnit = data.costPerUnit ?? 0;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof unit !== "string" ||
      !unit.trim() ||
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity < 0 ||
      typeof lowStockThreshold !== "number" ||
      !Number.isFinite(lowStockThreshold) ||
      lowStockThreshold < 0 ||
      typeof costPerUnit !== "number" ||
      !Number.isFinite(costPerUnit) ||
      costPerUnit < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Provide a name, unit, and valid non-negative quantity, threshold, and unit cost.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const item = await InventoryItem.create({
      name: name.trim(),
      unit: unit.trim(),
      quantity,
      lowStockThreshold,
      costPerUnit,
    });

    return NextResponse.json(
      { success: true, item },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/inventory failed:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "An inventory item with that name already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Unable to create inventory item." },
      { status: 500 }
    );
  }
}

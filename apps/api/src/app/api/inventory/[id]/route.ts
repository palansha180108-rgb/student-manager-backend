
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import InventoryItem from "@/models/InventoryItem";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid inventory item ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const item = await InventoryItem.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Inventory item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("GET /api/inventory/[id] failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to retrieve inventory item." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid inventory item ID." },
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

    if ("unit" in data) {
      if (typeof data.unit !== "string" || !data.unit.trim()) {
        return NextResponse.json(
          { success: false, message: "Unit must be a non-empty string." },
          { status: 400 }
        );
      }
      updates.unit = data.unit.trim();
    }

    for (const field of ["quantity", "lowStockThreshold", "costPerUnit"] as const) {
      if (field in data) {
        const value = data[field];

        if (
          typeof value !== "number" ||
          !Number.isFinite(value) ||
          value < 0
        ) {
          return NextResponse.json(
            {
              success: false,
              message: `${field} must be a valid non-negative number.`,
            },
            { status: 400 }
          );
        }

        updates[field] = value;
      }
    }

    if ("isActive" in data) {
      if (typeof data.isActive !== "boolean") {
        return NextResponse.json(
          { success: false, message: "isActive must be true or false." },
          { status: 400 }
        );
      }
      updates.isActive = data.isActive;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "Provide at least one valid field to update." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const item = await InventoryItem.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Inventory item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("PATCH /api/inventory/[id] failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update inventory item." },
      { status: 500 }
    );
  }
}

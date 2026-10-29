
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import InventoryItem from "@/models/InventoryItem";
import StockMovement from "@/models/StockMovement";

export const runtime = "nodejs";

const movementTypes = [
  "stock_in",
  "stock_out",
  "adjustment",
  "waste",
] as const;

type MovementType = (typeof movementTypes)[number];

export async function GET() {
  try {
    await connectToDatabase();

    const movements = await StockMovement.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      count: movements.length,
      movements,
    });
  } catch (error) {
    console.error("GET /api/stock-movements failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to retrieve stock movements." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { success: false, message: "A valid request body is required." },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;
  const { inventoryItemId, movementType, quantity, reason } = data;

  if (
    typeof inventoryItemId !== "string" ||
    !mongoose.isValidObjectId(inventoryItemId)
  ) {
    return NextResponse.json(
      { success: false, message: "A valid inventory item ID is required." },
      { status: 400 }
    );
  }

  if (
    typeof movementType !== "string" ||
    !movementTypes.includes(movementType as MovementType)
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid movement type." },
      { status: 400 }
    );
  }

  if (
    typeof quantity !== "number" ||
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    return NextResponse.json(
      { success: false, message: "Quantity must be greater than zero." },
      { status: 400 }
    );
  }

  if (typeof reason !== "string" || !reason.trim()) {
    return NextResponse.json(
      { success: false, message: "A reason is required." },
      { status: 400 }
    );
  }

  if (reason.trim().length > 300) {
    return NextResponse.json(
      { success: false, message: "Reason must be 300 characters or fewer." },
      { status: 400 }
    );
  }

  const type = movementType as MovementType;

  if (type === "adjustment" && data.newQuantity === undefined) {
    return NextResponse.json(
      {
        success: false,
        message: "An adjustment requires the intended newQuantity.",
      },
      { status: 400 }
    );
  }

  if (
    type === "adjustment" &&
    (typeof data.newQuantity !== "number" ||
      !Number.isFinite(data.newQuantity) ||
      data.newQuantity < 0)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "newQuantity must be a non-negative number.",
      },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const session = await mongoose.startSession();
    let createdMovement: unknown = null;

    try {
      await session.withTransaction(async () => {
        const item = await InventoryItem.findOne({
          _id: inventoryItemId,
          isActive: true,
        }).session(session);

        if (!item) {
          throw new Error("INVENTORY_ITEM_NOT_FOUND");
        }

        const previousQuantity = item.quantity;
        let newQuantity: number;

        switch (type) {
          case "stock_in":
            newQuantity = previousQuantity + quantity;
            break;
          case "stock_out":
          case "waste":
            newQuantity = previousQuantity - quantity;
            break;
          case "adjustment":
            newQuantity = data.newQuantity as number;
            break;
        }

        if (newQuantity < 0) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        item.quantity = newQuantity;
        await item.save({ session });

        const [movement] = await StockMovement.create(
          [
            {
              inventoryItemId: item._id,
              itemName: item.name,
              movementType: type,
              quantity:
                type === "adjustment"
                  ? Math.abs(newQuantity - previousQuantity)
                  : quantity,
              previousQuantity,
              newQuantity,
              reason: reason.trim(),
              referenceId:
                typeof data.referenceId === "string"
                  ? data.referenceId.trim()
                  : "",
              recordedBy: "system",
            },
          ],
          { session }
        );

        createdMovement = movement.toObject();
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inventory updated and movement recorded.",
        movement: createdMovement,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "INVENTORY_ITEM_NOT_FOUND") {
      return NextResponse.json(
        { success: false, message: "Active inventory item not found." },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json(
        { success: false, message: "This movement would make stock negative." },
        { status: 409 }
      );
    }

    console.error("POST /api/stock-movements failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to record the stock movement. Check that MongoDB supports transactions.",
      },
      { status: 500 }
    );
  }
}

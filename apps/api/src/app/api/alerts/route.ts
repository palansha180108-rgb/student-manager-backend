
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Alert from "@/models/Alert";

export const runtime = "nodejs";

const alertTypes = ["low_stock", "out_of_stock", "system"] as const;
const severities = ["info", "warning", "critical"] as const;

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const resolvedParam = searchParams.get("resolved");
    const limitParam = Number(searchParams.get("limit") ?? "100");

    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(Math.floor(limitParam), 1), 200)
      : 100;

    const filter: Record<string, unknown> = {};

    if (resolvedParam === "true") filter.isResolved = true;
    if (resolvedParam === "false") filter.isResolved = false;

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("GET /api/alerts failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to retrieve alerts." },
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
        { success: false, message: "A valid request body is required." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.type !== "string" ||
      !alertTypes.includes(data.type as (typeof alertTypes)[number])
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid alert type." },
        { status: 400 }
      );
    }

    if (
      typeof data.title !== "string" ||
      !data.title.trim() ||
      data.title.length > 150
    ) {
      return NextResponse.json(
        { success: false, message: "A title of up to 150 characters is required." },
        { status: 400 }
      );
    }

    if (
      typeof data.message !== "string" ||
      !data.message.trim() ||
      data.message.length > 500
    ) {
      return NextResponse.json(
        { success: false, message: "A message of up to 500 characters is required." },
        { status: 400 }
      );
    }

    const severity =
      data.severity === undefined ? "warning" : data.severity;

    if (
      typeof severity !== "string" ||
      !severities.includes(severity as (typeof severities)[number])
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid alert severity." },
        { status: 400 }
      );
    }

    let inventoryItemId: mongoose.Types.ObjectId | null = null;

    if (data.inventoryItemId !== undefined && data.inventoryItemId !== null) {
      if (
        typeof data.inventoryItemId !== "string" ||
        !mongoose.isValidObjectId(data.inventoryItemId)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid inventory item ID." },
          { status: 400 }
        );
      }

      inventoryItemId = new mongoose.Types.ObjectId(data.inventoryItemId);
    }

    await connectToDatabase();

    const alert = await Alert.create({
      inventoryItemId,
      type: data.type,
      title: data.title.trim(),
      message: data.message.trim(),
      severity,
    });

    return NextResponse.json(
      { success: true, alert },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/alerts failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create alert." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body: unknown = await request.json();

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

    if (
      typeof data.id !== "string" ||
      !mongoose.isValidObjectId(data.id)
    ) {
      return NextResponse.json(
        { success: false, message: "A valid alert ID is required." },
        { status: 400 }
      );
    }

    const updates: Record<string, boolean | Date | null> = {};

    if ("isRead" in data) {
      if (typeof data.isRead !== "boolean") {
        return NextResponse.json(
          { success: false, message: "isRead must be true or false." },
          { status: 400 }
        );
      }
      updates.isRead = data.isRead;
    }

    if ("isResolved" in data) {
      if (typeof data.isResolved !== "boolean") {
        return NextResponse.json(
          { success: false, message: "isResolved must be true or false." },
          { status: 400 }
        );
      }

      updates.isResolved = data.isResolved;
      updates.resolvedAt = data.isResolved ? new Date() : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "Provide isRead or isResolved to update." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const alert = await Alert.findByIdAndUpdate(data.id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!alert) {
      return NextResponse.json(
        { success: false, message: "Alert not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error("PATCH /api/alerts failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update alert." },
      { status: 500 }
    );
  }
}

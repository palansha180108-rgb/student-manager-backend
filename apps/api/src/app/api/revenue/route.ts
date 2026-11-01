
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "daily";

    if (!["daily", "weekly", "monthly"].includes(period)) {
      return NextResponse.json(
        {
          success: false,
          message: "Period must be daily, weekly, or monthly.",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    if (period === "daily") {
      start.setHours(0, 0, 0, 0);
      end.setTime(start.getTime());
      end.setDate(end.getDate() + 1);
    } else if (period === "weekly") {
      start.setHours(0, 0, 0, 0);
      const day = start.getDay();
      start.setDate(start.getDate() - ((day + 6) % 7));
      end.setTime(start.getTime());
      end.setDate(end.getDate() + 7);
    } else {
      start.setHours(0, 0, 0, 0);
      start.setDate(1);
      end.setTime(start.getTime());
      end.setMonth(end.getMonth() + 1);
    }

    await connectToDatabase();

    const result = await Order.aggregate([
      {
        $match: {
          status: "completed",
          paymentStatus: "paid",
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          grossRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const summary = result[0] ?? {
      totalOrders: 0,
      grossRevenue: 0,
    };

    const grossRevenue = Number(summary.grossRevenue ?? 0);

    return NextResponse.json({
      success: true,
      period,
      periodStart: start,
      periodEnd: end,
      totalOrders: summary.totalOrders ?? 0,
      grossRevenue,
      refunds: 0,
      netRevenue: grossRevenue,
      currency: "INR",
      note: "Refund tracking is not implemented yet.",
    });
  } catch (error) {
    console.error("GET /api/revenue failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to calculate revenue." },
      { status: 500 }
    );
  }
}

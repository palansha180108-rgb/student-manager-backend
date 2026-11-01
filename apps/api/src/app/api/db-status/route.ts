
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    const db = (await import("mongoose")).default.connection.db;

    if (!db) {
      throw new Error("MongoDB database is not selected");
    }

    const [menu, products, inventory, inventoryitems] =
      await Promise.all([
        db.collection("menu").countDocuments(),
        db.collection("products").countDocuments(),
        db.collection("inventory").countDocuments(),
        db.collection("inventoryitems").countDocuments(),
      ]);

    return NextResponse.json({
      status: "ok",
      database: db.databaseName,
      collections: {
        menu,
        products,
        inventory,
        inventoryitems,
      },
    });
  } catch (error) {
    console.error("Database diagnostic failed:", error);

    return NextResponse.json(
      { status: "error", message: "Database diagnostic failed." },
      { status: 500 }
    );
  }
}

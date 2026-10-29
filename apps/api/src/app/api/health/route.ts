
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "CCD Predict-a-Latte API is running",
  });
}

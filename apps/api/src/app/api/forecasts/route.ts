
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Forecast from "@/models/Forecast";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    const forecasts = await Forecast.find()
      .sort({ forecastDate: 1 })
      .limit(200)
      .lean();

    return NextResponse.json({
      success: true,
      count: forecasts.length,
      forecasts,
    });
  } catch (error) {
    console.error("GET /api/forecasts failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to retrieve forecasts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const mlServiceUrl = process.env.ML_SERVICE_URL;

  if (!mlServiceUrl) {
    return NextResponse.json(
      { success: false, message: "ML_SERVICE_URL is not configured." },
      { status: 503 }
    );
  }

  try {
    const body: unknown = await request.json().catch(() => ({}));

    const response = await fetch(
      `${mlServiceUrl.replace(/\/$/, "")}/forecasts`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      }
    );

    const result: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "The ML service could not generate forecasts.",
          details: result,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ML service returned forecasts.",
      result,
    });
  } catch (error) {
    console.error("POST /api/forecasts failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not reach the ML service. Check that it is running.",
      },
      { status: 503 }
    );
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  const student = {
    name: "Student",
    role: "student",
    message: "Student dashboard API is working!",
    features: [
      "View dashboard",
      "Track orders",
      "View recommendations",
    ],
  };

  return NextResponse.json(student);
}
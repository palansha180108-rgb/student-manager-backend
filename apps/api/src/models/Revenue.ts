
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const RevenueSchema = new Schema(
  {
    periodType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    periodStart: {
      type: Date,
      required: true,
      index: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    totalOrders: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    grossRevenue: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    refunds: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    netRevenue: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
      enum: ["INR"],
    },
    lastCalculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

RevenueSchema.index(
  { periodType: 1, periodStart: 1 },
  { unique: true }
);

export type RevenueDocument = InferSchemaType<typeof RevenueSchema>;

const Revenue =
  mongoose.models.Revenue || mongoose.model("Revenue", RevenueSchema);

export default Revenue;

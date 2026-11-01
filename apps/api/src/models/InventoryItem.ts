
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const InventoryItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 5,
    },
    costPerUnit: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export type InventoryItemDocument =
  InferSchemaType<typeof InventoryItemSchema>;

const InventoryItem =
  mongoose.models.InventoryItem ||
  mongoose.model("InventoryItem", InventoryItemSchema, "inventory");

export default InventoryItem;


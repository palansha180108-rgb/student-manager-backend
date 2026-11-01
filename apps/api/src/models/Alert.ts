
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AlertSchema = new Schema(
  {
    inventoryItemId: {
      type: Schema.Types.ObjectId,
      ref: "InventoryItem",
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ["low_stock", "out_of_stock", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "warning",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
      index: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

AlertSchema.index({ isResolved: 1, createdAt: -1 });

export type AlertDocument = InferSchemaType<typeof AlertSchema>;

const Alert =
  mongoose.models.Alert || mongoose.model("Alert", AlertSchema);

export default Alert;

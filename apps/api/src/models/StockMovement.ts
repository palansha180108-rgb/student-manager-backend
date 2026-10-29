
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const StockMovementSchema = new Schema(
  {
    inventoryItemId: {
      type: Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
      index: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    movementType: {
      type: String,
      enum: ["stock_in", "stock_out", "adjustment", "waste"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.001,
    },
    previousQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    newQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    referenceId: {
      type: String,
      default: "",
      trim: true,
    },
    recordedBy: {
      type: String,
      default: "system",
      trim: true,
    },
  },
  { timestamps: true }
);

StockMovementSchema.index({ createdAt: -1 });

export type StockMovementDocument = InferSchemaType<
  typeof StockMovementSchema
>;

const StockMovement =
  mongoose.models.StockMovement ||
  mongoose.model("StockMovement", StockMovementSchema);

export default StockMovement;

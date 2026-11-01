import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SaleSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

export type SaleDocument = InferSchemaType<typeof SaleSchema>;

const Sale =
  mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

export default Sale;

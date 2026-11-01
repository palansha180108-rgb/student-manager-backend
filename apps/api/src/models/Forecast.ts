
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ForecastSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    forecastDate: {
      type: Date,
      required: true,
      index: true,
    },
    predictedDemand: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: "items",
      trim: true,
    },
    modelName: {
      type: String,
      required: true,
      trim: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

ForecastSchema.index({ productId: 1, forecastDate: 1 });

export type ForecastDocument = InferSchemaType<typeof ForecastSchema>;

const Forecast =
  mongoose.models.Forecast || mongoose.model("Forecast", ForecastSchema);

export default Forecast;

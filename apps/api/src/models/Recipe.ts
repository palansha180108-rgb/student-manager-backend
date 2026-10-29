
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const RecipeIngredientSchema = new Schema(
  {
    inventoryItemId: {
      type: Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
    },
    ingredientName: {
      type: String,
      required: true,
      trim: true,
    },
    quantityPerServing: {
      type: Number,
      required: true,
      min: 0.000001,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const RecipeSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: [RecipeIngredientSchema],
      required: true,
      validate: {
        validator: (ingredients: unknown[]) => ingredients.length > 0,
        message: "A recipe must contain at least one ingredient.",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isProvisional: {
  type: Boolean,
  default: true,
},
  },
  { timestamps: true }
);

export type RecipeDocument = InferSchemaType<typeof RecipeSchema>;

const Recipe =
  mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);

export default Recipe;

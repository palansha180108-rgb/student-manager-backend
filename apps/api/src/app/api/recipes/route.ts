
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import InventoryItem from "@/models/InventoryItem";
import Recipe from "@/models/Recipe";

export const runtime = "nodejs";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Retrieve saved recipes.
export async function GET() {
  try {
    await connectToDatabase();

    const recipes = await Recipe.find()
      .sort({ productName: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    console.error("GET /api/recipes failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to retrieve recipes." },
      { status: 500 }
    );
  }
}

// Create a recipe for an existing menu product.
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);

    if (!isObject(body)) {
      return NextResponse.json(
        { success: false, message: "A valid recipe object is required." },
        { status: 400 }
      );
    }

    const { productId, ingredients } = body;

    if (
      typeof productId !== "string" ||
      !mongoose.isValidObjectId(productId)
    ) {
      return NextResponse.json(
        { success: false, message: "A valid product ID is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { success: false, message: "A recipe must contain at least one ingredient." },
        { status: 400 }
      );
    }

    const requestedIngredients: {
      inventoryItemId: string;
      quantityPerServing: number;
    }[] = [];

    const seenIds = new Set<string>();

    for (const ingredient of ingredients) {
      if (
        !isObject(ingredient) ||
        typeof ingredient.inventoryItemId !== "string" ||
        !mongoose.isValidObjectId(ingredient.inventoryItemId) ||
        typeof ingredient.quantityPerServing !== "number" ||
        !Number.isFinite(ingredient.quantityPerServing) ||
        ingredient.quantityPerServing <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Each ingredient needs a valid inventory item ID and a positive quantity per serving.",
          },
          { status: 400 }
        );
      }

      const id = ingredient.inventoryItemId;

      if (seenIds.has(id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Each inventory item may appear only once in a recipe.",
          },
          { status: 400 }
        );
      }

      seenIds.add(id);
      requestedIngredients.push({
        inventoryItemId: id,
        quantityPerServing: ingredient.quantityPerServing,
      });
    }

    await connectToDatabase();

    const product = await Product.findById(productId).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Menu product not found." },
        { status: 404 }
      );
    }

    const inventoryItems = await InventoryItem.find({
      _id: {
        $in: requestedIngredients.map((ingredient) => ingredient.inventoryItemId),
      },
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    }).lean();

    if (inventoryItems.length !== requestedIngredients.length) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more inventory items were not found or are inactive.",
        },
        { status: 400 }
      );
    }

    const inventoryById = new Map(
      inventoryItems.map((item) => [item._id.toString(), item])
    );

    const recipeIngredients = requestedIngredients.map((ingredient) => {
      const item = inventoryById.get(ingredient.inventoryItemId)!;

      return {
        inventoryItemId: item._id,
        ingredientName: item.name,
        quantityPerServing: ingredient.quantityPerServing,
        unit: item.unit,
      };
    });

    const recipe = await Recipe.create({
      productId: product._id,
      productName: product.name,
      ingredients: recipeIngredients,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Recipe created successfully.",
        recipe,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A recipe already exists for this product.",
        },
        { status: 409 }
      );
    }

    console.error("POST /api/recipes failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create recipe." },
      { status: 500 }
    );
  }
}

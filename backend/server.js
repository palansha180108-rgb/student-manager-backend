
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let db;

// Check backend
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CCD backend is running",
  });
});

// Check database
app.get("/api/db-status", async (req, res) => {
  try {
    await db.command({ ping: 1 });
    res.json({
      status: "ok",
      message: "MongoDB connected successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database check failed",
    });
  }
});

// Get all menu items
app.get("/api/menu", async (req, res) => {
  try {
    const menuItems = await db.collection("menu").find({}).toArray();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch menu items",
    });
  }
});

// Add one menu item
app.post("/api/menu", async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return res.status(400).json({
        message: "Enter a valid name, price, and category",
      });
    }

    const result = await db.collection("menu").insertOne({
      name: name.trim(),
      price,
      category: category.trim(),
    });

    res.status(201).json({
      message: "Menu item added successfully",
      _id: result.insertedId,
      name: name.trim(),
      price,
      category: category.trim(),
    });
  } catch (error) {
    console.error("Add menu item error:", error.message);
    res.status(500).json({
      message: "Could not add menu item",
    });
  }
});
// Update menu item availability
app.patch("/api/menu/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");
    const { status } = req.body;

    if (!["Available", "Unavailable"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Available or Unavailable",
      });
    }

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid menu item ID",
      });
    }

    const result = await db.collection("menu").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.json({
      message: "Menu availability updated successfully",
      status,
    });
  } catch (error) {
    console.error("Update menu availability error:", error.message);
    res.status(500).json({
      message: "Could not update menu availability",
    });
  }
});
 // Add 18 menu items in one request
app.post("/api/menu/bulk", async (req, res) => {
  try {
    const items = [
      { name: "Americano", price: 110, category: "Coffee" },
      { name: "Filter Coffee", price: 80, category: "Coffee" },
      { name: "Cafe Frappe", price: 180, category: "Coffee" },
      { name: "Iced Americano", price: 140, category: "Coffee" },
      { name: "Vanilla Latte", price: 180, category: "Coffee" },
      { name: "Caramel Latte", price: 190, category: "Coffee" },
      { name: "Hot Chocolate", price: 160, category: "Beverages" },
      { name: "Masala Tea", price: 60, category: "Tea" },
      { name: "Green Tea", price: 70, category: "Tea" },
      { name: "Lemon Iced Tea", price: 120, category: "Beverages" },
      { name: "Chocolate Muffin", price: 90, category: "Bakery" },
      { name: "Blueberry Muffin", price: 110, category: "Bakery" },
      { name: "Chocolate Brownie", price: 120, category: "Bakery" },
      { name: "Chocolate Cake", price: 150, category: "Bakery" },
      { name: "Veg Burger", price: 160, category: "Food" },
      { name: "Cheese Sandwich", price: 170, category: "Food" },
      { name: "Garlic Bread", price: 130, category: "Food" },
      { name: "French Fries", price: 120, category: "Food" },
    ];

    const collection = db.collection("menu");

    for (const item of items) {
      await collection.updateOne(
        { name: item.name },
        { $setOnInsert: item },
        { upsert: true }
      );
    }

    const total = await collection.countDocuments();

    res.json({
      message: "Menu items processed successfully",
      totalItems: total,
    });
  } catch (error) {
    console.error("Bulk menu error:", error.message);
    res.status(500).json({
      message: "Could not add menu items",
    });
  }
});

const defaultInventory = [
  { name: "Coffee Beans", unit: "kg", stock: 12, minimum: 5 },
  { name: "Milk", unit: "litres", stock: 8, minimum: 10 },
  { name: "Chocolate Syrup", unit: "litres", stock: 4, minimum: 3 },
  { name: "Sugar", unit: "kg", stock: 15, minimum: 5 },
  { name: "Whipped Cream", unit: "litres", stock: 2, minimum: 5 },
  { name: "Tea Leaves", unit: "kg", stock: 7, minimum: 3 },
  { name: "Bread", unit: "packs", stock: 9, minimum: 4 },
  { name: "Cheese", unit: "kg", stock: 3, minimum: 4 },
];

// Get inventory; initialize defaults if collection is empty
app.get("/api/inventory", async (req, res) => {
  try {
    const collection = db.collection("inventory");
    let items = await collection.find({}).toArray();

    if (items.length === 0) {
      await collection.insertMany(defaultInventory);
      items = await collection.find({}).toArray();
    }

    res.json(items);
  } catch (error) {
    console.error("Get inventory error:", error.message);
    res.status(500).json({ message: "Could not fetch inventory" });
  }
});

// Update an ingredient's stock quantity
app.patch("/api/inventory/:name", async (req, res) => {
  try {
    const { stock } = req.body;

    if (
      typeof stock !== "number" ||
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        message: "Stock must be a non-negative number",
      });
    }

    const result = await db.collection("inventory").updateOne(
      { name: req.params.name },
      { $set: { stock } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

    const item = await db.collection("inventory").findOne({
      name: req.params.name,
    });

    res.json(item);
  } catch (error) {
    console.error("Update inventory error:", error.message);
    res.status(500).json({ message: "Could not update inventory" });
  }
});

// Connect database, then start backend
async function startServer() {
  try {
    await client.connect();
    db = client.db("ccd_predict_latte");

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();

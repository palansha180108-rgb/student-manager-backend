
"use client";

import { useEffect, useMemo, useState } from "react";
import "./dashboard.css";

type MenuItem = {
  id: string | number;
  name: string;
  category: string;
  price: number;
  sales: number;
  status: "Available" | "Unavailable";
};

type InventoryItem = {
  _id?: string;
  name: string;
  unit: string;
  stock: number;
  minimum: number;
};

type Sale = {
  _id?: string;
  menuItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  recordedAt: string;
};

const initialInventory: InventoryItem[] = [
  { name: "Coffee Beans", unit: "kg", stock: 12, minimum: 5 },
  { name: "Milk", unit: "litres", stock: 8, minimum: 10 },
  { name: "Chocolate Syrup", unit: "litres", stock: 4, minimum: 3 },
  { name: "Sugar", unit: "kg", stock: 15, minimum: 5 },
  { name: "Whipped Cream", unit: "litres", stock: 2, minimum: 5 },
  { name: "Tea Leaves", unit: "kg", stock: 7, minimum: 3 },
  { name: "Bread", unit: "packs", stock: 9, minimum: 4 },
  { name: "Cheese", unit: "kg", stock: 3, minimum: 4 },
];

const navItems = [
  { name: "Overview", icon: "▦" },
  { name: "Menu", icon: "☕" },
  { name: "Inventory", icon: "▤" },
  { name: "AI Predictions", icon: "✧" },
  { name: "Reports", icon: "▥" },
];

export default function ManagerDashboard() {
  const [activePage, setActivePage] = useState("Overview");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
const [inventoryLoading, setInventoryLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editingStock, setEditingStock] = useState<number | null>(null);
  const [newStock, setNewStock] = useState("");
  const [notice, setNotice] = useState("");
  
const [showAddForm, setShowAddForm] = useState(false);
const [newItemName, setNewItemName] = useState("");
const [newItemPrice, setNewItemPrice] = useState("");
const [newItemCategory, setNewItemCategory] = useState("Coffee");
const [savingMenuItem, setSavingMenuItem] = useState(false);
const [showSaleForm, setShowSaleForm] = useState(false);
const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
const [saleQuantity, setSaleQuantity] = useState("1");
const [savingSale, setSavingSale] = useState(false);
const [sales, setSales] = useState<Sale[]>([]);
const [salesLoading, setSalesLoading] = useState(true);
  useEffect(() => {
  async function loadMenu() {
    try {
      const response = await fetch("http://localhost:3002/api/products");
      const data = await response.json();

      if (!response.ok || !data.success || !Array.isArray(data.products)) {
        throw new Error(data.message || "Failed to load menu.");
      }

      setMenu(
        data.products.map(
          (item: {
            _id: string;
            name: string;
            category: string;
            price: number;
            isAvailable: boolean;
            sales?: number;
          }) => ({
            id: item._id,
            name: item.name,
            category: item.category,
            price: item.price,
            sales: item.sales ?? 0,
            status: item.isAvailable ? "Available" : "Unavailable",
          })
        )
      );
    } catch (error) {
      console.error("Could not load menu:", error);
      setNotice("Could not load menu from the backend.");
    } finally {
      setMenuLoading(false);
    }
  }

  void loadMenu();
}, []);

useEffect(() => {
  async function loadSales() {
    try {
      const response = await fetch("http://localhost:3002/api/sales");
      const data = await response.json();

      if (!response.ok || !data.success || !Array.isArray(data.sales)) {
        throw new Error(data.message || "Failed to load sales.");
      }

      const savedSales: Sale[] = data.sales.map(
  (sale: {
    _id: string;
    menuItemId?: string | { _id: string };
    productId?: string | { _id: string };
    itemName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    recordedAt: string;
  }) => {
    const savedProductId = sale.productId ?? sale.menuItemId;

    return {
      _id: sale._id,
      menuItemId:
        typeof savedProductId === "string"
          ? savedProductId
          : savedProductId?._id ?? "",
      itemName: sale.itemName,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      total: sale.total,
      recordedAt: sale.recordedAt,
    };
  }
);



      setSales(savedSales);
    } catch (error) {
      console.error("Could not load sales:", error);
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not load sales from the backend."
      );
    } finally {
      setSalesLoading(false);
    }
  }

  void loadSales();
}, []);


  useEffect(() => {
  async function loadInventory() {
    try {
      const response = await fetch("http://localhost:3002/api/inventory");
      const data = await response.json();

      if (!response.ok || !data.success || !Array.isArray(data.items)) {
        throw new Error(data.message || "Failed to load inventory.");
      }

      setInventory(
        data.items.map(
          (item: {
            _id: string;
            name: string;
            unit: string;
            quantity: number;
            lowStockThreshold: number;
          }) => ({
            _id: item._id,
            name: item.name,
            unit: item.unit,
            stock: item.quantity,
            minimum: item.lowStockThreshold,
          })
        )
      );
    } catch (error) {
      console.error("Could not load inventory:", error);
      setNotice("Could not load inventory from the backend.");
    } finally {
      setInventoryLoading(false);
    }
  }

  void loadInventory();
}, []);

  const lowStock = inventory.filter(
    (item) => item.stock < item.minimum
  );
  const availableMenuCount = menu.filter(
  (item) => item.status === "Available"
).length;

const unavailableMenuCount = menu.length - availableMenuCount;

const totalRecordedSales = menu.reduce(
  (sum, item) => sum + item.sales,
  0
);

const totalRevenue = sales.reduce(
  (sum, sale) => sum + Number(sale.total || 0),
  0
);

const transactionCount = sales.length;

const salesByItem = sales.reduce<Record<string, number>>(
  (totals, sale) => {
    totals[sale.itemName] =
      (totals[sale.itemName] || 0) + sale.quantity;
    return totals;
  },
  {}
);

const bestSellingEntry = Object.entries(salesByItem).sort(
  (a, b) => b[1] - a[1]
)[0];

const bestSellingItem = bestSellingEntry?.[0] ?? "No sales yet";
const bestSellingQuantity = bestSellingEntry?.[1] ?? 0;

const lowStockCount = lowStock.length;

const healthyStockCount = inventory.length - lowStockCount;
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [menu, search, category]);

  function exportMenu() {
    const headings = [
      "ID",
      "Name",
      "Category",
      "Price",
      "Sales",
      "Status",
    ];

    const rows = menu.map((item) => [
      item.id,
      item.name,
      item.category,
      item.price,
      item.sales,
      item.status,
    ]);

    const csv = [headings, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const file = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ccd-menu-report.csv";
    link.click();

    URL.revokeObjectURL(url);
    setNotice("Menu report exported successfully.");
  }

  

async function updateStock(index: number) {
  const quantity = Number(newStock);
  const item = inventory[index] as InventoryItem & { _id?: string };

  if (
    !item ||
    !item._id ||
    newStock.trim() === "" ||
    !Number.isFinite(quantity) ||
    quantity < 0
  ) {
    setNotice("Enter a valid stock quantity.");
    return;
  }

  try {
    setNotice("");

    const response = await fetch(
      `http://localhost:3002/api/inventory/${encodeURIComponent(item._id)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Could not save stock quantity."
      );
    }

    setInventory((current) =>
      current.map((currentItem) =>
        currentItem.name === item.name
          ? { ...currentItem, stock: data.item.quantity }
          : currentItem
      )
    );

    setEditingStock(null);
    setNewStock("");
    setNotice("Inventory quantity saved to MongoDB.");
  } catch (error) {
    setNotice(
      error instanceof Error
        ? error.message
        : "Could not save inventory changes."
    );
  }
}



  
async function toggleAvailability(id: string | number) {
  const item = menu.find((current) => current.id === id);
  if (!item) return;

  const isAvailable = item.status !== "Available";

  try {
    setNotice("");

    const response = await fetch(
      `http://localhost:3002/api/products/${encodeURIComponent(String(id))}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not update availability.");
    }

    setMenu((current) =>
      current.map((currentItem) =>
        currentItem.id === id
          ? {
              ...currentItem,
              status: data.product.isAvailable
                ? "Available"
                : "Unavailable",
            }
          : currentItem
      )
    );

    setNotice("Menu availability saved to MongoDB.");
  } catch (error) {
    setNotice(
      error instanceof Error ? error.message : "Could not update availability."
    );
  }
}

  
async function addMenuItem() {
  const name = newItemName.trim();
  const price = Number(newItemPrice);
  const itemCategory = newItemCategory.trim();

  if (
    !name ||
    newItemPrice.trim() === "" ||
    !itemCategory ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    setNotice("Enter a valid name, category, and price.");
    return;
  }

  try {
    setSavingMenuItem(true);
    setNotice("");

    const response = await fetch("http://localhost:3002/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price,
        category: itemCategory,
        isAvailable: true,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not save the menu item.");
    }

    const savedItem = data.product;

    setMenu((current) => [
      ...current,
      {
        id: savedItem._id,
        name: savedItem.name,
        price: savedItem.price,
        category: savedItem.category,
        sales: 0,
        status: savedItem.isAvailable ? "Available" : "Unavailable",
      },
    ]);

    setNewItemName("");
    setNewItemPrice("");
    setNewItemCategory("Coffee");
    setShowAddForm(false);
    setNotice("Menu item added successfully!");
  } catch (error) {
    setNotice(
      error instanceof Error ? error.message : "Could not add menu item."
    );
  } finally {
    setSavingMenuItem(false);
  }
}
async function recordSale() {
  const quantity = Number(saleQuantity);
  const selectedItem = menu.find(
    (item) => String(item.id) === selectedMenuItemId
  );

  if (!selectedItem) {
    setNotice("Please select a menu item.");
    return;
  }

  if (
    selectedItem.status !== "Available" ||
    !Number.isSafeInteger(quantity) ||
    quantity <= 0
  ) {
    setNotice("Select an available item and enter a positive whole quantity.");
    return;
  }

  try {
    setSavingSale(true);
    setNotice("");

    const response = await fetch("http://localhost:3002/api/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: String(selectedItem.id),
        quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not record sale.");
    }

    const salesResponse = await fetch("http://localhost:3002/api/sales");
    const salesData = await salesResponse.json();

    if (
      !salesResponse.ok ||
      !salesData.success ||
      !Array.isArray(salesData.sales)
    ) {
      throw new Error("Sale was saved, but the sales list could not be refreshed. Reload the dashboard.");
    }

    
setSales(
  salesData.sales.map(
    (sale: {
      _id: string;
      productId?: string | { _id: string };
      menuItemId?: string | { _id: string };
      itemName: string;
      quantity: number;
      unitPrice: number;
      total: number;
      recordedAt: string;
    }) => {
      const savedProductId = sale.productId ?? sale.menuItemId;

      return {
        _id: sale._id,
        menuItemId:
          typeof savedProductId === "string"
            ? savedProductId
            : savedProductId?._id ?? "",
        itemName: sale.itemName,
        quantity: sale.quantity,
        unitPrice: sale.unitPrice,
        total: sale.total,
        recordedAt: sale.recordedAt,
      };
    }
  )
);


    setMenu((currentMenu) =>
      currentMenu.map((item) =>
        String(item.id) === String(selectedItem.id)
          ? { ...item, sales: item.sales + quantity }
          : item
      )
    );

    setSaleQuantity("1");
    setShowSaleForm(false);
    setNotice(`Sale recorded: ${quantity} × ${selectedItem.name}.`);
  } catch (error) {
    setNotice(
      error instanceof Error ? error.message : "Could not record sale."
    );
  } finally {
    setSavingSale(false);
  }
}function renderMenuTable(items: MenuItem[]) {
    return (
      <div className="table-wrap">
      
        <table>
          <thead>
            <tr>
              <th>ITEM</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>RECORDED SALES</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="product-cell">
                    <span className="product-icon">☕</span>
                    <div>
                      <strong>{item.name}</strong>
                      <small>
                        SKU-{String(item.id).slice(-6)}
                      </small>
                    </div>
                  </div>
                </td>

                <td>{item.category}</td>
                <td className="price">₹{item.price}</td>

                <td>
                  {item.sales} <span className="muted">units</span>
                </td>

                <td>
                  <span
                    className={`status ${
                      item.status === "Available" ? "good" : "bad"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <button
                    className="text-button"
                    onClick={() => toggleAvailability(item.id)}
                  >
                    {item.status === "Available" ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="empty-state">
            {menuLoading
              ? "Loading menu items..."
              : "No menu items match your search."}
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">☕</div>
          <div>
            <h2>
              CCD <span>Manager</span>
            </h2>
            <p>Predict-a-Latte</p>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-link ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item.name);
                setNotice("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}

              {item.name === "Inventory" && lowStock.length > 0 && (
                <span className="nav-count">{lowStock.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">✦</span>
            <strong>Smart inventory</strong>
            <p>Monitor stock and prepare for demand.</p>
          </div>

          <div className="profile">
            <div className="avatar">M</div>
            <div className="profile-info">
              <strong>Manager</strong>
              <span>CCD Campus Outlet</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {activePage}
          </div>

          <div className="topbar-right">
            <span className="live-dot" />
            <span className="topbar-label">Campus Outlet</span>
            <div className="top-avatar">M</div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">CAFÉ OPERATIONS</div>
              <h1>
                {activePage === "Overview"
                  ? "Manager Dashboard"
                  : activePage}
              </h1>
              <p>
                Manage your menu, monitor inventory, and plan ahead.
              </p>
            </div>

            <button className="primary-button" onClick={exportMenu}>
              <span>⇩</span> Export menu
            </button>
          </div>

          {menuLoading && (
            <div className="notice" role="status">
              Loading menu from the database...
            </div>
          )}

          {notice && (
            <div className="notice" role="status">
              {notice}
              <button
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}

          {activePage === "Overview" && (
            <>
              <div className="welcome-banner">
                <div>
                  <span className="banner-tag">
                    YOUR DAILY SNAPSHOT
                  </span>
                  <h2>Everything under control.</h2>
                  <p>
                    Review your menu and stock status from one place.
                  </p>
                  <button
                    className="banner-button"
                    onClick={() => setActivePage("Inventory")}
                  >
                    Review inventory <span>→</span>
                  </button>
                </div>

                <div className="banner-art" aria-hidden="true">
                  <span>☕</span>
                  <i>✦</i>
                  <b>✧</b>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Total menu items</span>
                    <span className="stat-icon purple">☕</span>
                  </div>
                  <strong className="stat-value">{menu.length}</strong>
                  <span className="stat-foot">Across all categories</span>
                </div>

<div className="stat-card">
  <div className="stat-top">
    <span>Total ingredients</span>
    <span className="stat-icon blue">▤</span>
  </div>
  <strong className="stat-value">
    {inventory.length}
  </strong>
  <span className="stat-foot">
    Tracked inventory records
  </span>
</div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Available items</span>
                    <span className="stat-icon green">✓</span>
                  </div>
                  <strong className="stat-value">
                    {menu.filter((item) => item.status === "Available").length}
                  </strong>
                  <span className="stat-foot">Ready to serve</span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Low-stock ingredients</span>
                    <span className="stat-icon orange">!</span>
                  </div>
                  <strong className="stat-value">{lowStock.length}</strong>
                  <span className="stat-foot">
                    {lowStock.length
                      ? "Restocking may be needed"
                      : "All stock levels look good"}
                  </span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Recorded sales</span>
                    <span className="stat-icon blue">↗</span>
                  </div>
                  <strong className="stat-value">
                    {menu
                      .reduce((sum, item) => sum + item.sales, 0)
                      .toLocaleString("en-IN")}
                  </strong>
                  <span className="stat-foot">
                    Recorded units across menu items
                  </span>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Record a sale</h2>
                  <p>Record units sold to update the sales total.</p>
                </div>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() =>
                    setShowSaleForm((current) => !current)
                  }
                >
                  {showSaleForm ? "Cancel" : "+ Record Sale"}
                </button>
              </div>

              {showSaleForm && (
                <form
                  className="toolbar"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void recordSale();
                  }}
                >
                  <select
                    value={selectedMenuItemId}
                    onChange={(event) =>
                      setSelectedMenuItemId(event.target.value)
                    }
                    aria-label="Select menu item"
                    required
                  >
                    <option value="">Select menu item</option>
                    {menu
                      .filter(
                        (item) => item.status === "Available"
                      )
                      .map((item) => (
                        <option
                          key={item.id}
                          value={String(item.id)}
                        >
                          {item.name} — ₹{item.price}
                        </option>
                      ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={saleQuantity}
                    onChange={(event) =>
                      setSaleQuantity(event.target.value)
                    }
                    placeholder="Quantity sold"
                    aria-label="Quantity sold"
                    required
                  />

                  <button
                    className="primary-button"
                    type="submit"
                    disabled={savingSale || menuLoading}
                  >
                    {savingSale ? "Recording..." : "Save Sale"}
                  </button>
                </form>
              )}

              <div className="section-heading">
                <div>
                  <h2>Menu overview</h2>
                  <p>Popular items and current availability</p>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => setActivePage("Menu")}
                >
                  View all items →
                </button>
              </div>

              {renderMenuTable(menu.slice(0, 6))}

              <div className="section-heading inventory-heading">
                <div>
                  <h2>Inventory alerts</h2>
                  <p>Ingredients that need your attention</p>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => setActivePage("Inventory")}
                >
                  Manage stock →
                </button>
              </div>

              <div className="alert-list">
                {lowStock.length === 0 ? (
                  <p className="empty-state">
                    No low-stock alerts right now.
                  </p>
                ) : (
                  lowStock.map((item) => (
                    <div className="alert-row" key={item.name}>
                      <div className="alert-symbol">!</div>
                      <div className="alert-info">
                        <strong>{item.name}</strong>
                        <span>Below minimum stock level</span>
                      </div>
                      <div className="alert-quantity">
                        <strong>
                          {item.stock} {item.unit}
                        </strong>
                        <span>
                          Minimum: {item.minimum} {item.unit}
                        </span>
                      </div>
                      <span className="status warning">Restock</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activePage === "Menu" && (
            <>
              <div className="menu-summary">
                <div>
                  <strong>{menu.length}</strong>
                  <span>Total items</span>
                </div>
                <div>
                  <strong>
                    {new Set(menu.map((item) => item.category)).size}
                  </strong>
                  <span>Categories</span>
                </div>
                <div>
                  <strong>
                    {menu.filter((item) => item.status === "Available").length}
                  </strong>
                  <span>Available</span>
                </div>
              </div>

              
<div className="section-heading menu-heading">
  <div>
    <h2>All menu items</h2>
    <p>Search, filter, and manage your menu.</p>
  </div>

  <button
    className="primary-button"
    onClick={() => setShowAddForm((current) => !current)}
  >
    + Add Menu Item
  </button>
</div>

{showAddForm && (
  <form
    className="toolbar"
    onSubmit={(event) => {
      event.preventDefault();
      void addMenuItem();
    }}
  >
    <input
      value={newItemName}
      onChange={(event) => setNewItemName(event.target.value)}
      placeholder="Item name"
      required
    />

    <input
      type="number"
      min="0.01"
      step="0.01"
      value={newItemPrice}
      onChange={(event) => setNewItemPrice(event.target.value)}
      placeholder="Price (₹)"
      required
    />

    <select
      value={newItemCategory}
      onChange={(event) => setNewItemCategory(event.target.value)}
      aria-label="New item category"
    >
      <option value="Coffee">Coffee</option>
      <option value="Cold Beverages">Cold Beverages</option>
      <option value="Food">Food</option>
      <option value="Desserts">Desserts</option>
    </select>

    <button
      className="primary-button"
      type="submit"
      disabled={savingMenuItem}
    >
      {savingMenuItem ? "Saving..." : "Save Item"}
    </button>

    <button
      className="secondary-button"
      type="button"
      onClick={() => setShowAddForm(false)}
    >
      Cancel
    </button>
  </form>
)}


              <div className="toolbar">
                <div className="search-box">
                  <span>⌕</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search menu items..."
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label="Filter by category"
                >
                  <option value="All">All categories</option>
                  {[...new Set(menu.map((item) => item.category))].map(
                    (cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )
                  )}
                </select>

                <button
                  className="secondary-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Reset filters
                </button>
              </div>

              {renderMenuTable(filteredMenu)}

              <p className="table-footer">
                Showing {filteredMenu.length} of {menu.length} menu items.
              </p>
            </>
          )}

          {activePage === "Inventory" && (
            <>
              <div className="stats-grid inventory-stats">
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Tracked ingredients</span>
                    <span className="stat-icon purple">▤</span>
                  </div>
                  <strong className="stat-value">{inventory.length}</strong>
                  <span className="stat-foot">Inventory records</span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Need restocking</span>
                    <span className="stat-icon orange">!</span>
                  </div>
                  <strong className="stat-value">{lowStock.length}</strong>
                  <span className="stat-foot">Below minimum level</span>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Stock healthy</span>
                    <span className="stat-icon green">✓</span>
                  </div>
                  <strong className="stat-value">
                    {inventory.length - lowStock.length}
                  </strong>
                  <span className="stat-foot">At or above minimum</span>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Ingredient inventory</h2>
                  <p>
                    Update quantities and track minimum stock levels.
                  </p>
                </div>
              </div>
{inventoryLoading && (
  <p className="notice">Loading inventory from MongoDB...</p>
)}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>INGREDIENT</th>
                      <th>CURRENT STOCK</th>
                      <th>MINIMUM STOCK</th>
                      <th>STOCK LEVEL</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {inventory.map((item, index) => {
                      const isLow = item.stock < item.minimum;
                      const percent = Math.min(
                        100,
                        (item.stock / Math.max(item.minimum * 2, 1)) * 100
                      );

                      return (
                        <tr key={item.name}>
                          <td>
                            <strong>{item.name}</strong>
                          </td>

                          <td>
                            {editingStock === index ? (
                              <input
                                className="stock-input"
                                type="number"
                                min="0"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                              />
                            ) : (
                              `${item.stock} ${item.unit}`
                            )}
                          </td>

                          <td>
                            {item.minimum} {item.unit}
                          </td>

                          <td>
                            <div className="stock-meter">
                              <div
                                className={`stock-meter-fill ${
                                  isLow ? "fill-low" : ""
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </td>

                          <td>
                            <span
                              className={`status ${
                                isLow ? "bad" : "good"
                              }`}
                            >
                              {isLow ? "Low stock" : "In stock"}
                            </span>
                          </td>

                          <td>
                            {editingStock === index ? (
                              <>
                                <button
                                  className="text-button"
                                  onClick={() => updateStock(index)}
                                >
                                  Save
                                </button>
                                {" "}
                                <button
                                  className="text-button muted"
                                  onClick={() => {
                                    setEditingStock(null);
                                    setNewStock("");
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                className="text-button"
                                onClick={() => {
                                  setEditingStock(index);
                                  setNewStock(String(item.stock));
                                }}
                              >
                                Update
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              
<p className="table-footer">
  Inventory records are loaded from MongoDB. Stock updates are saved to the database.
</p>

<div className="section-heading inventory-heading">
  <div>
    <h2>Restocking Recommendations</h2>
    <p>
      Ingredients below their minimum stock level need attention.
    </p>
  </div>
</div>

<div className="table-wrap">
  <table>
    <thead>
      <tr>
        <th>INGREDIENT</th>
        <th>CURRENT STOCK</th>
        <th>MINIMUM STOCK</th>
        <th>RESTOCK NEEDED</th>
      </tr>
    </thead>
    <tbody>
      {lowStock.map((item) => (
        <tr key={item.name}>
          <td>
            <strong>{item.name}</strong>
          </td>
          <td>
            {item.stock} {item.unit}
          </td>
          <td>
            {item.minimum} {item.unit}
          </td>
          <td>
            <span className="status bad">
              +{item.minimum - item.stock} {item.unit}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {lowStock.length === 0 && (
    <div className="empty-state">
      All ingredients meet their minimum stock levels.
      No restocking is currently needed.
    </div>
  )}
</div>

            </>
          )}

          {activePage === "AI Predictions" && (
            <>
              <div className="prediction-banner">
                <span className="prediction-star">✧</span>
                <div>
                  <span className="banner-tag">PREDICT-A-LATTE</span>
                  <h2>Demand forecasting</h2>
                  <p>
                    This section is ready for your team's AI/ML prediction API.
                  </p>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Illustrative demand forecast</h2>
                  <p>
                    Example estimates only — not generated by a connected AI
                    model.
                  </p>
                </div>
              </div>

              <div className="prediction-grid">
                {[
                  {
                    name: "Cold Coffee",
                    demand: 88,
                    level: "High demand",
                    note: "Consider checking milk and coffee stock.",
                  },
                  {
                    name: "Cappuccino",
                    demand: 74,
                    level: "High demand",
                    note: "Monitor coffee bean availability.",
                  },
                  {
                    name: "French Fries",
                    demand: 68,
                    level: "Moderate demand",
                    note: "Review potato stock before busy periods.",
                  },
                  {
                    name: "Cafe Latte",
                    demand: 62,
                    level: "Moderate demand",
                    note: "Keep milk quantities updated.",
                  },
                ].map((item) => (
                  <div className="prediction-card" key={item.name}>
                    <div className="prediction-card-top">
                      <span className="product-icon">✧</span>
                      <span className="status prediction-status">
                        {item.level}
                      </span>
                    </div>

                    <h3>{item.name}</h3>
                    <p>{item.note}</p>

                    <div className="prediction-meter">
                      <div style={{ width: `${item.demand}%` }} />
                    </div>

                    <div className="prediction-number">
                      <strong>{item.demand}%</strong>
                      <span>Illustrative demand index</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="integration-note">
                <strong>Integration note</strong>
                <p>
                  Connect the AI/ML team's API to replace these illustrative
                  values with real predictions based on historical orders,
                  seasonality, and stock records.
                </p>
              </div>
            </>
          )}

          
{activePage === "Reports" && (
  <>
    <div className="section-heading">
      <div>
        <h2>Reports & Analytics</h2>
        <p>
          A summary of your current menu and inventory records.
        </p>
      </div>
    </div>

<div className="stats-grid">
  <div className="stat-card">
    <span>Recorded Revenue</span>
    <h3>
      {salesLoading
        ? "Loading..."
        : totalRevenue.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          })}
    </h3>
    <p>Based on saved sale records</p>
  </div>

  <div className="stat-card">
    <span>Transactions</span>
    <h3>{salesLoading ? "Loading..." : transactionCount}</h3>
    <p>Total recorded sale entries</p>
  </div>

  <div className="stat-card">
    <span>Best-Selling Item</span>
    <h3>
      {salesLoading ? "Loading..." : bestSellingItem}
    </h3>
    <p>
      {salesLoading
        ? "Calculating..."
        : `${bestSellingQuantity} units sold`}
    </p>
  </div>
</div>

    <div className="report-grid">
      <div className="report-card">
        <span className="report-icon">☕</span>
        <h3>Menu Overview</h3>
        <p>Total menu items: <strong>{menu.length}</strong></p>
        <p>Available: <strong>{availableMenuCount}</strong></p>
        <p>Unavailable: <strong>{unavailableMenuCount}</strong></p>
        <p>Total recorded sales: <strong>{totalRecordedSales}</strong></p>

        <button className="primary-button" onClick={exportMenu}>
          Download Menu CSV ↓
        </button>
      </div>

      <div className="report-card">
        <span className="report-icon">▤</span>
        <h3>Inventory Overview</h3>
        <p>Total ingredients: <strong>{inventory.length}</strong></p>
        <p>Healthy stock: <strong>{healthyStockCount}</strong></p>
        <p>Low-stock ingredients: <strong>{lowStockCount}</strong></p>

        {lowStockCount > 0 ? (
          <p>
            Attention needed:{" "}
            <strong>
              {lowStock.map((item) => item.name).join(", ")}
            </strong>
          </p>
        ) : (
          <p>All tracked ingredients meet their minimum stock levels.</p>
        )}

        <button
          className="secondary-button"
          onClick={() => setActivePage("Inventory")}
        >
          Manage inventory →
        </button>
      </div>

      <div className="report-card">
        <span className="report-icon">✧</span>
        <h3>Demand Forecast</h3>
        <p>
          View the sample demand indicators currently displayed in
          the AI Predictions section.
        </p>
        <p>
          <strong>Important:</strong> These are illustrative values,
          not live model predictions.
        </p>

        <button
          className="secondary-button"
          onClick={() => setActivePage("AI Predictions")}
        >
          View forecast →
        </button>
      </div>
    </div>

<div className="section-heading">
  <div>
    <h2>Recent Sales Transactions</h2>
    <p>Latest recorded sales saved in MongoDB.</p>
  </div>
</div>

<div className="table-wrap">
  <table>
    <thead>
      <tr>
        <th>ITEM</th>
        <th>QUANTITY</th>
        <th>UNIT PRICE</th>
        <th>TOTAL</th>
        <th>DATE & TIME</th>
      </tr>
    </thead>
    <tbody>
      {sales.slice(0, 10).map((sale, index) => (
        <tr key={sale._id ?? `${sale.itemName}-${sale.recordedAt}-${index}`}>
          <td>
            <strong>{sale.itemName}</strong>
          </td>
          <td>{sale.quantity}</td>
          <td>
            {Number(sale.unitPrice).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </td>
          <td className="price">
            {Number(sale.total).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </td>
          <td>
            {new Date(sale.recordedAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {salesLoading ? (
    <div className="empty-state">Loading sales...</div>
  ) : sales.length === 0 ? (
    <div className="empty-state">No sales transactions recorded yet.</div>
  ) : (
    <p className="table-footer">
      Showing {Math.min(sales.length, 10)} of {sales.length} transactions.
    </p>
  )}
</div>

    
<div className="integration-note">
  <strong>Data source and limitations</strong>
  <p>
    Menu and inventory summaries use data loaded from MongoDB.
    Revenue and transaction count are calculated from saved records
    in the sales collection. Item-level sales counts are maintained
    separately on menu documents. Demand predictions remain
    illustrative until the team's prediction model is connected.
  </p>
</div>

  </>
)}

          <footer className="footer">
            <span>CCD Predict-a-Latte</span>
            <span>Manager workspace · Frontend prototype</span>
          </footer>
        </div>
      </section>
    </main>
  );
}



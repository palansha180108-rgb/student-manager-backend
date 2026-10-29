
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

export type ApiProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  description?: string;
  imageUrl?: string;
};

export type ApiInventoryItem = {
  _id: string;
  name: string;
  unit: string;
  quantity: number;
  lowStockThreshold: number;
  costPerUnit?: number;
  isActive?: boolean;
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `API request failed (${response.status})`
    );
  }

  return data as T;
}

export const apiService = {
  getProducts: () =>
    apiRequest<{ success: boolean; count: number; products: ApiProduct[] }>(
      "/api/products"
    ),

  getInventory: () =>
    apiRequest<{ success: boolean; count: number; items: ApiInventoryItem[] }>(
      "/api/inventory"
    ),

  getOrders: () => apiRequest<any>("/api/orders"),
  getAlerts: () => apiRequest<any>("/api/alerts"),
  getRevenue: () => apiRequest<any>("/api/revenue"),
  getForecasts: () => apiRequest<any>("/api/forecasts"),
};

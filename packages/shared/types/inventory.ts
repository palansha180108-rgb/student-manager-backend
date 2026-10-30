export interface InventoryItem {
  _id?: string;
  name: string;
  unit: string;
  quantity: number;
  lowStockThreshold: number;
  costPerUnit: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type StockMovementType =
  | "stock_in"
  | "stock_out"
  | "adjustment"
  | "waste";

export interface StockMovement {
  _id?: string;
  inventoryItemId: string;
  itemName: string;
  movementType: StockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  referenceId?: string;
  recordedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

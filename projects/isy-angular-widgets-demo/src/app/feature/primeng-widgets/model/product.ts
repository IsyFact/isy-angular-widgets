/**
 * An interface for displaying products with their code, name, price, quantity, inventory status, category, and rating
 */
export interface Product {
  id?: string;
  code?: string;
  name?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  rating?: number;
}

/**
 * An interface for displaying delivery status with status and date
 */
export interface DeliveryStatus {
  status: string;
  date: string;
}

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

/**
 * An interface for displaying IT solutions with name, size, type and possible sub solutions
 */
export interface ItSolution {
  key: string;
  data: {
    name: string;
    size: string;
    type: string;
  };
  children?: ItSolution[];
}

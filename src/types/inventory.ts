export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  minStock: number;
  maxStock: number;
  currentStock: number;
  supplier: string;
  location: string;
  status: 'active' | 'inactive' | 'discontinued';
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  unitPrice: number;
  totalValue: number;
  reason: string;
  reference: string;
  date: Date;
  user: string;
  previousStock: number;
  newStock: number;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  alertType: 'low-stock' | 'out-of-stock' | 'overstock';
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  resolved: boolean;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  status: 'active' | 'inactive';
  rating: number;
}
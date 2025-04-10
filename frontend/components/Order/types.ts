export type OrderStatus = 'In Transit' | 'Delivered' | 'Processing' | 'Cancelled';

export type OrderItem = {
  name: string;
  quantity: number;
  weight: number;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type OrderType = {
  id: string;
  status: OrderStatus;
  origin: string;
  destination: string;
  date: string;
  carrier: string;
  weight: number;
  items: OrderItem[];
  customer: Customer;
  trackingNumber: string;
  estimatedDelivery: string;
}; 
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

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
  id: number;
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
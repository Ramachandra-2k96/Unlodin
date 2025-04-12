export type OrderStatus = 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

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
  // Additional properties for timeline
  created_at?: string;
  accepted_at?: string;
  pickup_date?: string;
  transit_date?: string;
  delivery_date?: string;
  updated_at?: string;
}; 
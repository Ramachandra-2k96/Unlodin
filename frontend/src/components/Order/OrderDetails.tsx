import React from 'react';
import { ChevronLeft, Truck, Package, Calendar, MapPin, Clock, User, Mail, Phone, Tag, Edit, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { OrderType, OrderStatus } from './types';

// Timeline event type
interface TimelineEvent {
  status: OrderStatus;
  date: string | null;
  icon: JSX.Element;
  label: string;
  description: string;
}

// Status badge component
const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'picked_up': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get user-friendly status label
  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'picked_up': return 'Picked Up';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};

// Order Timeline component
const OrderTimeline: React.FC<{ order: OrderType }> = ({ order }) => {
  // Only show timeline if we have the necessary dates
  const hasTimeline = order.created_at || order.pickup_date || order.delivery_date || order.updated_at;
  
  if (!hasTimeline) {
    return null;
  }

  const timelineEvents = [
    {
      status: 'pending' as OrderStatus,
      date: order.created_at ? new Date(order.created_at).toLocaleString() : null,
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      label: 'Order Placed',
      description: `Order #${order.id} has been created`
    },
    order.status === 'accepted' ? {
      status: 'accepted' as OrderStatus,
      date: order.accepted_at ? new Date(order.accepted_at).toLocaleString() : null,
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      label: 'Carrier Assigned',
      description: 'A carrier has been assigned to your order'
    } : null,
    order.status === 'picked_up' ? {
      status: 'picked_up' as OrderStatus,
      date: order.pickup_date ? new Date(order.pickup_date).toLocaleString() : null,
      icon: <Package className="w-5 h-5 text-purple-500" />,
      label: 'Package Picked Up',
      description: `Picked up from ${order.origin}`
    } : null,
    order.status === 'in_transit' ? {
      status: 'in_transit' as OrderStatus,
      date: order.transit_date ? new Date(order.transit_date).toLocaleString() : null,
      icon: <Truck className="w-5 h-5 text-blue-500" />,
      label: 'In Transit',
      description: `On the way to ${order.destination}`
    } : null,
    (order.status === 'delivered' || order.delivery_date) ? {
      status: 'delivered' as OrderStatus,
      date: order.delivery_date ? new Date(order.delivery_date).toLocaleString() : null,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      label: 'Delivered',
      description: `Successfully delivered to ${order.destination}`
    } : null,
    order.status === 'cancelled' ? {
      status: 'cancelled' as OrderStatus,
      date: order.updated_at ? new Date(order.updated_at).toLocaleString() : null,
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      label: 'Cancelled',
      description: 'Order has been cancelled'
    } : null
  ].filter((event): event is TimelineEvent => event !== null);

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 md:p-5 border border-slate-700 animate-fadeIn">
      <h3 className="text-lg font-semibold text-white mb-4">Delivery Status</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700"></div>
        
        {/* Timeline items */}
        <div className="space-y-6">
          {timelineEvents.map((event, index) => {
            if (!event) return null;
            const isLast = index === timelineEvents.length - 1;
            
            return (
              <div key={event.status} 
                className={`relative pl-12 transform transition-all duration-500 ease-out ${
                  isLast ? 'opacity-100 translate-y-0' : 'opacity-80'
                }`}
              >
                {/* Status dot */}
                <div className={`absolute left-3 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                  isLast 
                    ? 'bg-yellow-500 border-yellow-500 ring-4 ring-yellow-500/20' 
                    : 'bg-slate-800 border-slate-600'
                }`}></div>
                
                {/* Status content */}
                <div className={`${isLast ? 'text-white' : 'text-slate-300'}`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      {event.icon}
                      <span className="font-medium">{event.label}</span>
                    </div>
                    {event.date && (
                      <span className="text-xs text-slate-400">
                        {event.date}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface OrderDetailsProps {
  order: OrderType;
  onStatusUpdate: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onStatusUpdate }) => {
  return (
    <div className="text-slate-300 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-slate-700">
        <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
          <div>
            <h2 className="text-xl font-bold text-white">
              Order #{order.id}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <span className="text-sm text-slate-400">
                {order.date}
              </span>
              <StatusBadge status={order.status} />
            </div>
          </div>
        </div>
        
        <button
          onClick={onStatusUpdate}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
        >
          <Edit size={16} />
          Update Status
        </button>
      </div>
      
      {/* Order Timeline */}
      <OrderTimeline order={order} />
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping details */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Shipping Details</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Origin</p>
                <p className="font-medium text-white">{order.origin}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Destination</p>
                <p className="font-medium text-white">{order.destination}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Carrier</p>
                <p className="font-medium text-white">{order.carrier}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Tracking Number</p>
                <p className="font-medium text-white">{order.trackingNumber}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Estimated Delivery</p>
                <p className="font-medium text-white">{order.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer details */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Name</p>
                <p className="font-medium text-white">{order.customer.name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="font-medium text-white">{order.customer.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="font-medium text-white">{order.customer.phone}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Item details */}
        <div className="md:col-span-2 bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Items</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr>
                  <th className="py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Item</th>
                  <th className="py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Quantity</th>
                  <th className="py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-4 text-sm text-white">{item.name}</td>
                    <td className="py-4 text-sm text-white">{item.quantity}</td>
                    <td className="py-4 text-sm text-white">{item.weight} kg</td>
                  </tr>
                ))}
                <tr className="bg-slate-700/30">
                  <td className="py-3 text-sm font-medium text-white">Total</td>
                  <td className="py-3 text-sm font-medium text-white">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="py-3 text-sm font-medium text-white">{order.weight} kg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 
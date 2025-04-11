import React from 'react';
import { ChevronLeft, Truck, Package, Calendar, MapPin, Clock, User, Mail, Phone, Tag, Edit } from 'lucide-react';
import { OrderType } from './types';

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
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
  const getStatusLabel = (status: string): string => {
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

interface OrderDetailsProps {
  order: OrderType;
  onStatusUpdate: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onStatusUpdate }) => {
  return (
    <div className="text-slate-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-slate-700">
        <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
          <div>
            <h2 className="text-xl font-bold text-white">
              {order.id}
            </h2>
            <div className="flex items-center gap-2 mt-1">
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
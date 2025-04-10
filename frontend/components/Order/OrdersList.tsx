import React from 'react';
import { Package, Truck, Calendar, FileText } from 'lucide-react';
import { OrderType } from './types';

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Order Card component for mobile view
const OrderCard: React.FC<{ order: OrderType; onClick: () => void }> = ({ order, onClick }) => (
  <div 
    className="bg-slate-800 rounded-lg shadow-md p-4 mb-4 border border-slate-700 hover:border-yellow-500/50 cursor-pointer transition-all duration-200 transform hover:-translate-y-1"
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-semibold text-lg text-white">{order.id}</h3>
      <StatusBadge status={order.status} />
    </div>
    
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="flex items-center gap-1.5">
        <Truck className="w-4 h-4 text-yellow-500" />
        <span className="text-slate-400">From:</span>
        <span className="font-medium text-slate-200">{order.origin}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Package className="w-4 h-4 text-yellow-500" />
        <span className="text-slate-400">To:</span>
        <span className="font-medium text-slate-200">{order.destination}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-yellow-500" />
        <span className="text-slate-400">Date:</span>
        <span className="font-medium text-slate-200">{order.date}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <FileText className="w-4 h-4 text-yellow-500" />
        <span className="text-slate-400">Weight:</span>
        <span className="font-medium text-slate-200">{order.weight} kg</span>
      </div>
    </div>
    
    <div className="mt-3 pt-3 border-t border-slate-700">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-slate-400">Customer:</span>
        <span className="font-medium text-slate-200">{order.customer.name}</span>
      </div>
    </div>
  </div>
);

interface OrdersListProps {
  orders: OrderType[];
  onSelectOrder: (order: OrderType) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({ orders, onSelectOrder }) => {
  return (
    <div>
      {/* Results count */}
      <div className="flex justify-between items-center mb-4 text-sm text-slate-400">
        <div>
          Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </div>
      </div>
      
      {/* Orders table (desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Origin</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Destination</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Weight</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 divide-y divide-slate-800">
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => onSelectOrder(order)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-500">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{order.customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{order.origin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{order.destination}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{order.weight} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Orders cards (mobile) */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onClick={() => onSelectOrder(order)} 
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersList; 
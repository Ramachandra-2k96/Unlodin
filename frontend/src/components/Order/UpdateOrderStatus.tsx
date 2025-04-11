import React, { useState } from 'react';
import { ChevronLeft, Check, AlertTriangle } from 'lucide-react';
import { OrderType, OrderStatus } from './types';
import { useAuth } from '../../context/AuthContext';

interface UpdateOrderStatusProps {
  order: OrderType;
  onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
}

// Helper function to get user-friendly status label
const getStatusLabel = (status: OrderStatus): string => {
  switch (status.toLowerCase()) {
    case 'pending': return 'Pending';
    case 'accepted': return 'Accepted';
    case 'picked_up': return 'Picked Up';
    case 'in_transit': return 'In Transit';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};

const UpdateOrderStatus: React.FC<UpdateOrderStatusProps> = ({ order, onStatusUpdate }) => {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ reason?: string }>({});
  
  // Get available status options based on user role and current status
  const getAvailableStatuses = (): OrderStatus[] => {
    // Determine user role from auth context
    const isShipper = user?.account_type === 'shipper';
    
    if (isShipper) {
      // Shippers can only cancel orders that aren't delivered
      return order.status !== 'DELIVERED' ? ['CANCELLED'] : [];
    } else {
      // Carrier status progression
      switch (order.status) {
        case 'PENDING':
          return ['ACCEPTED'];
        case 'ACCEPTED':
          return ['PICKED_UP'];
        case 'PICKED_UP':
          return ['IN_TRANSIT'];
        case 'IN_TRANSIT':
          return ['DELIVERED'];
        default:
          return [];
      }
    }
  };
  
  const availableStatuses = getAvailableStatuses();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { reason?: string } = {};
    
    // Require reason if status is changing to Cancelled
    if (selectedStatus === 'CANCELLED' && !reason) {
      newErrors.reason = 'Please provide a reason for cancellation';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onStatusUpdate(order.id, selectedStatus);
    }
  };
  
  return (
    <div className="text-slate-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white">
            Update Order Status
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Order ID: {order.id}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Status */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Current Status</h3>
          
          <div className="p-4 rounded-lg border border-yellow-500 bg-yellow-500/10 flex items-center justify-center">
            <span className="font-medium text-yellow-500">
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>
        
        {/* New Status */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">New Status</h3>
          
          {availableStatuses.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableStatuses.map((status) => (
                <div 
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedStatus === status 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : 'border-slate-700 bg-transparent hover:border-slate-500'
                  } flex flex-col items-center justify-center`}
                >
                  {selectedStatus === status && (
                    <Check size={16} className="mb-1 text-yellow-500" />
                  )}
                  <span className={`font-medium ${selectedStatus === status ? 'text-yellow-500' : 'text-slate-300'}`}>
                    {getStatusLabel(status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
              <p className="text-center text-slate-400">
                {order.status === 'DELIVERED' ? 
                  'This order has been delivered and cannot be updated further.' : 
                  order.status === 'CANCELLED' ?
                  'This order has been cancelled and cannot be updated further.' :
                  'No status changes are available for this order.'}
              </p>
            </div>
          )}
          
          {/* Cancellation Warning */}
          {selectedStatus === 'CANCELLED' && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-800/50 rounded-lg flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">Important Note</p>
                <p className="text-sm text-red-300 mt-1">
                  Cancelling an order is irreversible. Please provide a reason for cancellation.
                </p>
              </div>
            </div>
          )}
          
          {/* Reason for Status Change */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {selectedStatus === 'CANCELLED' ? 'Reason for Cancellation' : 'Notes (Optional)'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                errors.reason ? 'border-red-500' : 'border-slate-700'
              }`}
              placeholder={selectedStatus === 'CANCELLED' ? 'Provide reason for cancellation...' : 'Add any notes about this status change...'}
            ></textarea>
            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
          </div>
        </div>
        
        {/* Timeline Preview */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Status Timeline Preview</h3>
          
          <div className="space-y-6 relative">
            <div className="absolute top-0 bottom-0 left-[7px] w-[2px] bg-slate-700"></div>
            
            {/* Previous Status */}
            <div className="flex items-start gap-4 relative">
              <div className="w-4 h-4 mt-1.5 rounded-full bg-yellow-500 z-10"></div>
              <div>
                <p className="font-medium text-white">{getStatusLabel(order.status)}</p>
                <p className="text-sm text-slate-400 mt-0.5">Current Status</p>
                <p className="text-xs text-slate-500 mt-1">{order.date}</p>
              </div>
            </div>
            
            {/* New Status */}
            {selectedStatus && (
              <div className="flex items-start gap-4 relative">
                <div className="w-4 h-4 mt-1.5 rounded-full border-2 border-yellow-500 bg-slate-800 z-10"></div>
                <div>
                  <p className="font-medium text-yellow-500">{getStatusLabel(selectedStatus)}</p>
                  <p className="text-sm text-slate-400 mt-0.5">New Status</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date().toISOString().split('T')[0]} (Today)</p>
                  
                  {reason && (
                    <div className="mt-2 p-2 bg-slate-800 rounded border border-slate-700 text-sm text-slate-300">
                      {reason}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="submit"
            disabled={!selectedStatus || availableStatuses.length === 0}
            className={`px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium rounded-lg transition-colors ${
              (!selectedStatus || availableStatuses.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Update Status
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrderStatus; 
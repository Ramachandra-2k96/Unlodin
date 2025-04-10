import React, { useState } from 'react';
import { ChevronLeft, Check, AlertTriangle } from 'lucide-react';
import { OrderType, OrderStatus } from './types';

interface UpdateOrderStatusProps {
  order: OrderType;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onCancel: () => void;
}

const UpdateOrderStatus: React.FC<UpdateOrderStatusProps> = ({ order, onUpdateStatus, onCancel }) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ reason?: string }>({});
  
  const statuses: OrderStatus[] = ['Processing', 'In Transit', 'Delivered', 'Cancelled'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { reason?: string } = {};
    
    // Require reason if status is changing to Cancelled
    if (selectedStatus === 'Cancelled' && !reason) {
      newErrors.reason = 'Please provide a reason for cancellation';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onUpdateStatus(order.id, selectedStatus);
    }
  };
  
  return (
    <div className="text-slate-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
        <button 
          onClick={onCancel}
          className="text-slate-400 hover:text-white p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statuses.map((status) => (
              <div 
                key={status}
                className={`p-4 rounded-lg border ${
                  order.status === status 
                    ? 'border-yellow-500 bg-yellow-500/10' 
                    : 'border-slate-700 bg-transparent'
                } flex items-center justify-center`}
              >
                <span className={`font-medium ${order.status === status ? 'text-yellow-500' : 'text-slate-300'}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* New Status */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">New Status</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statuses.map((status) => (
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
                  {status}
                </span>
              </div>
            ))}
          </div>
          
          {/* Cancellation Warning */}
          {selectedStatus === 'Cancelled' && (
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
              {selectedStatus === 'Cancelled' ? 'Reason for Cancellation' : 'Notes (Optional)'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                errors.reason ? 'border-red-500' : 'border-slate-700'
              }`}
              placeholder={selectedStatus === 'Cancelled' ? 'Provide reason for cancellation...' : 'Add any notes about this status change...'}
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
                <p className="font-medium text-white">{order.status}</p>
                <p className="text-sm text-slate-400 mt-0.5">Current Status</p>
                <p className="text-xs text-slate-500 mt-1">{order.date}</p>
              </div>
            </div>
            
            {/* New Status */}
            <div className="flex items-start gap-4 relative">
              <div className="w-4 h-4 mt-1.5 rounded-full border-2 border-yellow-500 bg-slate-800 z-10"></div>
              <div>
                <p className="font-medium text-yellow-500">{selectedStatus}</p>
                <p className="text-sm text-slate-400 mt-0.5">New Status</p>
                <p className="text-xs text-slate-500 mt-1">{new Date().toISOString().split('T')[0]} (Today)</p>
                
                {reason && (
                  <div className="mt-2 p-2 bg-slate-800 rounded border border-slate-700 text-sm text-slate-300">
                    {reason}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium rounded-lg transition-colors"
          >
            Update Status
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrderStatus; 
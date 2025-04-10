import React, { useState } from 'react';
import { OrderType, OrderStatus, OrderItem } from './types';
import { Plus, Minus, X } from 'lucide-react';

interface CreateOrderFormProps {
  onCreateOrder: (order: OrderType) => void;
  onCancel: () => void;
}

const defaultStatus: OrderStatus = 'Processing';

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onCreateOrder, onCancel }) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    carrier: '',
    weight: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    estimatedDelivery: '',
  });
  
  const [items, setItems] = useState<OrderItem[]>([
    { name: '', quantity: 1, weight: 0 }
  ]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, weight: 0 }]);
  };
  
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };
  
  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.origin) newErrors.origin = 'Origin is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.carrier) newErrors.carrier = 'Carrier is required';
    if (!formData.customerName) newErrors.customerName = 'Customer name is required';
    if (!formData.customerEmail) newErrors.customerEmail = 'Customer email is required';
    if (!formData.customerPhone) newErrors.customerPhone = 'Customer phone is required';
    
    // Validate items
    let hasItemErrors = false;
    items.forEach((item, index) => {
      if (!item.name) {
        newErrors[`item-${index}-name`] = 'Item name is required';
        hasItemErrors = true;
      }
      if (item.quantity <= 0) {
        newErrors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
        hasItemErrors = true;
      }
      if (item.weight <= 0) {
        newErrors[`item-${index}-weight`] = 'Weight must be greater than 0';
        hasItemErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    // Calculate total weight
    const totalWeight = items.reduce((total, item) => total + (item.weight * item.quantity), 0);
    
    // Create order object
    const newOrder: OrderType = {
      id: '', // This will be set by the parent component
      status: defaultStatus,
      origin: formData.origin,
      destination: formData.destination,
      date: new Date().toISOString().split('T')[0],
      carrier: formData.carrier,
      weight: totalWeight,
      items: items,
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
      trackingNumber: `TRK${Math.floor(1000000 + Math.random() * 9000000)}`,
      estimatedDelivery: formData.estimatedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    
    onCreateOrder(newOrder);
  };
  
  return (
    <div className="text-slate-300">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Create New Order</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Details */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Shipping Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Origin
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.origin ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="e.g. New York, NY"
              />
              {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Destination
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.destination ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="e.g. Los Angeles, CA"
              />
              {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Carrier
              </label>
              <input
                type="text"
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.carrier ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="e.g. Express Shipping"
              />
              {errors.carrier && <p className="text-red-500 text-xs mt-1">{errors.carrier}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Estimated Delivery Date
              </label>
              <input
                type="date"
                value={formData.estimatedDelivery}
                onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>
        
        {/* Customer Information */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.customerName ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="Full Name"
              />
              {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.customerEmail ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="email@example.com"
              />
              {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.customerPhone ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="(123) 456-7890"
              />
              {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
            </div>
          </div>
        </div>
        
        {/* Items */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-yellow-500 hover:text-yellow-400 flex items-center text-sm font-medium"
            >
              <Plus size={16} className="mr-1" />
              Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="p-4 border border-slate-700 rounded-lg bg-slate-800">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white font-medium">Item {index + 1}</h4>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-slate-700 text-white placeholder-slate-500 ${
                        errors[`item-${index}-name`] ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Item name"
                    />
                    {errors[`item-${index}-name`] && <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-name`]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => updateItem(index, 'quantity', Math.max(1, item.quantity - 1))}
                        className="bg-slate-700 text-white p-2 rounded-l-lg border-y border-l border-slate-600 hover:bg-slate-600"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className={`w-full text-center px-3 py-2 border-y bg-slate-700 text-white ${
                          errors[`item-${index}-quantity`] ? 'border-red-500' : 'border-slate-600'
                        }`}
                        min="1"
                      />
                      <button
                        type="button"
                        onClick={() => updateItem(index, 'quantity', item.quantity + 1)}
                        className="bg-slate-700 text-white p-2 rounded-r-lg border-y border-r border-slate-600 hover:bg-slate-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {errors[`item-${index}-quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-quantity`]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e) => updateItem(index, 'weight', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg bg-slate-700 text-white ${
                        errors[`item-${index}-weight`] ? 'border-red-500' : 'border-slate-600'
                      }`}
                      min="0.1"
                      step="0.1"
                    />
                    {errors[`item-${index}-weight`] && <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-weight`]}</p>}
                  </div>
                </div>
              </div>
            ))}
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
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderForm; 
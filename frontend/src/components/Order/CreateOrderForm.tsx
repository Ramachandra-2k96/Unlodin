import React, { useState } from 'react';
import { OrderType, OrderStatus } from './types';
import { Plus, Minus, X, AlertCircle } from 'lucide-react';

interface CreateOrderFormProps {
  onOrderCreate: (order: any) => Promise<void>;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onOrderCreate }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    pickup_location: '',
    delivery_location: '',
    pickup_date: '',
    delivery_deadline: '',
    package_description: '',
    weight: 0,
    dimensions: '',
    total_amount: 0,
    notes: '',
  });
  
  const [items, setItems] = useState<Array<{
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
  }>>([
    { product_name: '', product_sku: '', quantity: 1, unit_price: 0 }
  ]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const addItem = () => {
    setItems([...items, { product_name: '', product_sku: '', quantity: 1, unit_price: 0 }]);
  };
  
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };
  
  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate total amount whenever an item changes
    if (field === 'quantity' || field === 'unit_price') {
      const totalAmount = newItems.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
      setFormData({...formData, total_amount: totalAmount});
    }
    
    setItems(newItems);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields: Array<[string, string]> = [
      ['customer_name', 'Customer name is required'],
      ['customer_email', 'Customer email is required'],
      ['customer_phone', 'Customer phone is required'],
      ['pickup_location', 'Pickup location is required'],
      ['delivery_location', 'Delivery location is required'],
      ['pickup_date', 'Pickup date is required'],
      ['delivery_deadline', 'Delivery deadline is required'],
      ['package_description', 'Package description is required']
    ];
    
    requiredFields.forEach(([field, message]) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = message;
      }
    });
    
    // Validate weight
    if (formData.weight <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }
    
    // Validate total amount
    if (formData.total_amount <= 0) {
      newErrors.total_amount = 'Total amount must be greater than 0';
    }
    
    // Validate dates
    if (formData.pickup_date && formData.delivery_deadline) {
      const pickupDate = new Date(formData.pickup_date);
      const deliveryDate = new Date(formData.delivery_deadline);
      
      if (deliveryDate < pickupDate) {
        newErrors.delivery_deadline = 'Delivery deadline must be after pickup date';
      }
    }
    
    // Validate items
    let hasItemErrors = false;
    items.forEach((item, index) => {
      if (!item.product_name) {
        newErrors[`item-${index}-name`] = 'Product name is required';
        hasItemErrors = true;
      }
      if (!item.product_sku) {
        newErrors[`item-${index}-sku`] = 'Product SKU is required';
        hasItemErrors = true;
      }
      if (item.quantity <= 0) {
        newErrors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
        hasItemErrors = true;
      }
      if (item.unit_price <= 0) {
        newErrors[`item-${index}-price`] = 'Unit price must be greater than 0';
        hasItemErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    
    try {
      await onOrderCreate({
        ...formData,
        items: items
      });
    } catch (error: any) {
      console.error('Failed to create order:', error);
      setSubmitError(error.response?.data?.detail || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="text-slate-300">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Create New Order</h2>
      </div>
      
      {submitError && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{submitError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.customer_name ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="Full Name"
              />
              {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.customer_email ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="email@example.com"
              />
              {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.customer_phone ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="(123) 456-7890"
              />
              {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
            </div>
          </div>
        </div>
        
        {/* Shipping Details */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Shipping Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Pickup Location
              </label>
              <input
                type="text"
                value={formData.pickup_location}
                onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.pickup_location ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="e.g. New York, NY"
              />
              {errors.pickup_location && <p className="text-red-500 text-xs mt-1">{errors.pickup_location}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Delivery Location
              </label>
              <input
                type="text"
                value={formData.delivery_location}
                onChange={(e) => setFormData({ ...formData, delivery_location: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.delivery_location ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="e.g. Los Angeles, CA"
              />
              {errors.delivery_location && <p className="text-red-500 text-xs mt-1">{errors.delivery_location}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Pickup Date
              </label>
              <input
                type="date"
                value={formData.pickup_date}
                onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white ${
                  errors.pickup_date ? 'border-red-500' : 'border-slate-700'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.pickup_date && <p className="text-red-500 text-xs mt-1">{errors.pickup_date}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Delivery Deadline
              </label>
              <input
                type="date"
                value={formData.delivery_deadline}
                onChange={(e) => setFormData({ ...formData, delivery_deadline: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white ${
                  errors.delivery_deadline ? 'border-red-500' : 'border-slate-700'
                }`}
                min={formData.pickup_date || new Date().toISOString().split('T')[0]}
              />
              {errors.delivery_deadline && <p className="text-red-500 text-xs mt-1">{errors.delivery_deadline}</p>}
            </div>
          </div>
        </div>
        
        {/* Package Information */}
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Package Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Package Description
              </label>
              <textarea
                value={formData.package_description}
                onChange={(e) => setFormData({ ...formData, package_description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white placeholder-slate-500 ${
                  errors.package_description ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="Detailed description of the package contents"
              ></textarea>
              {errors.package_description && <p className="text-red-500 text-xs mt-1">{errors.package_description}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white ${
                  errors.weight ? 'border-red-500' : 'border-slate-700'
                }`}
                min="0.1"
                step="0.1"
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Dimensions (LxWxH in cm)
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white"
                placeholder="e.g. 30x20x15"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white"
                placeholder="Any additional information or special handling instructions"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Total Amount
              </label>
              <input
                type="number"
                value={formData.total_amount || ''}
                onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-lg bg-slate-800 text-white ${
                  errors.total_amount ? 'border-red-500' : 'border-slate-700'
                }`}
                min="0.01"
                step="0.01"
              />
              {errors.total_amount && <p className="text-red-500 text-xs mt-1">{errors.total_amount}</p>}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={item.product_name}
                      onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-slate-700 text-white placeholder-slate-500 ${
                        errors[`item-${index}-name`] ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Item name"
                    />
                    {errors[`item-${index}-name`] && <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-name`]}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Product SKU
                    </label>
                    <input
                      type="text"
                      value={item.product_sku}
                      onChange={(e) => updateItem(index, 'product_sku', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-slate-700 text-white placeholder-slate-500 ${
                        errors[`item-${index}-sku`] ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="SKU123"
                    />
                    {errors[`item-${index}-sku`] && <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-sku`]}</p>}
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
                      Unit Price
                    </label>
                    <input
                      type="number"
                      value={item.unit_price || ''}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg bg-slate-700 text-white ${
                        errors[`item-${index}-price`] ? 'border-red-500' : 'border-slate-600'
                      }`}
                      min="0.01"
                      step="0.01"
                    />
                    {errors[`item-${index}-price`] && <p className="text-red-500 text-xs mt-1">{errors[`item-${index}-price`]}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium rounded-lg transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Order...
              </span>
            ) : (
              "Create Order"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderForm; 
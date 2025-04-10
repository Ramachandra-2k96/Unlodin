import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Footer from '../Landing/Footer';
import OrdersList from './OrdersList';
import OrderDetails from './OrderDetails';
import CreateOrderForm from './CreateOrderForm';
import UpdateOrderStatus from './UpdateOrderStatus';
import { OrderType, OrderStatus } from './types';
import ChatBot from '../ChatBot';

// Sample order data for demonstration
const sampleOrders: OrderType[] = Array.from({ length: 50 }, (_, i) => ({
  id: `ORD-${1000 + i}`,
  status: ['In Transit', 'Delivered', 'Processing', 'Cancelled'][Math.floor(Math.random() * 4)] as OrderStatus,
  origin: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'][Math.floor(Math.random() * 5)],
  destination: ['Miami, FL', 'Seattle, WA', 'Boston, MA', 'Denver, CO', 'Atlanta, GA'][Math.floor(Math.random() * 5)],
  date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  carrier: ['FastTruck Logistics', 'Express Shipping', 'Premium Carriers', 'Route Masters', 'Reliable Transport'][Math.floor(Math.random() * 5)],
  weight: Math.floor(Math.random() * 5000) + 100,
  items: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, j) => ({
    name: ['Electronics', 'Furniture', 'Books', 'Clothing', 'Food Items'][Math.floor(Math.random() * 5)],
    quantity: Math.floor(Math.random() * 10) + 1,
    weight: Math.floor(Math.random() * 500) + 10,
  })),
  customer: {
    name: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'][Math.floor(Math.random() * 5)],
    email: ['john@example.com', 'jane@example.com', 'robert@example.com', 'emily@example.com', 'michael@example.com'][Math.floor(Math.random() * 5)],
    phone: ['555-123-4567', '555-987-6543', '555-456-7890', '555-789-0123', '555-321-6540'][Math.floor(Math.random() * 5)],
  },
  trackingNumber: `TRK${Math.floor(1000000 + Math.random() * 9000000)}`,
  estimatedDelivery: new Date(Date.now() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
}));

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>(sampleOrders);
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>(sampleOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'details' | 'create' | 'update'>('list');
  
  const ordersPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.origin.toLowerCase().includes(term) ||
        order.destination.toLowerCase().includes(term) ||
        order.carrier.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.trackingNumber.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, filters, searchTerm]);
  
  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Handle order selection
  const handleOrderSelect = (order: OrderType) => {
    setSelectedOrder(order);
    setActiveTab('details');
  };
  
  // Handle order creation
  const handleOrderCreate = (newOrder: OrderType) => {
    const nextId = `ORD-${1000 + orders.length}`;
    const orderWithId = { ...newOrder, id: nextId, date: new Date().toISOString().split('T')[0] };
    setOrders([orderWithId, ...orders]);
    setActiveTab('list');
  };
  
  // Handle order status update
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    setActiveTab('details');
  };
  
  // Handle getting order by ID
  const handleGetOrderById = (orderId: string) => {
    const foundOrder = orders.find(order => order.id === orderId);
    if (foundOrder) {
      setSelectedOrder(foundOrder);
      setActiveTab('details');
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      
      <div className="container mx-auto px-4 py-24 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-slate-400">View and manage your shipment orders</p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'list' 
                ? 'bg-yellow-500 text-slate-900' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Orders List
          </button>
          
          {selectedOrder && (
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'details' 
                  ? 'bg-yellow-500 text-slate-900' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Order Details
            </button>
          )}
          
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
              activeTab === 'create' 
                ? 'bg-yellow-500 text-slate-900' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Order
          </button>
          
          {selectedOrder && (
            <button
              onClick={() => setActiveTab('update')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'update' 
                  ? 'bg-yellow-500 text-slate-900' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Update Status
            </button>
          )}
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-md border border-slate-800 p-4 md:p-6 mb-6">
          {activeTab === 'list' && (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-grow">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search orders by ID, origin, destination, customer..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  </div>
                </div>
                
                {/* Filters */}
                <div className="flex space-x-3">
                  <div className="relative">
                    <select
                      className="appearance-none pl-10 pr-8 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="">All Statuses</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Processing">Processing</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  </div>
                </div>
                
                {/* Get Order by ID */}
                <div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Order ID (e.g. ORD-1000)"
                      className="w-40 md:w-48 pl-3 pr-3 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          handleGetOrderById(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Order ID (e.g. ORD-1000)"]') as HTMLInputElement;
                        if (input && input.value) {
                          handleGetOrderById(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium text-sm"
                    >
                      Get Order
                    </button>
                  </div>
                </div>
              </div>
              
              <OrdersList 
                orders={currentOrders} 
                onSelectOrder={handleOrderSelect} 
              />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                  <button
                    onClick={() => paginate(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg ${
                      currentPage === 1 
                        ? 'text-slate-600 cursor-not-allowed' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <div className="hidden sm:flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Show first page, last page, current page, and pages around current
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                        if (i === 4) pageNum = totalPages;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                        if (i === 0) pageNum = 1;
                      } else {
                        pageNum = currentPage - 2 + i;
                        if (i === 0) pageNum = 1;
                        if (i === 4) pageNum = totalPages;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => paginate(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                            currentPage === pageNum 
                              ? 'bg-yellow-500 text-slate-900' 
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <span className="sm:hidden text-sm text-slate-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg ${
                      currentPage === totalPages 
                        ? 'text-slate-600 cursor-not-allowed' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'details' && selectedOrder && (
            <OrderDetails 
              order={selectedOrder} 
              onBack={() => setActiveTab('list')}
              onUpdateStatus={() => setActiveTab('update')}
            />
          )}
          
          {activeTab === 'create' && (
            <CreateOrderForm
              onCreateOrder={handleOrderCreate}
              onCancel={() => setActiveTab('list')}
            />
          )}
          
          {activeTab === 'update' && selectedOrder && (
            <UpdateOrderStatus
              order={selectedOrder}
              onUpdateStatus={handleStatusUpdate}
              onCancel={() => setActiveTab('details')}
            />
          )}
        </div>
      </div>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Orders; 
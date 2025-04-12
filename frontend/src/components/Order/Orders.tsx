import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, LogOut, User, CheckCircle } from 'lucide-react';
import Footer from '../Landing/Footer';
import OrdersList from './OrdersList';
import OrderDetails from './OrderDetails';
import CreateOrderForm from './CreateOrderForm';
import UpdateOrderStatus from './UpdateOrderStatus';
import { OrderType, OrderStatus } from './types';
import ChatBot from '../ChatBot';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../services/api';

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};

const Orders: React.FC = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'details' | 'create' | 'update' | 'available'>('list');
  const [availableOrders, setAvailableOrders] = useState<OrderType[]>([]);
  const [availableOrdersPage, setAvailableOrdersPage] = useState(1);
  const [availableOrdersTotalPages, setAvailableOrdersTotalPages] = useState(1);
  const [acceptingOrderId, setAcceptingOrderId] = useState<number | null>(null);
  
  const ordersPerPage = 10;
  
  // Fetch orders from API
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let response;
      
      // Fetch orders based on user role
      if (user?.account_type === 'shipper') {
        response = await ordersAPI.getShipperOrders(currentPage, ordersPerPage);
      } else if (user?.account_type === 'carrier') {
        response = await ordersAPI.getCarrierOrders(currentPage, ordersPerPage);
      } else {
        // Fallback if user role is unknown
        response = { items: [], total: 0, page: 1, pages: 1 };
      }
      
      // Map API response to the expected format
      const mappedOrders: OrderType[] = response.items.map((item: any) => ({
        id: item.id,
        status: item.status,
        origin: item.pickup_location || '',
        destination: item.delivery_location || '',
        date: new Date(item.created_at).toLocaleDateString(),
        carrier: item.carrier_id ? 'Assigned' : 'Unassigned',
        weight: item.weight || 0,
        items: item.items || [],
        customer: {
          name: item.customer_name || '',
          email: item.customer_email || '',
          phone: item.customer_phone || '',
        },
        trackingNumber: item.tracking_number || '',
        estimatedDelivery: item.delivery_deadline ? new Date(item.delivery_deadline).toLocaleDateString() : '',
      }));
      
      setOrders(mappedOrders);
      setFilteredOrders(mappedOrders);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch available orders for carriers
  const fetchAvailableOrders = async () => {
    if (user?.account_type !== 'carrier') return;
    
    setIsLoading(true);
    try {
      const response = await ordersAPI.getAvailableOrders(
        availableOrdersPage,
        ordersPerPage
      );
      
      // Map API response to the expected format
      const mappedOrders: OrderType[] = response.items.map((item: any) => ({
        id: item.id,
        status: item.status,
        origin: item.pickup_location || '',
        destination: item.delivery_location || '',
        date: new Date(item.created_at).toLocaleDateString(),
        carrier: item.carrier_id ? 'Assigned' : 'Unassigned',
        weight: item.weight || 0,
        items: item.items || [],
        customer: {
          name: item.customer_name || '',
          email: item.customer_email || '',
          phone: item.customer_phone || '',
        },
        trackingNumber: item.tracking_number || '',
        estimatedDelivery: item.delivery_deadline ? new Date(item.delivery_deadline).toLocaleDateString() : '',
      }));
      
      setAvailableOrders(mappedOrders);
      setAvailableOrdersTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch available orders:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Accept an order (carriers only)
  const handleAcceptOrder = async (orderId: number) => {
    if (user?.account_type !== 'carrier') return;
    
    setAcceptingOrderId(orderId);
    try {
      await ordersAPI.acceptOrder(orderId);
      // Refresh both lists
      fetchAvailableOrders();
      fetchOrders();
      // Show success message
      alert('Order accepted successfully!');
    } catch (error) {
      console.error('Failed to accept order:', error);
      alert('Failed to accept order. Please try again.');
    } finally {
      setAcceptingOrderId(null);
    }
  };
  
  // Apply filters and search locally
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toString().includes(term) ||
        order.origin?.toLowerCase().includes(term) ||
        order.destination?.toLowerCase().includes(term) ||
        order.carrier?.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term) ||
        order.trackingNumber?.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, filters.status, searchTerm]);
  
  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [currentPage, user]);
  
  // Fetch available orders when tab changes
  useEffect(() => {
    if (activeTab === 'available' && user?.account_type === 'carrier') {
      fetchAvailableOrders();
    }
  }, [activeTab, availableOrdersPage, user]);
  
  // Change page for my orders
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Change page for available orders
  const paginateAvailable = (pageNumber: number) => {
    setAvailableOrdersPage(pageNumber);
  };
  
  // Handle order selection
  const handleOrderSelect = (order: OrderType) => {
    setSelectedOrder(order);
    setActiveTab('details');
  };
  
  // Handle order creation
  const handleOrderCreate = async (newOrder: any) => {
    try {
      await ordersAPI.createOrder(newOrder);
      // Show success notification
      alert('Order created successfully!');
      
      // Refresh the orders list
      fetchOrders();
      
      // Go back to the orders list
      setActiveTab('list');
    } catch (error: any) {
      console.error('Failed to create order:', error);
      throw error; // Let the CreateOrderForm component handle the error display
    }
  };
  
  // Handle order status update
  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    try {
      // Ensure status value is uppercase
      const statusValue = typeof newStatus === 'string' ? newStatus.toUpperCase() as OrderStatus : newStatus;
      
      await ordersAPI.updateOrderStatus(orderId, statusValue);
      
      // Update local state for the selected order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: statusValue });
      }
      
      // Refresh orders list
      fetchOrders();
      setActiveTab('details');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };
  
  // Handle getting order by ID
  const handleGetOrderById = async (orderId: number) => {
    try {
      const order = await ordersAPI.getOrderById(orderId);
      setSelectedOrder(order);
      setActiveTab('details');
    } catch (error) {
      console.error('Failed to get order details:', error);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      {/* Header with user profile */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 py-4 px-4 md:px-6 sticky top-0 z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center w-full md:w-auto justify-between">
            <h1 className="text-xl font-bold text-white">
              <span className="text-white">UNLOD</span><span className="text-yellow-400">IN</span>
            </h1>
            
            {user && (
              <div className="flex md:hidden items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{user.name}</span>
                <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full uppercase">{user.account_type}</span>
              </div>
            )}
          </div>
          
          {user && (
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <div className="hidden md:flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-yellow-400" />
                <span>{user.name}</span>
                <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full uppercase">{user.account_type}</span>
              </div>
              
              <button 
                onClick={() => logout()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-10 flex-grow">
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
            My Orders
          </button>
          
          {user?.account_type === 'carrier' && (
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'available' 
                  ? 'bg-yellow-500 text-slate-900' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Available Orders
            </button>
          )}
          
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
          
          {user?.account_type === 'shipper' && (
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
          )}
          
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
                    <div className="flex items-center space-x-2">
                      <Filter className="text-slate-400 w-5 h-5" />
                      <select
                        className="pl-2 pr-8 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <>
                  <OrdersList
                    orders={filteredOrders}
                    onOrderSelect={handleOrderSelect}
                  />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-3 py-2 border border-slate-700 bg-slate-800 text-sm font-medium rounded-l-md hover:bg-slate-700 ${
                            currentPage === 1 ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300'
                          }`}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'bg-yellow-500 text-slate-900 border-yellow-500'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-3 py-2 border border-slate-700 bg-slate-800 text-sm font-medium rounded-r-md hover:bg-slate-700 ${
                            currentPage === totalPages ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300'
                          }`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          
          {activeTab === 'available' && user?.account_type === 'carrier' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Available Orders</h3>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <>
                  {availableOrders.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-slate-400">No available orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availableOrders.map(order => (
                        <div 
                          key={order.id}
                          className="bg-slate-800 rounded-lg shadow-md p-4 border border-slate-700 hover:border-yellow-500/50 transition-all duration-200"
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-lg text-white">Order #{order.id}</h4>
                                {order.status && <StatusBadge status={order.status} />}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400">From:</span>
                                  <span className="font-medium text-slate-200">{order.origin}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400">To:</span>
                                  <span className="font-medium text-slate-200">{order.destination}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400">Weight:</span>
                                  <span className="font-medium text-slate-200">{order.weight} kg</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex md:flex-col justify-between gap-2">
                              <button
                                onClick={() => handleOrderSelect(order)}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors flex-1"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleAcceptOrder(order.id)}
                                disabled={acceptingOrderId === order.id}
                                className={`px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg text-sm font-medium transition-colors flex-1 flex items-center justify-center ${
                                  acceptingOrderId === order.id ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                              >
                                {acceptingOrderId === order.id ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Accepting...
                                  </span>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Accept Order
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Pagination for Available Orders */}
                  {availableOrdersTotalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginateAvailable(Math.max(1, availableOrdersPage - 1))}
                          disabled={availableOrdersPage === 1}
                          className={`relative inline-flex items-center px-3 py-2 border border-slate-700 bg-slate-800 text-sm font-medium rounded-l-md hover:bg-slate-700 ${
                            availableOrdersPage === 1 ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300'
                          }`}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        
                        {Array.from({ length: availableOrdersTotalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => paginateAvailable(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              availableOrdersPage === page
                                ? 'bg-yellow-500 text-slate-900 border-yellow-500'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => paginateAvailable(Math.min(availableOrdersTotalPages, availableOrdersPage + 1))}
                          disabled={availableOrdersPage === availableOrdersTotalPages}
                          className={`relative inline-flex items-center px-3 py-2 border border-slate-700 bg-slate-800 text-sm font-medium rounded-r-md hover:bg-slate-700 ${
                            availableOrdersPage === availableOrdersTotalPages ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300'
                          }`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          
          {activeTab === 'details' && selectedOrder && (
            <OrderDetails 
              order={selectedOrder} 
              onStatusUpdate={() => setActiveTab('update')}
            />
          )}
          
          {activeTab === 'create' && (
            <CreateOrderForm onOrderCreate={handleOrderCreate} />
          )}
          
          {activeTab === 'update' && selectedOrder && (
            <UpdateOrderStatus 
              order={selectedOrder} 
              onStatusUpdate={handleStatusUpdate} 
            />
          )}
        </div>
      </div>
      
      <Footer />
      
      {/* ChatBot */}
      <div className="fixed bottom-4 right-4">
        <ChatBot />
      </div>
    </div>
  );
};

export default Orders; 
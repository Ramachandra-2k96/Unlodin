import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Package, Truck, Calendar, FileText } from 'lucide-react';
import Navbar from '../Landing/Navbar';
import Footer from '../Landing/Footer';

// Sample order data for demonstration
const sampleOrders = Array.from({ length: 50 }, (_, i) => ({
  id: `ORD-${1000 + i}`,
  status: ['In Transit', 'Delivered', 'Pending', 'Cancelled'][Math.floor(Math.random() * 4)],
  origin: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'][Math.floor(Math.random() * 5)],
  destination: ['Miami, FL', 'Seattle, WA', 'Boston, MA', 'Denver, CO', 'Atlanta, GA'][Math.floor(Math.random() * 5)],
  date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  carrier: ['FastTruck Logistics', 'Express Shipping', 'Premium Carriers', 'Route Masters', 'Reliable Transport'][Math.floor(Math.random() * 5)],
  weight: Math.floor(Math.random() * 5000) + 100,
}));

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
const OrderCard: React.FC<{ order: any }> = ({ order }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-semibold text-lg text-gray-800">{order.id}</h3>
      <StatusBadge status={order.status} />
    </div>
    
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="flex items-center gap-1.5">
        <Truck className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">From:</span>
        <span className="font-medium text-gray-800">{order.origin}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Package className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">To:</span>
        <span className="font-medium text-gray-800">{order.destination}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">Date:</span>
        <span className="font-medium text-gray-800">{order.date}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <FileText className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">Weight:</span>
        <span className="font-medium text-gray-800">{order.weight} kg</span>
      </div>
    </div>
    
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-gray-600">Carrier:</span>
        <span className="font-medium text-gray-800">{order.carrier}</span>
      </div>
    </div>
  </div>
);

const Orders: React.FC = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [filteredOrders, setFilteredOrders] = useState(sampleOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });
  
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
        order.carrier.toLowerCase().includes(term)
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
  
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">View and manage your shipment orders</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders by ID, origin, destination..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex space-x-3">
              <div className="relative">
                <select
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Statuses</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <div>
              Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
          </div>
          
          {/* Orders table (desktop) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.origin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.weight} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.carrier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Orders cards (mobile) */}
          <div className="md:hidden">
            {currentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <button
                onClick={() => paginate(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
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
                          ? 'bg-yellow-500 text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg ${
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Orders; 
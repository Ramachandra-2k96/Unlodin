import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-3 bg-red-500 rounded-full blur-md opacity-70"></div>
            <div className="relative bg-slate-900 rounded-full p-4">
              <ShieldAlert className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-slate-400 mb-8">
          You don't have permission to access this page. This area might be restricted to specific user roles.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <Link 
            to="/orders"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 rounded-lg text-slate-900 hover:bg-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go to Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 
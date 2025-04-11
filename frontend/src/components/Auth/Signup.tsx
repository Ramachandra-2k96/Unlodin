import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Home, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'shipper' | 'carrier'>('shipper');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the signup API
      await signup({
        name,
        email,
        username,
        password,
        account_type: userType
      });
      
      // Redirect to login page after successful signup
      navigate('/login', { 
        state: { 
          successMessage: 'Account created successfully! Please log in.' 
        } 
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden py-8">
      {/* Home navigation */}
      <Link to="/" className="absolute top-6 left-6 p-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 z-50 hover:bg-yellow-500/20 transition-all duration-300 group">
        <Home className="w-5 h-5 text-slate-300 group-hover:text-yellow-400 transition-colors" />
        <span className="sr-only">Back to Home</span>
      </Link>

      {/* Background particles */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9zdmc+')] bg-[length:60px_60px] z-0"></div>
      
      {/* Gradient effects */}
      <div className="absolute top-20 right-0 w-1/3 aspect-square bg-yellow-500/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-20 left-0 w-1/3 aspect-square bg-yellow-300/10 rounded-full blur-[150px] -z-10"></div>
      
      <div className="relative max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="flex items-center mb-4">
            <div className="relative mr-3">
              <div className="absolute -inset-3 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full blur-md opacity-60"></div>
              <div className="relative bg-slate-900/90 rounded-full p-3">
                <Truck className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-white">UNLOD</span><span className="text-yellow-400">IN</span>
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Create Account</h2>
          <p className="text-slate-400 text-center">Sign up to start optimizing your logistics</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 shadow-xl"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="johndoe123"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-slate-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-slate-400 hover:text-white focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setUserType('shipper')}
                  className={`relative cursor-pointer rounded-lg p-3 flex flex-col items-center border ${
                    userType === 'shipper' 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800/80'
                  } transition-all duration-200`}
                >
                  {userType === 'shipper' && (
                    <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-yellow-500" />
                  )}
                  <User className="h-6 w-6 mb-1.5 text-slate-300" />
                  <span className="text-sm font-medium text-white">Shipper</span>
                </div>
                
                <div
                  onClick={() => setUserType('carrier')}
                  className={`relative cursor-pointer rounded-lg p-3 flex flex-col items-center border ${
                    userType === 'carrier' 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800/80'
                  } transition-all duration-200`}
                >
                  {userType === 'carrier' && (
                    <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-yellow-500" />
                  )}
                  <Truck className="h-6 w-6 mb-1.5 text-slate-300" />
                  <span className="text-sm font-medium text-white">Carrier</span>
                </div>
              </div>
            </div>
            
            <div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.4)" }}
                whileTap={{ y: 0 }}
                className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-slate-900 bg-gradient-to-r from-yellow-500 to-yellow-400 font-medium hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            &copy; 2023 Unlodin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 
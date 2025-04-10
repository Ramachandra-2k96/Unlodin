import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
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
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-center">Sign in to continue to your dashboard</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  autoComplete="current-password"
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-yellow-500 focus:ring-yellow-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <div>
              <motion.button
                type="submit"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.4)" }}
                whileTap={{ y: 0 }}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-slate-900 bg-gradient-to-r from-yellow-500 to-yellow-400 font-medium hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
              >
                <span>Sign in</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors">
                Sign up
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

export default Login; 
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Login from './components/Auth/Login.tsx'
import Signup from './components/Auth/Signup.tsx'
import Orders from './components/Order/Orders.tsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx'
import Unauthorized from './components/Auth/Unauthorized.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/orders" element={<Orders />} />
          </Route>
          
          {/* Shipper only routes */}
          <Route element={<ProtectedRoute allowedRoles={['shipper']} />}>
            {/* Add shipper specific routes here if needed */}
          </Route>
          
          {/* Carrier only routes */}
          <Route element={<ProtectedRoute allowedRoles={['carrier']} />}>
            {/* Add carrier specific routes here if needed */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

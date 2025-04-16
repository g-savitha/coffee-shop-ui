import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from './utils/auth.jsx';
import NavBar from './components/NavBar.jsx';
import Login from './components/Login.jsx';
import ProductList from './components/ProductList.jsx';
import ProductForm from './components/ProductForm.jsx';
import ProductEdit from './components/ProductEdit.jsx';
import RolesInfo from './components/RolesInfo.jsx';
import StaffManagement from './components/management/StaffManagement.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Protected route component that handles authentication and role-based access
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  // Check for role-based access
  if (allowedRoles.length > 0) {
    const user = getUser();
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/products" />;
    }
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/roles-info" element={<RolesInfo />} />

        {/* Product Routes */}
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        } />

        <Route path="/add-product" element={
          <ProtectedRoute allowedRoles={['owner', 'store_manager']}>
            <ProductForm />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-product/:productId" element={
          <ProtectedRoute allowedRoles={['owner', 'store_manager', 'shift_manager']}>
            <ProductEdit />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/management/staff" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <StaffManagement />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
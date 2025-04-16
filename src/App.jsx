import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from './utils/auth.jsx';
import NavBar from './components/NavBar.jsx';
import Login from './components/Login.jsx';
import ProductList from './components/ProductList.jsx';
import ProductForm from './components/ProductForm.jsx';
import ProductEdit from './components/ProductEdit.jsx';
import RolesInfo from './components/RolesInfo.jsx';
import InventoryManagement from './components/management/InventoryManagement.jsx';
import StaffManagement from './components/management/StaffManagement.jsx';
import StoreSettings from './components/management/StoreSettings.jsx';
import ReportsView from './components/management/ReportsView.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  // If roles are specified, check if the user has the required role
  if (allowedRoles.length > 0) {
    const user = getUser();
    if (!allowedRoles.includes(user.role)) {
      // Redirect to products page if user doesn't have permission
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
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/roles-info" element={<RolesInfo />} />

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

        {/* Management Routes */}
        <Route path="/management/inventory" element={
          <ProtectedRoute allowedRoles={['owner', 'store_manager', 'shift_manager']}>
            <InventoryManagement />
          </ProtectedRoute>
        } />

        <Route path="/management/reports" element={
          <ProtectedRoute allowedRoles={['owner', 'store_manager', 'shift_manager']}>
            <ReportsView />
          </ProtectedRoute>
        } />

        <Route path="/management/staff" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <StaffManagement />
          </ProtectedRoute>
        } />

        <Route path="/management/settings" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <StoreSettings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
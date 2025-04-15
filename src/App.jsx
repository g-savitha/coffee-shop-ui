import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth.jsx';
import NavBar from './components/NavBar.jsx';
import Login from './components/Login.jsx';
import ProductList from './components/ProductList.jsx';
import ProductForm from './components/ProductForm.jsx';
import RolesInfo from './components/RolesInfo.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
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
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/auth.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Dropdown, NavDropdown } from 'react-bootstrap';

const NavBar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">☕ Coffee Shop</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/roles-info">
                <i className="bi bi-info-circle me-1"></i> Roles & Permissions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <i className="bi bi-cup-hot me-1"></i> Products
              </Link>
            </li>
            {user && (user.role === 'owner' || user.role === 'store_manager') && (
              <li className="nav-item">
                <Link className="nav-link" to="/add-product">
                  <i className="bi bi-plus-circle me-1"></i> Add Product
                </Link>
              </li>
            )}
            
            {/* Management Dropdown - Only visible for appropriate roles */}
            {user && (user.role === 'owner' || user.role === 'store_manager' || user.role === 'shift_manager') && (
              <NavDropdown title={<><i className="bi bi-gear me-1"></i> Management</>} id="management-dropdown">
                
                {/* Inventory Management - Available to owners, store managers, and shift managers */}
                <NavDropdown.Item as={Link} to="/management/inventory">
                  <i className="bi bi-box me-1"></i> Inventory
                </NavDropdown.Item>
                
                {/* Reports - Available to owners, store managers, and shift managers */}
                <NavDropdown.Item as={Link} to="/management/reports">
                  <i className="bi bi-graph-up me-1"></i> Reports
                </NavDropdown.Item>
                
                {/* Store Settings - Only available to owners */}
                {user.role === 'owner' && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/management/staff">
                      <i className="bi bi-people me-1"></i> Staff Management
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/management/settings">
                      <i className="bi bi-sliders me-1"></i> Store Settings
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    <i className="bi bi-person-badge me-1"></i> 
                    {user.username} ({user.role}) 
                    {/* Display active permissions based on role */}
                    {user.role === 'owner' && (
                      <small className="ms-1 text-light-emphasis">[Full System Admin]</small>
                    )}
                    {user.role === 'store_manager' && (
                      <small className="ms-1 text-light-emphasis">[Product & Price Management]</small>
                    )}
                    {user.role === 'shift_manager' && (
                      <small className="ms-1 text-light-emphasis">[Operations Management]</small>
                    )}
                    {user.role === 'barista' && (
                      <small className="ms-1 text-light-emphasis">[Inventory Status]</small>
                    )}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
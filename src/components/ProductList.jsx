import React, { useState, useEffect } from 'react';
import api from '../utils/api.jsx';
import { getUser } from '../utils/auth.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      setLoading(false);
    }
  };

  const toggleAvailability = async (productId, currentAvailability) => {
    try {
      await api.patch(`/products/${productId}/availability`, {
        availability: !currentAvailability
      });

      setProducts(products.map(product =>
        product.id === productId
          ? { ...product, availability: !product.availability }
          : product
      ));

      setSuccessMessage('Product availability updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update availability. Check your permissions.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
      setSuccessMessage('Product deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete product. Check your permissions.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4">
      <h2>☕ Coffee Shop Products</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Special</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>
                <span className={`badge ${product.availability ? 'bg-success' : 'bg-danger'}`}>
                  {product.availability ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td>
                {product.specialtyItem && <span className="badge bg-warning text-dark">Specialty</span>}
                {product.limitedTimeOffer && <span className="badge bg-info text-dark ms-1">Limited</span>}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-1"
                  onClick={() => toggleAvailability(product.id, product.availability)}
                >
                  Toggle Availability
                </button>

                {(user.role === 'owner' || user.role === 'store_manager') && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: 'coffee',
    specialtyItem: false,
    limitedTimeOffer: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!product.name || !product.price || !product.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/api/products', {
        ...product,
        price: parseFloat(product.price)
      });
      navigate('/products');
    } catch (err) {
      setError('Failed to create product. Check your permissions.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Product</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price (₹)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
            <option value="pastry">Pastry</option>
            <option value="merchandise">Merchandise</option>
          </select>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="specialtyItem"
            name="specialtyItem"
            checked={product.specialtyItem}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="specialtyItem">
            Specialty Item
          </label>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="limitedTimeOffer"
            name="limitedTimeOffer"
            checked={product.limitedTimeOffer}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="limitedTimeOffer">
            Limited Time Offer
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Add Product</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/products')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
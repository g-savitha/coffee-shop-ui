import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api.jsx';
import { getUser } from '../utils/auth.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Spinner, Form, Button, Card } from 'react-bootstrap';

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    specialtyItem: false,
    limitedTimeOffer: false
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${productId}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch product details. ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (user.role === 'shift_manager') {
        // Shift managers can only update details, not price
        await api.patch(`/api/products/${productId}/details`, {
          name: product.name,
          category: product.category,
          specialtyItem: product.specialtyItem,
          limitedTimeOffer: product.limitedTimeOffer
        });
      } else {
        // Owner and store managers can update everything
        await api.put(`/api/products/${productId}`, {
          ...product,
          price: parseFloat(product.price)
        });
      }
      navigate('/products');
    } catch (err) {
      setError('Failed to update product. ' + (err.response?.data?.message || err.message));
    }
  };

  if (!['owner', 'store_manager', 'shift_manager'].includes(user.role)) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You don't have permission to edit products.</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header as="h5">Edit Product</Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                    disabled={user.role === 'shift_manager'}
                  />
                  {user.role === 'shift_manager' && (
                    <Form.Text className="text-muted">
                      Shift managers cannot modify product prices
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                  >
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="pastry">Pastry</option>
                    <option value="merchandise">Merchandise</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Specialty Item"
                    name="specialtyItem"
                    checked={product.specialtyItem}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Limited Time Offer"
                    name="limitedTimeOffer"
                    checked={product.limitedTimeOffer}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit">
                    Update Product
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/products')}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductEdit; 
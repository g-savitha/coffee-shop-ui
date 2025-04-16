import React, { useState, useEffect } from 'react';
import api from '../../utils/api.jsx';
import { getUser } from '../../utils/auth.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Table, Button, Modal, Form, Alert, Spinner,
  InputGroup, Badge, Card, Row, Col, Dropdown
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSort, FaFilter } from 'react-icons/fa';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: '',
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    unitPrice: 0,
    supplier: '',
    reorderLevel: 0,
    expiryDate: '',
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const user = getUser();
  const categories = ['Coffee Beans', 'Milk', 'Syrups', 'Cups', 'Food Items', 'Equipment', 'Cleaning Supplies', 'Other'];
  const units = ['kg', 'g', 'L', 'ml', 'units', 'packets', 'boxes'];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/inventory');
      setInventory(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setCurrentItem({
      id: '',
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      unitPrice: 0,
      supplier: '',
      reorderLevel: 0,
      expiryDate: '',
      notes: ''
    });
    setValidationErrors({});
    setShowAddModal(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem({ ...item });
    setValidationErrors({});
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: name === 'quantity' || name === 'unitPrice' || name === 'reorderLevel'
        ? parseFloat(value) || 0
        : value
    });

    // Clear validation error when field is corrected
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!currentItem.name.trim()) errors.name = 'Name is required';
    if (!currentItem.category) errors.category = 'Category is required';
    if (currentItem.quantity < 0) errors.quantity = 'Quantity cannot be negative';
    if (!currentItem.unit) errors.unit = 'Unit is required';
    if (currentItem.unitPrice < 0) errors.unitPrice = 'Price cannot be negative';
    if (currentItem.reorderLevel < 0) errors.reorderLevel = 'Reorder level cannot be negative';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/api/inventory', currentItem);
      setInventory([...inventory, response.data]);
      setShowAddModal(false);
      showSuccessMessage('Item added successfully!');
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await api.put(`/api/inventory/${currentItem.id}`, currentItem);
      setInventory(inventory.map(item => 
        item.id === currentItem.id ? response.data : item
      ));
      setShowEditModal(false);
      showSuccessMessage('Item updated successfully!');
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/api/inventory/${id}`);
      setInventory(inventory.filter(item => item.id !== id));
      showSuccessMessage('Item deleted successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedInventory = inventory
    .filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory ? item.category === filterCategory : true;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (typeof valueA === 'string') {
        if (sortOrder === 'asc') {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      } else {
        if (sortOrder === 'asc') {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      }
    });

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.reorderLevel).length;
  };

  const getTotalInventoryValue = () => {
    return inventory.reduce((total, item) => total + (item.quantity * item.unitPrice), 0).toFixed(2);
  };

  if (!['owner', 'store_manager', 'shift_manager'].includes(user.role)) {
    return (
      <Alert variant="danger" className="mt-4">
        <h4 className="alert-heading">Access Denied</h4>
        <p>You need manager or owner privileges to access the inventory management section.</p>
      </Alert>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Inventory Management</h2>
      
      {successMessage && (
        <Alert variant="success" className="my-3">
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" className="my-3">
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h5>Total Items</h5>
              <h3>{inventory.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h5>Low Stock Items</h5>
              <h3>
                <Badge bg={getLowStockItems() > 0 ? "warning" : "success"}>
                  {getLowStockItems()}
                </Badge>
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h5>Total Value</h5>
              <h3>₹{getTotalInventoryValue()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={handleAddItem}>
          <FaPlus className="me-1" /> Add New Item
        </Button>
        
        <div className="d-flex">
          <InputGroup className="me-2" style={{ width: '250px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary">
              <FaFilter className="me-1" /> {filterCategory || 'All Categories'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilterCategory('')}>All Categories</Dropdown.Item>
              <Dropdown.Divider />
              {categories.map(category => (
                <Dropdown.Item 
                  key={category} 
                  onClick={() => setFilterCategory(category)}
                >
                  {category}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {loading && inventory.length === 0 ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Name <FaSort className="ms-1" />
                </th>
                <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                  Category <FaSort className="ms-1" />
                </th>
                <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                  Quantity <FaSort className="ms-1" />
                </th>
                <th onClick={() => handleSort('unitPrice')} style={{ cursor: 'pointer' }}>
                  Unit Price <FaSort className="ms-1" />
                </th>
                <th onClick={() => handleSort('supplier')} style={{ cursor: 'pointer' }}>
                  Supplier <FaSort className="ms-1" />
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedInventory.length > 0 ? (
                filteredAndSortedInventory.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>
                      {item.quantity} {item.unit}
                      {item.quantity <= item.reorderLevel && (
                        <Badge bg="warning" className="ms-2">Low</Badge>
                      )}
                    </td>
                    <td>₹{item.unitPrice.toFixed(2)}</td>
                    <td>{item.supplier}</td>
                    <td>
                      <Badge bg={item.quantity === 0 ? "danger" : 
                        item.quantity <= item.reorderLevel ? "warning" : "success"}>
                        {item.quantity === 0 ? "Out of Stock" : 
                         item.quantity <= item.reorderLevel ? "Low Stock" : "In Stock"}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditItem(item)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-3">
                    {searchTerm || filterCategory ? 
                      "No items match your search criteria." : 
                      "No inventory items found. Add some items to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add Item Modal */}
      <Modal show={showAddModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Inventory Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAdd}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={currentItem.name}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={currentItem.category}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.category}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={currentItem.quantity}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      isInvalid={!!validationErrors.quantity}
                    />
                    <Form.Select
                      name="unit"
                      value={currentItem.unit}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.unit}
                    >
                      <option value="">Select Unit</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.quantity || validationErrors.unit}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit Price</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="unitPrice"
                      value={currentItem.unitPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      isInvalid={!!validationErrors.unitPrice}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.unitPrice}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Supplier</Form.Label>
                  <Form.Control
                    type="text"
                    name="supplier"
                    value={currentItem.supplier}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Reorder Level</Form.Label>
                  <Form.Control
                    type="number"
                    name="reorderLevel"
                    value={currentItem.reorderLevel}
                    onChange={handleInputChange}
                    min="0"
                    isInvalid={!!validationErrors.reorderLevel}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.reorderLevel}
                  </Form.Control.Feedback>
                  <Form.Text muted>
                    You'll get a low stock warning when quantity reaches this level.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date (if applicable)</Form.Label>
                  <Form.Control
                    type="date"
                    name="expiryDate"
                    value={currentItem.expiryDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={currentItem.notes}
                onChange={handleInputChange}
                placeholder="Additional information about this item"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitAdd} 
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Add Item'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Item Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Inventory Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEdit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={currentItem.name}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={currentItem.category}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.category}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={currentItem.quantity}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      isInvalid={!!validationErrors.quantity}
                    />
                    <Form.Select
                      name="unit"
                      value={currentItem.unit}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.unit}
                    >
                      <option value="">Select Unit</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.quantity || validationErrors.unit}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit Price</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="unitPrice"
                      value={currentItem.unitPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      isInvalid={!!validationErrors.unitPrice}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.unitPrice}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Supplier</Form.Label>
                  <Form.Control
                    type="text"
                    name="supplier"
                    value={currentItem.supplier}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Reorder Level</Form.Label>
                  <Form.Control
                    type="number"
                    name="reorderLevel"
                    value={currentItem.reorderLevel}
                    onChange={handleInputChange}
                    min="0"
                    isInvalid={!!validationErrors.reorderLevel}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.reorderLevel}
                  </Form.Control.Feedback>
                  <Form.Text muted>
                    You'll get a low stock warning when quantity reaches this level.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date (if applicable)</Form.Label>
                  <Form.Control
                    type="date"
                    name="expiryDate"
                    value={currentItem.expiryDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={currentItem.notes}
                onChange={handleInputChange}
                placeholder="Additional information about this item"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitEdit}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Update Item'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InventoryManagement; 
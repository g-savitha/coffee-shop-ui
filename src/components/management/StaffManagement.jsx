import React, { useState, useEffect } from 'react';
import api from '../../utils/api.jsx';
import { getUser } from '../../utils/auth.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Table, Button, Form, Modal, Alert, Card, 
  Badge, Spinner, Col, Row, InputGroup
} from 'react-bootstrap';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'barista',
    shift: 'morning',
    storeLocation: 'bengaluru',
    trainingLevel: 1
  });
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const user = getUser();
  const roles = ['owner', 'store_manager', 'shift_manager', 'barista'];
  const shifts = ['morning', 'afternoon', 'evening', 'night'];
  const locations = ['bengaluru', 'mall', 'downtown', 'campus'];
  
  useEffect(() => {
    fetchStaff();
  }, []);
  
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/staff');
      setStaff(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff data. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!showEditModal && !formData.password.trim()) {
      errors.password = 'Password is required for new staff';
    }
    
    if (!formData.role) {
      errors.role = 'Role is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'barista',
      shift: 'morning',
      storeLocation: 'bengaluru',
      trainingLevel: 1
    });
    setFormErrors({});
  };
  
  const handleAddStaff = async () => {
    if (!validateForm()) return;
    
    try {
      const response = await api.post('/api/staff', formData);
      setStaff([...staff, response.data]);
      setShowAddModal(false);
      resetForm();
      showSuccessMessage('Staff member added successfully!');
    } catch (err) {
      console.error('Error adding staff:', err);
      setFormErrors({
        ...formErrors,
        submit: err.response?.data?.message || 'Failed to add staff member'
      });
    }
  };
  
  const handleOpenEditModal = (staffMember) => {
    setEditingStaffId(staffMember.id);
    setFormData({
      username: staffMember.username,
      password: '', // Don't pre-fill password
      role: staffMember.role,
      shift: staffMember.shift,
      storeLocation: staffMember.storeLocation,
      trainingLevel: staffMember.trainingLevel
    });
    setShowEditModal(true);
  };
  
  const handleUpdateStaff = async () => {
    if (!validateForm()) return;
    
    const updateData = { ...formData };
    // Only include password if it's provided
    if (!updateData.password) {
      delete updateData.password;
    }
    
    try {
      const response = await api.put(`/api/staff/${editingStaffId}`, updateData);
      setStaff(staff.map(s => s.id === editingStaffId ? response.data : s));
      setShowEditModal(false);
      resetForm();
      showSuccessMessage('Staff member updated successfully!');
    } catch (err) {
      console.error('Error updating staff:', err);
      setFormErrors({
        ...formErrors,
        submit: err.response?.data?.message || 'Failed to update staff member'
      });
    }
  };
  
  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }
    
    try {
      await api.delete(`/api/staff/${id}`);
      setStaff(staff.filter(s => s.id !== id));
      showSuccessMessage('Staff member deleted successfully!');
    } catch (err) {
      console.error('Error deleting staff:', err);
      setError('Failed to delete staff member. ' + (err.response?.data?.message || err.message));
    }
  };
  
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner': return 'danger';
      case 'store_manager': return 'warning';
      case 'shift_manager': return 'info';
      case 'barista': return 'success';
      default: return 'secondary';
    }
  };
  
  if (user.role !== 'owner') {
    return (
      <Alert variant="danger" className="mt-4">
        <h4 className="alert-heading">Access Denied</h4>
        <p>You need owner privileges to access the staff management section.</p>
      </Alert>
    );
  }
  
  return (
    <div className="container mt-4">
      <Card>
        <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
          <span>Staff Management</span>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-person-plus-fill me-1"></i> Add Staff
          </Button>
        </Card.Header>
        <Card.Body>
          {successMessage && (
            <Alert variant="success" className="mb-3">
              {successMessage}
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
            </div>
          ) : staff.length === 0 ? (
            <Alert variant="info">No staff members found.</Alert>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Shift</th>
                  <th>Store Location</th>
                  <th>Training Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(member => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.username}</td>
                    <td>
                      <Badge bg={getRoleBadgeColor(member.role)}>
                        {member.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td>{member.shift}</td>
                    <td>{member.storeLocation}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2">{member.trainingLevel}</span>
                        <div className="progress flex-grow-1" style={{ height: '0.5rem' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ width: `${member.trainingLevel * 20}%` }}
                            aria-valuenow={member.trainingLevel} 
                            aria-valuemin="0" 
                            aria-valuemax="5">
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        onClick={() => handleOpenEditModal(member)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteStaff(member.id)}
                        disabled={member.id === user.id}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      {/* Add Staff Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Staff Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formErrors.submit && (
            <Alert variant="danger">
              {formErrors.submit}
            </Alert>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                isInvalid={!!formErrors.username}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.username}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                isInvalid={!!formErrors.password}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.password}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role.replace('_', ' ')}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Shift</Form.Label>
                  <Form.Select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                  >
                    {shifts.map(shift => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Store Location</Form.Label>
                  <Form.Select
                    name="storeLocation"
                    value={formData.storeLocation}
                    onChange={handleInputChange}
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Training Level (1-5)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="trainingLevel"
                      value={formData.trainingLevel}
                      onChange={handleInputChange}
                      min="1"
                      max="5"
                    />
                    <InputGroup.Text>
                      <i className="bi bi-star-fill"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddStaff}>
            Add Staff
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Edit Staff Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Staff Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formErrors.submit && (
            <Alert variant="danger">
              {formErrors.submit}
            </Alert>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                isInvalid={!!formErrors.username}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.username}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>
                Password
                <span className="text-muted ms-2">(Leave blank to keep current password)</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                isInvalid={!!formErrors.password}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.password}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={editingStaffId === user.id} // Can't change own role
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role.replace('_', ' ')}
                      </option>
                    ))}
                  </Form.Select>
                  {editingStaffId === user.id && (
                    <Form.Text className="text-muted">
                      You cannot change your own role
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Shift</Form.Label>
                  <Form.Select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                  >
                    {shifts.map(shift => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Store Location</Form.Label>
                  <Form.Select
                    name="storeLocation"
                    value={formData.storeLocation}
                    onChange={handleInputChange}
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Training Level (1-5)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="trainingLevel"
                      value={formData.trainingLevel}
                      onChange={handleInputChange}
                      min="1"
                      max="5"
                    />
                    <InputGroup.Text>
                      <i className="bi bi-star-fill"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStaff}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffManagement; 
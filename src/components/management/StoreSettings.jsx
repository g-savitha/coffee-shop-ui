import React, { useState, useEffect } from 'react';
import api from '../../utils/api.jsx';
import { getUser } from '../../utils/auth.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Card, Form, Button, Alert, Row, Col, Spinner,
  Tab, Tabs, InputGroup, ToggleButton, ButtonGroup
} from 'react-bootstrap';

const StoreSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [settings, setSettings] = useState({
    storeName: '',
    storeAddress: '',
    contactEmail: '',
    contactPhone: '',
    openingHours: {
      monday: { open: '08:00', close: '20:00', isClosed: false },
      tuesday: { open: '08:00', close: '20:00', isClosed: false },
      wednesday: { open: '08:00', close: '20:00', isClosed: false },
      thursday: { open: '08:00', close: '20:00', isClosed: false },
      friday: { open: '08:00', close: '20:00', isClosed: false },
      saturday: { open: '09:00', close: '18:00', isClosed: false },
      sunday: { open: '10:00', close: '16:00', isClosed: true }
    },
    taxRate: 18,
    currency: 'INR',
    receiptFooter: 'Thank you for visiting our coffee shop!',
    logoUrl: '',
    enableLoyaltyProgram: true,
    pointsPerPurchase: 10,
    pointsRedemptionThreshold: 100,
    discountPercentage: 10
  });
  
  const user = getUser();
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/settings');
      setSettings(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load store settings. ' + (err.response?.data?.message || err.message));
      // If we can't load settings, we'll use the defaults defined in state
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const handleNestedInputChange = (category, field, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    });
  };
  
  const handleOpeningHoursChange = (day, field, value) => {
    setSettings({
      ...settings,
      openingHours: {
        ...settings.openingHours,
        [day]: {
          ...settings.openingHours[day],
          [field]: field === 'isClosed' ? value === 'true' : value
        }
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.put('/api/settings', settings);
      setSettings(response.data);
      showSuccessMessage('Store settings updated successfully!');
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings. ' + (err.response?.data?.message || err.message));
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
  
  if (user.role !== 'owner') {
    return (
      <Alert variant="danger" className="mt-4">
        <h4 className="alert-heading">Access Denied</h4>
        <p>You need owner privileges to access the store settings section.</p>
      </Alert>
    );
  }
  
  return (
    <div className="container mt-4">
      <Card>
        <Card.Header as="h5">Store Settings</Card.Header>
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
          ) : (
            <Tabs defaultActiveKey="general" className="mb-4">
              <Tab eventKey="general" title="General">
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Store Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="storeName"
                          value={settings.storeName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Store Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="storeAddress"
                          value={settings.storeAddress}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="contactEmail"
                          value={settings.contactEmail}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="contactPhone"
                          value={settings.contactPhone}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tax Rate (%)</Form.Label>
                        <Form.Control
                          type="number"
                          name="taxRate"
                          value={settings.taxRate}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Currency</Form.Label>
                        <Form.Select
                          name="currency"
                          value={settings.currency}
                          onChange={handleInputChange}
                        >
                          {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Receipt Footer</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="receiptFooter"
                      value={settings.receiptFooter}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Logo URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="logoUrl"
                      value={settings.logoUrl}
                      onChange={handleInputChange}
                      placeholder="URL to your store logo"
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                    </Button>
                  </div>
                </Form>
              </Tab>
              
              <Tab eventKey="hours" title="Opening Hours">
                <Form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <p className="text-muted">Configure your store's opening hours for each day of the week.</p>
                  </div>
                  
                  {days.map((day) => (
                    <Row key={day} className="mb-3 align-items-center">
                      <Col md={2}>
                        <Form.Label className="text-capitalize">{day}</Form.Label>
                      </Col>
                      <Col md={2}>
                        <ButtonGroup className="mb-2">
                          <ToggleButton
                            type="radio"
                            variant={settings.openingHours[day].isClosed ? 'outline-secondary' : 'success'}
                            name={`status-${day}`}
                            value="false"
                            checked={!settings.openingHours[day].isClosed}
                            onChange={(e) => handleOpeningHoursChange(day, 'isClosed', e.target.value)}
                          >
                            Open
                          </ToggleButton>
                          <ToggleButton
                            type="radio"
                            variant={settings.openingHours[day].isClosed ? 'danger' : 'outline-secondary'}
                            name={`status-${day}`}
                            value="true"
                            checked={settings.openingHours[day].isClosed}
                            onChange={(e) => handleOpeningHoursChange(day, 'isClosed', e.target.value)}
                          >
                            Closed
                          </ToggleButton>
                        </ButtonGroup>
                      </Col>
                      <Col md={8}>
                        {!settings.openingHours[day].isClosed && (
                          <Row>
                            <Col md={5}>
                              <InputGroup>
                                <InputGroup.Text>Open</InputGroup.Text>
                                <Form.Control
                                  type="time"
                                  value={settings.openingHours[day].open}
                                  onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                                  disabled={settings.openingHours[day].isClosed}
                                />
                              </InputGroup>
                            </Col>
                            <Col md={5}>
                              <InputGroup>
                                <InputGroup.Text>Close</InputGroup.Text>
                                <Form.Control
                                  type="time"
                                  value={settings.openingHours[day].close}
                                  onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                                  disabled={settings.openingHours[day].isClosed}
                                />
                              </InputGroup>
                            </Col>
                          </Row>
                        )}
                      </Col>
                    </Row>
                  ))}
                  
                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : 'Save Hours'}
                    </Button>
                  </div>
                </Form>
              </Tab>
              
              <Tab eventKey="loyalty" title="Loyalty Program">
                <Form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <p className="text-muted">Configure your loyalty program settings to reward your regular customers.</p>
                  </div>
                  
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="enableLoyaltyProgram"
                      label="Enable Loyalty Program"
                      checked={settings.enableLoyaltyProgram}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'enableLoyaltyProgram',
                          value: e.target.checked
                        }
                      })}
                    />
                  </Form.Group>
                  
                  {settings.enableLoyaltyProgram && (
                    <>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Points Per Purchase</Form.Label>
                            <Form.Control
                              type="number"
                              name="pointsPerPurchase"
                              value={settings.pointsPerPurchase}
                              onChange={handleInputChange}
                              min="1"
                            />
                            <Form.Text className="text-muted">
                              The number of points a customer earns per purchase
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Redemption Threshold</Form.Label>
                            <Form.Control
                              type="number"
                              name="pointsRedemptionThreshold"
                              value={settings.pointsRedemptionThreshold}
                              onChange={handleInputChange}
                              min="1"
                            />
                            <Form.Text className="text-muted">
                              The minimum points required for a customer to redeem a reward
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Discount Percentage</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            name="discountPercentage"
                            value={settings.discountPercentage}
                            onChange={handleInputChange}
                            min="1"
                            max="100"
                          />
                          <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                        <Form.Text className="text-muted">
                          The percentage discount applied when redeeming points
                        </Form.Text>
                      </Form.Group>
                    </>
                  )}
                  
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : 'Save Loyalty Settings'}
                    </Button>
                  </div>
                </Form>
              </Tab>
            </Tabs>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StoreSettings; 
import React, { useState, useEffect } from 'react';
import api from '../../utils/api.jsx';
import { getUser } from '../../utils/auth.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Alert, Spinner, Table, Badge } from 'react-bootstrap';

const ReportsView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState(null);
  const user = getUser();

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await api.get('/api/products/reports/inventory');
      setReportData(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch report: ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="mt-4">
      {error}
      {user.role !== 'owner' && user.role !== 'store_manager' && user.role !== 'shift_manager' && (
        <p className="mt-2">
          Note: You need at least Shift Manager role to access reports.
        </p>
      )}
    </Alert>
  );

  if (!reportData) return (
    <Alert variant="warning" className="mt-4">
      No report data available
    </Alert>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mt-4">
      <h2>Inventory Report</h2>
      <p className="text-muted">
        View inventory status and product statistics
        {user.role === 'shift_manager' && " (Shift Managers have limited report access)"}
      </p>

      <div className="row">
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header className="bg-primary text-white">
              Product Summary
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <th>Total Products</th>
                    <td>{reportData.totalProducts}</td>
                  </tr>
                  <tr>
                    <th>Available Products</th>
                    <td>
                      <Badge bg="success">{reportData.availableProducts}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <th>Unavailable Products</th>
                    <td>
                      <Badge bg="danger">{reportData.unavailableProducts}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <th>Specialty Items</th>
                    <td>
                      <Badge bg="warning" text="dark">{reportData.specialtyItemsCount}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <th>Limited Time Offers</th>
                    <td>
                      <Badge bg="info">{reportData.limitedTimeOffersCount}</Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header className="bg-primary text-white">
              Products by Category
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(reportData.categories).map(([category, count]) => (
                    <tr key={category}>
                      <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Footer className="text-muted">
          Report generated at: {formatDate(reportData.generatedAt)}
        </Card.Footer>
      </Card>

      {(user.role === 'owner' || user.role === 'store_manager') && (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          As {user.role === 'owner' ? 'an owner' : 'a store manager'}, you have access to additional reports like sales reports and financial data.
        </Alert>
      )}
    </div>
  );
};

export default ReportsView; 
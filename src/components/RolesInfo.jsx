import React, { useState } from 'react';
import { Card, Accordion, Table, Badge } from 'react-bootstrap';

const RolesInfo = () => {
  const [activeKey, setActiveKey] = useState('0');

  const roles = [
    {
      name: 'Owner',
      description: 'Has full access to all features and can override most restrictions.',
      rbacPermissions: [
        'manage_staff', 'manage_products', 'manage_prices', 
        'view_reports', 'manage_store'
      ],
      abacCapabilities: [
        'Can modify all products regardless of creator',
        'Can work outside assigned shift hours',
        'Can modify specialty items regardless of training level',
        'Can modify limited-time offers',
        'Not restricted by time of day or current shift'
      ],
      canDo: [
        'Create new products',
        'Delete any product',
        'Modify any product, including specialty items',
        'Change prices at any time',
        'Update product availability',
        'Access all parts of the system 24/7',
        'Override most restrictions'
      ],
      badgeColor: 'danger'
    },
    {
      name: 'Store Manager',
      description: 'Manages store operations and has broad access to product management.',
      rbacPermissions: [
        'manage_products', 'manage_prices', 
        'view_reports', 'manage_schedule'
      ],
      abacCapabilities: [
        'Can modify any product regardless of creator',
        'Can work outside assigned shift hours',
        'Can modify specialty items regardless of training level',
        'Can modify limited-time offers',
        'Has flexibility with time-based restrictions'
      ],
      canDo: [
        'Create new products',
        'Delete products',
        'Update any product details',
        'Modify specialty items',
        'Change prices',
        'Update product availability',
        'Work outside their assigned shift'
      ],
      badgeColor: 'primary'
    },
    {
      name: 'Shift Manager',
      description: 'Manages day-to-day operations during their assigned shift.',
      rbacPermissions: [
        'update_products', 'view_reports', 'manage_shift'
      ],
      abacCapabilities: [
        'Can only modify regular products (not specialty items without sufficient training)',
        'Cannot modify products outside their shift hours',
        'Can modify limited-time offers only if they created them',
        'Subject to time-of-day restrictions based on assigned shift'
      ],
      canDo: [
        'Update regular product details during their shift',
        'Modify specialty items only with training level ≥ 3 AND if they created the item',
        'Update product availability',
        'Cannot create or delete products',
        'Cannot work outside assigned shift hours'
      ],
      badgeColor: 'success'
    },
    {
      name: 'Barista',
      description: 'Front-line staff with limited system access focused on product availability.',
      rbacPermissions: [
        'view_products', 'update_availability'
      ],
      abacCapabilities: [
        'Very limited ability to modify products (mostly just availability)',
        'Cannot work outside assigned shift',
        'Cannot modify specialty items without high training',
        'Subject to strict time-of-day restrictions'
      ],
      canDo: [
        'View all products',
        'Update product availability (mark items as in/out of stock)',
        'Cannot change product details, prices, or categories',
        'Cannot create or delete products',
        'Cannot work outside assigned shift'
      ],
      badgeColor: 'info'
    }
  ];

  return (
    <div className="container my-4">
      <Card>
        <Card.Header as="h4" className="text-center bg-dark text-white">
          Role Permissions &amp; Access Control System
        </Card.Header>
        <Card.Body>
          <p className="lead">
            This application demonstrates both Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC).
          </p>
          <p>
            <strong>RBAC</strong>: Permissions are assigned to roles, and users inherit permissions from their role.
            <br />
            <strong>ABAC</strong>: Access is determined dynamically based on attributes of the user, resource, action, and environment.
          </p>

          <h5 className="mt-4">Available Roles:</h5>
          <div className="d-flex flex-wrap mb-3">
            {roles.map((role, index) => (
              <Badge 
                key={index} 
                bg={role.badgeColor} 
                className="me-2 mb-2 p-2"
                style={{ cursor: 'pointer' }} 
                onClick={() => setActiveKey(index.toString())}
              >
                {role.name}
              </Badge>
            ))}
          </div>

          <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
            {roles.map((role, index) => (
              <Accordion.Item key={index} eventKey={index.toString()}>
                <Accordion.Header>
                  <strong>{role.name}</strong> - {role.description}
                </Accordion.Header>
                <Accordion.Body>
                  <h6 className="mt-2">RBAC Permissions:</h6>
                  <div className="mb-3">
                    {role.rbacPermissions.map((perm, i) => (
                      <Badge key={i} bg="secondary" className="me-2 mb-1">{perm}</Badge>
                    ))}
                  </div>

                  <h6 className="mt-3">ABAC Capabilities:</h6>
                  <ul className="small">
                    {role.abacCapabilities.map((cap, i) => (
                      <li key={i}>{cap}</li>
                    ))}
                  </ul>

                  <h6 className="mt-3">In Practice, {role.name}s Can:</h6>
                  <ul className="small">
                    {role.canDo.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card.Body>
        <Card.Footer className="text-muted">
          <h6 className="mb-2">Test Accounts:</h6>
          <Table size="sm" bordered responsive>
            <thead>
              <tr>
                <th>Role</th>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Owner</td>
                <td>owner</td>
                <td>owner123</td>
              </tr>
              <tr>
                <td>Store Manager</td>
                <td>manager</td>
                <td>manager123</td>
              </tr>
              <tr>
                <td>Shift Manager</td>
                <td>shift_lead</td>
                <td>shift123</td>
              </tr>
              <tr>
                <td>Barista</td>
                <td>barista</td>
                <td>barista123</td>
              </tr>
            </tbody>
          </Table>
          <p className="small text-center mt-3">
            Try logging in with different accounts to experience varying levels of access.
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default RolesInfo; 
import React, { useState } from 'react';
import { Card, Accordion, Table, Badge } from 'react-bootstrap';

/**
 * Component that displays information about the role-based access control system
 */
const RolesInfo = () => {
  const [activeKey, setActiveKey] = useState('0');

  // Role definitions with permissions and capabilities
  const roles = [
    {
      name: 'Owner',
      description: 'Has full access to all features and system administration.',
      rbacPermissions: [
        'manage_products', 'update_availability', 'manage_staff', 'manage_prices'
      ],
      canDo: [
        'Create new products',
        'Delete any product',
        'Modify any product',
        'Update product availability',
        'Manage staff accounts',
        'Has all permissions by default'
      ],
      badgeColor: 'danger'
    },
    {
      name: 'Store Manager',
      description: 'Manages products.',
      rbacPermissions: [
        'manage_products', 'update_availability', 'manage_prices'
      ],
      canDo: [
        'Create new products',
        'Delete products',
        'Update product availability',
        'Modify product prices'
      ],
      badgeColor: 'primary'
    },
    {
      name: 'Shift Manager',
      description: 'Manages day-to-day operations.',
      rbacPermissions: [
        'update_availability', 'update_products'
      ],
      canDo: [
        'Update product availability',
        'Update product details (except prices)',
        'Cannot create or delete products'
      ],
      badgeColor: 'success'
    },
    {
      name: 'Barista',
      description: 'Front-line staff with limited system access.',
      rbacPermissions: [
        'update_availability'
      ],
      canDo: [
        'View all products',
        'Update product availability (mark items as in/out of stock)',
        'Cannot create, modify, or delete products',
        'Cannot access management features'
      ],
      badgeColor: 'info'
    }
  ];

  // Test accounts for demonstration
  const testAccounts = [
    { role: 'Owner', username: 'owner', password: 'owner123' },
    { role: 'Store Manager', username: 'manager', password: 'manager123' },
    { role: 'Shift Manager', username: 'shift_lead', password: 'shift123' },
    { role: 'Barista', username: 'barista', password: 'barista123' }
  ];

  return (
    <div className="container my-4">
      <Card>
        <Card.Header as="h4" className="text-center bg-dark text-white">
          Role-Based Access Control System
        </Card.Header>
        
        <Card.Body>
          {/* Introduction */}
          <p className="lead">
            This application demonstrates Role-Based Access Control (RBAC).
          </p>
          <p>
            <strong>RBAC</strong>: Permissions are assigned to roles, and users inherit permissions from their role.
          </p>

          {/* Role Selection */}
          <h5 className="mt-4">Available Roles (Highest to Lowest Privileges):</h5>
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

          {/* Role Details Accordion */}
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
          
          {/* Implementation Note */}
          <div className="alert alert-info mt-4">
            <h6>Note on Feature Implementation:</h6>
            <p className="small mb-0">
              This application demonstrates product management with role-based permissions.
              Only staff management for owners and product management for appropriate roles are fully implemented.
            </p>
          </div>
        </Card.Body>
        
        {/* Test Accounts */}
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
              {testAccounts.map((account, index) => (
                <tr key={index}>
                  <td>{account.role}</td>
                  <td>{account.username}</td>
                  <td>{account.password}</td>
                </tr>
              ))}
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

import React, { useState } from 'react';
import { Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import UserTag from './UserTag';
import './PodForm.css';

const PodForm = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [podName, setPodName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [functionalArea, setFunctionalArea] = useState(initialData.functionalArea || '');
  const [builders, setBuilders] = useState(initialData.builders || []);
  const [stakeholders, setStakeholders] = useState(initialData.stakeholders || []);
  const [productOwners, setProductOwners] = useState(initialData.productOwners || []);
  
  const functionalAreas = [
    'Engineering',
    'Marketing',
    'Sales',
    'Customer Support',
    'Product',
    'Design'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: podName,
      description,
      functionalArea,
      builders,
      stakeholders,
      productOwners
    });
  };

  const handleRemoveUser = (userType, userIndex) => {
    if (userType === 'builder') {
      setBuilders(builders.filter((_, index) => index !== userIndex));
    } else if (userType === 'stakeholder') {
      setStakeholders(stakeholders.filter((_, index) => index !== userIndex));
    } else if (userType === 'productOwner') {
      setProductOwners(productOwners.filter((_, index) => index !== userIndex));
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initialData.id ? 'Edit Pod' : 'Create New Pod'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Container className="m-0">
            <Row className="mb-3 mr-3 rowFlex">
              <Form.Group className="flexItem col-4" as={Col} md="6" controlId="podName">
                <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter pod name"
                  value={podName}
                  onChange={(e) => setPodName(e.target.value)}
                  required
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="flexItem col-1" as={Col} md="6" controlId="functionalArea">
                <Form.Label>Functional area</Form.Label>
                <Form.Select
                  value={functionalArea}
                  onChange={(e) => setFunctionalArea(e.target.value)}
                >
                  <option key="placeholder" value="">Select functional area</option>
                  {functionalAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            
            <Row className="mb-3 mr-3 rowFlex">
              <Form.Group className="flexItem" as={Col} md="12" controlId="podDescription">
                <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter pod description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>
            </Row>
            
            <Row className="mb-3 mr-3 rowFlex">
              <Col md={4}>
                <Form.Group controlId="builders">
                  <Form.Label>Builders<span className="text-danger">*</span></Form.Label>
                  <div className="user-selection-area">
                    {builders.map((user, index) => (
                      <UserTag 
                        key={index} 
                        user={user} 
                        onRemove={() => handleRemoveUser('builder', index)} 
                      />
                    ))}
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="add-user-btn"
                      onClick={() => setBuilders([...builders, { email: 'user@example.com', role: 'Builder' }])}
                    >
                      <FontAwesomeIcon icon={faUser} /> Add Builder
                    </Button>
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group controlId="productOwners">
                  <Form.Label>Product Owners</Form.Label>
                  <div className="user-selection-area">
                    {productOwners.map((user, index) => (
                      <UserTag 
                        key={index} 
                        user={user} 
                        onRemove={() => handleRemoveUser('productOwner', index)} 
                      />
                    ))}
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="add-user-btn"
                      onClick={() => setProductOwners([...productOwners, { email: 'user@example.com', role: 'Product Owner' }])}
                    >
                      <FontAwesomeIcon icon={faUser} /> Add Product Owner
                    </Button>
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group controlId="stakeholders">
                  <Form.Label>Stakeholders</Form.Label>
                  <div className="user-selection-area">
                    {stakeholders.map((user, index) => (
                      <UserTag 
                        key={index} 
                        user={user} 
                        onRemove={() => handleRemoveUser('stakeholder', index)} 
                      />
                    ))}
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="add-user-btn"
                      onClick={() => setStakeholders([...stakeholders, { email: 'user@example.com', role: 'Stakeholder' }])}
                    >
                      <FontAwesomeIcon icon={faUser} /> Add Stakeholder
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" className="addModalBtn" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="danger" className="addModalBtn" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PodForm;


import React, { useState, useEffect, useMemo } from 'react';
import { Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './PodForm.css';
import UserTag from './UserTag';

const PodForm = ({ isOpen, onClose, onSubmit, initialData = {}, title = "Edit POD" }) => {
  const [podName, setPodName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [functionalArea, setFunctionalArea] = useState(initialData.functionalArea || '');
  const [editorContentBuilder, setEditorContentBuilder] = useState('');
  const [editorContentStakeholder, setEditorContentStakeholder] = useState('');
  const [editorContentProductOwner, setEditorContentProductOwner] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Get default functional areas from props or use our default list
  const functionalAreas = [
    'Finance',
    'Marketing',
    'Engineering',
    'Product',
    'Design',
    'Sales',
    'Customer Support',
    'HR',
    'Operations'
  ];

  // Mock mentioning functionality
  let userFetchTimeOut;
  const quillSearch = (searchTerm, renderList, mentionChar) => {
    clearTimeout(userFetchTimeOut);
    if (searchTerm.length >= 3) {
      userFetchTimeOut = setTimeout(() => {
        // In a real app, this would call an API
        // Mocking the behavior for now
        console.log(`Searching for ${searchTerm}`);
      }, 1000);
    }
  };

  // Setup Quill editor modules
  const module = useMemo(
    () => ({
      toolbar: false,
      clipboard: {
        matchVisual: false,
      },
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö0-9_.]*$/,
        mentionDenotationChars: ['@'],
        onSelect: function (item, insertItem) {
          insertItem(item);
        },
        source: quillSearch,
      },
    }),
    []
  );

  // Handle Quill editor changes
  const handleQuillBuilder = (content) => {
    setEditorContentBuilder(content);
  };

  const handleQuillStakeholder = (content) => {
    setEditorContentStakeholder(content);
  };

  const handleQuillProductOwner = (content) => {
    setEditorContentProductOwner(content);
  };

  useEffect(() => {
    if (initialData) {
      setPodName(initialData.name || '');
      setDescription(initialData.description || '');
      setFunctionalArea(initialData.functionalArea || '');
      
      // Handle builder content
      if (initialData.builders && initialData.builders.length > 0) {
        const builderContent = initialData.builders.map(user => 
          `<span class="mention" data-index="0" data-denotation-char="@" data-id="${user.email}" data-value="${user.name}">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${user.name}</span>﻿</span>`
        ).join(' ');
        setEditorContentBuilder(`<p>${builderContent}</p>`);
      }

      // Handle product owner content
      if (initialData.productOwners && initialData.productOwners.length > 0) {
        const productOwnerContent = initialData.productOwners.map(user => 
          `<span class="mention" data-index="0" data-denotation-char="@" data-id="${user.email}" data-value="${user.name}${user.role ? ` (${user.role})` : ''}">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${user.name}${user.role ? ` (${user.role})` : ''}</span>﻿</span>`
        ).join(' ');
        setEditorContentProductOwner(`<p>${productOwnerContent}</p>`);
      }

      // Handle stakeholder content
      if (initialData.stakeholders && initialData.stakeholders.length > 0) {
        const stakeholderContent = initialData.stakeholders.map(user => 
          `<span class="mention" data-index="0" data-denotation-char="@" data-id="${user.email}" data-value="${user.name}${user.role ? ` (${user.role})` : ''}">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${user.name}${user.role ? ` (${user.role})` : ''}</span>﻿</span>`
        ).join(' ');
        setEditorContentStakeholder(`<p>${stakeholderContent}</p>`);
      }
    } else {
      // Reset form
      setPodName('');
      setDescription('');
      setFunctionalArea('');
      setEditorContentBuilder('');
      setEditorContentStakeholder('');
      setEditorContentProductOwner('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Extract emails from editor content using regex
    const regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    
    // Extract builder emails
    const builderMatches = editorContentBuilder.match(regex);
    const builderEmails = builderMatches ? builderMatches.map(email => email) : [];
    
    // Extract product owner emails
    const productOwnerMatches = editorContentProductOwner.match(regex);
    const productOwnerEmails = productOwnerMatches ? productOwnerMatches.map(email => email) : [];
    
    // Extract stakeholder emails
    const stakeholderMatches = editorContentStakeholder.match(regex);
    const stakeholderEmails = stakeholderMatches ? stakeholderMatches.map(email => email) : [];
    
    // Create builders, product owners, and stakeholders objects
    const builders = builderEmails.map(email => ({
      id: Math.random().toString(),
      email,
      name: email.split('@')[0]
    }));
    
    const productOwners = productOwnerEmails.map(email => ({
      id: Math.random().toString(),
      email,
      name: email.split('@')[0]
    }));
    
    const stakeholders = stakeholderEmails.map(email => ({
      id: Math.random().toString(),
      email,
      name: email.split('@')[0]
    }));
    
    // Validate required fields
    if (!podName) {
      alert('Pod name is required');
      return;
    }
    
    if (!description) {
      alert('Description is required');
      return;
    }
    
    if (builders.length === 0) {
      alert('At least one builder is required');
      return;
    }
    
    // Check for duplicate users across roles
    const allEmails = [...builderEmails, ...productOwnerEmails, ...stakeholderEmails];
    const uniqueEmails = [...new Set(allEmails)];
    
    if (allEmails.length !== uniqueEmails.length) {
      alert('A user can only be assigned as a Builder, Stakeholder, or Product Owner.');
      return;
    }
    
    const podData = {
      id: initialData.id,
      name: podName,
      description,
      functionalArea,
      builders: builders,
      productOwners: productOwners,
      stakeholders: stakeholders,
      builders_html: editorContentBuilder,
      stakeholders_html: editorContentStakeholder,
      product_owners_html: editorContentProductOwner,
    };
    
    onSubmit(podData);
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{initialData.id ? 'Edit POD' : 'Create New POD'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        {loadingStatus ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Fetching data...</p>
          </div>
        ) : (
          <Form>
            <Container className="m-0">
              <Row className="mb-3 mr-3 rowFlex">
                <Form.Group className="flexItem col-4" as={Col} md="4">
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
                <Form.Group className="flexItem col-1" as={Col} md="4">
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
                <Form.Group className="flexItem" as={Col} md="4">
                  <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter pod description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              
              <Row className="mb-5 mr-3 mt-2 rowFlex h-25">
                <Form.Group className="flexItem col-4" as={Col} md="4">
                  <Form.Label>Builders<span className="text-danger">*</span></Form.Label>
                  <ReactQuill
                    style={{ background: '#fff' }}
                    theme="snow"
                    className="react-quill-badge"
                    value={editorContentBuilder}
                    onChange={handleQuillBuilder}
                    modules={module}
                    placeholder="select members using @ operator"
                  />
                </Form.Group>
                
                <Form.Group className="flexItem col-4" as={Col} md="4">
                  <Form.Label>Product owners</Form.Label>
                  <ReactQuill
                    style={{ background: '#fff' }}
                    theme="snow"
                    className="react-quill-badge"
                    value={editorContentProductOwner}
                    onChange={handleQuillProductOwner}
                    modules={module}
                    placeholder="select members using @ operator"
                  />
                </Form.Group>
                
                <Form.Group className="flexItem col-4" as={Col} md="4">
                  <Form.Label>Stakeholders</Form.Label>
                  <ReactQuill
                    style={{ background: '#fff' }}
                    theme="snow"
                    className="react-quill-badge"
                    value={editorContentStakeholder}
                    onChange={handleQuillStakeholder}
                    modules={module}
                    placeholder="select members using @ operator"
                  />
                </Form.Group>
              </Row>
            </Container>
          </Form>
        )}
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

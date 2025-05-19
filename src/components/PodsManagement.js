
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import PodForm from './PodForm';
import UserTag from './UserTag';
import './PodsManagement.css';

const PodsManagement = () => {
  const [pods, setPods] = useState([]);
  const [showPodForm, setShowPodForm] = useState(false);
  const [currentPod, setCurrentPod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editorContentBuilder, setEditorContentBuilder] = useState('');
  const [editorContentStakeholder, setEditorContentStakeholder] = useState('');
  const [editorContentProductOwner, setEditorContentProductOwner] = useState('');
  const [podName, setPodName] = useState('');
  const [functionalArea, setFunctionalArea] = useState('');
  const [description, setDescription] = useState('');
  const [checkBox, setCheckBox] = useState(false);

  useEffect(() => {
    // Sample data - Replace with your API call
    const samplePods = [
      {
        id: '1',
        name: 'Engineering Team Alpha',
        description: 'Core engineering team responsible for platform development',
        functionalArea: 'Engineering',
        builders: [
          { id: '1', email: 'manvendrasingh.bais@example.com', name: 'Manvendra Singh Bais' },
          { id: '2', email: 'akshay.desai@example.com', name: 'Akshay Desai', role: 'Data Engineer' }
        ],
        stakeholders: [
          { id: '5', email: 'jane.doe@example.com', name: 'Jane Doe', role: 'Stakeholder' }
        ],
        productOwners: [
          { id: '3', email: 'john.smith@example.com', name: 'John Smith', role: 'Product Owner' }
        ],
        created_on: '2023-05-15',
        created_by: 'admin@example.com',
        builder_count: 2,
        product_owner_count: 1,
        stakeholder_count: 1,
        is_active: true,
        status: 'Approved'
      },
      {
        id: '2',
        name: 'Marketing Team',
        description: 'Team responsible for marketing campaigns',
        functionalArea: 'Marketing',
        builders: [
          { id: '4', email: 'sarah.johnson@example.com', name: 'Sarah Johnson' }
        ],
        stakeholders: [],
        productOwners: [
          { id: '6', email: 'mike.brown@example.com', name: 'Mike Brown', role: 'Product Owner' }
        ],
        created_on: '2023-06-20',
        created_by: 'admin@example.com',
        builder_count: 1,
        product_owner_count: 1,
        stakeholder_count: 0,
        is_active: true,
        status: 'Approved'
      }
    ];
    setPods(samplePods);
  }, []);

  const handleCreatePod = () => {
    setCurrentPod(null);
    setShowPodForm(true);
  };

  const handleEditPod = (pod) => {
    setCurrentPod(pod);
    
    // Simulate loading members' HTML content like in the reference code
    setEditorContentBuilder(`<p><span class="mention" data-index="0" data-denotation-char="@" data-id="${pod.builders[0].email}" data-value="${pod.builders[0].name}">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${pod.builders[0].name}</span>﻿</span></p>`);
    
    if (pod.productOwners && pod.productOwners.length > 0) {
      setEditorContentProductOwner(`<p><span class="mention" data-index="0" data-denotation-char="@" data-id="${pod.productOwners[0].email}" data-value="${pod.productOwners[0].name}">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${pod.productOwners[0].name}</span>﻿</span></p>`);
    }
    
    if (pod.stakeholders && pod.stakeholders.length > 0) {
      setEditorContentStakeholder(`<p><span class="mention" data-index="0" data-denotation-char="@" data-id="${pod.stakeholders[0].email}" data-value="${pod.stakeholders[0].name}">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${pod.stakeholders[0].name}</span>﻿</span></p>`);
    }
    
    setPodName(pod.name);
    setDescription(pod.description);
    setFunctionalArea(pod.functionalArea);
    
    setShowPodForm(true);
  };

  const handleClosePodForm = () => {
    setShowPodForm(false);
    setCurrentPod(null);
  };

  const handlePodSubmit = (podData) => {
    setLoading(true);
    
    // Simulating API call delay
    setTimeout(() => {
      if (podData.id) {
        // Edit existing pod
        setPods(pods.map(pod => 
          pod.id === podData.id ? { ...pod, ...podData } : pod
        ));
      } else {
        // Create new pod
        const newPod = {
          id: Date.now().toString(), // Simple ID generation for demo
          ...podData
        };
        setPods([...pods, newPod]);
      }
      
      setLoading(false);
      setShowPodForm(false);
      setCurrentPod(null);
    }, 1000);
  };

  const handleDeletePod = (id) => {
    if (window.confirm("Are you sure you want to delete this POD?")) {
      setPods(pods.filter(pod => pod.id !== id));
    }
  };

  const handlePodDetail = (id) => {
    console.log("View details for pod:", id);
    // Navigate to pod details page in a real app
  };

  return (
    <Container className="pods-container">
      <div className="header-section">
        <h2 className="page-title">Pods Management</h2>
        <Button 
          variant="primary" 
          className="create-pod-btn" 
          onClick={handleCreatePod}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Create Pod
        </Button>
      </div>

      <Row>
        {pods.map(pod => (
          <Col key={pod.id} xs={12} className="mb-4">
            <Card className="pod-card">
              <Card.Body>
                <div className="pod-header">
                  <div>
                    <h3>{pod.name}</h3>
                    {pod.functionalArea && <span className="badge bg-secondary me-2">{pod.functionalArea}</span>}
                  </div>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="edit-pod-btn"
                    onClick={() => handleEditPod(pod)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" /> Edit
                  </Button>
                </div>
                
                <p className="pod-description">{pod.description}</p>
                
                {pod.builders.length > 0 && (
                  <div className="mb-4">
                    <div className="section-title">Builders</div>
                    <div className="d-flex flex-wrap gap-2">
                      {pod.builders.map((user) => (
                        <UserTag key={user.id} user={user} onRemove={() => {}} />
                      ))}
                    </div>
                  </div>
                )}
                
                {pod.productOwners.length > 0 && (
                  <div className="mb-4">
                    <div className="section-title">Product Owners</div>
                    <div className="d-flex flex-wrap gap-2">
                      {pod.productOwners.map((user) => (
                        <UserTag key={user.id} user={user} onRemove={() => {}} />
                      ))}
                    </div>
                  </div>
                )}
                
                {pod.stakeholders.length > 0 && (
                  <div>
                    <div className="section-title">Stakeholders</div>
                    <div className="d-flex flex-wrap gap-2">
                      {pod.stakeholders.map((user) => (
                        <UserTag key={user.id} user={user} onRemove={() => {}} />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-3 text-end">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handlePodDetail(pod.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDeletePod(pod.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <PodForm
        isOpen={showPodForm}
        onClose={handleClosePodForm}
        onSubmit={handlePodSubmit}
        initialData={currentPod}
      />
    </Container>
  );
};

export default PodsManagement;

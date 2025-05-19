
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

  useEffect(() => {
    // Sample data - Replace with your API call
    const samplePods = [
      {
        id: 1,
        name: 'Engineering Team Alpha',
        description: 'Core engineering team responsible for platform development',
        functionalArea: 'Engineering',
        builders: [
          { email: 'manvendrasingh.bais@example.com', role: 'Builder' },
          { email: 'akshay.desai@example.com', role: 'Data Engineer' }
        ],
        stakeholders: [
          { email: 'jane.doe@example.com', role: 'Stakeholder' }
        ],
        productOwners: [
          { email: 'john.smith@example.com', role: 'Product Owner' }
        ]
      },
      {
        id: 2,
        name: 'Marketing Team',
        description: 'Team responsible for marketing campaigns',
        functionalArea: 'Marketing',
        builders: [
          { email: 'sarah.johnson@example.com', role: 'Builder' }
        ],
        stakeholders: [],
        productOwners: [
          { email: 'mike.brown@example.com', role: 'Product Owner' }
        ]
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
      if (currentPod) {
        // Edit existing pod
        setPods(pods.map(pod => 
          pod.id === currentPod.id ? { ...pod, ...podData } : pod
        ));
      } else {
        // Create new pod
        const newPod = {
          id: Date.now(), // Simple ID generation for demo
          ...podData
        };
        setPods([...pods, newPod]);
      }
      
      setLoading(false);
      setShowPodForm(false);
      setCurrentPod(null);
    }, 1000);
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
                      {pod.builders.map((user, index) => (
                        <UserTag key={index} user={user} onRemove={() => {}} />
                      ))}
                    </div>
                  </div>
                )}
                
                {pod.productOwners.length > 0 && (
                  <div className="mb-4">
                    <div className="section-title">Product Owners</div>
                    <div className="d-flex flex-wrap gap-2">
                      {pod.productOwners.map((user, index) => (
                        <UserTag key={index} user={user} onRemove={() => {}} />
                      ))}
                    </div>
                  </div>
                )}
                
                {pod.stakeholders.length > 0 && (
                  <div>
                    <div className="section-title">Stakeholders</div>
                    <div className="d-flex flex-wrap gap-2">
                      {pod.stakeholders.map((user, index) => (
                        <UserTag key={index} user={user} onRemove={() => {}} />
                      ))}
                    </div>
                  </div>
                )}
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

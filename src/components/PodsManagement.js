
import React, { useState } from 'react';
import { Button, Card, Container, Grid, Typography, Box } from '@mui/material';
import { PodForm } from './PodForm';
import { toast } from "sonner";
import 'bootstrap/dist/css/bootstrap.min.css';
import './PodsManagement.css';

// Sample initial pod data
const samplePod = {
  id: 'pod-1',
  name: 'Finance Team',
  description: 'Handles all financial operations and reporting',
  functionalArea: 'Finance',
  builders: [
    { id: '1', email: 'manvendrasingh.bais@example.com', name: 'Manvendra Singh Bais' },
    { id: '2', email: 'akshay.desai@example.com', name: 'Akshay Desai', role: 'KHC Data' },
  ],
  productOwners: [
    { id: '3', email: 'vivek.bhosle@example.com', name: 'Vivek Bhosle', role: 'Global Contingent Worker' },
    { id: '4', email: 'pankaj.maddan@example.com', name: 'Pankaj Maddan', role: 'Global Contingent Worker' },
  ],
  stakeholders: [
    { id: '5', email: 'raja.manickam@example.com', name: 'Raja Manickam' },
  ],
};

const PodsManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPod, setCurrentPod] = useState(samplePod);
  
  const handleOpenForm = (pod) => {
    setCurrentPod(pod);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
  
  const handleSubmitPod = (podData) => {
    // In a real app, you'd save this to your backend
    console.log('Submitting pod:', podData);
    toast.success("POD updated successfully");
    setIsFormOpen(false);
  };

  const renderUserCard = (user) => (
    <div key={user.id} className="user-card">
      <div className="user-name">{user.name}</div>
      <div className="user-email">{user.email}</div>
      {user.role && <div className="user-role">{user.role}</div>}
    </div>
  );
  
  return (
    <Container className="pods-container">
      <Box className="header-section">
        <Typography variant="h4" component="h1" className="page-title">
          POD Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenForm()}
          className="create-pod-btn"
        >
          Create New POD
        </Button>
      </Box>
      
      <Card className="pod-card">
        <Box className="pod-header">
          <Typography variant="h5" component="h2">
            Finance Team
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => handleOpenForm(samplePod)}
            className="edit-pod-btn"
          >
            Edit POD
          </Button>
        </Box>
        <Typography className="pod-description">
          Handles all financial operations and reporting
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography className="section-title">
              Builders
            </Typography>
            <div className="user-list">
              {samplePod.builders.map(renderUserCard)}
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography className="section-title">
              Product Owners
            </Typography>
            <div className="user-list">
              {samplePod.productOwners.map(renderUserCard)}
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography className="section-title">
              Stakeholders
            </Typography>
            <div className="user-list">
              {samplePod.stakeholders.map(renderUserCard)}
            </div>
          </Grid>
        </Grid>
      </Card>
      
      <PodForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        initialData={currentPod}
        onSubmit={handleSubmitPod}
        title={currentPod ? "Edit POD" : "Create New POD"}
      />
    </Container>
  );
};

export default PodsManagement;

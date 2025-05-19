
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PodForm, PodData, User } from "./PodForm";
import { toast } from "sonner";

// Sample initial pod data
const samplePod: PodData = {
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

export const PodsManagement: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPod, setCurrentPod] = useState<PodData | undefined>(samplePod);
  
  const handleOpenForm = (pod?: PodData) => {
    setCurrentPod(pod);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
  
  const handleSubmitPod = (podData: PodData) => {
    // In a real app, you'd save this to your backend
    console.log('Submitting pod:', podData);
    toast.success("POD updated successfully");
    setIsFormOpen(false);
  };
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">POD Management</h1>
        <Button onClick={() => handleOpenForm()}>Create New POD</Button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Finance Team</h2>
          <Button variant="outline" onClick={() => handleOpenForm(samplePod)}>
            Edit POD
          </Button>
        </div>
        <p className="text-gray-600 mb-4">
          Handles all financial operations and reporting
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Builders</h3>
            <div className="space-y-2">
              {samplePod.builders.map((user) => (
                <div key={user.id} className="bg-gray-100 rounded-md p-2 text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-500">{user.email}</div>
                  {user.role && <div className="text-xs text-gray-600">{user.role}</div>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Product Owners</h3>
            <div className="space-y-2">
              {samplePod.productOwners.map((user) => (
                <div key={user.id} className="bg-gray-100 rounded-md p-2 text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-500">{user.email}</div>
                  {user.role && <div className="text-xs text-gray-600">{user.role}</div>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Stakeholders</h3>
            <div className="space-y-2">
              {samplePod.stakeholders.map((user) => (
                <div key={user.id} className="bg-gray-100 rounded-md p-2 text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-500">{user.email}</div>
                  {user.role && <div className="text-xs text-gray-600">{user.role}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <PodForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        initialData={currentPod}
        onSubmit={handleSubmitPod}
        title={currentPod ? "Edit POD" : "Create New POD"}
      />
    </div>
  );
};

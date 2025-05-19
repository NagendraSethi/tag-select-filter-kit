
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PodForm, PodData } from "./PodForm";
import { toast } from "sonner";

// Sample initial pod data
const samplePod: PodData = {
  id: 'pod-1',
  name: 'Finance Team',
  description: 'Handles all financial operations and reporting',
  functionalArea: 'Finance',
  editorContentBuilder: '<p><span class="mention" data-index="0" data-denotation-char="@" data-id="manvendrasingh.bais@example.com" data-value="Manvendra Singh Bais">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>Manvendra Singh Bais</span>﻿</span> <span class="mention" data-index="1" data-denotation-char="@" data-id="akshay.desai@example.com" data-value="Akshay Desai (KHC Data)">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>Akshay Desai (KHC Data)</span>﻿</span></p>',
  productOwners: [
    { id: '3', email: 'vivek.bhosle@example.com', name: 'Vivek Bhosle', role: 'Global Contingent Worker' },
    { id: '4', email: 'pankaj.maddan@example.com', name: 'Pankaj Maddan', role: 'Global Contingent Worker' },
  ],
  stakeholders: [
    { id: '5', email: 'raja.manickam@example.com', name: 'Raja Manickam' },
  ],
};

// Helper function to extract users from HTML content
const extractUsersFromHTML = (htmlContent: string): Array<{id: string, email: string, name: string, role?: string}> => {
  const users: Array<{id: string, email: string, name: string, role?: string}> = [];
  
  if (!htmlContent) return users;
  
  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Find all mention spans
  const mentionSpans = tempDiv.querySelectorAll('span.mention');
  
  mentionSpans.forEach(span => {
    const email = span.getAttribute('data-id') || '';
    const fullValue = span.getAttribute('data-value') || '';
    
    // Extract name and role from the data-value
    let name = fullValue;
    let role = undefined;
    
    const roleMatch = fullValue.match(/(.+?)(\s+\((.+?)\))?$/);
    if (roleMatch) {
      name = roleMatch[1];
      role = roleMatch[3];
    }
    
    users.push({
      id: email, // Using email as ID
      email,
      name,
      role
    });
  });
  
  return users;
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

  // Extract builders from the editor content to display
  const builders = currentPod ? extractUsersFromHTML(currentPod.editorContentBuilder) : [];
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">POD Management</h1>
        <Button onClick={() => handleOpenForm()}>Create New POD</Button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{currentPod?.name}</h2>
          <Button variant="outline" onClick={() => handleOpenForm(currentPod)}>
            Edit POD
          </Button>
        </div>
        <p className="text-gray-600 mb-4">
          {currentPod?.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Builders</h3>
            <div className="space-y-2">
              {builders.map((user) => (
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
              {currentPod?.productOwners.map((user) => (
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
              {currentPod?.stakeholders.map((user) => (
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

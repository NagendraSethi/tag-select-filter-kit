import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserSelector } from "./UserSelector";
import { toast } from "sonner";

// Default functional areas
const functionalAreas = [
  "Finance",
  "Marketing",
  "Engineering",
  "Product",
  "Design",
  "Sales",
  "Customer Support",
  "HR",
  "Operations"
];

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface PodData {
  id?: string;
  name: string;
  description: string;
  functionalArea: string;
  editorContentBuilder: string;
  productOwners: User[];
  stakeholders: User[];
}

interface PodFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PodData;
  onSubmit: (data: PodData) => void;
  title?: string;
}

const defaultPodData: PodData = {
  name: '',
  description: '',
  functionalArea: '',
  editorContentBuilder: '<p></p>',
  productOwners: [],
  stakeholders: [],
};

// Helper function to extract users from HTML content
const extractUsersFromHTML = (htmlContent: string): User[] => {
  const users: User[] = [];
  
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

export const PodForm: React.FC<PodFormProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  title = "Edit POD"
}) => {
  const [podData, setPodData] = useState<PodData>(initialData || defaultPodData);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Extract users from editorContentBuilder for the UserSelector component
  const [selectedBuilders, setSelectedBuilders] = useState<User[]>([]);

  useEffect(() => {
    if (initialData) {
      setPodData(initialData);
      setSelectedBuilders(extractUsersFromHTML(initialData.editorContentBuilder));
    } else {
      setPodData(defaultPodData);
      setSelectedBuilders([]);
    }
  }, [initialData, isOpen]);

  const handleInputChange = (field: keyof PodData, value: string) => {
    setPodData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Function to add a user mention to the editor content
  const handleAddUser = (userType: 'productOwners' | 'stakeholders', user: User) => {
    if (userType === 'productOwners' || userType === 'stakeholders') {
      // For product owners and stakeholders, keep the original logic
      const isInProductOwners = podData.productOwners.some(u => u.id === user.id);
      const isInStakeholders = podData.stakeholders.some(u => u.id === user.id);
      
      if (isInProductOwners || isInStakeholders) {
        toast.error("User already exists in one of the categories");
        return;
      }
      
      setPodData(prev => ({
        ...prev,
        [userType]: [...prev[userType], user]
      }));
    }
  };

  // Function to add a builder user to the editorContentBuilder
  const handleAddBuilder = (user: User) => {
    // Check if user is already in builders
    const existingBuilders = extractUsersFromHTML(podData.editorContentBuilder);
    const isAlreadyBuilder = existingBuilders.some(u => u.id === user.id);
    
    if (isAlreadyBuilder) {
      toast.error("User already exists as a builder");
      return;
    }
    
    // Prepare the user's display name with role if present
    const displayValue = user.role ? `${user.name} (${user.role})` : user.name;
    
    // Create a new span for the user mention
    const mentionSpan = `<span class="mention" data-index="0" data-denotation-char="@" data-id="${user.email}" data-value="${displayValue}">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span>${displayValue}</span>﻿</span>`;
    
    // Update the editor content by adding the new mention
    let newEditorContent = podData.editorContentBuilder;
    
    if (newEditorContent === '<p></p>' || newEditorContent === '') {
      newEditorContent = `<p>${mentionSpan}</p>`;
    } else {
      // If there's content, we need to insert it properly inside the <p> tag
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newEditorContent;
      const pTag = tempDiv.querySelector('p');
      
      if (pTag) {
        // Add a space before the new mention if there's content already
        if (pTag.innerHTML.trim() !== '') {
          pTag.innerHTML += ' ' + mentionSpan;
        } else {
          pTag.innerHTML = mentionSpan;
        }
        newEditorContent = tempDiv.innerHTML;
      } else {
        // If for some reason there's no p tag, wrap in one
        newEditorContent = `<p>${newEditorContent} ${mentionSpan}</p>`;
      }
    }
    
    setPodData(prev => ({
      ...prev,
      editorContentBuilder: newEditorContent
    }));
    
    // Update the selected builders view
    setSelectedBuilders([...existingBuilders, user]);
  };

  // Function to remove a user from the editorContentBuilder
  const handleRemoveBuilder = (userId: string) => {
    // Get email from userId since we're using email as ID
    const email = userId;
    
    // Create a temporary DOM element to parse and modify the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = podData.editorContentBuilder;
    
    // Find the mention span with the matching data-id
    const mentionSpan = tempDiv.querySelector(`span.mention[data-id="${email}"]`);
    
    if (mentionSpan) {
      // Remove the mention span
      const parent = mentionSpan.parentNode;
      if (parent) {
        // If there's text before or after (like a space), clean it up
        let contentToRemove = mentionSpan;
        
        // If the next node is a text node with just a space, remove it too
        if (mentionSpan.nextSibling && mentionSpan.nextSibling.nodeType === 3 && mentionSpan.nextSibling.nodeValue?.trim() === '') {
          parent.removeChild(mentionSpan.nextSibling);
        }
        
        parent.removeChild(contentToRemove);
        
        // Update the pod data with the new HTML
        const newEditorContent = tempDiv.innerHTML;
        setPodData(prev => ({
          ...prev,
          editorContentBuilder: newEditorContent
        }));
        
        // Update the selected builders view
        setSelectedBuilders(prev => prev.filter(u => u.id !== userId));
      }
    }
  };

  const handleRemoveUser = (userType: 'productOwners' | 'stakeholders', userId: string) => {
    setPodData(prev => ({
      ...prev,
      [userType]: prev[userType].filter(user => user.id !== userId)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!podData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!podData.description) {
      newErrors.description = 'Description is required';
    }
    
    // Check if there's at least one builder in the editor content
    const builders = extractUsersFromHTML(podData.editorContentBuilder);
    if (builders.length === 0) {
      newErrors.editorContentBuilder = 'At least one builder is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(podData);
    } else {
      toast.error("Please fill all required fields");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={podData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter pod name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="functionalArea">Functional area</Label>
              <Select
                value={podData.functionalArea}
                onValueChange={(value) => handleInputChange('functionalArea', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select functional area" />
                </SelectTrigger>
                <SelectContent>
                  {functionalAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">
                Description<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={podData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter pod description"
                className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>
                Builders<span className="text-red-500">*</span>
              </Label>
              <Card className="p-4">
                <UserSelector 
                  onSelectUser={(user) => handleAddBuilder(user)} 
                  selectedUsers={selectedBuilders}
                  onRemoveUser={(userId) => handleRemoveBuilder(userId)}
                />
                {errors.editorContentBuilder && <p className="text-sm text-red-500 mt-2">{errors.editorContentBuilder}</p>}
              </Card>
            </div>
            
            <div className="space-y-2">
              <Label>Product owners</Label>
              <Card className="p-4">
                <UserSelector 
                  onSelectUser={(user) => handleAddUser('productOwners', user)} 
                  selectedUsers={podData.productOwners}
                  onRemoveUser={(userId) => handleRemoveUser('productOwners', userId)}
                />
              </Card>
            </div>
            
            <div className="space-y-2">
              <Label>Stakeholders</Label>
              <Card className="p-4">
                <UserSelector 
                  onSelectUser={(user) => handleAddUser('stakeholders', user)} 
                  selectedUsers={podData.stakeholders}
                  onRemoveUser={(userId) => handleRemoveUser('stakeholders', userId)}
                />
              </Card>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

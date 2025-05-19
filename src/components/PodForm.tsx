
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
  builders: User[];
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
  builders: [],
  productOwners: [],
  stakeholders: [],
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

  useEffect(() => {
    if (initialData) {
      setPodData(initialData);
    } else {
      setPodData(defaultPodData);
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

  const handleAddUser = (userType: 'builders' | 'productOwners' | 'stakeholders', user: User) => {
    // Check if user already exists in any category
    const isInBuilders = podData.builders.some(u => u.id === user.id);
    const isInProductOwners = podData.productOwners.some(u => u.id === user.id);
    const isInStakeholders = podData.stakeholders.some(u => u.id === user.id);
    
    if (isInBuilders || isInProductOwners || isInStakeholders) {
      toast.error("User already exists in one of the categories");
      return;
    }
    
    setPodData(prev => ({
      ...prev,
      [userType]: [...prev[userType], user]
    }));
  };

  const handleRemoveUser = (userType: 'builders' | 'productOwners' | 'stakeholders', userId: string) => {
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
    
    if (podData.builders.length === 0) {
      newErrors.builders = 'At least one builder is required';
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
                  onSelectUser={(user) => handleAddUser('builders', user)} 
                  selectedUsers={podData.builders}
                  onRemoveUser={(userId) => handleRemoveUser('builders', userId)}
                />
                {errors.builders && <p className="text-sm text-red-500 mt-2">{errors.builders}</p>}
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

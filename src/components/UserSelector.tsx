
import React, { useState, useEffect, useRef } from 'react';
import { User } from "./PodForm";
import { Search, Users, X } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserSelectorProps {
  onSelectUser: (user: User) => void;
  selectedUsers?: User[];
  onRemoveUser?: (userId: string) => void;
  label?: string;
}

// Mock user data - in a real app, you'd fetch this from an API
const mockUsers: User[] = [
  { id: '1', email: 'manvendrasingh.bais@example.com', name: 'Manvendra Singh Bais' },
  { id: '2', email: 'akshay.desai@example.com', name: 'Akshay Desai', role: 'KHC Data' },
  { id: '3', email: 'vivek.bhosle@example.com', name: 'Vivek Bhosle', role: 'Global Contingent Worker' },
  { id: '4', email: 'pankaj.maddan@example.com', name: 'Pankaj Maddan', role: 'Global Contingent Worker' },
  { id: '5', email: 'raja.manickam@example.com', name: 'Raja Manickam' },
  { id: '6', email: 'priya.sharma@example.com', name: 'Priya Sharma' },
  { id: '7', email: 'rahul.kumar@example.com', name: 'Rahul Kumar' },
  { id: '8', email: 'neha.patel@example.com', name: 'Neha Patel' },
  { id: '9', email: 'amit.verma@example.com', name: 'Amit Verma' },
  { id: '10', email: 'deepak.singh@example.com', name: 'Deepak Singh' },
];

export const UserSelector: React.FC<UserSelectorProps> = ({ 
  onSelectUser, 
  selectedUsers = [], 
  onRemoveUser,
  label = "Search users"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editorContent, setEditorContent] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = mockUsers.filter(
        user => 
          user.name.toLowerCase().includes(lowercasedSearch) || 
          user.email.toLowerCase().includes(lowercasedSearch) ||
          (user.role && user.role.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredUsers(filtered);
      setIsOpen(true);
    } else {
      setFilteredUsers([]);
      setIsOpen(false);
    }
  }, [searchTerm]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelect = (user: User) => {
    onSelectUser(user);
    setEditorContent(''); // Clear the search field after selection
  };

  const handleRemoveUser = (userId: string) => {
    if (onRemoveUser) {
      onRemoveUser(userId);
    }
  };
  
  const handleQuillChange = (content: string) => {
    setEditorContent(content);
    
    // Extract search term from content
    const textOnly = content.replace(/<[^>]*>/g, '').trim();
    setSearchTerm(textOnly);
  };
  
  const isUserSelected = (userId: string) => {
    return selectedUsers.some(user => user.id === userId);
  };

  const quillModules = {
    toolbar: false,
  };
  
  return (
    <div className="w-full">
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <Search className="absolute left-2 top-6 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={handleQuillChange}
            modules={quillModules}
            placeholder={`${label} by name or email...`}
            className="pl-6"
          />
        </div>
        
        {isOpen && filteredUsers.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <Checkbox 
                  id={`user-${user.id}`} 
                  className="mr-2"
                  checked={isUserSelected(user.id)}
                  onCheckedChange={(checked) => {
                    if (checked && !isUserSelected(user.id)) {
                      handleSelect(user);
                    } else if (!checked && onRemoveUser && isUserSelected(user.id)) {
                      handleRemoveUser(user.id);
                    }
                  }}
                />
                <div 
                  className="flex items-center flex-grow"
                  onClick={() => {
                    if (!isUserSelected(user.id)) {
                      handleSelect(user);
                    } else if (onRemoveUser) {
                      handleRemoveUser(user.id);
                    }
                  }}
                >
                  <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  {user.role && (
                    <div className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                      {user.role}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isOpen && searchTerm.length >= 2 && filteredUsers.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>
      
      {selectedUsers.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-1 mb-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Selected users:</span>
          </div>
          <ScrollArea className="h-40 rounded-md border">
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="bg-gray-100 rounded-md p-2 text-sm flex items-center gap-2"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      {user.role && <div className="text-xs text-gray-600">{user.role}</div>}
                    </div>
                    {onRemoveUser && (
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-500 hover:text-red-700 ml-1 rounded-full hover:bg-red-100 p-1"
                        title="Remove user"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

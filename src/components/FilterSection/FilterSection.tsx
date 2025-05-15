
import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface FilterSectionProps {
  surveyTags: string[];
  userTags: string[];
  setFilterParams: (params: any) => void;
}

interface Option {
  label: string;
  value: string;
}

const FilterPill: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
      {label}
      <X className="h-3 w-3 cursor-pointer" onClick={onRemove} />
    </Badge>
  );
};

const FilterSection: React.FC<FilterSectionProps> = ({ surveyTags, userTags, setFilterParams }) => {
  const { toast } = useToast();
  const [selectedSurveyTags, setSelectedSurveyTags] = useState<Option[]>(
    JSON.parse(localStorage.getItem('selectedSurveyTags') || '[]')
  );
  
  const [selectedUserTags, setSelectedUserTags] = useState<Option[]>(
    JSON.parse(localStorage.getItem('selectedUserTags') || '[]')
  );
  
  const [selectedRole, setSelectedRole] = useState<Option[]>([]);
  const [surveyTagsOpen, setSurveyTagsOpen] = useState(false);
  const [userTagsOpen, setUserTagsOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('selectedSurveyTags', JSON.stringify(selectedSurveyTags));
    localStorage.setItem('selectedUserTags', JSON.stringify(selectedUserTags));
  }, [selectedSurveyTags, selectedUserTags]);

  const roleOptions = ['Owner', 'Assignee'].map((role) => ({ label: role, value: role }));
  const surveyOptions = surveyTags.map((tag) => ({ label: tag, value: tag }));
  const userOptions = userTags.map((tag) => ({ label: tag, value: tag }));

  const handleReset = () => {
    if (selectedSurveyTags?.length > 0 || selectedUserTags?.length > 0 || selectedRole?.length > 0) {
      setSelectedSurveyTags([]);
      setSelectedUserTags([]);
      setSelectedRole([]);
      setFilterParams({});
      toast({
        title: "Filters reset",
        description: "All filters have been cleared.",
      });
    }
  };

  const applyFilters = () => {
    if (selectedSurveyTags?.length > 0 || selectedUserTags?.length > 0 || selectedRole?.length > 0) {
      const filterParams = {
        survey_tags: selectedSurveyTags.map((tag) => tag.value),
        user_tags: selectedUserTags.map((tag) => tag.value),
        role_filters: selectedRole.map((role) => role.value),
      };
      setFilterParams(filterParams);
      toast({
        title: "Filters applied",
        description: "Your filter settings have been applied.",
      });
    } else {
      toast({
        title: "No filters selected",
        description: "Please select at least one filter to apply.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTag = (tagToRemove: Option, type: 'survey' | 'user') => {
    if (type === 'survey') {
      setSelectedSurveyTags(prev => prev.filter(tag => tag.value !== tagToRemove.value));
    } else {
      setSelectedUserTags(prev => prev.filter(tag => tag.value !== tagToRemove.value));
    }
  };

  const handleAddTag = (newTag: Option, type: 'survey' | 'user') => {
    if (type === 'survey') {
      if (!selectedSurveyTags.some(tag => tag.value === newTag.value)) {
        setSelectedSurveyTags(prev => [...prev, newTag]);
      }
    } else {
      if (!selectedUserTags.some(tag => tag.value === newTag.value)) {
        setSelectedUserTags(prev => [...prev, newTag]);
      }
    }
  };

  const handleAddRole = (role: Option) => {
    if (!selectedRole.some(r => r.value === role.value)) {
      setSelectedRole(prev => [...prev, role]);
    }
  };

  const handleRemoveRole = (roleToRemove: Option) => {
    setSelectedRole(prev => prev.filter(role => role.value !== roleToRemove.value));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-4">
        <div className="space-y-4">
          {/* Header with icon */}
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-medium">Filter Results</h3>
          </div>
          
          {/* Filter controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Survey Tags Dropdown */}
            <div className="relative">
              <div 
                className="w-full border border-gray-200 rounded-md p-2 flex justify-between items-center cursor-pointer hover:border-purple-300"
                onClick={() => setSurveyTagsOpen(!surveyTagsOpen)}
              >
                <span className="text-sm text-gray-600">
                  {selectedSurveyTags.length > 0 
                    ? `${selectedSurveyTags.length} Survey Tags` 
                    : 'Survey Tags'
                  }
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${surveyTagsOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {surveyTagsOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="p-2">
                    {surveyOptions.map((option) => (
                      <div 
                        key={option.value} 
                        className={`p-2 hover:bg-purple-50 rounded cursor-pointer flex justify-between items-center ${
                          selectedSurveyTags.some(tag => tag.value === option.value) ? 'bg-purple-50' : ''
                        }`}
                        onClick={() => {
                          const isSelected = selectedSurveyTags.some(tag => tag.value === option.value);
                          if (isSelected) {
                            handleRemoveTag(option, 'survey');
                          } else {
                            handleAddTag(option, 'survey');
                          }
                        }}
                      >
                        <span>{option.label}</span>
                        {selectedSurveyTags.some(tag => tag.value === option.value) && (
                          <div className="h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Tags Dropdown */}
            <div className="relative">
              <div 
                className="w-full border border-gray-200 rounded-md p-2 flex justify-between items-center cursor-pointer hover:border-purple-300"
                onClick={() => setUserTagsOpen(!userTagsOpen)}
              >
                <span className="text-sm text-gray-600">
                  {selectedUserTags.length > 0 
                    ? `${selectedUserTags.length} User Tags` 
                    : 'User Tags'
                  }
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${userTagsOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {userTagsOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="p-2">
                    {userOptions.map((option) => (
                      <div 
                        key={option.value} 
                        className={`p-2 hover:bg-purple-50 rounded cursor-pointer flex justify-between items-center ${
                          selectedUserTags.some(tag => tag.value === option.value) ? 'bg-purple-50' : ''
                        }`}
                        onClick={() => {
                          const isSelected = selectedUserTags.some(tag => tag.value === option.value);
                          if (isSelected) {
                            handleRemoveTag(option, 'user');
                          } else {
                            handleAddTag(option, 'user');
                          }
                        }}
                      >
                        <span>{option.label}</span>
                        {selectedUserTags.some(tag => tag.value === option.value) && (
                          <div className="h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Dropdown */}
            <div className="relative">
              <div 
                className="w-full border border-gray-200 rounded-md p-2 flex justify-between items-center cursor-pointer hover:border-purple-300"
                onClick={() => setRoleOpen(!roleOpen)}
              >
                <span className="text-sm text-gray-600">
                  {selectedRole.length > 0 
                    ? `${selectedRole.length} Roles` 
                    : 'Select Role'
                  }
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {roleOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="p-2">
                    {roleOptions.map((option) => (
                      <div 
                        key={option.value} 
                        className={`p-2 hover:bg-purple-50 rounded cursor-pointer flex justify-between items-center ${
                          selectedRole.some(role => role.value === option.value) ? 'bg-purple-50' : ''
                        }`}
                        onClick={() => {
                          const isSelected = selectedRole.some(role => role.value === option.value);
                          if (isSelected) {
                            handleRemoveRole(option);
                          } else {
                            handleAddRole(option);
                          }
                        }}
                      >
                        <span>{option.label}</span>
                        {selectedRole.some(role => role.value === option.value) && (
                          <div className="h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="default" 
                className="bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
              
              {(selectedSurveyTags?.length > 0 || selectedUserTags?.length > 0 || selectedRole?.length > 0) && (
                <Button 
                  variant="outline" 
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>
          
          {/* Selected filter pills */}
          {(selectedSurveyTags.length > 0 || selectedUserTags.length > 0 || selectedRole.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedSurveyTags.map((tag) => (
                <FilterPill
                  key={`survey-${tag.value}`}
                  label={`Survey: ${tag.label}`}
                  onRemove={() => handleRemoveTag(tag, 'survey')}
                />
              ))}
              {selectedUserTags.map((tag) => (
                <FilterPill
                  key={`user-${tag.value}`}
                  label={`User: ${tag.label}`}
                  onRemove={() => handleRemoveTag(tag, 'user')}
                />
              ))}
              {selectedRole.map((role) => (
                <FilterPill
                  key={`role-${role.value}`}
                  label={`Role: ${role.label}`}
                  onRemove={() => handleRemoveRole(role)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;

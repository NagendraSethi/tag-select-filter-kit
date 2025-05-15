
import React, { useState } from 'react';
import FilterSection from '@/components/FilterSection/FilterSection';

const Index = () => {
  const [filterParams, setFilterParams] = useState({});
  
  // Sample data for demonstration
  const sampleSurveyTags = [
    'Customer Feedback', 
    'Product Review', 
    'Website Usability', 
    'Market Research',
    'Employee Satisfaction',
    'Event Feedback'
  ];
  
  const sampleUserTags = [
    'Premium', 
    'New User', 
    'Enterprise', 
    'Trial',
    'Beta Tester',
    'Developer'
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Filter Demo</h1>
      
      <FilterSection 
        surveyTags={sampleSurveyTags}
        userTags={sampleUserTags}
        setFilterParams={setFilterParams}
      />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Applied Filters</h2>
        <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
          {JSON.stringify(filterParams, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Index;

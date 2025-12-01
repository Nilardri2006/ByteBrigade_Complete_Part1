import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import SkillInput from './SkillInput';

const SearchForm = ({ onSearch, loading }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    requiredSkills: [],
    teamSize: '3',
    includeBeginner: true
  });
  
  const [currentRequiredSkill, setCurrentRequiredSkill] = useState('');

  // FIXED: Safe skill addition with proper string handling
  const addRequiredSkill = () => {
    // Convert to string and handle null/undefined cases
    const skillToAdd = String(currentRequiredSkill || '').trim();
    
    if (!skillToAdd || searchCriteria.requiredSkills.includes(skillToAdd)) {
      return;
    }
    
    setSearchCriteria(prev => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, skillToAdd]
    }));
    
    setCurrentRequiredSkill('');
  };

  const removeRequiredSkill = (index) => {
    setSearchCriteria(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
    }));
  };

  // FIXED: Proper change handler for SkillInput
  const handleRequiredSkillChange = (e) => {
    if (e && e.target && typeof e.target.value !== 'undefined') {
      setCurrentRequiredSkill(String(e.target.value));
    }
  };

  const handleSearch = () => {
    if (searchCriteria.requiredSkills.length === 0) {
      alert('Please specify at least one required skill.');
      return;
    }
    onSearch(searchCriteria);
  };

  const handleTeamSizeChange = (e) => {
    setSearchCriteria(prev => ({
      ...prev,
      teamSize: e.target.value
    }));
  };

  const handleBeginnerToggle = (e) => {
    setSearchCriteria(prev => ({
      ...prev,
      includeBeginner: e.target.checked
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Search className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Find Your Team</h2>
      </div>

      <div className="space-y-6">
        {/* Required Skills - FIXED */}
        <div>
          <SkillInput
            label="Required Skills *"
            value={currentRequiredSkill}
            onChange={handleRequiredSkillChange}
            onAdd={addRequiredSkill}
            onRemove={removeRequiredSkill}
            skills={searchCriteria.requiredSkills}
            placeholder="Add skills you need in teammates (e.g., React, Python)"
            type="required"
            suggestions={[
              'JavaScript', 'Python', 'React', 'Node.js', 'Django', 
              'Machine Learning', 'Data Science', 'UI/UX Design',
              'Java', 'C++', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'
            ]}
            required={true}
          />
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Preferred Team Size
            </label>
            <select
              value={searchCriteria.teamSize}
              onChange={handleTeamSizeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2">2 members</option>
              <option value="3">3 members</option>
              <option value="4">4 members</option>
              <option value="5">5 members</option>
              <option value="6">6+ members</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeBeginner"
              checked={searchCriteria.includeBeginner}
              onChange={handleBeginnerToggle}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="includeBeginner" className="ml-2 text-sm text-gray-700">
              Include beginners in search results
            </label>
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-4">
          <button
            onClick={handleSearch}
            disabled={loading || searchCriteria.requiredSkills.length === 0}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search for Teammates
              </span>
            )}
          </button>
        </div>

        {/* Search Summary */}
        {searchCriteria.requiredSkills.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Search Summary:</strong> Looking for {searchCriteria.teamSize} team members 
              with skills: {searchCriteria.requiredSkills.join(', ')}
              {searchCriteria.includeBeginner ? ' (including beginners)' : ' (experienced only)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchForm;

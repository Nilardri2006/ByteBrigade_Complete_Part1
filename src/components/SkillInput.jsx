// SkillInput.jsx
import React from 'react';
import { Plus } from 'lucide-react';
import SkillTag from './SkillTag';

const SkillInput = ({ 
  label, 
  value, 
  onChange, 
  onAdd, 
  onRemove, 
  skills, 
  placeholder, 
  type = 'known', 
  suggestions = [], 
  required = false,
  disabled = false 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) {
        onAdd();
      }
    }
  };

  const handleInputChange = (e) => {
    if (!disabled) {
      onChange(e.target.value);
    }
  };

  const handleAdd = () => {
    if (!disabled) {
      onAdd();
    }
  };

  const handleRemove = (index) => {
    if (!disabled) {
      onRemove(index);
    }
  };

  return (
    <div className="skill-input">
      <label className="skill-input-label">
        {label} {required && '*'}
      </label>
      
      <div className="skill-input-container">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="skill-input-field"
          disabled={disabled}
        />
        <button 
          type="button" 
          onClick={handleAdd}
          className={`skill-add-button ${type}`}
          disabled={disabled || !value.trim()}
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="skills-list">
        {skills.map((skill, index) => (
          <SkillTag
            key={index}
            skill={skill}
            onRemove={() => handleRemove(index)}
            type={type}
            removable={!disabled}
          />
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions">
          <strong>Suggestions:</strong> {suggestions.slice(0, 10).join(', ')}...
        </div>
      )}
    </div>
  );
};

export default SkillInput;
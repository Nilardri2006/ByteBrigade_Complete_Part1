import React from 'react';
import { Plus } from 'lucide-react';
import SkillTag from './SkillTag';

const SkillInput = ({ 
  label, value, onChange, onAdd, onRemove, 
  skills, placeholder, type = 'known', suggestions = [], required = false 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="skill-input">
      <label className="skill-input-label">{label} {required && '*'}</label>
      <div className="skill-input-container">
        <input
          type="text" value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="skill-input-field"
        />
        <button type="button" onClick={onAdd} className={`skill-add-button ${type}`}>
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="skills-list">
        {skills.map((skill, index) => (
          <SkillTag key={index} skill={skill} onRemove={() => onRemove(index)} type={type} removable={true} />
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
import React from 'react';
import { X } from 'lucide-react';

const SkillTag = ({ skill, onRemove, removable = true, type = 'known' }) => {
  return (
    <span className={`skill-tag ${type}`}>
      {skill}
      {removable && (
        <button
          onClick={onRemove}
          className="skill-tag-remove"
          type="button"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};

export default SkillTag;

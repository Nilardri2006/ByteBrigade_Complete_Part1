import React from 'react';
import { X } from 'lucide-react';

const SkillTag = ({ skill, onRemove, removable = true, type = 'known' }) => {
  return (
    <span className={`skill-tag ${type}`}>
      {/* Django serializer returns the skill name directly */}
      {typeof skill === 'object' ? skill.name : skill}
      {removable && (
        <button onClick={onRemove} className="skill-tag-remove" type="button">
          <X size={12} />
        </button>
      )}
    </span>
  );
};

export default SkillTag;
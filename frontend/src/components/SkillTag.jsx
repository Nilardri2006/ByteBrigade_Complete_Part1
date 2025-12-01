import React from 'react';
import { X } from 'lucide-react';

const SkillTag = ({ skill, onRemove, removable = true, type = 'known' }) => {
  // FIXED: Extract skill name from object or use as string
  const skillName = (() => {
    if (typeof skill === 'object' && skill !== null) {
      return skill.name || String(skill);
    }
    return String(skill);
  })();

  const getTagStyle = () => {
    if (type === 'desired') {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTagStyle()}`}>
      {skillName}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black hover:bg-opacity-20 focus:outline-none focus:bg-black focus:bg-opacity-20"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default SkillTag;

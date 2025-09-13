import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import SkillTag from './SkillTag';

// Note: This component is in src/components/
// All component-to-component imports are relative to this folder.

const ProfileCard = ({ profile }) => {
  // Defensive check: If for some reason the whole profile is missing, render nothing.
  if (!profile) {
    return null;
  }

  // Use fallback empty arrays to prevent crashes
  const knownSkills = profile.knownSkills || [];
  const desiredSkills = profile.desiredSkills || [];

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h3 className="profile-name">{profile.name}</h3>
        <div className="profile-badges">
          {profile.isBeginner && (
            <span className="beginner-badge">Beginner Friendly</span>
          )}
        </div>
      </div>

      <div className="profile-links">
        {profile.email && (
          <a href={`mailto:${profile.email}`} className="profile-link">
            <FaEnvelope />
            Email
          </a>
        )}
        {profile.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
            <FaLinkedin />
            LinkedIn
          </a>
        )}
        {profile.github && (
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="profile-link">
            <FaGithub />
            GitHub
          </a>
        )}
      </div>

      {/* CORRECTED: Check the length of the fallback array */}
      {knownSkills.length > 0 && (
        <div className="skills-section">
          <h4>Known Skills</h4>
          <div className="skills-list">
            {knownSkills.map((skill, index) => (
              <SkillTag key={index} skill={skill} type="known" removable={false} />
            ))}
          </div>
        </div>
      )}

      {/* CORRECTED: Check the length of the fallback array. This was the line that crashed. */}
      {desiredSkills.length > 0 && (
        <div className="skills-section">
          <h4>Wants to Learn</h4>
          <div className="skills-list">
            {desiredSkills.map((skill, index) => (
              <SkillTag key={index} skill={skill} type="desired" removable={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
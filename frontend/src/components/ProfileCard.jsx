import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import SkillTag from './SkillTag';

const ProfileCard = ({ profile }) => {
  if (!profile) {
    return null; // Return nothing if no profile is provided
  }

  // Use fallback empty arrays to prevent crashes if skills are missing
  const knownSkills = profile.known_skills || [];
  const desiredSkills = profile.desired_skills || [];

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h3 className="profile-name">{profile.name}</h3>
        <div className="profile-badges">
          {profile.is_beginner && (
            <span className="beginner-badge">Beginner Friendly</span>
          )}
        </div>
      </div>
      <div className="profile-links">
        {profile.email && <a href={`mailto:${profile.email}`} className="profile-link"><FaEnvelope /> Email</a>}
        {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link"><FaLinkedin /> LinkedIn</a>}
        {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="profile-link"><FaGithub /> GitHub</a>}
      </div>
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
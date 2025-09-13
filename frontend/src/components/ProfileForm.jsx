import React, { useState, useEffect } from 'react';
import SkillInput from './SkillInput';
import { commonSkills } from './constants';

const ProfileForm = ({ onSubmit, onUpdate = null, editingProfile = null, loading = false }) => {
  const [profile, setProfile] = useState({
    name: '', email: '', college: '', year: '', linkedin: '', github: '',
    gender: '', knownSkills: [], desiredSkills: [], isBeginner: false,
  });

  const [currentKnownSkill, setCurrentKnownSkill] = useState('');
  const [currentDesiredSkill, setCurrentDesiredSkill] = useState('');
  
  useEffect(() => {
    if (editingProfile) {
      const formatSkills = (skillsArray) => {
        if (!Array.isArray(skillsArray)) return [];
        return skillsArray; // API returns a flat array of strings
      };
      setProfile({
        name: editingProfile.name || '',
        email: editingProfile.email || '',
        college: editingProfile.college || '',
        year: editingProfile.year || '',
        linkedin: editingProfile.linkedin || '',
        github: editingProfile.github || '',
        gender: editingProfile.gender || '',
        isBeginner: editingProfile.is_beginner || false,
        knownSkills: formatSkills(editingProfile.known_skills),
        desiredSkills: formatSkills(editingProfile.desired_skills),
      });
    }
  }, [editingProfile]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addSkill = (skill, type) => {
    if (!skill.trim() || profile[type].includes(skill.trim())) return;
    setProfile(prev => ({ ...prev, [type]: [...prev[type], skill.trim()] }));
  };

  const removeSkill = (index, type) => {
    setProfile(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.email || profile.knownSkills.length === 0) {
      alert('Please fill in name, email, and at least one known skill.');
      return;
    }
    
    if (editingProfile && onUpdate) {
      await onUpdate(profile);
    } else if (onSubmit) {
      await onSubmit(profile);
    }
  };

  return (
    <div className="profile-form">
      <div className="form-card">
        <h2 className="form-title">{editingProfile ? 'Update Your Profile' : 'Create Your Developer Profile'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Name *</label><input type="text" name="name" value={profile.name} onChange={handleFieldChange} className="form-input" required disabled={!!editingProfile} /></div>
            <div className="form-group"><label className="form-label">Email *</label><input type="email" name="email" value={profile.email} onChange={handleFieldChange} className="form-input" required disabled={!!editingProfile} /></div>
            <div className="form-group"><label className="form-label">Gender</label><select name="gender" value={profile.gender} onChange={handleFieldChange} className="form-select" disabled={!!editingProfile}><option value="">Select...</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer-not-to-say">Prefer not to say</option></select></div>
          </div>
          <div className="url-grid">
            <div className="form-group"><label className="form-label">LinkedIn URL</label><input type="url" name="linkedin" value={profile.linkedin} onChange={handleFieldChange} className="form-input" placeholder="https://linkedin.com/in/yourprofile" disabled={!!editingProfile} /></div>
            <div className="form-group"><label className="form-label">GitHub URL</label><input type="url" name="github" value={profile.github} onChange={handleFieldChange} className="form-input" placeholder="https://github.com/yourusername" disabled={!!editingProfile} /></div>
          </div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">College Name</label><input type="text" name="college" value={profile.college} onChange={handleFieldChange} className="form-input" disabled={!!editingProfile} /></div>
            <div className="form-group"><label className="form-label">Year of Study</label><input type="number" name="year" value={profile.year} onChange={handleFieldChange} className="form-input" disabled={!!editingProfile} /></div>
            <div className="checkbox-container" style={{ justifyContent: 'start', padding: '20px 0' }}><input type="checkbox" id="beginner" name="isBeginner" checked={profile.isBeginner} onChange={handleFieldChange} className="checkbox" disabled={!!editingProfile} /><label htmlFor="beginner" className="checkbox-label">I'm a beginner looking for a team</label></div>
          </div>
          <div className="skills-grid">
            <SkillInput
              label="Known Tech Stack *" value={currentKnownSkill} onChange={setCurrentKnownSkill}
              onAdd={() => { addSkill(currentKnownSkill, 'knownSkills'); setCurrentKnownSkill(''); }}
              onRemove={(index) => removeSkill(index, 'knownSkills')}
              skills={profile.knownSkills} placeholder="e.g., JavaScript, Python..."
              type="known" suggestions={commonSkills} required
            />
            <SkillInput
              label="Desired Tech Stack (Want to learn)" value={currentDesiredSkill} onChange={setCurrentDesiredSkill}
              onAdd={() => { addSkill(currentDesiredSkill, 'desiredSkills'); setCurrentDesiredSkill(''); }}
              onRemove={(index) => removeSkill(index, 'desiredSkills')}
              skills={profile.desiredSkills} placeholder="e.g., Machine Learning, Vue.js..."
              type="desired" suggestions={commonSkills}
            />
          </div>
          <div className="submit-container">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Submitting...' : (editingProfile ? 'Update Skills' : 'Create Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
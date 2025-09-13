// ProfileForm.jsx - Updated with backend integration and skill update functionality
import React, { useState, useEffect } from 'react';
import SkillInput from './SkillInput';

const commonSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Java',
  'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'Vue.js',
  'Angular', 'TypeScript', 'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS',
  'Machine Learning', 'Data Science', 'AI', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'DevOps', 'CI/CD', 'Git', 'GitHub',
  'Figma', 'Adobe XD', 'Photoshop', 'UI/UX Design', 'Graphic Design'
];

const ProfileForm = ({ 
  onSubmit, 
  loading = false, 
  editingProfile = null, 
  onUpdate = null,
  onCancelEdit = null 
}) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    college: '',
    year: '',
    linkedin: '',
    github: '',
    gender: '',
    knownSkills: [],
    desiredSkills: [],
    isBeginner: false
  });

  const [currentKnownSkill, setCurrentKnownSkill] = useState('');
  const [currentDesiredSkill, setCurrentDesiredSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load profile data when editing
  useEffect(() => {
    if (editingProfile) {
      setProfile({
        name: editingProfile.name || '',
        email: editingProfile.email || '',
        college: editingProfile.college_name || '',
        year: editingProfile.year ? editingProfile.year.toString() : '',
        linkedin: editingProfile.linkedin_url || '',
        github: editingProfile.github_url || '',
        gender: editingProfile.gender || '',
        knownSkills: editingProfile.known_skills?.map(skill => skill.name) || [],
        desiredSkills: editingProfile.desired_skills?.map(skill => skill.name) || [],
        isBeginner: editingProfile.is_beginner || false
      });
    }
  }, [editingProfile]);

  const addKnownSkill = () => {
    if (!currentKnownSkill.trim()) return;
    if (profile.knownSkills.includes(currentKnownSkill.trim())) {
      setError('This skill is already added.');
      return;
    }
    setProfile(prev => ({
      ...prev,
      knownSkills: [...prev.knownSkills, currentKnownSkill.trim()]
    }));
    setCurrentKnownSkill('');
    setError(null);
  };

  const addDesiredSkill = () => {
    if (!currentDesiredSkill.trim()) return;
    if (profile.desiredSkills.includes(currentDesiredSkill.trim())) {
      setError('This skill is already added.');
      return;
    }
    setProfile(prev => ({
      ...prev,
      desiredSkills: [...prev.desiredSkills, currentDesiredSkill.trim()]
    }));
    setCurrentDesiredSkill('');
    setError(null);
  };

  const removeKnownSkill = (index) => {
    setProfile(prev => ({
      ...prev,
      knownSkills: prev.knownSkills.filter((_, i) => i !== index)
    }));
  };

  const removeDesiredSkill = (index) => {
    setProfile(prev => ({
      ...prev,
      desiredSkills: prev.desiredSkills.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!profile.name.trim()) {
      setError('Please enter your name.');
      return false;
    }

    if (!profile.email.trim()) {
      setError('Please enter your email.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!profile.college.trim()) {
      setError('Please enter your college name.');
      return false;
    }

    if (profile.knownSkills.length === 0) {
      setError('Please add at least one known skill.');
      return false;
    }

    if (profile.linkedin && !profile.linkedin.match(/^https?:\/\/.+/)) {
      setError('Please enter a valid LinkedIn URL (starting with http:// or https://)');
      return false;
    }

    if (profile.github && !profile.github.match(/^https?:\/\/.+/)) {
      setError('Please enter a valid GitHub URL (starting with http:// or https://)');
      return false;
    }

    return true;
  };

  const createProfile = async () => {
    try {
      const profileData = {
        name: profile.name,
        email: profile.email,
        college_name: profile.college,
        year: profile.year ? parseInt(profile.year) : null,
        linkedin: profile.linkedin,
        github: profile.github,
        gender: profile.gender,
        knownSkills: profile.knownSkills,
        desiredSkills: profile.desiredSkills,
        isBeginner: profile.isBeginner
      };

      const response = await fetch('http://127.0.0.1:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create profile');
      }

      const result = await response.json();
      if (onSubmit) {
        onSubmit(result);
      }
      
      setSuccessMessage('Profile created successfully!');
      resetForm();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  };

  const updateProfile = async () => {
    try {
      const profileData = {
        name: profile.name,
        email: profile.email,
        college_name: profile.college,
        year: profile.year ? parseInt(profile.year) : null,
        linkedin: profile.linkedin,
        github: profile.github,
        gender: profile.gender,
        knownSkills: profile.knownSkills,
        desiredSkills: profile.desiredSkills,
        isBeginner: profile.isBeginner
      };

      const response = await fetch(`/api/users/${editingProfile.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }

      const result = await response.json();
      if (onUpdate) {
        onUpdate(result);
      }
      
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  };

  const resetForm = () => {
    setProfile({
      name: '',
      email: '',
      college: '',
      year: '',
      linkedin: '',
      github: '',
      gender: '',
      knownSkills: [],
      desiredSkills: [],
      isBeginner: false
    });
    setCurrentKnownSkill('');
    setCurrentDesiredSkill('');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingProfile) {
        await updateProfile();
      } else {
        await createProfile();
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
    if (editingProfile) {
      // Reset to original values
      setProfile({
        name: editingProfile.name || '',
        email: editingProfile.email || '',
        college: editingProfile.college_name || '',
        year: editingProfile.year ? editingProfile.year.toString() : '',
        linkedin: editingProfile.linkedin_url || '',
        github: editingProfile.github_url || '',
        gender: editingProfile.gender || '',
        knownSkills: editingProfile.known_skills?.map(skill => skill.name) || [],
        desiredSkills: editingProfile.desired_skills?.map(skill => skill.name) || [],
        isBeginner: editingProfile.is_beginner || false
      });
    } else {
      resetForm();
    }
    setError(null);
    setSuccessMessage('');
  };

  return (
    <div className="profile-form">
      <div className="form-card">
        <h2 className="form-title">
          {editingProfile ? 'Update Your Profile' : 'Create Your Developer Profile'}
        </h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Year</label>
            <select
              value={profile.year}
              onChange={(e) => setProfile(prev => ({ ...prev, year: e.target.value }))}
              className="form-select"
            >
              <option value="">Select...</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">College *</label>
          <input
            type="text"
            value={profile.college}
            onChange={(e) => setProfile(prev => ({ ...prev, college: e.target.value }))}
            className="form-input"
            placeholder="Enter your college name"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Gender (Optional)</label>
          <select
            value={profile.gender}
            onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
            className="form-select"
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div className="url-grid">
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
              className="form-input"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input
              type="url"
              value={profile.github}
              onChange={(e) => setProfile(prev => ({ ...prev, github: e.target.value }))}
              className="form-input"
              placeholder="https://github.com/yourusername"
            />
          </div>
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="beginner"
            checked={profile.isBeginner}
            onChange={(e) => setProfile(prev => ({ ...prev, isBeginner: e.target.checked }))}
            className="checkbox"
          />
          <label htmlFor="beginner" className="checkbox-label">I'm a beginner</label>
        </div>

        <div className="skills-grid">
          <SkillInput
            label="Known Tech Stack *"
            value={currentKnownSkill}
            onChange={setCurrentKnownSkill}
            onAdd={addKnownSkill}
            onRemove={removeKnownSkill}
            skills={profile.knownSkills}
            placeholder="e.g., JavaScript, Python, React..."
            type="known"
            suggestions={commonSkills}
            required={true}
          />

          <SkillInput
            label="Desired Tech Stack (What you want to learn)"
            value={currentDesiredSkill}
            onChange={setCurrentDesiredSkill}
            onAdd={addDesiredSkill}
            onRemove={removeDesiredSkill}
            skills={profile.desiredSkills}
            placeholder="e.g., Machine Learning, Vue.js, Docker..."
            type="desired"
            suggestions={commonSkills}
          />
        </div>

        <div className="submit-container">
          <button 
            onClick={handleSubmit} 
            className="submit-button"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (editingProfile ? 'Updating...' : 'Creating...') : (editingProfile ? 'Update Profile' : 'Create Profile')}
          </button>
          
          {editingProfile && (
            <button 
              onClick={handleCancel}
              className="cancel-button"
              type="button"
              disabled={isSubmitting || loading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
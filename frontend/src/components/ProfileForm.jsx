import React, { useState, useEffect } from 'react';
import SkillInput from './SkillInput';
import { commonSkills } from './constants';

const ProfileForm = ({ onSubmit, onUpdate = null, editingProfile = null, loading = false }) => {
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
    isBeginner: false,
    hackathonExperiences: []
  });
  
  const [currentKnownSkill, setCurrentKnownSkill] = useState('');
  const [currentDesiredSkill, setCurrentDesiredSkill] = useState('');

  useEffect(() => {
    if (editingProfile) {
      console.log('📝 Loading profile for editing:', editingProfile);
      
      // FIXED: Properly format skills to extract names from objects
      const formatSkills = (skillsArray) => {
        if (!Array.isArray(skillsArray)) return [];
        return skillsArray.map(skill => {
          // Handle Django skill objects {id: 1, name: "JavaScript"}
          if (typeof skill === 'object' && skill !== null) {
            return skill.name || String(skill);
          }
          return String(skill);
        });
      };

      const formatHackathonExperiences = (experiencesArray) => {
        if (!Array.isArray(experiencesArray)) return [];
        return experiencesArray.map(exp => ({
          organizer_name: exp.organizer_name || '',
          hackathon_name: exp.hackathon_name || '',
          description: exp.description || '',
          achievements: exp.achievements || ''
        }));
      };

      setProfile({
        name: editingProfile.name || '',
        email: editingProfile.email || '',
        college: editingProfile.college_name || editingProfile.college || '',
        year: editingProfile.year ? String(editingProfile.year) : '',
        linkedin: editingProfile.linkedin_url || editingProfile.linkedin || '',
        github: editingProfile.github_url || editingProfile.github || '',
        gender: editingProfile.gender || '',
        isBeginner: editingProfile.is_beginner || editingProfile.isBeginner || false,
        knownSkills: formatSkills(editingProfile.known_skills || editingProfile.knownSkills || []),
        desiredSkills: formatSkills(editingProfile.desired_skills || editingProfile.desiredSkills || []),
        hackathonExperiences: formatHackathonExperiences(editingProfile.hackathon_experiences || editingProfile.hackathonExperiences || [])
      });

      console.log('✅ Profile formatted successfully');
    }
  }, [editingProfile]);

  const handleFieldChange = (e) => {
    if (!e || !e.target) return;
    
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addSkill = (skill, type) => {
    const skillName = skill.trim();
    if (!skillName || profile[type].includes(skillName)) return;
    
    setProfile(prev => ({
      ...prev,
      [type]: [...prev[type], skillName]
    }));
    
    // Clear the input after adding
    if (type === 'knownSkills') {
      setCurrentKnownSkill('');
    } else {
      setCurrentDesiredSkill('');
    }
  };

  const removeSkill = (index, type) => {
    setProfile(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // FIXED: Separate handlers for each skill type
  const handleKnownSkillChange = (e) => {
    if (e && e.target && typeof e.target.value === 'string') {
      setCurrentKnownSkill(e.target.value);
    }
  };

  const handleDesiredSkillChange = (e) => {
    if (e && e.target && typeof e.target.value === 'string') {
      setCurrentDesiredSkill(e.target.value);
    }
  };

  const addKnownSkill = () => {
    addSkill(currentKnownSkill, 'knownSkills');
  };

  const addDesiredSkill = () => {
    addSkill(currentDesiredSkill, 'desiredSkills');
  };

  // Hackathon experience functions
  const addHackathonExperience = () => {
    setProfile(prev => ({
      ...prev,
      hackathonExperiences: [
        ...prev.hackathonExperiences,
        {
          organizer_name: '',
          hackathon_name: '',
          description: '',
          achievements: ''
        }
      ]
    }));
  };

  const removeHackathonExperience = (index) => {
    setProfile(prev => ({
      ...prev,
      hackathonExperiences: prev.hackathonExperiences.filter((_, i) => i !== index)
    }));
  };

  const updateHackathonExperience = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      hackathonExperiences: prev.hackathonExperiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profile.name || !profile.email || profile.knownSkills.length === 0) {
      alert('Please fill in name, email, and at least one known skill.');
      return;
    }

    console.log('📤 Submitting profile:', profile);

    if (onSubmit) {
      await onSubmit(profile);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={profile.name}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={profile.email}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College/University
              </label>
              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your college name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year of Study
              </label>
              <select
                name="year"
                value={profile.year}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isBeginner"
                id="isBeginner"
                checked={profile.isBeginner}
                onChange={handleFieldChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isBeginner" className="ml-2 text-sm font-medium text-gray-700">
                I am a beginner looking to learn
              </label>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Profile
              </label>
              <input
                type="url"
                name="github"
                value={profile.github}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>
        </div>

        {/* Skills Section - FIXED */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
          
          <div className="mb-6">
            <SkillInput
              label="Known Skills *"
              value={currentKnownSkill}
              onChange={handleKnownSkillChange}
              onAdd={addKnownSkill}
              onRemove={(index) => removeSkill(index, 'knownSkills')}
              skills={profile.knownSkills}
              placeholder="Add a skill you know (e.g., JavaScript, Python)"
              type="known"
              suggestions={commonSkills}
              required={true}
            />
          </div>

          <div>
            <SkillInput
              label="Skills You Want to Learn"
              value={currentDesiredSkill}
              onChange={handleDesiredSkillChange}
              onAdd={addDesiredSkill}
              onRemove={(index) => removeSkill(index, 'desiredSkills')}
              skills={profile.desiredSkills}
              placeholder="Add a skill you want to learn"
              type="desired"
              suggestions={commonSkills}
            />
          </div>
        </div>

        {/* Past Experiences in Hackathons */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Past Experiences in Hackathons</h3>
            <button
              type="button"
              onClick={addHackathonExperience}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
            >
              Add Experience
            </button>
          </div>

          {profile.hackathonExperiences.length === 0 ? (
            <p className="text-gray-500 text-sm italic">
              No hackathon experiences added yet. Click "Add Experience" to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {profile.hackathonExperiences.map((experience, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-800">
                      Experience {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeHackathonExperience(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name of the Organizer *
                      </label>
                      <input
                        type="text"
                        value={experience.organizer_name}
                        onChange={(e) => updateHackathonExperience(index, 'organizer_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Google, Microsoft, MLH"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name of the Hackathon *
                      </label>
                      <input
                        type="text"
                        value={experience.hackathon_name}
                        onChange={(e) => updateHackathonExperience(index, 'hackathon_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., HacktoberFest, DevFest"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={experience.description}
                      onChange={(e) => updateHackathonExperience(index, 'description', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your experience, what you built, technologies used, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Achievements (if any)
                    </label>
                    <input
                      type="text"
                      value={experience.achievements}
                      onChange={(e) => updateHackathonExperience(index, 'achievements', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Winner, Runner-up, Best Innovation Award"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : editingProfile ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;

import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProfileForm from './ProfileForm';
import apiService from '../api/apiService';
import { Loader, ArrowLeft } from 'lucide-react';
import './HackathonTeamBuilder.css';

const MyProfileManager = ({ currentUserId, onNavigateBack, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUserId) {
      fetchProfile(currentUserId);
    } else {
      setError("Please create a profile first to manage it.");
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchProfile = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProfile = await apiService.getProfileById(id);
      setProfile(fetchedProfile);
    } catch (err) {
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSkills = async (updatedProfileData) => {
    if (!profile) {
      setError("No profile to update.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updateProfileSkills(profile.id, {
        knownSkills: updatedProfileData.knownSkills,
        desiredSkills: updatedProfileData.desiredSkills,
      });

      if (response && response.user) {
        setProfile(response.user);
        alert('Profile skills updated successfully!');
        if (onUpdateSuccess) onUpdateSuccess();
      } else {
        throw new Error('Update failed to return a valid user.');
      }
    } catch (err) {
      setError("Failed to update skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="top-bar">
         <button onClick={onNavigateBack} className="back-btn">
          <ArrowLeft size={20} />
          Back to Home
        </button>
        <Header />
      </div>
      <div className="content-wrapper">
        <div className="tab-content">
          <div className="profile-manager-container">
            <h2 className="profile-manager-title">My Profile</h2>
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Loader style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} size={48} />
                <p>Loading your profile...</p>
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            {!loading && profile && (
              <ProfileForm
                editingProfile={profile}
                onUpdate={handleUpdateSkills}
                loading={loading}
              />
            )}
            {!loading && !profile && !error && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <h3>No Profile Found</h3>
                <p>Create a profile to get started and manage your skills here.</p>
                <button onClick={onNavigateBack} className="create-profile-button">
                  Create Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileManager;
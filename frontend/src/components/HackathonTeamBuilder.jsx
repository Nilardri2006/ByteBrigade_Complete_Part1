import React, { useState, useEffect } from 'react';
import Header from './Header';
import NavigationTabs from './NavigationTabs';
import ProfileForm from './ProfileForm';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import apiService from '../api/apiService';
import './HackathonTeamBuilder.css';
import { ArrowLeft } from 'lucide-react';

const HackathonTeamBuilder = ({ onProfileCreated, currentUserId, onNavigateBack, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'profile');
  const [profiles, setProfiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all profiles when the search tab is active
    if (activeTab === 'search') {
      fetchProfiles();
    }
  }, [activeTab]);
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getAllProfiles();
      setProfiles(data);
    } catch (err) {
      setError('Failed to load profiles. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (newProfile) => {
    setLoading(true);
    setError(null);
    try {
      const createdProfile = await apiService.createProfile(newProfile);
      onProfileCreated(createdProfile.id); // Navigate to the manager page
      alert('Profile created successfully!');
    } catch (err) {
      setError('Failed to create profile. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchCriteria) => {
    setLoading(true);
    setHasSearched(true);
    setError(null);
    try {
      const results = await apiService.searchProfiles(searchCriteria);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'search') {
      setHasSearched(false); // Reset search state when switching to the search tab
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
        <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      <div className="content-wrapper">
        {error && (
          <div className="error-message" style={{ width: '100%', maxWidth: '920px', marginBottom: '1rem' }}>
            <p>{error}</p>
            <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
          </div>
        )}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <ProfileForm onSubmit={handleProfileSubmit} loading={loading} />
          )}
          {activeTab === 'search' && (
            <>
              <SearchForm onSearch={handleSearch} loading={loading} />
              <SearchResults
                searchResults={searchResults}
                allProfiles={profiles}
                hasSearched={hasSearched}
                onCreateProfile={() => handleTabChange('profile')}
                currentUserId={currentUserId}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonTeamBuilder;
import React, { useState, useEffect } from 'react';
import Header from './Header';
import NavigationTabs from './NavigationTabs';
import ProfileForm from './ProfileForm';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import apiService from './apiService';
import './HackathonTeamBuilder.css';

const HackathonTeamBuilder = ({ onProfileCreated, currentUserId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profiles, setProfiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllProfiles();
      setProfiles(data);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
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
      setProfiles(prev => [...prev, createdProfile]);
      onProfileCreated(createdProfile.id);
      alert('Profile created successfully!');
    } catch (err) {
      console.error('Failed to create profile:', err);
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
      console.error('Failed to search profiles:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'search') {
      setHasSearched(false);
    }
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <Header />
        <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      <div className="content-wrapper">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>&times;</button>
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
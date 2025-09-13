import React from 'react';
import { Users, Loader } from 'lucide-react';
import ProfileCard from './ProfileCard';
import './HackathonTeamBuilder.css';

const SearchResults = ({ searchResults, allProfiles, hasSearched, onCreateProfile, loading = false }) => {
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Loader style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} size={48} />
                <p>Searching for teammates...</p>
            </div>
        );
    }

    if (hasSearched) {
        if (searchResults.length > 0) {
            return (
                <div className="search-results">
                    <div className="results-header">
                        <h2 className="results-title">Found {searchResults.length} potential teammate{searchResults.length !== 1 ? 's' : ''}</h2>
                    </div>
                    <div className="results-grid">
                        {searchResults.map(profile => <ProfileCard key={profile.id} profile={profile} />)}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="no-results">
                    <Users size={64} className="no-results-icon" />
                    <h3>No teammates found</h3>
                    <p>Try adjusting your search criteria or check back later for new profiles.</p>
                </div>
            );
        }
    }

    if (allProfiles && allProfiles.length > 0) {
        return (
            <div className="search-results">
                <div className="results-header">
                    <h2 className="results-title">All Developer Profiles ({allProfiles.length})</h2>
                </div>
                <div className="results-grid">
                    {allProfiles.map(profile => <ProfileCard key={profile.id} profile={profile} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="no-results">
            <Users size={64} className="no-results-icon" />
            <h3>No profiles yet</h3>
            <p>Be the first to create a developer profile and find your squad!</p>
            <button className="create-profile-button" onClick={onCreateProfile}>Create Your Profile</button>
        </div>
    );
};

export default SearchResults;
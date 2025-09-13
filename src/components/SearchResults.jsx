// SearchResults.jsx - Updated with edit functionality
import React from 'react';
import { Users, Loader } from 'lucide-react';
import ProfileCard from './ProfileCard';

const SearchResults = ({ 
    searchResults, 
    allProfiles, 
    hasSearched, 
    onCreateProfile, 
    onEditProfile,
    currentUserId,
    loading = false 
}) => {
    if (loading) {
        return (
            <div className="loading-container">
                <Loader className="loading-spinner" size={48} />
                <p>Loading profiles...</p>
            </div>
        );
    }

    // Show search results if there was a search
    if (hasSearched && searchResults.length > 0) {
        return (
            <div className="search-results">
                <div className="results-header">
                    <h2 className="results-title">
                        Found {searchResults.length} potential teammate{searchResults.length !== 1 ? 's' : ''}
                    </h2>
                </div>
                <div className="results-grid">
                    {searchResults.map(profile => (
                        <ProfileCard 
                            key={profile.id || profile.email} 
                            profile={profile} 
                            onEdit={onEditProfile}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Show no results message if searched but no results
    if (hasSearched && searchResults.length === 0) {
        return (
            <div className="no-results">
                <Users size={64} className="no-results-icon" />
                <h3>No teammates found</h3>
                <p>Try adjusting your search criteria or check back later for new profiles.</p>
                <button className="create-profile-button" onClick={onCreateProfile}>
                    Create Profile
                </button>
            </div>
        );
    }

    // Show all profiles if no search has been performed yet
    if (allProfiles && allProfiles.length > 0) {
        return (
            <div className="search-results">
                <div className="results-header">
                    <h2 className="results-title">All Developer Profiles ({allProfiles.length})</h2>
                </div>
                <div className="results-grid">
                    {allProfiles.map(profile => (
                        <ProfileCard 
                            key={profile.id || profile.email} 
                            profile={profile} 
                            onEdit={onEditProfile}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Show empty state when no profiles exist
    return (
        <div className="no-results">
            <Users size={64} className="no-results-icon" />
            <h3>No profiles yet</h3>
            <p>Be the first to create a developer profile!</p>
            <button className="create-profile-button" onClick={onCreateProfile}>
                Create Profile
            </button>
        </div>
    );
};

export default SearchResults;
import React from 'react';
import { Users, Loader, Search, UserPlus } from 'lucide-react';
import ProfileCard from './ProfileCard';
import './HackathonTeamBuilder.css';

const SearchResults = ({ searchResults, allProfiles, hasSearched, onCreateProfile, loading = false }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 text-lg">Searching for teammates...</p>
        <p className="text-gray-500 text-sm">Finding the perfect match for your project</p>
      </div>
    );
  }

  if (hasSearched && searchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No teammates found</h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your search criteria or check back later for new profiles.
        </p>
        <button
          onClick={() => onCreateProfile && onCreateProfile()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Your Profile
        </button>
      </div>
    );
  }

  if (hasSearched) {
    return (
      <div>
        {/* Results Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Search Results
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {searchResults.length} teammate{searchResults.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <p className="text-gray-600 mt-1">
            Found {searchResults.length} potential teammate{searchResults.length !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>

        {/* Results Grid - ENHANCED for better spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {searchResults.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Team Building Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Look for complementary skills to build a well-rounded team</li>
            <li>• Consider hackathon experience levels for balanced collaboration</li>
            <li>• Check social links to learn more about potential teammates</li>
            <li>• Don't forget to connect and introduce your project idea!</li>
          </ul>
        </div>
      </div>
    );
  }

  // Default state - show all profiles
  return (
    <div className="text-center py-12">
      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to find your team?</h3>
      <p className="text-gray-600 mb-6">
        Use the search form above to find teammates with the skills you need.
      </p>
      
      {allProfiles && allProfiles.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Or browse all {allProfiles.length} available profiles:
          </p>
          <button
            onClick={() => onCreateProfile && onCreateProfile()}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Be the first to create a developer profile and find your squad!
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

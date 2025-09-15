import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin, FaTrophy, FaCalendar, FaUsers, FaMedal } from 'react-icons/fa';
import SkillTag from './SkillTag';

const ProfileCard = ({ profile }) => {
  if (!profile) {
    return null;
  }

  // Handle skill objects and arrays
  const knownSkills = profile.known_skills || [];
  const desiredSkills = profile.desired_skills || [];
  const hackathonExperiences = profile.hackathon_experiences || [];

  // Helper function for year suffix
  const getSuffix = (year) => {
    const yearNum = parseInt(year);
    if (yearNum === 1) return 'st';
    if (yearNum === 2) return 'nd';
    if (yearNum === 3) return 'rd';
    return 'th';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            {profile.college_name && (
              <span className="flex items-center">
                <FaUsers className="w-3 h-3 mr-1" />
                {profile.college_name}
                {profile.year && `, ${profile.year}${profile.year === 'graduate' ? '' : getSuffix(profile.year)} Year`}
              </span>
            )}
          </div>
          
          {/* Beginner Badge */}
          {profile.is_beginner && (
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Beginner Friendly
            </span>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-2">
          <FaEnvelope className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{profile.email}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors"
            >
              <FaLinkedin className="w-4 h-4 mr-1" />
              LinkedIn
            </a>
          )}
          
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-gray-900 text-sm transition-colors"
            >
              <FaGithub className="w-4 h-4 mr-1" />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Known Skills */}
      {knownSkills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Known Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {knownSkills.slice(0, 6).map((skill, index) => (
              <SkillTag
                key={`known-${index}`}
                skill={skill}
                type="known"
                removable={false}
              />
            ))}
            {knownSkills.length > 6 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{knownSkills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Desired Skills */}
      {desiredSkills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Wants to Learn
          </h4>
          <div className="flex flex-wrap gap-2">
            {desiredSkills.slice(0, 4).map((skill, index) => (
              <SkillTag
                key={`desired-${index}`}
                skill={skill}
                type="desired"
                removable={false}
              />
            ))}
            {desiredSkills.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{desiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* NEW: Hackathon Experiences Section */}
      {hackathonExperiences.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <FaTrophy className="w-4 h-4 text-yellow-500 mr-2" />
            <h4 className="text-sm font-semibold text-gray-900">Hackathon Experience</h4>
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              {hackathonExperiences.length} event{hackathonExperiences.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="space-y-3">
            {hackathonExperiences.slice(0, 2).map((experience, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-gray-900 mb-1">
                      {experience.hackathon_name}
                    </h5>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <FaCalendar className="w-3 h-3 mr-1" />
                      <span>Organized by {experience.organizer_name}</span>
                    </div>
                  </div>
                </div>
                
                {/* Achievements */}
                {experience.achievements && (
                  <div className="flex items-center mb-2">
                    <FaMedal className="w-3 h-3 text-yellow-600 mr-1" />
                    <span className="text-xs text-yellow-800 font-medium bg-yellow-200 px-2 py-1 rounded-full">
                      {experience.achievements}
                    </span>
                  </div>
                )}
                
                {/* Description */}
                {experience.description && (
                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                    {experience.description.length > 100 
                      ? `${experience.description.substring(0, 100)}...` 
                      : experience.description
                    }
                  </p>
                )}
              </div>
            ))}
            
            {/* Show more experiences indicator */}
            {hackathonExperiences.length > 2 && (
              <div className="text-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  +{hackathonExperiences.length - 2} more experience{hackathonExperiences.length - 2 !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience Summary for users without detailed experiences */}
      {hackathonExperiences.length === 0 && (knownSkills.length > 3 || desiredSkills.length > 2) && (
        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center">
              <FaUsers className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-xs text-gray-600">
                Ready to participate in hackathons and collaborate on projects
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Connect Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2">
          <FaEnvelope className="w-4 h-4" />
          <span>Connect for Team Up</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-500">
        <span className="flex items-center">
          <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
          {knownSkills.length} skills
        </span>
        {hackathonExperiences.length > 0 && (
          <span className="flex items-center">
            <FaTrophy className="w-3 h-3 mr-1" />
            {hackathonExperiences.length} hackathon{hackathonExperiences.length !== 1 ? 's' : ''}
          </span>
        )}
        {profile.is_beginner && (
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
            Beginner
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;

// src/api/apiService.js

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Enhanced error handling with detailed feedback
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('🚨 Full API Error Response:', errorData);
    
    let errorMessage = '';
    if (errorData.username) errorMessage += `Username: ${Array.isArray(errorData.username) ? errorData.username[0] : errorData.username}; `;
    if (errorData.email) errorMessage += `Email: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}; `;
    if (errorData.password) errorMessage += `Password: ${Array.isArray(errorData.password) ? errorData.password[0] : errorData.password}; `;
    if (errorData.error) errorMessage += errorData.error;
    if (errorData.detail) errorMessage += errorData.detail;
    if (errorData.non_field_errors) errorMessage += errorData.non_field_errors[0];
    
    throw new Error(errorMessage || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

const apiService = {
  // 🆕 CREATE USER ACCOUNT - Registration
  createUser: async (userData) => {
    try {
      console.log('👤 Creating user account:', userData.username);
      
      const requestData = {
        username: userData.username,
        password: userData.password,
        name: userData.name,
        email: userData.email
      };
      
      console.log('📤 Sending user creation request:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await handleResponse(response);
      console.log('✅ User created successfully:', result);
      return result;
    } catch (error) {
      console.error("❌ User creation failed:", error);
      throw error;
    }
  },

  // 🔐 LOGIN USER - Authentication
  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login for:', credentials.username);
      
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      const result = await handleResponse(response);
      console.log('✅ Login successful for user:', result.username);
      return result;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  },

  // 📋 GET ALL PROFILES - Fetch all users
  getAllProfiles: async () => {
    try {
      console.log('📋 Fetching all user profiles...');
      
      const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: { 'Accept': 'application/json' }
      });
      
      const result = await handleResponse(response);
      console.log(`✅ Fetched ${result.length} profiles`);
      return result;
    } catch (error) {
      console.error("❌ Failed to fetch profiles:", error);
      throw error;
    }
  },

  // 👤 GET PROFILE BY ID - Fetch specific user
  getProfileById: async (id) => {
    try {
      console.log(`👤 Fetching profile for user ID: ${id}`);
      
      const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
        headers: { 'Accept': 'application/json' }
      });
      
      const result = await handleResponse(response);
      console.log('✅ Profile fetched successfully:', result.name);
      return result;
    } catch (error) {
      console.error(`❌ Failed to fetch profile ${id}:`, error);
      throw error;
    }
  },

  // 🔄 UPDATE USER PROFILE - Update existing user's profile info
  updateUserProfile: async (userId, profileData) => {
    try {
      console.log(`🔄 Updating profile for user ID: ${userId}`, profileData);
      
      const requestData = {
        name: profileData.name,
        email: profileData.email,
        college: profileData.college || '',
        year: profileData.year ? parseInt(profileData.year) : null,
        gender: profileData.gender || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        knownSkills: Array.isArray(profileData.knownSkills) ? profileData.knownSkills : [],
        desiredSkills: Array.isArray(profileData.desiredSkills) ? profileData.desiredSkills : [],
        isBeginner: Boolean(profileData.isBeginner)
      };
      
      console.log('📤 Sending profile update request:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await handleResponse(response);
      console.log('✅ Profile updated successfully');
      return result;
    } catch (error) {
      console.error(`❌ Failed to update profile for user ${userId}:`, error);
      throw error;
    }
  },

  // 🔄 UPDATE SKILLS - Update user skills
  updateProfileSkills: async (id, skillsUpdate) => {
    try {
      console.log(`🔄 Updating skills for user ${id}:`, skillsUpdate);
      
      const requestData = {
        knownSkills: Array.isArray(skillsUpdate.knownSkills) ? skillsUpdate.knownSkills : [],
        desiredSkills: Array.isArray(skillsUpdate.desiredSkills) ? skillsUpdate.desiredSkills : []
      };
      
      console.log('📤 Sending skill update request:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/users/${id}/skills/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await handleResponse(response);
      console.log('✅ Skills updated successfully');
      return result;
    } catch (error) {
      console.error(`❌ Failed to update skills for user ${id}:`, error);
      throw error;
    }
  },

  // 🔍 SEARCH PROFILES - Search users by skills and criteria
  searchProfiles: async (criteria) => {
    try {
      console.log('🔍 Searching profiles with criteria:', criteria);
      
      const params = new URLSearchParams();
      
      // Add skills parameter
      if (criteria.requiredSkills && Array.isArray(criteria.requiredSkills) && criteria.requiredSkills.length > 0) {
        params.append('skills', criteria.requiredSkills.join(','));
      }
      
      // Add team size parameter
      if (criteria.teamSize) {
        params.append('team_size', criteria.teamSize.toString());
      }
      
      // Add beginner preference
      if (criteria.includeBeginner !== undefined) {
        params.append('include_beginner', criteria.includeBeginner.toString());
      }
      
      const queryString = params.toString();
      console.log('📤 Search query string:', queryString);
      
      const response = await fetch(`${API_BASE_URL}/search/users/?${queryString}`, {
        headers: { 'Accept': 'application/json' }
      });
      
      const result = await handleResponse(response);
      console.log(`✅ Search completed: ${result.length} results found`);
      return result;
    } catch (error) {
      console.error("❌ Search failed:", error);
      throw error;
    }
  },

  // 🏥 HEALTH CHECK - Check API status
  healthCheck: async () => {
    try {
      console.log('🏥 Checking API health...');
      
      const response = await fetch(`${API_BASE_URL}/health/`, {
        headers: { 'Accept': 'application/json' }
      });
      
      const result = await handleResponse(response);
      console.log('✅ API is healthy:', result);
      return result;
    } catch (error) {
      console.error("❌ Health check failed:", error);
      throw error;
    }
  }
};

export default apiService;

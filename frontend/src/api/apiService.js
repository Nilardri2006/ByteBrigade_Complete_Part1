// src/api/apiService.js

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * A helper function to handle the response from the fetch API.
 * It checks for errors and parses the JSON.
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Gracefully handle non-json errors
    // Use 'detail' for DRF's default error messages, or provide a fallback.
    const errorMessage = errorData.detail || `HTTP error! Status: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

const apiService = {
  /**
   * Retrieves all profiles from the Django backend.
   */
  getAllProfiles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching all profiles:", error);
      throw error; // Re-throw to be caught by the component
    }
  },

  /**
   * Retrieves a single profile by its ID.
   */
  getProfileById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${id}/`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching profile with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new profile by sending data to the Django backend.
   * It maps the camelCase field names from React to snake_case for Django.
   */
  createProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          linkedin: profileData.linkedin,
          github: profileData.github,
          is_beginner: profileData.isBeginner,
          known_skills: profileData.knownSkills,
          desired_skills: profileData.desiredSkills,
        }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  /**
   * Updates the skills for a specific profile.
   */
  updateProfileSkills: async (id, skillsUpdate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${id}/`, {
        method: 'PATCH', // PATCH is for partial updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          known_skills: skillsUpdate.knownSkills,
          desired_skills: skillsUpdate.desiredSkills,
        }),
      });
      const updatedProfile = await handleResponse(response);
      // The API returns the profile directly. We wrap it to match the component's expectation.
      return { user: updatedProfile };
    } catch (error) {
      console.error(`Error updating skills for profile ${id}:`, error);
      throw error;
    }
  },

  /**
   * Searches for profiles based on skills and beginner status.
   */
  searchProfiles: async (criteria) => {
    try {
      const params = new URLSearchParams();
      criteria.requiredSkills.forEach(skill => {
        params.append('known_skills', skill);
      });
      params.append('includeBeginner', criteria.includeBeginner);
      
      const response = await fetch(`${API_BASE_URL}/profiles/?${params.toString()}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error searching profiles:", error);
      throw error;
    }
  },
};

export default apiService;
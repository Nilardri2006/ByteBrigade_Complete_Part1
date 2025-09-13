const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:8000/api";

class ApiService {
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error(`Request failed: ${error.message}`);
      throw error;
    }
  }

  async createProfile(profileData) {
    try {
      const response = await this.makeRequest('/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          linkedin: profileData.linkedin || null,
          github: profileData.github || null,
          gender: profileData.gender || null,
          knownSkills: profileData.knownSkills || [],
          desiredSkills: profileData.desiredSkills || [],
          isBeginner: profileData.isBeginner || false,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getAllProfiles(skip = 0, limit = 100) {
    try {
      const response = await this.makeRequest(`/users/?skip=${skip}&limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async searchProfiles(searchCriteria) {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchCriteria.requiredSkills && searchCriteria.requiredSkills.length > 0) {
        queryParams.append('skills', searchCriteria.requiredSkills.join(','));
      }
      
      if (searchCriteria.includeBeginner !== undefined) {
        queryParams.append('include_beginner', searchCriteria.includeBeginner.toString());
      }
      
      if (searchCriteria.teamSize) {
        queryParams.append('team_size', searchCriteria.teamSize.toString());
      }

      const response = await this.makeRequest(`/users/search/?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async checkHealth() {
    try {
      const response = await this.makeRequest('/health/');
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default new ApiService();

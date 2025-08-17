// API service for authentication and API calls
class ApiService {
  constructor() {
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    this.baseURL = `${apiBaseUrl}/api`; // Backend URL
    this.token = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
  }

  // Get headers for API requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Make API request
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }




  // Get current authenticated user
  async getCurrentUser() {
    return await this.makeRequest('/auth/user', {
      credentials: 'include'
    });
  }


  // Get friends list
  async getFriends(userId = 1) {
    return await this.makeRequest(`/friends/${userId}`);
  }

  // Get close friends
  async getCloseFriends(userId = 1) {
    return await this.makeRequest(`/friends/${userId}/close`);
  }

  // Add friend
  async addFriend(userId, email) {
    return await this.makeRequest(`/friends/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Toggle close friend status
  async toggleCloseFriend(userId, friendId) {
    return await this.makeRequest(`/friends/${userId}/toggle-close/${friendId}`, {
      method: 'PUT',
    });
  }

  // Accept friend request
  async acceptFriendRequest(userId, friendId) {
    return await this.makeRequest(`/friends/${userId}/accept/${friendId}`, {
      method: 'PUT',
    });
  }

  // Reject friend request
  async rejectFriendRequest(userId, friendId) {
    return await this.makeRequest(`/friends/${userId}/reject/${friendId}`, {
      method: 'PUT',
    });
  }

  // Get upcoming meetings
  async getUpcomingMeetings(userId = 1) {
    return await this.makeRequest(`/meetings/${userId}/upcoming`);
  }

  // Get meetings by date range
  async getMeetingsByDateRange(userId, startDate, endDate) {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    
    return await this.makeRequest(`/meetings/${userId}/range?${params}`);
  }

  // Create meeting
  async createMeeting(organizerId, friendId, title, description, startTime, endTime, location) {
    return await this.makeRequest('/meetings/create', {
      method: 'POST',
      body: JSON.stringify({
        organizerId,
        friendId,
        title,
        description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location,
      }),
    });
  }

  // Update meeting status
  async updateMeetingStatus(meetingId, status) {
    return await this.makeRequest(`/meetings/${meetingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Delete meeting
  async deleteMeeting(meetingId) {
    return await this.makeRequest(`/meetings/${meetingId}`, {
      method: 'DELETE',
    });
  }

  // Get user profile
  async getUserProfile(userId = 1) {
    try {
      const userData = await this.makeRequest(`/auth/profile/${userId}`);
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }) : 'Unknown',
        totalFriends: 0, // Will be calculated in getDashboardStats
        totalMeetings: 0, // Will be calculated in getDashboardStats
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  // Get dashboard stats
  async getDashboardStats(userId = 1) {
    try {
      const stats = await this.makeRequest(`/friends/${userId}/stats`);
      const meetings = await this.getUpcomingMeetings(userId);
      
      return {
        totalFriends: stats.totalFriends || 0,
        closeFriends: stats.closeFriends || 0,
        upcomingMeetings: meetings.length || 0,
        pendingRequests: stats.pendingRequests || 0,
      };
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      return {
        totalFriends: 0,
        closeFriends: 0,
        upcomingMeetings: 0,
        pendingRequests: 0,
      };
    }
  }

  // Calendar API methods
  async getUpcomingCalendarEvents(maxResults = 10) {
    return await this.makeRequest(`/calendar/events/upcoming?maxResults=${maxResults}`, {
      credentials: 'include'
    });
  }

  async getCalendarEventsByDateRange(startDate, endDate) {
    const params = new URLSearchParams({
      startDate: startDate,
      endDate: endDate
    });
    
    return await this.makeRequest(`/calendar/events/range?${params}`, {
      credentials: 'include'
    });
  }
}

export const apiService = new ApiService();

// API service for authentication and API calls
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8080/api'; // Backend URL
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

  // Login method
  async login(email, password) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Register method
  async register(name, email, password) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Validate token method
  async validateToken(token) {
    this.setToken(token);
    return await this.makeRequest('/auth/validate');
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
    // For now, return mock user data since we don't have a user profile endpoint
    return {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      joinDate: 'January 2024',
      totalFriends: 3,
      totalMeetings: 3,
    };
  }

  // Get dashboard stats
  async getDashboardStats(userId = 1) {
    try {
      const [friends, meetings] = await Promise.all([
        this.getFriends(userId),
        this.getUpcomingMeetings(userId),
      ]);

      const closeFriends = friends.filter(friend => friend.isClose);

      return {
        totalFriends: friends.length,
        closeFriends: closeFriends.length,
        upcomingMeetings: meetings.length,
        pendingRequests: 0, // We'll need to implement this endpoint
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
}

export const apiService = new ApiService();

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const FriendsContext = createContext();

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};

export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const friendsData = await apiService.getFriends(1); // Using user ID 1 for now
      setFriends(friendsData);
    } catch (error) {
      console.error('Failed to load friends:', error);
      // Fallback to empty array if API fails
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const closeFriends = friends.filter(friend => friend.isClose);

  const addFriend = async (email) => {
    setLoading(true);
    try {
      await apiService.addFriend(1, email); // Using user ID 1 for now
      await loadFriends(); // Reload friends list
      return { success: true };
    } catch (error) {
      console.error('Failed to add friend:', error);
      return { success: false, error: error.message || 'Failed to add friend' };
    } finally {
      setLoading(false);
    }
  };

  const toggleCloseFriend = async (friendId) => {
    try {
      await apiService.toggleCloseFriend(1, friendId); // Using user ID 1 for now
      await loadFriends(); // Reload friends list
    } catch (error) {
      console.error('Failed to toggle close friend:', error);
    }
  };

  const acceptFriendRequest = async (friendId) => {
    try {
      await apiService.acceptFriendRequest(1, friendId); // Using user ID 1 for now
      await loadFriends(); // Reload friends list
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const rejectFriendRequest = async (friendId) => {
    try {
      await apiService.rejectFriendRequest(1, friendId); // Using user ID 1 for now
      await loadFriends(); // Reload friends list
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    }
  };

  const value = {
    friends,
    closeFriends,
    addFriend,
    toggleCloseFriend,
    acceptFriendRequest,
    rejectFriendRequest,
    loading,
    refreshFriends: loadFriends,
  };

  return (
    <FriendsContext.Provider value={value}>
      {children}
    </FriendsContext.Provider>
  );
};

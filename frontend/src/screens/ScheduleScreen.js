import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, COMMON_STYLES } from '../design/DesignSystem';
import { apiService } from '../services/apiService';

const ScheduleScreen = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [suggestedTimes, setSuggestedTimes] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');

  useEffect(() => {
    loadScheduleData();
  }, []);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      const [meetings, friendsList] = await Promise.all([
        apiService.getUpcomingMeetings(1), // Using user ID 1 for now
        apiService.getFriends(1), // Using user ID 1 for now
      ]);
      
      setUpcomingMeetings(meetings);
      setFriends(friendsList);
      
      // Generate suggested times based on current time
      generateSuggestedTimes();
    } catch (error) {
      console.error('Failed to load schedule data:', error);
      // Fallback to empty arrays if API fails
      setUpcomingMeetings([]);
      setFriends([]);
      generateSuggestedTimes();
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestedTimes = () => {
    const now = new Date();
    const times = [];
    const timeSlots = [
      '9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:30 PM', '6:00 PM'
    ];
    
    timeSlots.forEach((time, index) => {
      times.push({
        id: index + 1,
        time: time,
        available: Math.random() > 0.3, // Random availability for demo
      });
    });
    
    setSuggestedTimes(times);
  };

  const handleScheduleMeeting = () => {
    if (!selectedFriend) {
      Alert.alert('Error', 'Please select a friend');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time');
      return;
    }
    if (!meetingTitle.trim()) {
      Alert.alert('Error', 'Please enter a meeting title');
      return;
    }
    if (!meetingLocation.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    // Here you would typically call the API to create the meeting
    Alert.alert(
      'Meeting Scheduled!',
      `Meeting "${meetingTitle}" scheduled with ${selectedFriend.name} at ${selectedTime.time} at ${meetingLocation}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedFriend(null);
            setSelectedTime(null);
            setMeetingTitle('');
            setMeetingLocation('');
            loadScheduleData(); // Refresh the data
          },
        },
      ]
    );
  };

  const renderFriendCard = (friend) => (
    <TouchableOpacity
      key={friend.id}
      style={[
        styles.friendCard,
        selectedFriend?.id === friend.id && styles.selectedFriendCard,
      ]}
      onPress={() => setSelectedFriend(friend)}
    >
      <View style={styles.friendInfo}>
        <View style={styles.friendAvatar}>
          <Ionicons name="person" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{friend.name}</Text>
          <Text style={styles.friendEmail}>{friend.email}</Text>
        </View>
      </View>
      {selectedFriend?.id === friend.id && (
        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  const renderMeetingCard = (meeting) => (
    <View key={meeting.id} style={styles.meetingCard}>
      <View style={styles.meetingHeader}>
        <View style={styles.meetingIcon}>
          <Ionicons name="time-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.meetingInfo}>
          <Text style={styles.meetingTitle}>{meeting.title}</Text>
          <Text style={styles.meetingFriend}>with {meeting.friend?.name || 'Unknown'}</Text>
        </View>
        <View style={styles.meetingStatus}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: meeting.status === 'CONFIRMED' ? COLORS.success + '20' : COLORS.warning + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: meeting.status === 'CONFIRMED' ? COLORS.success : COLORS.warning }
            ]}>
              {meeting.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.meetingDetails}>
        <View style={styles.meetingDetail}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.meetingDetailText}>
            {new Date(meeting.startTime).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.meetingDetail}>
          <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.meetingDetailText}>
            {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.meetingDetail}>
          <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.meetingDetailText}>{meeting.location}</Text>
        </View>
      </View>
    </View>
  );

  const renderTimeSlot = (timeSlot) => (
    <TouchableOpacity
      key={timeSlot.id}
      style={[
        styles.timeSlot,
        !timeSlot.available && styles.unavailableTimeSlot,
        selectedTime?.id === timeSlot.id && styles.selectedTimeSlot,
      ]}
      onPress={() => timeSlot.available && setSelectedTime(timeSlot)}
      disabled={!timeSlot.available}
    >
      <Text style={[
        styles.timeSlotText,
        !timeSlot.available && styles.unavailableTimeSlotText,
        selectedTime?.id === timeSlot.id && styles.selectedTimeSlotText,
      ]}>
        {timeSlot.time}
      </Text>
      {!timeSlot.available && (
        <Text style={styles.unavailableText}>Busy</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="refresh" size={32} color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading schedule...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Schedule</Text>
            <Text style={styles.headerSubtitle}>Plan your next meeting</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => Alert.alert('Profile', 'Profile modal coming soon')}
            >
              <Ionicons name="person-circle" size={32} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Select Friend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Friend</Text>
          <View style={styles.friendsList}>
            {friends.length > 0 ? (
              friends.map(renderFriendCard)
            ) : (
              <View style={styles.noFriendsContainer}>
                <Ionicons name="people-outline" size={32} color={COLORS.textLight} />
                <Text style={styles.noFriendsText}>No friends available</Text>
              </View>
            )}
          </View>
        </View>

        {/* Meeting Details */}
        {selectedFriend && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meeting Details</Text>
            <View style={styles.meetingDetailsCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Meeting Title</Text>
                <TextInput
                  style={styles.textInput}
                  value={meetingTitle}
                  onChangeText={setMeetingTitle}
                  placeholder="Enter meeting title"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.textInput}
                  value={meetingLocation}
                  onChangeText={setMeetingLocation}
                  placeholder="Enter location"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
            </View>
          </View>
        )}

        {/* Suggested Times */}
        {selectedFriend && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Times</Text>
            <View style={styles.timeSlotsGrid}>
              {suggestedTimes.map(renderTimeSlot)}
            </View>
          </View>
        )}

        {/* Schedule Button */}
        {selectedFriend && selectedTime && meetingTitle.trim() && meetingLocation.trim() && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleMeeting}>
              <Ionicons name="calendar" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.scheduleButtonText}>Schedule Meeting</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Upcoming Meetings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.meetingsList}>
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map(renderMeetingCard)
            ) : (
              <View style={styles.noMeetingsContainer}>
                <Ionicons name="calendar-outline" size={32} color={COLORS.textLight} />
                <Text style={styles.noMeetingsText}>No upcoming meetings</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },

  // Header
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: SPACING.xs,
  },

  // Content
  content: {
    flex: 1,
  },

  // Section
  section: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  viewAllText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Friends
  friendsList: {
    gap: SPACING.md,
  },
  friendCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  },
  selectedFriendCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.xs,
  },
  friendEmail: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
  },
  noFriendsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  noFriendsText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },

  // Meeting Details
  meetingDetailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...TYPOGRAPHY.body,
  },

  // Time Slots
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    width: '48%',
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.primary,
  },
  unavailableTimeSlot: {
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  timeSlotText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  selectedTimeSlotText: {
    color: COLORS.textInverse,
  },
  unavailableTimeSlotText: {
    color: COLORS.textLight,
  },
  unavailableText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },

  // Schedule Button
  scheduleButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  scheduleButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },

  // Meetings
  meetingsList: {
    gap: SPACING.md,
  },
  meetingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  meetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  meetingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.xs,
  },
  meetingFriend: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
  },
  meetingStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  meetingDetails: {
    gap: SPACING.sm,
  },
  meetingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingDetailText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  noMeetingsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  noMeetingsText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
});

export default ScheduleScreen;

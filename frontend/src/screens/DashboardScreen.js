import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, COMMON_STYLES } from '../design/DesignSystem';
import { apiService } from '../services/apiService';

const DashboardScreen = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [stats, setStats] = useState({
    totalFriends: 0,
    closeFriends: 0,
    upcomingMeetings: 0,
    pendingRequests: 0,
  });
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    email: 'loading@example.com',
    joinDate: 'Loading...',
    totalFriends: 0,
    totalMeetings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, meetings, profile] = await Promise.all([
        apiService.getDashboardStats(1), // Using user ID 1 for now
        apiService.getUpcomingMeetings(1), // Using user ID 1 for now
        apiService.getUserProfile(1), // Using user ID 1 for now
      ]);
      
      setStats(dashboardStats);
      setUpcomingMeetings(meetings || []);
      
      // Update user profile with real data
      setUserProfile({
        name: profile.name || 'User',
        email: profile.email || 'user@example.com',
        joinDate: profile.joinDate || 'Unknown',
        totalFriends: dashboardStats.totalFriends || 0,
        totalMeetings: dashboardStats.upcomingMeetings || 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set empty state when API fails
      setUserProfile({
        name: 'User',
        email: 'user@example.com',
        joinDate: 'Unknown',
        totalFriends: 0,
        totalMeetings: 0,
      });
      setStats({
        totalFriends: 0,
        closeFriends: 0,
        upcomingMeetings: 0,
        pendingRequests: 0,
      });
      setUpcomingMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 1,
      title: 'Schedule Meeting',
      icon: 'calendar-outline',
      color: COLORS.primary,
    },
    {
      id: 2,
      title: 'Add Friend',
      icon: 'person-add-outline',
      color: COLORS.secondary,
    },
    {
      id: 3,
      title: 'View Calendar',
      icon: 'calendar-outline',
      color: COLORS.success,
    },
    {
      id: 4,
      title: 'Friend Requests',
      icon: 'people-outline',
      color: COLORS.warning,
    },
  ];

  const menuItems = [
    {
      id: 1,
      title: 'Account Settings',
      icon: 'person-outline',
      color: COLORS.primary,
      action: () => Alert.alert('Settings', 'Account settings coming soon'),
    },
    {
      id: 2,
      title: 'Privacy & Security',
      icon: 'shield-outline',
      color: COLORS.secondary,
      action: () => Alert.alert('Privacy', 'Privacy settings coming soon'),
    },
    {
      id: 3,
      title: 'Help & Support',
      icon: 'help-circle-outline',
      color: COLORS.info,
      action: () => Alert.alert('Support', 'Help & support coming soon'),
    },
    {
      id: 4,
      title: 'About',
      icon: 'information-circle-outline',
      color: COLORS.success,
      action: () => Alert.alert('About', 'App version 1.0.0'),
    },
  ];

  const renderStatCard = (title, value, icon, color) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{title}</Text>
      </View>
    </View>
  );

  const renderMeetingCard = (meeting) => (
    <TouchableOpacity key={meeting.id} style={styles.meetingCard}>
      <View style={styles.meetingHeader}>
        <View style={styles.meetingIcon}>
          <Ionicons name="time-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.meetingInfo}>
          <Text style={styles.meetingTitle}>{meeting.title}</Text>
          <Text style={styles.meetingFriend}>with {meeting.friend?.name || 'Unknown'}</Text>
        </View>
        <View style={styles.meetingTime}>
          <Text style={styles.meetingDate}>
            {new Date(meeting.startTime).toLocaleDateString()}
          </Text>
          <Text style={styles.meetingTimeText}>
            {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
      <View style={styles.meetingLocation}>
        <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
        <Text style={styles.meetingLocationText}>{meeting.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderQuickAction = (action) => (
    <TouchableOpacity key={action.id} style={styles.quickActionCard}>
      <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
        <Ionicons name={action.icon} size={24} color={action.color} />
      </View>
      <Text style={styles.quickActionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  const renderMenuItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuItemIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={styles.menuItemTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  const renderSettingItem = (title, value, onValueChange, icon) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <View style={styles.settingItemIcon}>
          <Ionicons name={icon} size={20} color={COLORS.textLight} />
        </View>
        <Text style={styles.settingItemTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor={value ? COLORS.surface : COLORS.textLight}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="refresh" size={32} color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.userName}>{userProfile.name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => setShowProfileModal(true)}
          >
            <Ionicons name="person-circle" size={40} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Total Friends', stats.totalFriends, 'people-outline', COLORS.primary)}
            {renderStatCard('Close Friends', stats.closeFriends, 'heart-outline', COLORS.success)}
            {renderStatCard('Upcoming', stats.upcomingMeetings, 'calendar-outline', COLORS.warning)}
            {renderStatCard('Requests', stats.pendingRequests, 'mail-outline', COLORS.info)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

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

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="person-add" size={16} color={COLORS.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  <Text style={styles.activityBold}>Sarah Johnson</Text> accepted your friend request
                </Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="calendar" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  Meeting scheduled with <Text style={styles.activityBold}>Mike Chen</Text>
                </Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal visible={showProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowProfileModal(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.profileCard}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Ionicons name="person" size={40} color={COLORS.primary} />
                    </View>
                    <TouchableOpacity style={styles.editAvatarButton}>
                      <Ionicons name="camera" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.userName}>{userProfile.name}</Text>
                  <Text style={styles.userEmail}>{userProfile.email}</Text>
                  <Text style={styles.userJoinDate}>Member since {userProfile.joinDate}</Text>
                </View>
              </View>

              {/* Stats Section */}
              <View style={styles.statsSection}>
                <View style={styles.statsCard}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userProfile.totalFriends}</Text>
                    <Text style={styles.statLabel}>Friends</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userProfile.totalMeetings}</Text>
                    <Text style={styles.statLabel}>Meetings</Text>
                  </View>
                </View>
              </View>

              {/* Settings Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.settingsCard}>
                  {renderSettingItem(
                    'Push Notifications',
                    notificationsEnabled,
                    setNotificationsEnabled,
                    'notifications-outline'
                  )}
                  {renderSettingItem(
                    'Dark Mode',
                    darkModeEnabled,
                    setDarkModeEnabled,
                    'moon-outline'
                  )}
                  {renderSettingItem(
                    'Location Services',
                    locationEnabled,
                    setLocationEnabled,
                    'location-outline'
                  )}
                </View>
              </View>

              {/* Menu Section */}
              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.menuCard}>
                  {menuItems.map(renderMenuItem)}
                </View>
              </View>

              {/* Logout Section */}
              <View style={styles.logoutSection}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => {
                    setShowProfileModal(false);
                    Alert.alert('Logout', 'Are you sure you want to logout?');
                  }}
                >
                  <Ionicons name="log-out-outline" size={20} color={COLORS.error} style={styles.logoutIcon} />
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  greeting: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  userName: {
    ...TYPOGRAPHY.h2,
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

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    width: '48%',
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    width: '48%',
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionTitle: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    fontWeight: '600',
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
    marginBottom: SPACING.sm,
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
  meetingTime: {
    alignItems: 'flex-end',
  },
  meetingDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  meetingTimeText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
  },
  meetingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingLocationText: {
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

  // Activity
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
  },
  activityBold: {
    fontWeight: '600',
    color: COLORS.text,
  },
  activityTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    ...SHADOWS.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
  },
  modalCloseButton: {
    padding: SPACING.xs,
  },
  modalContent: {
    padding: SPACING.lg,
  },

  // Profile Modal Content
  profileSection: {
    marginBottom: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  userJoinDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },

  // Stats Section
  statsSection: {
    marginBottom: SPACING.lg,
  },
  statsCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },

  // Settings Section
  settingsSection: {
    marginBottom: SPACING.lg,
  },
  settingsCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingItemTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
  },

  // Menu Section
  menuSection: {
    marginBottom: SPACING.lg,
  },
  menuCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuItemTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
  },

  // Logout Section
  logoutSection: {
    marginBottom: SPACING.lg,
  },
  logoutButton: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '30',
    ...SHADOWS.sm,
  },
  logoutIcon: {
    marginRight: SPACING.sm,
  },
  logoutText: {
    ...TYPOGRAPHY.button,
    color: COLORS.error,
  },
});

export default DashboardScreen;

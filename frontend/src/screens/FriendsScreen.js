import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFriends } from '../contexts/FriendsContext';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, COMMON_STYLES } from '../design/DesignSystem';

const FriendsScreen = () => {
  const { friends, closeFriends, addFriend, toggleCloseFriend, loading } = useFriends();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  const handleAddFriend = async () => {
    if (!newFriendEmail) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }

    const result = await addFriend(newFriendEmail);
    if (result.success) {
      setNewFriendEmail('');
      setShowAddModal(false);
      Alert.alert('Success', 'Friend request sent!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const renderFriend = ({ item }) => (
    <View style={styles.friendCard}>
      <View style={styles.friendAvatar}>
        <Ionicons name="person" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendEmail}>{item.email}</Text>
        {item.isClose && (
          <View style={styles.closeFriendBadge}>
            <Ionicons name="heart" size={12} color={COLORS.success} />
            <Text style={styles.closeFriendText}>Close Friend</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[styles.closeButton, item.isClose && styles.closeButtonActive]}
        onPress={() => toggleCloseFriend(item.id)}
      >
        <Ionicons 
          name={item.isClose ? "heart" : "heart-outline"} 
          size={16} 
          color={item.isClose ? "white" : COLORS.primary} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="people-outline" size={48} color={COLORS.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No Friends Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start building your network by adding friends
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="person-add-outline" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.emptyButtonText}>Add Your First Friend</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Friends</Text>
            <Text style={styles.headerSubtitle}>
              {friends.length} friends • {closeFriends.length} close
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => Alert.alert('Profile', 'Profile functionality coming soon')}
            >
              <Ionicons name="person-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="person-add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      {friends.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFriend}
          refreshing={loading}
          style={styles.friendsList}
          contentContainerStyle={styles.friendsListContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Friend Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Friend</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewFriendEmail('');
                }}
              >
                <Ionicons name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.modalSubtitle}>
                Send a friend request to connect with someone
              </Text>
              
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalInputLabel}>Email Address</Text>
                <View style={styles.modalInputWrapper}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={COLORS.textLight} 
                    style={styles.modalInputIcon}
                  />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter friend's email"
                    value={newFriendEmail}
                    onChangeText={setNewFriendEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowAddModal(false);
                    setNewFriendEmail('');
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalAddButton}
                  onPress={handleAddFriend}
                >
                  <Ionicons name="send" size={16} color="white" style={styles.buttonIcon} />
                  <Text style={styles.modalAddText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  
  // Header Styles
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
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },

  // Friends List
  friendsList: {
    flex: 1,
  },
  friendsListContent: {
    padding: SPACING.lg,
  },

  // Friend Card
  friendCard: {
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
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
  friendInfo: {
    flex: 1,
  },
  friendName: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.xs,
  },
  friendEmail: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  closeFriendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeFriendText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  closeButtonActive: {
    backgroundColor: COLORS.primary,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
    maxWidth: 280,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
  },
  emptyButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },
  buttonIcon: {
    marginRight: SPACING.sm,
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
  modalSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  modalInputContainer: {
    marginBottom: SPACING.xl,
  },
  modalInputLabel: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  modalInputIcon: {
    marginRight: SPACING.sm,
  },
  modalInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    ...TYPOGRAPHY.body,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    marginRight: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  modalCancelText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text,
  },
  modalAddButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    marginLeft: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalAddText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },
});

export default FriendsScreen;
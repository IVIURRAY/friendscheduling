import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../design/DesignSystem';

const GoogleCalendarScreen = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCalendarEvents();
    }
  }, [isAuthenticated]);

  const loadCalendarEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUpcomingCalendarEvents(20);
      setEvents(response.events || []);
    } catch (error) {
      console.error('Failed to load calendar events:', error);
      Alert.alert('Error', 'Failed to load calendar events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCalendarEvents();
    setRefreshing(false);
  };

  const formatEventDate = (dateTime) => {
    if (!dateTime) return 'No date';
    
    const date = new Date(dateTime.dateTime || dateTime.date);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: dateTime.dateTime ? 'numeric' : undefined,
      minute: dateTime.dateTime ? '2-digit' : undefined,
    });
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.summary || 'No title'}
        </Text>
        <View style={styles.eventTime}>
          <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.eventTimeText}>
            {formatEventDate(item.start)}
          </Text>
        </View>
      </View>
      
      {item.description && (
        <Text style={styles.eventDescription} numberOfLines={3}>
          {item.description}
        </Text>
      )}
      
      {item.location && (
        <View style={styles.eventLocation}>
          <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.eventLocationText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      )}
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="log-in-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>Not Authenticated</Text>
          <Text style={styles.emptySubtitle}>Please log in to view your calendar</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Google Calendar</Text>
        <Text style={styles.headerSubtitle}>
          Upcoming events from your Google Calendar
        </Text>
      </View>

      {events.length === 0 && !isLoading ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>No Events Found</Text>
          <Text style={styles.emptySubtitle}>
            No upcoming events in your Google Calendar
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.eventsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  eventsList: {
    padding: SPACING.md,
  },
  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  eventHeader: {
    marginBottom: SPACING.sm,
  },
  eventTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTimeText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  eventDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

export default GoogleCalendarScreen;
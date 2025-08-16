import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, COMMON_STYLES } from '../design/DesignSystem';
import { apiService } from '../services/apiService';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const meetings = await apiService.getUpcomingMeetings(1); // Using user ID 1 for now
      
      // Convert meetings to events format
      const eventsData = meetings.map(meeting => ({
        id: meeting.id,
        title: meeting.title,
        date: meeting.startTime.split('T')[0], // Extract date part
        time: new Date(meeting.startTime).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        location: meeting.location,
        friend: meeting.friend?.name || 'Unknown',
        type: 'meeting',
        meeting: meeting, // Keep the full meeting object for reference
      }));
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarHeader = () => (
    <View style={styles.calendarHeader}>
      <TouchableOpacity
        style={styles.monthButton}
        onPress={() => {
          const prevMonth = new Date(currentMonth);
          prevMonth.setMonth(prevMonth.getMonth() - 1);
          setCurrentMonth(prevMonth);
        }}
      >
        <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      
      <Text style={styles.monthTitle}>
        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </Text>
      
      <TouchableOpacity
        style={styles.monthButton}
        onPress={() => {
          const nextMonth = new Date(currentMonth);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          setCurrentMonth(nextMonth);
        }}
      >
        <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderCalendarDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View style={styles.daysHeader}>
        {days.map((day) => (
          <Text key={day} style={styles.dayHeader}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const renderCalendarGrid = () => {
    const daysInCurrentMonth = daysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateString);
      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth();
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.calendarDay, isSelected && styles.selectedDay]}
          onPress={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
        >
          <Text style={[styles.dayNumber, isSelected && styles.selectedDayText]}>
            {day}
          </Text>
          {dayEvents.length > 0 && (
            <View style={styles.eventIndicator}>
              <Ionicons name="ellipse" size={6} color={COLORS.primary} />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarGrid}>
        {days.map((day, index) => (
          <View key={index} style={styles.calendarCell}>
            {day}
          </View>
        ))}
      </View>
    );
  };

  const renderSelectedDateEvents = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const dayEvents = events.filter(event => event.date === dateString);

    if (dayEvents.length === 0) {
      return (
        <View style={styles.noEventsContainer}>
          <Ionicons name="calendar-outline" size={48} color={COLORS.textLight} />
          <Text style={styles.noEventsTitle}>No Events</Text>
          <Text style={styles.noEventsSubtitle}>
            No events scheduled for {selectedDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.addEventButton}
            onPress={() => Alert.alert('Add Event', 'Add event functionality coming soon')}
          >
            <Ionicons name="add" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.addEventText}>Add Event</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>
            Events for {selectedDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.addEventButton}
            onPress={() => Alert.alert('Add Event', 'Add event functionality coming soon')}
          >
            <Ionicons name="add" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.eventsList}>
          {dayEvents.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <View style={[styles.eventTypeIcon, { backgroundColor: event.type === 'meeting' ? COLORS.primary + '20' : COLORS.success + '20' }]}>
                  <Ionicons 
                    name={event.type === 'meeting' ? 'people' : 'happy'} 
                    size={16} 
                    color={event.type === 'meeting' ? COLORS.primary : COLORS.success} 
                  />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventFriend}>with {event.friend}</Text>
                </View>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
              <View style={styles.eventLocation}>
                <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
                <Text style={styles.eventLocationText}>{event.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="refresh" size={32} color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading calendar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Calendar</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => Alert.alert('Profile', 'Profile functionality coming soon')}
            >
              <Ionicons name="person-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.todayButton}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarCard}>
            {renderCalendarHeader()}
            {renderCalendarDays()}
            {renderCalendarGrid()}
          </View>
        </View>

        {/* Events Section */}
        <View style={styles.eventsSection}>
          {renderSelectedDateEvents()}
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
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  todayButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  todayButtonText: {
    ...TYPOGRAPHY.buttonSmall,
    color: COLORS.textInverse,
  },

  // Content
  content: {
    flex: 1,
  },

  // Calendar Section
  calendarSection: {
    padding: SPACING.lg,
  },
  calendarCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  monthButton: {
    padding: SPACING.sm,
  },
  monthTitle: {
    ...TYPOGRAPHY.h3,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
  },
  dayNumber: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
  },
  selectedDayText: {
    color: COLORS.textInverse,
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 2,
  },

  // Events Section
  eventsSection: {
    padding: SPACING.lg,
  },
  noEventsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  noEventsTitle: {
    ...TYPOGRAPHY.h3,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  noEventsSubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  addEventButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  addEventText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },

  // Events Container
  eventsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  eventsTitle: {
    ...TYPOGRAPHY.h3,
  },
  eventsList: {
    maxHeight: 300,
  },
  eventCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  eventTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.xs,
  },
  eventFriend: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
  },
  eventTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
});

export default CalendarScreen;

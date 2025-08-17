import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import GoogleCalendarScreen from './src/screens/GoogleCalendarScreen';

// Import contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { FriendsProvider } from './src/contexts/FriendsContext';

// Import design system
import { COLORS } from './src/design/DesignSystem';

// Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Friends':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Calendar':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Google Calendar':
            iconName = focused ? 'logo-google' : 'logo-google';
            break;
          case 'Schedule':
            iconName = focused ? 'time' : 'time-outline';
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Friends" component={FriendsScreen} />
    <Tab.Screen name="Calendar" component={CalendarScreen} />
    <Tab.Screen name="Google Calendar" component={GoogleCalendarScreen} />
    <Tab.Screen name="Schedule" component={ScheduleScreen} />
  </Tab.Navigator>
);

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
      <StatusBar style="dark" backgroundColor={COLORS.background} />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FriendsProvider>
        <AppContent />
      </FriendsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  // Tab Bar Styles
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 8,
    paddingTop: 8,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
});
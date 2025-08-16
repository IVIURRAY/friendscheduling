import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';

// Import contexts
import { AuthProvider } from './src/contexts/AuthContext';
import { FriendsProvider } from './src/contexts/FriendsContext';

// Import design system
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from './src/design/DesignSystem';

// Modern Login Screen
const ModernLoginScreen = ({ onLogin }) => (
  <View style={styles.loginContainer}>
    <View style={styles.loginContent}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="people" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.appTitle}>FriendScheduler</Text>
        <Text style={styles.appSubtitle}>Connect • Schedule • Meet</Text>
      </View>
      
      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Ionicons name="log-in-outline" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.loginButtonText}>Get Started</Text>
      </TouchableOpacity>
      
      <Text style={styles.loginFooter}>
        By continuing, you agree to our Terms of Service
      </Text>
    </View>
  </View>
);

// Modern Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = ({ onLogin }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={() => <ModernLoginScreen onLogin={onLogin} />} />
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
    <Tab.Screen name="Schedule" component={ScheduleScreen} />
  </Tab.Navigator>
);

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack onLogin={handleLogin} />}
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
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 24,
  },
  loginContent: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  appTitle: {
    ...TYPOGRAPHY.h1,
    marginBottom: 8,
  },
  appSubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },
  loginFooter: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    lineHeight: 20,
  },

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
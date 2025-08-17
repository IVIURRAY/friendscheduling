import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../design/DesignSystem';

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle, loginWithApple, availableProviders } = useAuth();

  const handleGoogleLogin = () => {
    setIsLoading(true);
    loginWithGoogle();
  };

  const handleAppleLogin = () => {
    setIsLoading(true);
    loginWithApple();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="people" size={32} color={COLORS.primary} />
              </View>
            </View>
            <Text style={styles.title}>Welcome to FriendScheduler</Text>
            <Text style={styles.subtitle}>
              {availableProviders.length > 1 
                ? 'Choose your preferred sign-in method to get started'
                : 'Sign in with Google to get started'}
            </Text>
          </View>

          {/* OAuth Section */}
          <View style={styles.oauthSection}>
            <TouchableOpacity
              style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="reload" size={20} color="white" style={styles.loadingIcon} />
                  <Text style={styles.googleButtonText}>Connecting...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="logo-google" size={20} color="white" style={styles.buttonIcon} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </View>
              )}
            </TouchableOpacity>

            {availableProviders.includes('apple') && (
              <TouchableOpacity
                style={[styles.appleButton, isLoading && styles.appleButtonDisabled]}
                onPress={handleAppleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="reload" size={20} color="white" style={styles.loadingIcon} />
                    <Text style={styles.appleButtonText}>Connecting...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="logo-apple" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.appleButtonText}>Continue with Apple</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            
            <Text style={styles.oauthNote}>
              We'll help you schedule meetings with friends securely
            </Text>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.lg,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.textLight,
  },

  // OAuth Section
  oauthSection: {
    marginBottom: SPACING.xl,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  googleButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  appleButton: {
    backgroundColor: '#000000',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  appleButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  appleButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },
  oauthNote: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  loadingIcon: {
    marginRight: SPACING.sm,
  },
  googleButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },

  // Footer Section
  footerSection: {
    alignItems: 'center',
  },
  footerText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
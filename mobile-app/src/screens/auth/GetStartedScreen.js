import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button } from '../../components';

const ecoRoles = [
  {
    id: 'farmer',
    emoji: '🌾',
    title: 'Empower Farmers',
    subtitle: 'List crops, set fair prices, and reach buyers directly — zero middlemen.',
    color: Colors.primary,
    bgColor: '#E8F5EB',
  },
  {
    id: 'buyer',
    emoji: '🛒',
    title: 'Fresh for Buyers',
    subtitle: 'Browse verified crop listings, compare prices, and order direct from farms.',
    color: Colors.buyer,
    bgColor: '#E3F0FF',
  },
  {
    id: 'transporter',
    emoji: '🚛',
    title: 'Reliable Transport',
    subtitle: 'Clear delivery tasks, optimized routing, and real-time order tracking.',
    color: Colors.transporter,
    bgColor: '#FFF1ED',
  },
];

const GetStartedScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoScale, fadeAnim, slideAnim]);

  const handleGetStarted = useCallback(() => {
    navigation.navigate('RoleSelect');
  }, [navigation]);

  const handleSignIn = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8F5" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.brandName}>Arunella</Text>
          <Text style={styles.tagline}>Sri Lanka's Digital Agricultural Ecosystem</Text>
        </Animated.View>

        {/* Hero Title */}
        <Animated.View
          style={[
            styles.heroSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.heroTitle}>One Platform. Three Pillars.</Text>
          <Text style={styles.heroSubtitle}>
            Connecting Sri Lankan farmers, buyers, and transporters for a fairer, direct supply chain.
          </Text>
        </Animated.View>

        {/* 3 Pillars / Roles Cards */}
        <Animated.View style={[styles.pillarsContainer, { opacity: fadeAnim }]}>
          {ecoRoles.map((role) => (
            <View
              key={role.id}
              style={[styles.pillarCard, Shadows.sm, { backgroundColor: role.bgColor }]}
            >
              <View style={[styles.emojiContainer, { backgroundColor: role.color + '25' }]}>
                <Text style={styles.pillarEmoji}>{role.emoji}</Text>
              </View>
              <View style={styles.pillarText}>
                <Text style={[styles.pillarTitle, { color: role.color }]}>{role.title}</Text>
                <Text style={styles.pillarSubtitle}>{role.subtitle}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Get Started CTA Footer */}
      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          size="lg"
          roleColor={Colors.primary}
          style={{ width: '100%' }}
        />
        <TouchableOpacity onPress={handleSignIn} style={styles.signInLink}>
          <Text style={[Typography.body2, { color: Colors.textSecondary }]}>
            Already have an account?{' '}
            <Text style={{ color: Colors.primary, fontWeight: '700' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F5',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  logoEmoji: {
    fontSize: 34,
  },
  brandName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSubtitle: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.sm,
  },
  pillarsContainer: {
    gap: 12,
  },
  pillarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pillarEmoji: {
    fontSize: 24,
  },
  pillarText: {
    flex: 1,
  },
  pillarTitle: {
    ...Typography.subtitle1,
    fontWeight: '800',
    marginBottom: 2,
  },
  pillarSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 34,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
    gap: 12,
  },
  signInLink: {
    paddingVertical: 6,
  },
});

export default GetStartedScreen;

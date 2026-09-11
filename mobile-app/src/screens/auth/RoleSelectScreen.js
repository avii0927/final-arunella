import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button } from '../../components';

const roles = [
  {
    id: 'farmer',
    label: 'Farmer',
    emoji: '👨‍🌾',
    description: 'List your crops, manage inventory and earn fair prices directly from buyers.',
    color: Colors.farmer,
    bgColor: Colors.farmerLight,
    features: ['Crop Listings', 'Order Management', 'Wallet & Earnings'],
  },
  {
    id: 'buyer',
    label: 'Buyer',
    emoji: '🛒',
    description: 'Browse fresh produce, compare prices, and place orders directly with farmers.',
    color: Colors.buyer,
    bgColor: Colors.buyerLight,
    features: ['Browse Marketplace', 'Direct Orders', 'Track Deliveries'],
  },
  {
    id: 'transporter',
    label: 'Transporter',
    emoji: '🚛',
    description: 'Manage delivery tasks, update status, and earn by delivering agricultural goods.',
    color: Colors.transporter,
    bgColor: Colors.transporterLight,
    features: ['Delivery Tasks', 'Route Navigation', 'Income Tracking'],
  },
];

// ── Role card is extracted into its own component so onPress
//    is a stable prop reference (selectRole callback), not a new arrow each render.
const RoleCard = ({ role, isSelected, onSelect }) => {
  const handlePress = useCallback(() => onSelect(role), [onSelect, role]);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[
        styles.roleCard,
        Shadows.md,
        isSelected && {
          borderColor: role.color,
          borderWidth: 2.5,
          backgroundColor: role.bgColor,
        },
      ]}
    >
      {/* Selection indicator */}
      <View
        style={[
          styles.selectionRing,
          { borderColor: role.color, backgroundColor: isSelected ? role.color : 'transparent' },
        ]}
      >
        {isSelected && <Text style={{ color: Colors.white, fontSize: 12 }}>✓</Text>}
      </View>

      {/* Role header */}
      <View style={styles.roleHeader}>
        <View style={[styles.roleEmojiContainer, { backgroundColor: role.color + '20' }]}>
          <Text style={styles.roleEmoji}>{role.emoji}</Text>
        </View>
        <View style={styles.roleInfo}>
          <Text style={[styles.roleLabel, { color: isSelected ? role.color : Colors.textPrimary }]}>
            {role.label}
          </Text>
          <Text style={styles.roleDesc}>{role.description}</Text>
        </View>
      </View>

      {/* Feature chips */}
      <View style={styles.featureRow}>
        {role.features.map((f) => (
          <View
            key={f}
            style={[styles.featureChip, { backgroundColor: isSelected ? role.color + '20' : Colors.borderLight }]}
          >
            <Text style={[styles.featureText, { color: isSelected ? role.color : Colors.textSecondary }]}>
              {f}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const RoleSelectScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = useCallback(() => {
    if (selectedRole) {
      navigation.navigate('Login', { role: selectedRole });
    }
  }, [navigation, selectedRole]);

  // Stable selector passed down to each card
  const handleSelectRole = useCallback((role) => setSelectedRole(role), []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Text style={{ fontSize: 24 }}>🌿</Text>
            </View>
            <Text style={styles.brand}>Arunella</Text>
          </View>
          <Text style={styles.pageTitle}>Who are you?</Text>
          <Text style={styles.subtitle}>
            Choose your role to get started with the right experience.
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRole?.id === role.id}
              onSelect={handleSelectRole}
            />
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          roleColor={selectedRole?.color}
          size="lg"
          style={{ width: '100%' }}
        />
        <Text style={styles.footerNote}>
          By continuing, you agree to our{' '}
          <Text style={{ color: Colors.primary }}>Terms & Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.lg },
  header: { marginBottom: Spacing.xl },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.lg },
  logoMark: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  brand: { ...Typography.h3, color: Colors.textPrimary, fontWeight: '800' },
  pageTitle: { ...Typography.h2, color: Colors.textPrimary, fontWeight: '800', marginBottom: 8 },
  subtitle: { ...Typography.body1, color: Colors.textSecondary, lineHeight: 24 },
  rolesContainer: { gap: 16 },
  roleCard: {
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.border, position: 'relative',
  },
  selectionRing: {
    position: 'absolute', top: 16, right: 16,
    width: 24, height: 24, borderRadius: 12, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  roleHeader: { flexDirection: 'row', gap: 14, marginBottom: 14, marginRight: 30 },
  roleEmojiContainer: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  roleEmoji: { fontSize: 30 },
  roleInfo: { flex: 1 },
  roleLabel: { ...Typography.h4, marginBottom: 4, fontWeight: '700' },
  roleDesc: { ...Typography.body2, color: Colors.textSecondary, lineHeight: 20 },
  featureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  featureChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radii.pill },
  featureText: { ...Typography.caption, fontWeight: '600' },
  footer: {
    paddingHorizontal: Spacing.lg, paddingBottom: 34, paddingTop: Spacing.md,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight,
    alignItems: 'center', gap: 12,
  },
  footerNote: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
});

export default RoleSelectScreen;

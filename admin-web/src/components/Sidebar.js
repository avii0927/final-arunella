import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const NAV_ITEMS = [
  { id: 'Overview', label: 'Overview', icon: 'dashboard' },
  { id: 'Users', label: 'Users', icon: 'group' },
  { id: 'Products', label: 'Products', icon: 'eco' },
  { id: 'Deliveries', label: 'Deliveries', icon: 'local-shipping' },
  { id: 'FraudDetection', label: 'Fraud Detection', icon: 'security' },
];

export default function Sidebar({ activeTab, onSelectTab }) {
  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <MaterialIcons name="eco" size={24} color={colors.onPrimaryContainer} />
        </View>
        <View>
          <Text style={styles.brandTitle}>Arunella</Text>
          <Text style={styles.brandSubtitle}>Admin Console</Text>
        </View>
      </View>

      {/* Navigation Links */}
      <View style={styles.navList}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onSelectTab(item.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={item.icon}
                size={22}
                color={isActive ? colors.onSecondaryContainer : colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.navLabel,
                  isActive && styles.navLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 256,
    backgroundColor: colors.surfaceContainerLowest,
    borderRightWidth: 1,
    borderRightColor: colors.outlineVariant,
    padding: 16,
    height: '100%',
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 20,
      },
    }),
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
  },
  navList: {
    gap: 6,
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  navItemActive: {
    backgroundColor: colors.secondaryContainer,
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  navLabelActive: {
    color: colors.onSecondaryContainer,
    fontWeight: '700',
  },
});

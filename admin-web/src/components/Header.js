import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function Header({ title, showSearch, searchQuery, setSearchQuery, onLogout, dbConnected }) {
  return (
    <View style={styles.header}>
      {showSearch ? (
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      ) : (
        <Text style={styles.title}>{title || 'Arunella Admin'}</Text>
      )}

      <View style={styles.actionsGroup}>
        {/* DB Connection Status Indicator */}
        <View
          style={[
            styles.dbBadge,
            dbConnected ? styles.dbBadgeConnected : styles.dbBadgeOffline,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              dbConnected ? styles.dotConnected : styles.dotOffline,
            ]}
          />
          <Text
            style={[
              styles.dbBadgeText,
              dbConnected ? styles.dbTextConnected : styles.dbTextOffline,
            ]}
          >
            {dbConnected ? 'DB Live' : 'DB Offline'}
          </Text>
        </View>

        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <MaterialIcons name="notifications" size={22} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <MaterialIcons name="settings" size={22} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
        {onLogout && (
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
            <MaterialIcons name="logout" size={18} color={colors.error} style={{ marginRight: 4 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        right: 0,
        left: 256,
        zIndex: 10,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 9999,
    paddingHorizontal: 12,
    width: 320,
    height: 38,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.onSurface,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dbBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    marginRight: 4,
  },
  dbBadgeConnected: {
    backgroundColor: colors.secondaryContainer,
  },
  dbBadgeOffline: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotConnected: {
    backgroundColor: colors.leafGreen,
  },
  dotOffline: {
    backgroundColor: colors.onSurfaceVariant,
  },
  dbBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dbTextConnected: {
    color: colors.onSecondaryContainer,
  },
  dbTextOffline: {
    color: colors.onSurfaceVariant,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: colors.errorContainer,
    marginLeft: 8,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onErrorContainer,
  },
});

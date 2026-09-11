import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function KpiCard({ title, value, valueColor, subtext, trendIcon, trendColor, iconName, iconBg }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        {iconName && (
          <View style={[styles.iconBox, iconBg ? { backgroundColor: iconBg } : null]}>
            <MaterialIcons name={iconName} size={20} color={colors.onSurface} />
          </View>
        )}
      </View>

      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>

      {subtext && (
        <View style={styles.trendRow}>
          {trendIcon && (
            <MaterialIcons
              name={trendIcon}
              size={14}
              color={trendColor || colors.leafGreen}
              style={{ marginRight: 4 }}
            />
          )}
          <Text style={[styles.subtext, trendColor ? { color: trendColor } : null]}>
            {subtext}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 220,
    backgroundColor: colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    justifyContent: 'space-between',
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  iconBox: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.onSurface,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtext: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.leafGreen,
  },
});

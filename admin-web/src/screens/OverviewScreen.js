import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import KpiCard from '../components/KpiCard';

export default function OverviewScreen({ farmers, crops, deliveries, recentCrops, activityFeed, onNavigateTab }) {
  const activeListingsCount = crops.filter(
    (c) => !c.status || c.status.toLowerCase().includes('active')
  ).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Overview</Text>
        <Text style={styles.subtitle}>Key metrics and recent operational activity.</Text>
      </View>

      {/* KPI Cards Grid */}
      <View style={styles.kpiGrid}>
        <KpiCard
          title="Total Farmers"
          value={farmers.length}
          iconName="group"
          iconBg={colors.actionBlue}
        />
        <KpiCard
          title="Crop Listings"
          value={crops.length}
          iconName="eco"
          iconBg={colors.primaryContainer}
        />
        <KpiCard
          title="Active Listings"
          value={activeListingsCount}
          iconName="inventory-2"
          iconBg={colors.userTan}
        />
        <KpiCard
          title="Deliveries"
          value={deliveries.length}
          iconName="local-shipping"
          iconBg={colors.secondaryContainer}
        />
      </View>

      {/* Main Grid: Recent Crops Table + Activity Feed */}
      <View style={styles.contentGrid}>
        {/* Recent Crops Table Card */}
        <View style={styles.tableCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Crop Listings</Text>
            <TouchableOpacity onPress={() => onNavigateTab('Products')}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, { flex: 1.2 }]}>Product ID</Text>
              <Text style={[styles.th, { flex: 2 }]}>Name</Text>
              <Text style={[styles.th, { flex: 1.2 }]}>Qty</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>Price/KG</Text>
              <Text style={[styles.th, { flex: 1.2 }]}>Status</Text>
            </View>

            {crops.slice(0, 5).map((crop) => (
              <View key={crop.productId} style={styles.tableBodyRow}>
                <Text style={[styles.tdMono, { flex: 1.2 }]}>#CROP-{crop.productId}</Text>
                <Text style={[styles.tdBold, { flex: 2 }]}>{crop.productName}</Text>
                <Text style={[styles.tdSub, { flex: 1.2 }]}>{crop.stock}</Text>
                <Text style={[styles.td, { flex: 1.5 }]}>{crop.pricePerKg}</Text>
                <View style={{ flex: 1.2 }}>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{crop.status || 'Active'}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity Feed */}
        <View style={styles.activityCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
          </View>

          <View style={styles.activityList}>
            {((activityFeed && activityFeed.length > 0)
              ? activityFeed
              : [
                  ...crops.slice(0, 2).map((c) => ({
                    id: `crop-${c.productId || Math.random()}`,
                    title: `Crop listing: ${c.productName}`,
                    subtitle: `${c.stock || 'Stock'} available at ${c.pricePerKg || 'LKR 200/KG'}`,
                    badgeText: 'Listing',
                    badgeBg: '#FFF9C4',
                    badgeColor: '#1a1c1a',
                    time: 'Recently',
                    icon: 'inventory-2',
                    iconBg: '#acf4a4',
                    iconColor: '#307231',
                  })),
                  ...deliveries.slice(0, 2).map((d) => ({
                    id: `del-${d.deliveryId || Math.random()}`,
                    title: `Delivery #${d.deliveryId} (${d.status || 'Active'})`,
                    subtitle: `From ${d.pickupLocation || 'Origin'} to ${d.deliveryLocation || 'Destination'}`,
                    badgeText: 'Logistics',
                    badgeBg: '#e2e3e0',
                    badgeColor: '#40493d',
                    time: 'Recently',
                    icon: 'local-shipping',
                    iconBg: '#E1F5FE',
                    iconColor: '#1a1c1a',
                  })),
                  ...farmers.slice(0, 1).map((f) => ({
                    id: `farm-${f.userId || Math.random()}`,
                    title: `Farmer registered: ${f.name}`,
                    subtitle: `District: ${f.district || 'Colombo'}`,
                    badgeText: 'User',
                    badgeBg: '#cbffc2',
                    badgeColor: '#0d631b',
                    time: 'Recently',
                    icon: 'person-add',
                    iconBg: '#e2e3e0',
                    iconColor: '#40493d',
                  })),
                ]
            ).map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <View style={[styles.activityIconBox, { backgroundColor: item.iconBg }]}>
                  <MaterialIcons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
                      <Text style={[styles.badgeText, { color: item.badgeColor }]}>
                        {item.badgeText}
                      </Text>
                    </View>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    gap: 24,
  },
  header: {
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.onSurface,
  },
  subtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  tableCard: {
    flex: 2,
    minWidth: 500,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  tableContainer: {
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: colors.earthGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  th: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  tableBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
  },
  tdMono: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'monospace',
  },
  tdBold: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  tdSub: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  td: {
    fontSize: 14,
    color: colors.onSurface,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: colors.secondaryContainer,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
  activityCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  activityList: {
    padding: 16,
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
  },
  activityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  activitySubtitle: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
});

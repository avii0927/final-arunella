import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import KpiCard from '../components/KpiCard';

export default function DeliveriesScreen({ deliveries, onCancelDelivery }) {
  const totalDeliveriesCount = deliveries.length;
  const inTransitCount = deliveries.filter(
    (d) =>
      d.status &&
      (d.status.toLowerCase().includes('transit') ||
        d.status.toLowerCase().includes('in_transit'))
  ).length;
  const deliveredCount = deliveries.filter(
    (d) => d.status && d.status.toLowerCase().includes('deliver')
  ).length;
  const activeShipmentsCount = deliveries.filter(
    (d) =>
      !d.status ||
      (!d.status.toLowerCase().includes('deliver') &&
        !d.status.toLowerCase().includes('cancel'))
  ).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Page Header */}
      <View style={styles.topHeaderRow}>
        <View>
          <Text style={styles.pageTitle}>Delivery Tracking</Text>
          <Text style={styles.subtitle}>Real-time logistics monitoring and fleet management.</Text>
        </View>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <KpiCard
          title="Total Shipments"
          value={totalDeliveriesCount}
        />
        <KpiCard
          title="Active Shipments"
          value={activeShipmentsCount}
        />
        <KpiCard
          title="In Transit"
          value={inTransitCount}
        />
        <KpiCard
          title="Delivered"
          value={deliveredCount}
        />
      </View>

      {/* Master Delivery Log Table */}
      <View style={styles.tableCard}>
        <View style={styles.tableCardHeader}>
          <Text style={styles.tableTitle}>Master Delivery Log</Text>
        </View>

        <View style={styles.tableHeaderRow}>
          <Text style={[styles.th, { flex: 1.2 }]}>Delivery ID</Text>
          <Text style={[styles.th, { flex: 1.2 }]}>Order ID</Text>
          <Text style={[styles.th, { flex: 2.2 }]}>Pickup Location</Text>
          <Text style={[styles.th, { flex: 2.2 }]}>Destination</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Status</Text>
          <Text style={[styles.thRight, { flex: 1 }]}>Actions</Text>
        </View>

        {deliveries.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No deliveries found.</Text>
          </View>
        ) : (
          deliveries.map((d) => {
            const isDelivered = d.status === 'Delivered';
            const isTransit = d.status === 'In Transit';
            return (
              <View key={d.deliveryId || d.id} style={styles.tableBodyRow}>
                <Text style={[styles.tdMono, { flex: 1.2 }]}>#DLY-{d.deliveryId || d.id}</Text>
                <Text style={[styles.tdMonoSub, { flex: 1.2 }]}>#ORD-{d.orderId || '892'}</Text>
                <Text style={[styles.td, { flex: 2.2 }]}>{d.pickupLocation || '-'}</Text>
                <Text style={[styles.td, { flex: 2.2 }]}>{d.deliveryLocation || '-'}</Text>
                <View style={{ flex: 1.5 }}>
                  <View
                    style={[
                      styles.statusPill,
                      isDelivered && styles.statusPillSuccess,
                      isTransit && styles.statusPillTransit,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isDelivered && styles.statusPillTextSuccess,
                      ]}
                    >
                      {d.status || 'In Transit'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.actionsCell, { flex: 1 }]}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnDanger]}
                    onPress={() => onCancelDelivery && onCancelDelivery(d.deliveryId || d.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="cancel" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
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
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  tableCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  tableCardHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
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
  thRight: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
    textAlign: 'right',
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
  tdMonoSub: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontFamily: 'monospace',
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
    backgroundColor: colors.userTan,
  },
  statusPillTransit: {
    backgroundColor: colors.userTan,
  },
  statusPillSuccess: {
    backgroundColor: colors.secondaryContainer,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSurface,
  },
  statusPillTextSuccess: {
    color: colors.onSecondaryContainer,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.surfaceContainerHigh,
  },
  actionBtnDanger: {
    backgroundColor: colors.errorContainer,
  },
  emptyRow: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
});

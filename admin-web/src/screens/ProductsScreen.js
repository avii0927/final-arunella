import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import KpiCard from '../components/KpiCard';

export default function ProductsScreen({ crops, onOpenAddProduct }) {
  const totalCropsCount = crops.length;
  const nearingExpiryCount = crops.filter((c) => c.status === 'Nearing Expiry').length || 42;
  const lowStockCount = crops.filter((c) => c.status === 'Low Stock').length || 18;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Page Header */}
      <View style={styles.topHeaderRow}>
        <View>
          <Text style={styles.pageTitle}>Product Management</Text>
          <Text style={styles.subtitle}>Monitor stock, pricing, and expiry across all listings.</Text>
        </View>
        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.exportBtn} activeOpacity={0.7}>
            <MaterialIcons name="file-download" size={18} color={colors.onSurface} style={{ marginRight: 6 }} />
            <Text style={styles.exportBtnText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={onOpenAddProduct} activeOpacity={0.8}>
            <MaterialIcons name="add" size={18} color={colors.onPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.addBtnText}>Add Listing</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* KPI Row */}
      <View style={styles.kpiRow}>
        <KpiCard title="Total Listings" value={totalCropsCount} />
        <KpiCard title="Nearing Expiry" value={nearingExpiryCount} valueColor={colors.warning} />
        <KpiCard title="Low Stock" value={lowStockCount} valueColor={colors.error} />
        <KpiCard title="Avg Price / KG" value="LKR 240" />
      </View>

      {/* Inventory Details Table */}
      <View style={styles.tableCard}>
        <View style={styles.tableCardHeader}>
          <Text style={styles.tableTitle}>Inventory Details</Text>
        </View>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.th, { flex: 1.2 }]}>Product ID</Text>
          <Text style={[styles.th, { flex: 2 }]}>Name</Text>
          <Text style={[styles.th, { flex: 1.2 }]}>Stock</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Price / KG</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Min Price</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Expiry</Text>
          <Text style={[styles.th, { flex: 1.2 }]}>Status</Text>
          <Text style={[styles.thRight, { flex: 1 }]}>Actions</Text>
        </View>

        {crops.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No crop listings found.</Text>
          </View>
        ) : (
          crops.map((crop) => {
            const isWarning = crop.status === 'Nearing Expiry';
            const isError = crop.status === 'Low Stock';
            return (
              <View key={crop.productId} style={styles.tableBodyRow}>
                <Text style={[styles.tdMono, { flex: 1.2 }]}>#PROD-{crop.productId}</Text>
                <Text style={[styles.tdBold, { flex: 2 }]}>{crop.productName}</Text>
                <Text style={[styles.tdSub, { flex: 1.2 }]}>{crop.stock || '-'}</Text>
                <Text style={[styles.td, { flex: 1.5 }]}>{crop.pricePerKg || '-'}</Text>
                <Text style={[styles.tdSub, { flex: 1.5 }]}>{crop.minPrice || '-'}</Text>
                <Text style={[styles.tdSub, { flex: 1.5 }]}>{crop.expDate || '-'}</Text>
                <View style={{ flex: 1.2 }}>
                  <View
                    style={[
                      styles.statusPill,
                      isWarning && styles.statusPillWarning,
                      isError && styles.statusPillError,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isWarning && styles.statusPillTextWarning,
                        isError && styles.statusPillTextError,
                      ]}
                    >
                      {crop.status || 'Active'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.actionsCell, { flex: 1 }]}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="more-vert" size={20} color={colors.onSurfaceVariant} />
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
  btnGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainerLowest,
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  statusPillWarning: {
    backgroundColor: colors.userTan,
  },
  statusPillError: {
    backgroundColor: colors.errorContainer,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
  statusPillTextWarning: {
    color: colors.warning,
  },
  statusPillTextError: {
    color: colors.onErrorContainer,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
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

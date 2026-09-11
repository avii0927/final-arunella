import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import KpiCard from '../components/KpiCard';

export default function UsersScreen({ farmers, buyers, transporters, searchQuery, onOpenAddUser }) {
  const filteredFarmers = farmers.filter(
    (f) =>
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.district && f.district.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredBuyers = buyers.filter(
    (b) =>
      !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.marketLocation && b.marketLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTransporters = transporters.filter(
    (t) =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.vehiclePlateNo && t.vehiclePlateNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalUsersCount = farmers.length + buyers.length + transporters.length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.topHeaderRow}>
        <View>
          <Text style={styles.pageTitle}>User Management</Text>
          <Text style={styles.subtitle}>Manage farmers, buyers, and transporters across the network.</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onOpenAddUser} activeOpacity={0.8}>
          <MaterialIcons name="add" size={18} color={colors.onPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.addBtnText}>Add New User</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <KpiCard title="Total Users" value={totalUsersCount} />
        <KpiCard title="Farmers" value={farmers.length} />
        <KpiCard title="Buyers" value={buyers.length} />
        <KpiCard title="Transporters" value={transporters.length} />
      </View>

      {/* Farmers Table */}
      <View style={styles.tableCard}>
        <View style={styles.tableCardHeader}>
          <MaterialIcons name="agriculture" size={22} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.tableTitle}>Farmers</Text>
        </View>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.th, { flex: 2 }]}>Name</Text>
          <Text style={[styles.th, { flex: 2 }]}>Email</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>NIC</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>District</Text>
          <Text style={[styles.thRight, { flex: 1 }]}>Actions</Text>
        </View>
        {filteredFarmers.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No farmers registered.</Text>
          </View>
        ) : (
          filteredFarmers.map((f) => (
            <View key={f.userId} style={styles.tableBodyRow}>
              <View style={[styles.nameCell, { flex: 2 }]}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{f.name ? f.name.charAt(0) : 'F'}</Text>
                </View>
                <View>
                  <Text style={styles.nameText}>{f.name}</Text>
                  <Text style={styles.idText}>#F-{f.userId}</Text>
                </View>
              </View>
              <Text style={[styles.tdSub, { flex: 2 }]}>{f.email}</Text>
              <Text style={[styles.tdMono, { flex: 1.5 }]}>{f.nic}</Text>
              <Text style={[styles.tdSub, { flex: 1.5 }]}>{f.district || '-'}</Text>
              <View style={[styles.actionsCell, { flex: 1 }]}>
                <TouchableOpacity style={styles.actionBtn}>
                  <MaterialIcons name="visibility" size={18} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]}>
                  <MaterialIcons name="block" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Buyers Table */}
      <View style={styles.tableCard}>
        <View style={styles.tableCardHeader}>
          <MaterialIcons name="shopping-cart" size={22} color={colors.warning} style={{ marginRight: 8 }} />
          <Text style={styles.tableTitle}>Buyers</Text>
        </View>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.th, { flex: 2 }]}>Name</Text>
          <Text style={[styles.th, { flex: 2 }]}>Email</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Business Reg No</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Market Location</Text>
          <Text style={[styles.thRight, { flex: 1 }]}>Actions</Text>
        </View>
        {filteredBuyers.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No buyers registered.</Text>
          </View>
        ) : (
          filteredBuyers.map((b) => (
            <View key={b.userId} style={styles.tableBodyRow}>
              <View style={[styles.nameCell, { flex: 2 }]}>
                <View style={styles.buyerBadge}>
                  <Text style={styles.buyerBadgeText}>Buyer</Text>
                </View>
                <View>
                  <Text style={styles.nameText}>{b.name}</Text>
                  <Text style={styles.idText}>#B-{b.userId}</Text>
                </View>
              </View>
              <Text style={[styles.tdSub, { flex: 2 }]}>{b.email}</Text>
              <Text style={[styles.tdMono, { flex: 1.5 }]}>{b.businessRegNo}</Text>
              <Text style={[styles.tdSub, { flex: 1.5 }]}>{b.marketLocation || '-'}</Text>
              <View style={[styles.actionsCell, { flex: 1 }]}>
                <TouchableOpacity style={styles.actionBtn}>
                  <MaterialIcons name="visibility" size={18} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]}>
                  <MaterialIcons name="block" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Transporters Table */}
      <View style={styles.tableCard}>
        <View style={styles.tableCardHeader}>
          <MaterialIcons name="local-shipping" size={22} color={colors.onSurfaceVariant} style={{ marginRight: 8 }} />
          <Text style={styles.tableTitle}>Transporters</Text>
        </View>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.th, { flex: 2 }]}>Name</Text>
          <Text style={[styles.th, { flex: 2 }]}>Email</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Plate No</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Max Capacity</Text>
          <Text style={[styles.thRight, { flex: 1 }]}>Actions</Text>
        </View>
        {filteredTransporters.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No transporters registered.</Text>
          </View>
        ) : (
          filteredTransporters.map((t) => (
            <View key={t.userId} style={styles.tableBodyRow}>
              <View style={[styles.nameCell, { flex: 2 }]}>
                <View style={styles.transporterAvatar}>
                  <Text style={styles.transporterAvatarText}>{t.name ? t.name.charAt(0) : 'T'}</Text>
                </View>
                <View>
                  <Text style={styles.nameText}>{t.name}</Text>
                  <Text style={styles.idText}>#T-{t.userId}</Text>
                </View>
              </View>
              <Text style={[styles.tdSub, { flex: 2 }]}>{t.email}</Text>
              <Text style={[styles.tdMono, { flex: 1.5 }]}>{t.vehiclePlateNo}</Text>
              <Text style={[styles.tdSub, { flex: 1.5 }]}>{t.maxCapacity || '-'}</Text>
              <View style={[styles.actionsCell, { flex: 1 }]}>
                <TouchableOpacity style={styles.actionBtn}>
                  <MaterialIcons name="visibility" size={18} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]}>
                  <MaterialIcons name="block" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
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
    flexDirection: 'row',
    alignItems: 'center',
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
  nameCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
  buyerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.actionBlue,
  },
  buyerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSurface,
  },
  transporterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transporterAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurface,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  idText: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  tdSub: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  tdMono: {
    fontSize: 12,
    color: colors.onSurface,
    fontFamily: 'monospace',
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
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

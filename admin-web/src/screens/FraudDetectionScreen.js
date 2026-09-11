import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import KpiCard from '../components/KpiCard';

export default function FraudDetectionScreen({ incidents, systemRules, onSelectIncident, onRunScan }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [scanning, setScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState('Just now');

  const filteredIncidents = incidents.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Critical') return item.riskLevel === 'Critical';
    if (activeFilter === 'High') return item.riskLevel === 'High';
    if (activeFilter === 'Medium') return item.riskLevel === 'Medium';
    if (activeFilter === 'Price Gouging') return item.riskType === 'Price Gouging';
    return true;
  });

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setLastScanTime('Seconds ago');
      if (onRunScan) onRunScan();
    }, 800);
  };

  const criticalCount = incidents.filter((i) => i.riskLevel === 'Critical').length;
  const rulesList = systemRules || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Header Row */}
      <View style={styles.topHeaderRow}>
        <View>
          <Text style={styles.pageTitle}>Fraud Detection & Risk Management</Text>
          <Text style={styles.subtitle}>
            Rule-based anomaly detection, price gouging monitoring, and account integrity alerts.
          </Text>
        </View>
        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.exportBtn} activeOpacity={0.7}>
            <MaterialIcons name="file-download" size={18} color={colors.onSurface} style={{ marginRight: 6 }} />
            <Text style={styles.exportBtnText}>Export Audit Log</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.scanBtn, scanning && styles.scanBtnDisabled]}
            onPress={handleScan}
            disabled={scanning}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={scanning ? 'sync' : 'security'}
              size={18}
              color={colors.onPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.scanBtnText}>
              {scanning ? 'Scanning...' : 'Run Security Scan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <KpiCard
          title="Flagged Accounts"
          value={incidents.length || 12}
          valueColor={colors.error}
          subtext={`${criticalCount} Critical Action Required`}
          trendIcon="warning"
          trendColor={colors.error}
        />
        <KpiCard
          title="Suspicious Transactions"
          value="28"
          subtext="Under active investigation"
          trendIcon="info"
          trendColor={colors.warning}
        />
        <KpiCard
          title="Risk Detection Rate"
          value="94%"
          subtext="High Precision"
          trendIcon="verified"
          trendColor={colors.leafGreen}
        />
        <KpiCard
          title="Resolved Cases"
          value="156"
          subtext="Cleared this month"
          trendIcon="check-circle"
          trendColor={colors.leafGreen}
        />
      </View>

      {/* Risk Level Filter Chips */}
      <View style={styles.filterRow}>
        {['All', 'Critical', 'High', 'Medium', 'Price Gouging'].map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          );
        })}
        <Text style={styles.lastScanLabel}>Last Scan: {lastScanTime}</Text>
      </View>

      {/* Content Grid: Incidents Table + System Rules Panel */}
      <View style={styles.contentGrid}>
        {/* Incidents Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableCardHeader}>
            <MaterialIcons name="gavel" size={22} color={colors.error} style={{ marginRight: 8 }} />
            <Text style={styles.tableTitle}>Flagged Fraud Incidents</Text>
          </View>

          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, { flex: 1.2 }]}>Incident ID</Text>
            <Text style={[styles.th, { flex: 2 }]}>User / Entity</Text>
            <Text style={[styles.th, { flex: 2 }]}>Risk Violation</Text>
            <Text style={[styles.th, { flex: 1.2 }]}>Risk Level</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>Financial Impact</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>Status</Text>
            <Text style={[styles.thRight, { flex: 1.2 }]}>Action</Text>
          </View>

          {filteredIncidents.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No fraud incidents match selected filter.</Text>
            </View>
          ) : (
            filteredIncidents.map((incident) => {
              const isCritical = incident.riskLevel === 'Critical';
              const isHigh = incident.riskLevel === 'High';
              return (
                <View key={incident.id} style={styles.tableBodyRow}>
                  <Text style={[styles.tdMono, { flex: 1.2 }]}>#{incident.id}</Text>
                  <View style={[{ flex: 2 }]}>
                    <Text style={styles.tdBold}>{incident.entityName}</Text>
                    <Text style={styles.tdSub}>{incident.entityType}</Text>
                  </View>
                  <Text style={[styles.td, { flex: 2 }]}>{incident.riskType}</Text>
                  <View style={{ flex: 1.2 }}>
                    <View
                      style={[
                        styles.riskPill,
                        isCritical && styles.riskPillCritical,
                        isHigh && styles.riskPillHigh,
                      ]}
                    >
                      <Text
                        style={[
                          styles.riskPillText,
                          isCritical && styles.riskPillTextCritical,
                          isHigh && styles.riskPillTextHigh,
                        ]}
                      >
                        {incident.riskLevel}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.tdBold, { flex: 1.5 }]}>{incident.impactAmount}</Text>
                  <View style={{ flex: 1.5 }}>
                    <Text style={styles.statusText}>{incident.status}</Text>
                  </View>
                  <View style={[styles.actionsCell, { flex: 1.2 }]}>
                    <TouchableOpacity
                      style={styles.reviewBtn}
                      onPress={() => onSelectIncident(incident)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.reviewBtnText}>Review</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* System Risk Rules Panel */}
        <View style={styles.rulesCard}>
          <View style={styles.tableCardHeader}>
            <MaterialIcons name="verified-user" size={22} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.tableTitle}>System Risk Rules</Text>
          </View>
          <View style={styles.rulesList}>
            {rulesList.map((rule) => (
              <View key={rule.id} style={styles.ruleItem}>
                <View style={styles.ruleHeader}>
                  <Text style={styles.ruleName}>{rule.ruleName}</Text>
                  <View style={styles.triggerBadge}>
                    <Text style={styles.triggerText}>{rule.triggerCount}</Text>
                  </View>
                </View>
                <Text style={styles.ruleDesc}>{rule.description}</Text>
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
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  scanBtnDisabled: {
    opacity: 0.7,
  },
  scanBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  filterTextActive: {
    color: colors.onPrimary,
  },
  lastScanLabel: {
    marginLeft: 'auto',
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  tableCard: {
    flex: 2,
    minWidth: 520,
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
  tdMono: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
    fontFamily: 'monospace',
  },
  tdBold: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  tdSub: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  td: {
    fontSize: 14,
    color: colors.onSurface,
  },
  riskPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: colors.userTan,
  },
  riskPillHigh: {
    backgroundColor: '#ffeede',
  },
  riskPillCritical: {
    backgroundColor: colors.errorContainer,
  },
  riskPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSurface,
  },
  riskPillTextHigh: {
    color: colors.warning,
  },
  riskPillTextCritical: {
    color: colors.onErrorContainer,
  },
  statusText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reviewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  },
  reviewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  emptyRow: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  rulesCard: {
    flex: 1,
    minWidth: 300,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  rulesList: {
    padding: 16,
    gap: 16,
  },
  ruleItem: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ruleName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
    flex: 1,
  },
  triggerBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  triggerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
  ruleDesc: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
  },
});

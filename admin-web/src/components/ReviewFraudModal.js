import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function ReviewFraudModal({ visible, incident, onClose, onAction }) {
  if (!incident) return null;

  const isCritical = incident.riskLevel === 'Critical';
  const isHigh = incident.riskLevel === 'High';
  const isMedium = incident.riskLevel === 'Medium';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <MaterialIcons name="security" size={24} color={colors.error} style={{ marginRight: 8 }} />
              <Text style={styles.modalTitle}>Fraud Incident Analysis</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Incident Overview Badge Banner */}
          <View style={styles.banner}>
            <View>
              <Text style={styles.incidentId}>Incident #{incident.id}</Text>
              <Text style={styles.entityName}>{incident.entityName} ({incident.entityType})</Text>
            </View>
            <View
              style={[
                styles.levelPill,
                isCritical && styles.levelCritical,
                isHigh && styles.levelHigh,
                isMedium && styles.levelMedium,
              ]}
            >
              <Text style={styles.levelText}>{incident.riskLevel} Risk</Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Risk Violation</Text>
              <Text style={styles.detailValue}>{incident.riskType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Risk Severity Score</Text>
              <Text style={[styles.detailValue, { color: colors.error, fontWeight: '700' }]}>
                {incident.riskScore} / 100
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Financial Impact</Text>
              <Text style={styles.detailValue}>{incident.impactAmount}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Detected Time</Text>
              <Text style={styles.detailValue}>{incident.detectedAt}</Text>
            </View>
          </View>

          {/* Explanation text */}
          <View style={styles.descBox}>
            <Text style={styles.descTitle}>Risk Analysis & Evidence:</Text>
            <Text style={styles.descText}>{incident.details}</Text>
          </View>

          {/* Action Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.freezeBtn}
              onPress={() => {
                onAction(incident.id, 'Frozen');
                onClose();
              }}
            >
              <MaterialIcons name="block" size={18} color={colors.onPrimary} style={{ marginRight: 6 }} />
              <Text style={styles.freezeBtnText}>Freeze Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => {
                onAction(incident.id, 'Resolved');
                onClose();
              }}
            >
              <MaterialIcons name="check-circle" size={18} color={colors.onPrimary} style={{ marginRight: 6 }} />
              <Text style={styles.clearBtnText}>Dismiss & Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 520,
    maxWidth: '92%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  incidentId: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'monospace',
  },
  entityName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 2,
  },
  levelPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainerHigh,
  },
  levelCritical: {
    backgroundColor: colors.errorContainer,
  },
  levelHigh: {
    backgroundColor: '#ffeede',
  },
  levelMedium: {
    backgroundColor: colors.userTan,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onErrorContainer,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: 200,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: 12,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  descBox: {
    backgroundColor: colors.surfaceContainerLow,
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    marginBottom: 20,
  },
  descTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 4,
  },
  descText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  freezeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  freezeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onPrimary,
  },
});

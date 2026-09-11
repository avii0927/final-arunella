import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function AddUserModal({ visible, onClose, onAddUser }) {
  const [role, setRole] = useState('Farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [extraField, setExtraField] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (!name || !email) return;
    onAddUser({
      role,
      name,
      email,
      extraField,
      location,
    });
    setName('');
    setEmail('');
    setExtraField('');
    setLocation('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New User</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Role selector tabs */}
          <View style={styles.roleSelector}>
            {['Farmer', 'Buyer', 'Transporter'].map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleTab, role === r && styles.roleTabActive]}
                onPress={() => setRole(r)}
              >
                <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sunil Perera"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. sunil@farm.lk"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {role === 'Farmer' ? 'NIC Number' : role === 'Buyer' ? 'Business Reg No' : 'Vehicle Plate No'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={role === 'Farmer' ? '782910382V' : role === 'Buyer' ? 'PV-00124' : 'WP-0012'}
              value={extraField}
              onChangeText={setExtraField}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {role === 'Farmer' ? 'District' : role === 'Buyer' ? 'Market Location' : 'Max Capacity (KG)'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={role === 'Farmer' ? 'Nuwara Eliya' : role === 'Buyer' ? 'Colombo' : '5000 kg'}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Create User</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 480,
    maxWidth: '90%',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 9999,
    padding: 4,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9999,
  },
  roleTabActive: {
    backgroundColor: colors.primary,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  roleTextActive: {
    color: colors.onPrimary,
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.onSurface,
    backgroundColor: colors.surfaceContainerLowest,
    ...Platform.select({
      web: { outlineStyle: 'none' },
    }),
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  submitBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onPrimary,
  },
});

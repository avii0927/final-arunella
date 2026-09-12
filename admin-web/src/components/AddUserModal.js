import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function AddUserModal({ visible, onClose, onAddUser }) {
  const [role, setRole] = useState('Farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nic, setNic] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [district, setDistrict] = useState('');

  // Role-specific fields
  const [location, setLocation] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [businessRegNo, setBusinessRegNo] = useState('');
  const [marketLocation, setMarketLocation] = useState('');
  const [vehiclePlateNo, setVehiclePlateNo] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setNic('');
    setContactNo('');
    setDistrict('');
    setLocation('');
    setBankAccountNo('');
    setBusinessRegNo('');
    setMarketLocation('');
    setVehiclePlateNo('');
    setMaxCapacity('');
  };

  const handleSubmit = () => {
    if (!name || !email) return;
    onAddUser({
      role,
      name,
      email,
      password,
      nic,
      contactNo,
      district,
      location,
      bankAccountNo,
      businessRegNo,
      marketLocation,
      vehiclePlateNo,
      maxCapacity,
    });
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New {role}</Text>
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

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Common Database Attributes */}
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Sunil Perera"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="sunil@farm.lk"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>NIC Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="782910382V"
                  value={nic}
                  onChangeText={setNic}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0771234567"
                  keyboardType="phone-pad"
                  value={contactNo}
                  onChangeText={setContactNo}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>District</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nuwara Eliya / Colombo"
                  value={district}
                  onChangeText={setDistrict}
                />
              </View>
            </View>

            {/* Role Specific Attributes */}
            {role === 'Farmer' && (
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Farm Location Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Keppetipola, Nuwara Eliya"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Bank Account No</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="8001928374"
                    value={bankAccountNo}
                    onChangeText={setBankAccountNo}
                  />
                </View>
              </View>
            )}

            {role === 'Buyer' && (
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Business Reg No</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="PV-00124"
                    value={businessRegNo}
                    onChangeText={setBusinessRegNo}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Market Location</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Pettah Wholesale Market"
                    value={marketLocation}
                    onChangeText={setMarketLocation}
                  />
                </View>
              </View>
            )}

            {role === 'Transporter' && (
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Vehicle Plate No</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="WP-0012"
                    value={vehiclePlateNo}
                    onChangeText={setVehiclePlateNo}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Max Capacity (KG)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="5000"
                    keyboardType="numeric"
                    value={maxCapacity}
                    onChangeText={setMaxCapacity}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Create {role}</Text>
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
    width: 560,
    maxWidth: '95%',
    maxHeight: '90%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  formScroll: {
    maxHeight: 380,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
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



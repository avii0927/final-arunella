import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button, Input } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { FarmerService, BuyerService, TransporterService } from '../../api';

const EditProfileScreen = ({ navigation }) => {
  const { user, role, updateUser } = useAuth();
  const roleColor = role === 'farmer' ? Colors.farmer : role === 'buyer' ? Colors.buyer : Colors.transporter;

  const [name, setName]               = useState(user?.name || '');
  const [email, setEmail]             = useState(user?.email || '');
  const [contactNo, setContactNo]     = useState(user?.contactNo || '');
  const [nic, setNic]                 = useState(user?.nic || '');
  const [district, setDistrict]       = useState(user?.district || '');
  const [location, setLocation]       = useState(user?.location || '');
  const [bankAccountNo, setBankAccountNo] = useState(user?.bankAccountNo || '');
  const [businessRegNo, setBusinessRegNo] = useState(user?.businessRegNo || '');
  const [vehiclePlateNo, setVehiclePlateNo] = useState(user?.vehiclePlateNo || '');
  const [maxCapacity, setMaxCapacity] = useState(user?.maxCapacity ? String(user.maxCapacity) : '');

  const [saving, setSaving]           = useState(false);

  const handleSave = useCallback(async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Name and Email cannot be empty.');
      return;
    }

    const payload = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      contactNo: contactNo.trim() || null,
      nic: nic.trim() || null,
      district: district.trim() || null,
      location: location.trim() || null,
    };

    if (role === 'farmer') {
      payload.bankAccountNo = bankAccountNo.trim() || null;
    } else if (role === 'buyer') {
      payload.businessRegNo = businessRegNo.trim() || null;
    } else if (role === 'transporter') {
      payload.vehiclePlateNo = vehiclePlateNo.trim() || null;
      payload.maxCapacity = maxCapacity ? parseFloat(maxCapacity) : null;
    }

    try {
      setSaving(true);
      let updatedUser = null;
      if (role === 'farmer') {
        updatedUser = await FarmerService.update(user.userId, payload);
      } else if (role === 'buyer') {
        updatedUser = await BuyerService.update(user.userId, payload);
      } else if (role === 'transporter') {
        updatedUser = await TransporterService.update(user.userId, payload);
      }

      updateUser(updatedUser || payload);
      Alert.alert('Success', 'Your personal information has been updated!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Update Failed', err.message || 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  }, [name, email, contactNo, nic, district, location, bankAccountNo, businessRegNo, vehiclePlateNo, maxCapacity, user, role, updateUser, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={roleColor} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: roleColor }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 22, color: Colors.white }}>←</Text>
          </TouchableOpacity>
          <Text style={[Typography.h3, { color: Colors.white, fontWeight: '800' }]}>
            Personal Information
          </Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={[Typography.body2, { color: Colors.white + 'DD', marginTop: 4 }]}>
          Manage your account credentials, location, and bank details
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={[Typography.label, { color: Colors.textMuted, marginBottom: 12 }]}>
            BASIC INFORMATION
          </Text>
          <Input label="Full Name *" value={name} onChangeText={setName} icon="👤" placeholder="Full Name" />
          <Input
            label="Email Address *"
            value={email}
            onChangeText={setEmail}
            icon="✉️"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="email@example.com"
          />
          <Input label="NIC Number" value={nic} onChangeText={setNic} icon="🪪" placeholder="NIC Number" />
          <Input
            label="Contact Number"
            value={contactNo}
            onChangeText={setContactNo}
            icon="📱"
            keyboardType="phone-pad"
            placeholder="+94 77 123 4567"
          />
        </View>

        {/* Location Information */}
        <View style={styles.section}>
          <Text style={[Typography.label, { color: Colors.textMuted, marginBottom: 12 }]}>
            LOCATION & DISTRICT
          </Text>
          <Input
            label="District"
            value={district}
            onChangeText={setDistrict}
            icon="📍"
            placeholder="e.g. Nuwara Eliya, Anuradhapura"
          />
          <Input
            label="Farm / Specific Location"
            value={location}
            onChangeText={setLocation}
            icon="🏡"
            placeholder="e.g. Welimada Farm Zone A"
          />
        </View>

        {/* Financial & Role Details */}
        <View style={styles.section}>
          <Text style={[Typography.label, { color: Colors.textMuted, marginBottom: 12 }]}>
            FINANCIAL & BUSINESS DETAILS
          </Text>

          {role === 'farmer' && (
            <Input
              label="Bank Account Number"
              value={bankAccountNo}
              onChangeText={setBankAccountNo}
              icon="🏦"
              keyboardType="number-pad"
              placeholder="Enter savings bank account no."
            />
          )}

          {role === 'buyer' && (
            <Input
              label="Business Registration Number"
              value={businessRegNo}
              onChangeText={setBusinessRegNo}
              icon="📋"
              placeholder="e.g. PV 12345"
            />
          )}

          {role === 'transporter' && (
            <>
              <Input
                label="Vehicle Plate Number"
                value={vehiclePlateNo}
                onChangeText={setVehiclePlateNo}
                icon="🚗"
                placeholder="e.g. WP-ABC-1234"
              />
              <Input
                label="Max Capacity (kg)"
                value={maxCapacity}
                onChangeText={setMaxCapacity}
                icon="⚖️"
                keyboardType="numeric"
                placeholder="e.g. 1000"
              />
            </>
          )}
        </View>

        <Button
          title={saving ? 'Saving Changes…' : 'Save Changes'}
          onPress={handleSave}
          roleColor={roleColor}
          size="lg"
          disabled={saving}
          style={{ marginTop: Spacing.md }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
});

export default EditProfileScreen;

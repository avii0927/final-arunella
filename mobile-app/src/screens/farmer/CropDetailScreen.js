import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button, StatusBadge, Input } from '../../components';
import { CropService } from '../../api';

const getCropEmoji = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('onion'))   return '🧅';
  if (n.includes('cabbage')) return '🥬';
  if (n.includes('tomato'))  return '🍅';
  if (n.includes('carrot'))  return '🥕';
  if (n.includes('potato'))  return '🥔';
  if (n.includes('chilli') || n.includes('pepper')) return '🌶️';
  if (n.includes('rice'))    return '🍚';
  return '🌾';
};

const CropDetailScreen = ({ navigation, route }) => {
  const crop = route?.params?.crop || {};

  const [pricePerKg, setPricePerKg] = useState(crop.pricePerKg ? String(crop.pricePerKg) : '');
  const [minPrice, setMinPrice]     = useState(crop.minPrice ? String(crop.minPrice) : '');
  const [stock, setStock]           = useState(crop.stock ? String(crop.stock) : '');
  const [status, setStatus]         = useState(crop.status || 'AVAILABLE');
  const [updating, setUpdating]     = useState(false);

  const handleUpdate = async () => {
    if (!pricePerKg || !stock) {
      Alert.alert('Error', 'Price and Stock quantity are required.');
      return;
    }

    const payload = {
      ...crop,
      pricePerKg: parseFloat(pricePerKg),
      minPrice: minPrice ? parseFloat(minPrice) : parseFloat(pricePerKg),
      stock: parseFloat(stock),
      status: status,
    };

    try {
      setUpdating(true);
      await CropService.update(crop.productId, payload);
      Alert.alert('Updated', 'Crop details updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Update Failed', err.message || 'Could not update crop.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Listing',
      `Delete ${crop.productName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await CropService.delete(crop.productId);
              Alert.alert('Deleted', 'Crop listing removed.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              Alert.alert('Delete Failed', err.message || 'Could not delete crop.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.farmer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 22, color: Colors.white }}>←</Text>
        </TouchableOpacity>
        <Text style={[Typography.h3, { color: Colors.white, fontWeight: '800' }]}>
          Crop Details
        </Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteHeaderBtn}>
          <Text style={{ fontSize: 20 }}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={[styles.banner, Shadows.md]}>
          <View style={[styles.emojiBg, { backgroundColor: Colors.farmerLight }]}>
            <Text style={{ fontSize: 64 }}>{getCropEmoji(crop.productName)}</Text>
          </View>
          <Text style={[Typography.h2, { color: Colors.textPrimary, fontWeight: '800', marginTop: 12 }]}>
            {crop.productName || 'Crop Listing'}
          </Text>
          <View style={{ marginTop: 8 }}>
            <StatusBadge status={status?.toLowerCase()} />
          </View>
        </View>

        {/* Edit Form */}
        <View style={[styles.card, Shadows.sm]}>
          <Text style={[Typography.label, { color: Colors.textMuted, marginBottom: 16 }]}>
            EDIT LISTING DETAILS
          </Text>

          <Input
            label="Price per kg (Rs.) *"
            value={pricePerKg}
            onChangeText={setPricePerKg}
            keyboardType="numeric"
            icon="🏷️"
          />

          <Input
            label="Minimum Acceptable Price (Rs.)"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric"
            icon="📉"
          />

          <Input
            label="Available Stock (kg) *"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            icon="⚖️"
          />

          {/* Status selector */}
          <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: 8, fontWeight: '600' }]}>
            Listing Status
          </Text>
          <View style={styles.statusToggleRow}>
            {['AVAILABLE', 'SOLD_OUT'].map((st) => (
              <TouchableOpacity
                key={st}
                onPress={() => setStatus(st)}
                style={[
                  styles.statusToggle,
                  status === st && { backgroundColor: Colors.farmer, borderColor: Colors.farmer },
                ]}
              >
                <Text
                  style={[
                    Typography.button,
                    { color: status === st ? Colors.white : Colors.textSecondary, fontSize: 13 },
                  ]}
                >
                  {st === 'AVAILABLE' ? '✓ Available' : '🚫 Sold Out'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title={updating ? 'Updating…' : 'Update Crop Listing'}
            onPress={handleUpdate}
            roleColor={Colors.farmer}
            disabled={updating}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.farmer,
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { padding: Spacing.lg, paddingBottom: 40 },
  banner: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emojiBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
  },
  statusToggleRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  statusToggle: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
});

export default CropDetailScreen;

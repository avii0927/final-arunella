import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button, Input } from '../../components';
import { CropService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const categories = ['Vegetables', 'Fruits', 'Grains', 'Spices', 'Other'];

const AddCropScreen = ({ navigation }) => {
  const { user } = useAuth();
  const FARMER_ID = user?.userId ?? 1;

  const [selectedCategory, setSelectedCategory] = useState('Vegetables');
  const [cropName, setCropName] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [expDate, setExpDate] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePublish = async () => {
    if (!cropName.trim() || !qty || !price) {
      Alert.alert('Missing Fields', 'Please fill in Crop Name, Quantity and Price.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const cropPayload = {
      farmer: { userId: FARMER_ID },
      productName: cropName.trim(),
      stock: parseInt(qty, 10),
      pricePerKg: parseFloat(price),
      status: 'AVAILABLE',
      uploadedDate: today,
      expDate: expDate || null,
      description: desc || null,
    };

    try {
      setSubmitting(true);
      await CropService.create(cropPayload);
      Alert.alert('Success 🌾', 'Your crop has been listed successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', `Failed to publish crop: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (navigation?.canGoBack && navigation.canGoBack() ? navigation.goBack() : navigation.navigate('FarmerApp'))}
          style={styles.backBtn}
        >
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={[Typography.h3, { color: Colors.textPrimary }]}>Add Crop Listing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Category */}
        <Text style={[Typography.label, { color: Colors.textSecondary, marginBottom: 10 }]}>
          CATEGORY
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                selectedCategory === cat && { backgroundColor: Colors.primary, borderColor: Colors.primary },
              ]}
            >
              <Text
                style={[
                  Typography.body2,
                  { color: selectedCategory === cat ? Colors.white : Colors.textSecondary, fontWeight: '600' },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Form fields */}
        <Input label="Crop Name *" value={cropName} onChangeText={setCropName} placeholder="e.g. Red Onion" icon="🌾" />
        <Input label="Available Quantity (kg) *" value={qty} onChangeText={setQty} placeholder="e.g. 500" icon="⚖️" keyboardType="numeric" />
        <Input label="Price per kg (Rs.) *" value={price} onChangeText={setPrice} placeholder="e.g. 280" icon="💰" keyboardType="numeric" />
        <Input label="Expiry Date (YYYY-MM-DD)" value={expDate} onChangeText={setExpDate} placeholder="e.g. 2026-10-15" icon="📅" />
        <Input
          label="Description (Optional)"
          value={desc}
          onChangeText={setDesc}
          placeholder="Describe your crop quality, harvest date..."
          icon="📝"
          multiline
          numberOfLines={4}
        />

        <Button
          title={submitting ? 'Publishing…' : 'Publish Crop Listing 🌾'}
          onPress={handlePublish}
          size="lg"
          style={{ marginTop: Spacing.md }}
          disabled={submitting}
        />
        {submitting && <ActivityIndicator color={Colors.primary} style={{ marginTop: 12 }} />}
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="ghost"
          size="md"
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: Spacing.lg, paddingBottom: 40 },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radii.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 10,
    backgroundColor: Colors.white,
  },
});

export default AddCropScreen;

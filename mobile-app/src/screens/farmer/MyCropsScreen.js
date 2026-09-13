import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button, StatusBadge } from '../../components';
import { CropService } from '../../api';
import { useAuth } from '../../context/AuthContext';

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

const MyCropsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const FARMER_ID = user?.userId ?? 1;

  const [crops, setCrops]             = useState([]);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);

  const fetchCrops = useCallback(async () => {
    try {
      const data = await CropService.getByFarmer(FARMER_ID);
      setCrops(data || []);
    } catch (err) {
      Alert.alert('Error', 'Could not load your crop listings.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [FARMER_ID]);

  useEffect(() => { fetchCrops(); }, [fetchCrops]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) fetchCrops();
    });
    return unsubscribe;
  }, [navigation, fetchCrops, loading]);

  const handleDeleteCrop = useCallback((crop) => {
    Alert.alert(
      'Delete Crop',
      `Are you sure you want to remove ${crop.productName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await CropService.delete(crop.productId);
              setCrops((prev) => prev.filter((c) => c.productId !== crop.productId));
              Alert.alert('Deleted', `${crop.productName} listing has been removed.`);
            } catch (err) {
              Alert.alert('Delete Failed', err.message || 'Could not delete crop listing.');
            }
          },
        },
      ]
    );
  }, []);

  const handleToggleStatus = useCallback(async (crop) => {
    const newStatus = crop.status === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE';
    try {
      const updated = await CropService.update(crop.productId, { ...crop, status: newStatus });
      setCrops((prev) =>
        prev.map((c) => (c.productId === crop.productId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      Alert.alert('Update Failed', err.message || 'Could not update status.');
    }
  }, []);

  const filteredCrops = crops.filter((c) => {
    const matchesSearch = c.productName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ? true : c.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalListings = crops.length;
  const availableCount = crops.filter((c) => c.status === 'AVAILABLE').length;
  const soldOutCount   = crops.filter((c) => c.status === 'SOLD_OUT').length;

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.farmer} />
        <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 12 }]}>
          Loading your crop listings…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.farmer} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[Typography.h2, { color: Colors.white, fontWeight: '800' }]}>
            My Crop Listings
          </Text>
          <TouchableOpacity
            style={styles.addBtnHeader}
            onPress={() => navigation.navigate('AddCrop')}
          >
            <Text style={{ color: Colors.farmer, fontWeight: '700', fontSize: 14 }}>+ Add Crop</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search your crop listings..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchCrops(); }}
            colors={[Colors.farmer]}
          />
        }
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, Shadows.sm]}>
            <Text style={[Typography.h3, { color: Colors.farmer, fontWeight: '800' }]}>{totalListings}</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Total Crops</Text>
          </View>
          <View style={[styles.statBox, Shadows.sm]}>
            <Text style={[Typography.h3, { color: Colors.success, fontWeight: '800' }]}>{availableCount}</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Available</Text>
          </View>
          <View style={[styles.statBox, Shadows.sm]}>
            <Text style={[Typography.h3, { color: Colors.error, fontWeight: '800' }]}>{soldOutCount}</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Sold Out</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {['ALL', 'AVAILABLE', 'SOLD_OUT'].map((st) => (
            <TouchableOpacity
              key={st}
              onPress={() => setStatusFilter(st)}
              style={[
                styles.filterPill,
                statusFilter === st && { backgroundColor: Colors.farmer, borderColor: Colors.farmer },
              ]}
            >
              <Text
                style={[
                  Typography.caption,
                  { color: statusFilter === st ? Colors.white : Colors.textSecondary, fontWeight: '700' },
                ]}
              >
                {st === 'ALL' ? 'All Crops' : st === 'AVAILABLE' ? 'Available' : 'Sold Out'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Crop Cards */}
        {filteredCrops.length === 0 ? (
          <View style={[styles.emptyState, Shadows.sm]}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>🌾</Text>
            <Text style={[Typography.body1, { color: Colors.textSecondary, fontWeight: '600' }]}>
              No crops found
            </Text>
            <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>
              {search ? 'Try clearing your search term.' : 'List your fresh harvest to start selling!'}
            </Text>
            <Button
              title="Add New Crop"
              roleColor={Colors.farmer}
              size="sm"
              style={{ marginTop: 16 }}
              onPress={() => navigation.navigate('AddCrop')}
            />
          </View>
        ) : (
          filteredCrops.map((crop) => (
            <View key={crop.productId} style={[styles.cropCard, Shadows.sm]}>
              <View style={styles.cropCardTop}>
                <View style={[styles.emojiCircle, { backgroundColor: Colors.farmerLight }]}>
                  <Text style={{ fontSize: 28 }}>{getCropEmoji(crop.productName)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h4, { color: Colors.textPrimary }]}>{crop.productName}</Text>
                  <Text style={[Typography.body2, { color: Colors.farmer, fontWeight: '700' }]}>
                    Rs. {crop.pricePerKg}/kg
                  </Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                    Stock: {crop.stock} kg
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: Colors.farmerLight }]}
                  onPress={() => handleToggleStatus(crop)}
                >
                  <Text style={[Typography.caption, { color: Colors.farmer, fontWeight: '700' }]}>
                    {crop.status === 'AVAILABLE' ? 'Mark Sold Out' : 'Mark Available'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: Colors.error + '15' }]}
                  onPress={() => handleDeleteCrop(crop)}
                >
                  <Text style={[Typography.caption, { color: Colors.error, fontWeight: '700' }]}>
                    Delete Listing
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.farmer,
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
    marginBottom: Spacing.md,
  },
  addBtnHeader: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchInput: { flex: 1, ...Typography.body1, color: Colors.textPrimary },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  statBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: 12,
    alignItems: 'center',
  },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.lg },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  cropCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: 12,
  },
  cropCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emojiCircle: { width: 50, height: 50, borderRadius: Radii.md, alignItems: 'center', justifyContent: 'center' },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radii.md },
});

export default MyCropsScreen;

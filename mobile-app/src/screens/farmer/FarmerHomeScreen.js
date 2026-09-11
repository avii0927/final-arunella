import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Card, Button, SectionHeader, StatusBadge, Avatar } from '../../components';
import { CropService, OrderService, FarmerService } from '../../api';
import { useAuth } from '../../context/AuthContext';

// ── Crop Emoji Helper ────────────────────────────────────────────────
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

// ── Stable sub-component so onPress is not an inline arrow ──────────────
const CropCard = ({ crop, navigation }) => {
  const handlePress = useCallback(() => navigation.navigate('CropDetail', { crop }), [navigation, crop]);
  return (
    <TouchableOpacity style={[cropCardStyles.cropCard, Shadows.sm]} onPress={handlePress}>
      <View style={cropCardStyles.cropLeft}>
        <View style={[cropCardStyles.cropEmoji, { backgroundColor: Colors.farmerLight }]}>
          <Text style={{ fontSize: 28 }}>{getCropEmoji(crop.productName)}</Text>
        </View>
        <View>
          <Text style={[Typography.h4, { color: Colors.textPrimary }]}>{crop.productName}</Text>
          <Text style={[Typography.body2, { color: Colors.textSecondary }]}>{crop.stock} kg available</Text>
          <Text style={[Typography.caption, { color: Colors.textMuted }]}>Min price: Rs. {crop.minPrice}/kg</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[Typography.body1, { color: Colors.primary, fontWeight: '700', marginBottom: 6 }]}>
          Rs. {crop.pricePerKg}/kg
        </Text>
        <StatusBadge status={crop.status?.toLowerCase()} />
      </View>
    </TouchableOpacity>
  );
};

const cropCardStyles = StyleSheet.create({
  cropCard: { backgroundColor: Colors.white, borderRadius: Radii.lg, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cropLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cropEmoji: { width: 52, height: 52, borderRadius: Radii.md, alignItems: 'center', justifyContent: 'center' },
});

const FarmerHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const FARMER_ID = user?.userId ?? 1;
  const [farmer, setFarmer]       = useState(null);
  const [crops, setCrops]         = useState([]);
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const fetchData = useCallback(async () => {
    try {
      const [farmerData, cropsData, allOrders] = await Promise.all([
        FarmerService.getById(FARMER_ID),
        CropService.getByFarmer(FARMER_ID),
        OrderService.getAll(),
      ]);
      setFarmer(farmerData);
      setCrops(cropsData || []);
      setOrders(allOrders || []);
    } catch (err) {
      Alert.alert(
        'Connection Error',
        'Could not reach the backend. Make sure the Spring Boot server is running on port 8085.',
        [{ text: 'Retry', onPress: fetchData }, { text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Refresh when screen comes back into focus
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleFocus = useCallback(() => {
    if (!loading) fetchData();
  }, [loading, fetchData]);

  const goToAddCrop    = useCallback(() => navigation.navigate('AddCrop'),          [navigation]);
  const goToMyCrops    = useCallback(() => navigation.navigate('MyCrops'),           [navigation]);
  const goToFarmerOrders = useCallback(() => navigation.navigate('FarmerOrders'),   [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', handleFocus);
    return unsubscribe;
  }, [navigation, handleFocus]);

  const activeCrops   = crops.filter(c => c.status === 'AVAILABLE').length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  const statCards = [
    { label: 'Active Listings', value: String(activeCrops),      icon: '🌾', color: Colors.primary },
    { label: 'Pending Orders',  value: String(pendingOrders),     icon: '📦', color: Colors.warning },
    { label: 'Total Crops',     value: String(crops.length),      icon: '📈', color: Colors.success },
    { label: 'Farmer Rating',   value: farmer ? `${farmer.rating}⭐` : '—', icon: '⭐', color: Colors.buyer },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 12 }]}>
          Loading your farm data…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Hero Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{greeting} 🌅</Text>
            <Text style={styles.farmerName}>{farmer?.name || 'Farmer'}</Text>
            <View style={styles.locationBadge}>
              <Text style={styles.locationText}>📍 {farmer?.district || '—'}</Text>
            </View>
          </View>
          <Avatar name={farmer?.name || 'F'} size={52} color={Colors.white} />
        </View>

        {/* Quick action banner */}
        <TouchableOpacity
          style={styles.addCropBanner}
          onPress={goToAddCrop}
        >
          <Text style={{ fontSize: 24 }}>🌱</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[Typography.body2, { color: Colors.primary, fontWeight: '700' }]}>
              Add New Crop Listing
            </Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
              Reach thousands of buyers
            </Text>
          </View>
          <Text style={{ color: Colors.primary, fontSize: 20 }}>→</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
          onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statCards.map((s) => (
            <View key={s.label} style={[styles.statCard, Shadows.sm]}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={[Typography.h3, { color: s.color, fontWeight: '800' }]}>{s.value}</Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: 'center' }]}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* My Crops */}
        <View style={styles.section}>
          <SectionHeader
            title="My Crop Listings"
            actionLabel="View All"
            onAction={goToMyCrops}
          />
          {crops.length === 0 ? (
            <View style={[styles.emptyState, Shadows.sm]}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>🌱</Text>
              <Text style={[Typography.body1, { color: Colors.textSecondary }]}>No crops listed yet</Text>
              <Button title="Add First Crop" onPress={goToAddCrop} size="sm" style={{ marginTop: 12 }} />
            </View>
          ) : (
            crops.slice(0, 4).map((crop) => (
              <CropCard key={crop.productId} crop={crop} navigation={navigation} />
            ))
          )}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <SectionHeader
            title="Recent Orders"
            actionLabel="View All"
            onAction={goToFarmerOrders}
          />
          {orders.length === 0 ? (
            <View style={[styles.emptyState, Shadows.sm]}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>📦</Text>
              <Text style={[Typography.body1, { color: Colors.textSecondary }]}>No orders yet</Text>
            </View>
          ) : (
            orders.slice(0, 3).map((order) => (
              <Card key={order.orderId} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={[Typography.label, { color: Colors.textMuted }]}>ORD-{order.orderId}</Text>
                  <StatusBadge status={order.status?.toLowerCase()} />
                </View>
                <View style={styles.orderDetails}>
                  <Text style={[Typography.body2, { color: Colors.textSecondary }]}>
                    Qty: {order.quantity} kg  ·  {order.date}
                  </Text>
                  <Text style={[Typography.body1, { color: Colors.success, fontWeight: '700' }]}>
                    Rs. {Number(order.price).toLocaleString()}
                  </Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: { ...Typography.body2, color: Colors.white + 'CC', marginBottom: 2 },
  farmerName: { ...Typography.h2, color: Colors.white, fontWeight: '800', marginBottom: 6 },
  locationBadge: {
    backgroundColor: Colors.white + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
  },
  locationText: { ...Typography.caption, color: Colors.white },
  addCropBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.md,
  },
  scrollContent: { paddingBottom: 100 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: Spacing.lg },
  statCard: {
    flex: 1, minWidth: '44%',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: { fontSize: 28 },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  cropCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cropEmoji: {
    width: 52, height: 52,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCard: { marginBottom: 10 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default FarmerHomeScreen;

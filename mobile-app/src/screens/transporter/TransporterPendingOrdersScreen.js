import React, { useState, useEffect, useCallback } from 'react';
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
import { Card, Button, SectionHeader, StatusBadge, EmptyState } from '../../components';
import { DeliveryService, OrderService, CropService, FarmerService, BuyerService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const TransporterPendingOrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const TRANSPORTER_ID = user?.userId ?? 1;

  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendingOrders = useCallback(async () => {
    try {
      // Fetch all deliveries, orders, crops, farmers, buyers to construct complete pending jobs list
      const [allDeliveriesRes, allOrdersRes, cropsRes, farmersRes, buyersRes] = await Promise.allSettled([
        DeliveryService.getAll(),
        OrderService.getAll(),
        CropService.getAll(),
        FarmerService.getAll(),
        BuyerService.getAll(),
      ]);

      const deliveriesList = allDeliveriesRes.status === 'fulfilled' ? (allDeliveriesRes.value || []) : [];
      const ordersList     = allOrdersRes.status === 'fulfilled' ? (allOrdersRes.value || []) : [];
      const cropsList      = cropsRes.status === 'fulfilled' ? (cropsRes.value || []) : [];
      const farmersList    = farmersRes.status === 'fulfilled' ? (farmersRes.value || []) : [];
      const buyersList     = buyersRes.status === 'fulfilled' ? (buyersRes.value || []) : [];

      // Filter deliveries that are in PENDING status or unassigned
      const pendingDeliveries = deliveriesList.filter((d) => {
        const s = (d.status || '').toLowerCase();
        return s === 'pending' || s === 'unassigned' || !d.transporter;
      });

      // Filter PENDING or CONFIRMED orders that don't have an active delivery record
      const existingOrderIds = new Set(deliveriesList.map((d) => d.order?.orderId || d.orderId));
      const unassignedOrders = ordersList.filter(
        (o) => ['pending', 'confirmed'].includes((o.status || '').toLowerCase()) && !existingOrderIds.has(o.orderId)
      );

      // Helper to extract meta information
      const resolveMeta = (orderId, farmerId, productId, buyerObj, rawPickup, rawDropoff) => {
        const crop = cropsList.find((c) => String(c.productId) === String(productId));
        const farmer = farmersList.find((f) => String(f.userId) === String(farmerId));
        const buyer = buyerObj || buyersList.find((b) => String(b.userId) === String(buyerObj?.userId));

        return {
          productName: crop?.productName || 'Fresh Agricultural Produce',
          farmerName: farmer?.name || 'Farmer / Supplier',
          farmerLocation: farmer?.location || farmer?.district || rawPickup || 'Farm Agro Depot',
          buyerName: buyer?.name || 'Buyer / Recipient',
          buyerLocation: buyer?.marketLocation || buyer?.district || rawDropoff || 'Wholesale Market',
        };
      };

      // Unified pending jobs list
      const combined = [
        ...pendingDeliveries.map((d) => {
          const matchedOrder = ordersList.find((o) => String(o.orderId) === String(d.order?.orderId || d.orderId));
          const meta = resolveMeta(
            matchedOrder?.orderId || d.orderId,
            matchedOrder?.farmerId,
            matchedOrder?.productId,
            matchedOrder?.buyer,
            d.pickupLocation,
            d.deliveryLocation
          );
          return {
            type: 'delivery',
            id: d.deliveryId,
            deliveryId: d.deliveryId,
            orderId: d.order?.orderId || d.orderId || '—',
            pickupLocation: meta.farmerLocation,
            deliveryLocation: meta.buyerLocation,
            productName: meta.productName,
            farmerName: meta.farmerName,
            buyerName: meta.buyerName,
            status: 'PENDING',
            quantity: matchedOrder?.quantity || d.quantity,
            price: matchedOrder?.price || d.totalPayout,
            raw: d,
            rawOrder: matchedOrder,
          };
        }),
        ...unassignedOrders.map((o) => {
          const meta = resolveMeta(o.orderId, o.farmerId, o.productId, o.buyer, null, null);
          return {
            type: 'order',
            id: `ord-${o.orderId}`,
            orderId: o.orderId,
            pickupLocation: meta.farmerLocation,
            deliveryLocation: meta.buyerLocation,
            productName: meta.productName,
            farmerName: meta.farmerName,
            buyerName: meta.buyerName,
            status: o.status,
            price: o.price,
            quantity: o.quantity,
            raw: o,
          };
        }),
      ];

      setPendingItems(combined);
    } catch (err) {
      Alert.alert('Error', 'Could not load pending orders from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) fetchPendingOrders();
    });
    return unsubscribe;
  }, [navigation, fetchPendingOrders, loading]);

  const handleAcceptJob = async (item) => {
    try {
      if (item.type === 'delivery') {
        await DeliveryService.update(item.deliveryId, {
          ...item.raw,
          status: 'SHIPPED',
          transporter: { userId: TRANSPORTER_ID },
          orderId: item.orderId !== '—' ? item.orderId : undefined,
        });
        if (item.orderId && item.orderId !== '—') {
          await OrderService.update(item.orderId, {
            ...(item.rawOrder || {}),
            orderId: item.orderId,
            status: 'SHIPPED',
          }).catch(() => null);
        }
      } else {
        // Create new delivery record for this order
        await DeliveryService.create({
          orderId: item.orderId,
          pickupLocation: item.pickupLocation,
          deliveryLocation: item.deliveryLocation,
          status: 'SHIPPED',
          transporter: { userId: TRANSPORTER_ID },
          date: new Date().toISOString().split('T')[0],
        });
        await OrderService.update(item.orderId, {
          ...item.raw,
          orderId: item.orderId,
          status: 'SHIPPED',
        }).catch(() => null);
      }

      Alert.alert(
        'Job Accepted! 🎉',
        `You have accepted Order #${item.orderId}. It has been marked as SHIPPED and moved to your Active Deliveries.`,
        [
          {
            text: 'View Deliveries',
            onPress: () => {
              fetchPendingOrders();
              navigation.navigate('TransporterHome');
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', `Failed to accept order: ${err.message}`);
    }
  };

  const handleDeclineJob = async (item) => {
    try {
      if (item.type === 'delivery') {
        await DeliveryService.update(item.deliveryId, {
          ...item.raw,
          status: 'CANCELLED',
        });
        if (item.orderId && item.orderId !== '—') {
          await OrderService.update(item.orderId, {
            ...(item.rawOrder || {}),
            orderId: item.orderId,
            status: 'CANCELLED',
          }).catch(() => null);
        }
      } else {
        await OrderService.update(item.orderId, {
          ...item.raw,
          orderId: item.orderId,
          status: 'CANCELLED',
        });
      }
      Alert.alert('Job Declined', `Order #${item.orderId} was declined and marked as cancelled.`);
      fetchPendingOrders();
    } catch (err) {
      Alert.alert('Error', `Failed to decline order: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.transporter} />
        <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 12 }]}>
          Loading pending orders…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.transporter} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Orders 📋</Text>
        <Text style={styles.headerSub}>Confirmed farmer orders waiting for transporter acceptance.</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchPendingOrders();
            }}
            colors={[Colors.transporter]}
          />
        }
      >
        <SectionHeader title={`Available Requests (${pendingItems.length})`} />

        {pendingItems.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No Pending Orders"
            subtitle="There are currently no new unassigned delivery requests."
          />
        ) : (
          pendingItems.map((item) => (
            <View key={item.id} style={[styles.jobCard, Shadows.md]}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: item.deliveryId, delivery: item.raw, orderId: item.orderId })}
                activeOpacity={0.8}
              >
                <View style={styles.badgeRow}>
                  <Text style={[Typography.label, { color: Colors.transporter, fontWeight: '700' }]}>
                    ORDER #{item.orderId}
                  </Text>
                  {item.deliveryId && (
                    <Text style={[Typography.caption, { color: Colors.textMuted, marginLeft: 8 }]}>
                      (DEL-{item.deliveryId})
                    </Text>
                  )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <StatusBadge status="pending" />
                  <Text style={{ color: Colors.transporter, fontSize: 16, fontWeight: '700' }}>›</Text>
                </View>
              </TouchableOpacity>

              {/* Order Meta Details */}
              <View style={styles.orderInfoBox}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🌾</Text>
                  <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '700', flex: 1 }]}>
                    {item.productName}{' '}
                    {item.quantity ? <Text style={{ color: Colors.primary }}>({item.quantity} KG)</Text> : null}
                  </Text>
                  {item.price ? (
                    <Text style={[Typography.caption, { color: Colors.success, fontWeight: '800' }]}>
                      LKR {Number(item.price).toLocaleString()}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>👨‍🌾</Text>
                  <Text style={[Typography.caption, { color: Colors.textSecondary, flex: 1 }]}>
                    Farmer: <Text style={{ color: Colors.textPrimary, fontWeight: '600' }}>{item.farmerName}</Text>
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🛒</Text>
                  <Text style={[Typography.caption, { color: Colors.textSecondary, flex: 1 }]}>
                    Buyer: <Text style={{ color: Colors.textPrimary, fontWeight: '600' }}>{item.buyerName}</Text>
                  </Text>
                </View>
              </View>

              {/* Route */}
              <View style={styles.routeContainer}>
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>PICKUP LOCATION</Text>
                    <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                      {item.pickupLocation}
                    </Text>
                  </View>
                </View>

                <View style={styles.routeLine} />

                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, { backgroundColor: Colors.transporter }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>DESTINATION</Text>
                    <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                      {item.deliveryLocation}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <Button
                  title="Accept Delivery ✅"
                  onPress={() => handleAcceptJob(item)}
                  roleColor={Colors.success}
                  size="md"
                  style={{ flex: 1.2 }}
                />
                <Button
                  title="Decline"
                  variant="secondary"
                  onPress={() => handleDeclineJob(item)}
                  roleColor={Colors.error}
                  size="md"
                  style={{ flex: 0.8 }}
                />
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
    backgroundColor: Colors.transporter,
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: { ...Typography.h2, color: Colors.white, fontWeight: '800', marginBottom: 4 },
  headerSub: { ...Typography.body2, color: Colors.white + 'CC' },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderInfoBox: {
    backgroundColor: Colors.background,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: 12,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    fontSize: 16,
  },
  routeContainer: { marginBottom: 14 },
  routePoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 4 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4, flexShrink: 0 },
  routeLine: { width: 2, height: 24, backgroundColor: Colors.border, marginLeft: 5, marginVertical: 2 },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default TransporterPendingOrdersScreen;

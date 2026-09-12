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
import { DeliveryService, OrderService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const TransporterPendingOrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const TRANSPORTER_ID = user?.userId ?? 1;

  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendingOrders = useCallback(async () => {
    try {
      // Fetch all deliveries and orders to find unassigned or PENDING jobs
      const [allDeliveries, allOrders] = await Promise.allSettled([
        DeliveryService.getAll(),
        OrderService.getAll(),
      ]);

      const deliveriesList = allDeliveries.status === 'fulfilled' ? (allDeliveries.value || []) : [];
      const ordersList = allOrders.status === 'fulfilled' ? (allOrders.value || []) : [];

      // Filter deliveries that are in PENDING status or unassigned
      const pendingDeliveries = deliveriesList.filter((d) => {
        const s = (d.status || '').toLowerCase();
        return s === 'pending' || s === 'unassigned' || !d.transporter;
      });

      // Also pair any PENDING orders that don't have a delivery yet
      const existingOrderIds = new Set(deliveriesList.map((d) => d.order?.orderId || d.orderId));
      const unassignedOrders = ordersList.filter(
        (o) => (o.status || '').toLowerCase() === 'pending' && !existingOrderIds.has(o.orderId)
      );

      // Unified pending jobs list
      const combined = [
        ...pendingDeliveries.map((d) => ({
          type: 'delivery',
          id: d.deliveryId,
          deliveryId: d.deliveryId,
          orderId: d.order?.orderId || d.orderId || '—',
          pickupLocation: d.pickupLocation || 'Farm Agro Depot',
          deliveryLocation: d.deliveryLocation || 'Market Wholesale Distribution Center',
          status: 'PENDING',
          raw: d,
        })),
        ...unassignedOrders.map((o) => ({
          type: 'order',
          id: `ord-${o.orderId}`,
          orderId: o.orderId,
          pickupLocation: 'Farm Agro Depot',
          deliveryLocation: 'Central Wholesale Market',
          status: 'PENDING',
          price: o.price,
          quantity: o.quantity,
          raw: o,
        })),
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
          status: 'IN_TRANSIT',
          transporter: { userId: TRANSPORTER_ID },
        });
      } else {
        // Create new delivery record for this order
        await DeliveryService.create({
          orderId: item.orderId,
          pickupLocation: item.pickupLocation,
          deliveryLocation: item.deliveryLocation,
          status: 'IN_TRANSIT',
          transporter: { userId: TRANSPORTER_ID },
          date: new Date().toISOString().split('T')[0],
        });
      }

      Alert.alert(
        'Job Accepted! 🎉',
        `You have accepted Order #${item.orderId}. It has been moved to your Active Deliveries.`,
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
      }
      Alert.alert('Job Declined', `Order #${item.orderId} was declined.`);
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
        <Text style={styles.headerSub}>Available delivery jobs waiting for transporter acceptance.</Text>
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
            actionLabel="Refresh Requests"
            onAction={() => {
              setLoading(true);
              fetchPendingOrders();
            }}
          />
        ) : (
          pendingItems.map((item) => (
            <View key={item.id} style={[styles.jobCard, Shadows.md]}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: item.deliveryId, delivery: item.raw })}
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

              {/* Item Details */}
              {item.quantity && (
                <View style={styles.detailRow}>
                  <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                    Quantity: <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>{item.quantity} KG</Text>
                  </Text>
                  {item.price && (
                    <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                      Value: <Text style={{ fontWeight: '700', color: Colors.success }}>LKR {item.price}</Text>
                    </Text>
                  )}
                </View>
              )}

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
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeContainer: { marginBottom: 14 },
  routePoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 4 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4, flexShrink: 0 },
  routeLine: { width: 2, height: 24, backgroundColor: Colors.border, marginLeft: 5, marginVertical: 2 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default TransporterPendingOrdersScreen;

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
import { StatusBadge, Card } from '../../components';
import { OrderService, FarmerService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const FarmerOrdersScreen = ({ navigation }) => {
  const { user }                        = useAuth();
  const FARMER_ID                       = user?.userId ?? 1;
  const [farmer, setFarmer]             = useState(null);
  const [orders, setOrders]             = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading]          = useState(true);
  const [refreshing, setRefreshing]    = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const [data, farmerData] = await Promise.all([
        OrderService.getAll(),
        FarmerService.getById(FARMER_ID).catch(() => null),
      ]);
      setOrders(data || []);
      if (farmerData) setFarmer(farmerData);
    } catch (err) {
      Alert.alert('Error', 'Could not load orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [FARMER_ID]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) fetchOrders();
    });
    return unsubscribe;
  }, [navigation, fetchOrders, loading]);

  const handleUpdateStatus = useCallback(async (order, newStatus) => {
    try {
      await OrderService.update(order.orderId, { ...order, status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.orderId === order.orderId ? { ...o, status: newStatus } : o))
      );
      Alert.alert('Order Updated', `Order ORD-${order.orderId} status changed to ${newStatus}.`);
    } catch (err) {
      Alert.alert('Update Failed', err.message || 'Could not update order status.');
    }
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status?.toUpperCase() === statusFilter;
  });

  const pendingCount   = orders.filter((o) => o.status === 'PENDING').length;
  const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED').length;
  const shippedCount   = orders.filter((o) => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.farmer} />
        <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 12 }]}>
          Loading orders…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.farmer} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: Colors.white, fontWeight: '800' }]}>
          Received Orders
        </Text>
        <Text style={[Typography.body2, { color: Colors.white + 'CC', marginTop: 4 }]}>
          Track and process buyer orders for your crops
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchOrders(); }}
            colors={[Colors.farmer]}
          />
        }
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, Shadows.sm]}>
            <Text style={[Typography.h3, { color: Colors.warning, fontWeight: '800' }]}>{pendingCount}</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Pending</Text>
          </View>
          <View style={[styles.statBox, Shadows.sm]}>
            <Text style={[Typography.h3, { color: Colors.farmer, fontWeight: '800' }]}>{confirmedCount}</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Confirmed</Text>
          </View>
          <View style={[styles.statBox, Shadows.sm]}>
            <Text style={[Typography.h3, { color: Colors.textPrimary, fontWeight: '800' }]}>{orders.length}</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Total Orders</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.lg }}>
          {['ALL', 'PENDING', 'CONFIRMED'].map((st) => (
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
                {st === 'ALL' ? 'All Orders' : st.charAt(0) + st.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <View style={[styles.emptyState, Shadows.sm]}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>📦</Text>
            <Text style={[Typography.body1, { color: Colors.textSecondary, fontWeight: '600' }]}>
              No orders found
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const pickupLocation = order.pickupLocation || farmer?.location || farmer?.district || user?.location || user?.district || 'Farm Location';
            return (
              <Card key={order.orderId} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={[Typography.h4, { color: Colors.textPrimary }]}>
                      ORD-{order.orderId}
                    </Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                      Date: {order.date || 'Today'}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={{ gap: 4 }}>
                    <Text style={[Typography.body2, { color: Colors.textSecondary }]}>
                      Quantity: <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>{order.quantity} kg</Text>
                    </Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                      Product ID: #{order.productId || 101} · Farmer ID: #{order.farmerId || 1}
                    </Text>
                    {order.buyer && (
                      <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                        Buyer: {order.buyer.name || `Buyer #${order.buyer.userId}`}
                      </Text>
                    )}
                    <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                      📍 Pickup: <Text style={{ color: Colors.textSecondary, fontWeight: '600' }}>{pickupLocation}</Text>
                    </Text>
                  </View>

                  <Text style={[Typography.h3, { color: Colors.success, fontWeight: '800' }]}>
                    Rs. {Number(order.price).toLocaleString()}
                  </Text>
                </View>

                {/* Farmer Actions */}
                {order.status === 'PENDING' && (
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: Colors.success + '20' }]}
                      onPress={() => handleUpdateStatus(order, 'CONFIRMED')}
                    >
                      <Text style={[Typography.caption, { color: Colors.success, fontWeight: '800' }]}>
                        ✓ Confirm Order
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {order.status === 'CONFIRMED' && (
                  <View style={styles.statusNoteRow}>
                    <Text style={[Typography.caption, { color: Colors.farmer, fontWeight: '600' }]}>
                      ✓ Order Confirmed · Ready for Transporter Pickup
                    </Text>
                  </View>
                )}

                {order.status === 'SHIPPED' && (
                  <View style={styles.statusNoteRow}>
                    <Text style={[Typography.caption, { color: Colors.buyer, fontWeight: '600' }]}>
                      🚚 Shipped by Transporter
                    </Text>
                  </View>
                )}

                {order.status === 'DELIVERED' && (
                  <View style={styles.statusNoteRow}>
                    <Text style={[Typography.caption, { color: Colors.success, fontWeight: '600' }]}>
                      ✅ Order Delivered to Buyer
                    </Text>
                  </View>
                )}
              </Card>
            );
          })
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
  scrollContent: { padding: Spacing.lg, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.lg },
  statBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: 10,
    alignItems: 'center',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  orderCard: { marginBottom: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statusNoteRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'flex-end',
  },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radii.md },
});

export default FarmerOrdersScreen;

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
import { Card, StatusBadge, Button } from '../../components';
import { OrderService } from '../../api';
import { useAuth } from '../../context/AuthContext';

// Logged-in buyer ID (matches dummy_data.sql user_id = 1 → Nimal Fernando)

const getOrderEmoji = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'confirmed' || s === 'in_progress') return '🚛';
  if (s === 'delivered')                        return '📦';
  return '⏳';
};

const BuyerOrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const BUYER_ID = user?.userId ?? 1;
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await OrderService.getByBuyer(BUYER_ID);
      setOrders(data || []);
    } catch (err) {
      Alert.alert('Error', 'Could not load orders. Is the backend running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) fetchOrders();
    });
    return unsubscribe;
  }, [navigation, fetchOrders, loading]);

  const total     = orders.length;
  const pending   = orders.filter(o => o.status === 'PENDING').length;
  const inProgress = orders.filter(o => o.status === 'IN_PROGRESS' || o.status === 'CONFIRMED').length;
  const delivered = orders.filter(o => o.status === 'DELIVERED').length;

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.buyer} />
        <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 12 }]}>Loading orders…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.buyer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnWhite}>
          <Text style={{ fontSize: 22, color: Colors.white }}>←</Text>
        </TouchableOpacity>
        <Text style={[Typography.h3, { color: Colors.white }]}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsBar}>
        {[
          { label: 'Total',       val: String(total),      color: Colors.textPrimary },
          { label: 'Pending',     val: String(pending),    color: Colors.warning },
          { label: 'In Progress', val: String(inProgress), color: Colors.buyer },
          { label: 'Delivered',   val: String(delivered),  color: Colors.success },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[Typography.h4, { color: s.color, fontWeight: '800' }]}>{s.val}</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchOrders(); }}
            colors={[Colors.buyer]}
          />
        }
      >
        {orders.length === 0 ? (
          <View style={[styles.emptyState, Shadows.sm]}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>📭</Text>
            <Text style={[Typography.body1, { color: Colors.textSecondary }]}>No orders yet</Text>
          </View>
        ) : (
          orders.map((order) => {
            const statusLow = order.status?.toLowerCase().replace('_', '-');
            return (
              <TouchableOpacity
                key={order.orderId}
                style={[styles.orderCard, Shadows.md]}
                onPress={() => navigation.navigate('OrderTracking', { order })}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[Typography.label, { color: Colors.textMuted }]}>ORD-{order.orderId}</Text>
                    <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{order.date}</Text>
                  </View>
                </View>

                {/* Product */}
                <View style={styles.productRow}>
                  <View style={[styles.productEmoji, { backgroundColor: Colors.buyerLight }]}>
                    <Text style={{ fontSize: 36 }}>{getOrderEmoji(order.status)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Order #{order.orderId}</Text>
                    <Text style={[Typography.body2, { color: Colors.textSecondary }]}>
                      Quantity: {order.quantity} kg
                    </Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                      Product ID: #{order.productId || 101} · Farmer ID: #{order.farmerId || 1}
                    </Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                      Placed on {order.date}
                    </Text>
                  </View>
                  <Text style={[Typography.h4, { color: Colors.buyer, fontWeight: '800' }]}>
                    Rs. {Number(order.price).toLocaleString()}
                  </Text>
                </View>

                {/* In-transit progress bar */}
                {(order.status === 'IN_PROGRESS' || order.status === 'CONFIRMED') && (
                  <View style={styles.trackingBar}>
                    <Text style={{ fontSize: 18 }}>🚛</Text>
                    <View style={styles.trackingProgress}>
                      <View style={styles.progressFill} />
                    </View>
                    <Text style={{ fontSize: 18 }}>📦</Text>
                    <Text style={[Typography.caption, { color: Colors.buyer, fontWeight: '700', marginLeft: 8 }]}>
                      On the way!
                    </Text>
                  </View>
                )}

                {/* Actions */}
                {order.status === 'PENDING' && (
                  <View style={styles.cardActions}>
                    <Button
                      title="Cancel Order"
                      variant="secondary"
                      roleColor={Colors.error}
                      size="sm"
                      style={{ flex: 1 }}
                      onPress={() => Alert.alert('Cancel', 'Cancel order feature coming soon.')}
                    />
                  </View>
                )}
              </TouchableOpacity>
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.buyer, paddingHorizontal: Spacing.lg,
    paddingTop: 52, paddingBottom: Spacing.md,
  },
  backBtnWhite: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.white + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  statsBar: {
    flexDirection: 'row', backgroundColor: Colors.white,
    paddingVertical: 14, paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  emptyState: {
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    padding: Spacing.xl, alignItems: 'center', marginTop: Spacing.md,
  },
  orderCard: {
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    padding: Spacing.lg, marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 14,
  },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  productEmoji: {
    width: 64, height: 64, borderRadius: Radii.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  trackingBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.buyerLight, borderRadius: Radii.md,
    padding: 10, marginBottom: 14,
  },
  trackingProgress: {
    flex: 1, height: 6, backgroundColor: Colors.border,
    borderRadius: 3, marginHorizontal: 8,
  },
  progressFill: { width: '60%', height: '100%', backgroundColor: Colors.buyer, borderRadius: 3 },
  cardActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  detailBtn: {
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: Colors.background, borderRadius: Radii.md,
  },
});

export default BuyerOrdersScreen;

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
import { Card, Button, SectionHeader, StatusBadge, Avatar } from '../../components';
import { DeliveryService, TransporterService, OrderService, CropService, FarmerService, BuyerService } from '../../api';
import { useAuth } from '../../context/AuthContext';

// Logged-in transporter ID (matches dummy_data.sql user_id = 1 → Mahinda Bandara)
const TransporterHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const TRANSPORTER_ID = user?.userId ?? 1;
  const [transporter, setTransporter]   = useState(null);
  const [deliveries, setDeliveries]     = useState([]);
  const [orders, setOrders]             = useState([]);
  const [crops, setCrops]               = useState([]);
  const [farmers, setFarmers]           = useState([]);
  const [buyers, setBuyers]             = useState([]);
  const [filter, setFilter]             = useState('all');
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [transporterData, myDeliveries, allDeliveries, ordersData, cropsData, farmersData, buyersData] = await Promise.all([
        TransporterService.getById(TRANSPORTER_ID).catch(() => null),
        DeliveryService.getByTransporter(TRANSPORTER_ID).catch(() => []),
        DeliveryService.getAll().catch(() => []),
        OrderService.getAll().catch(() => []),
        CropService.getAll().catch(() => []),
        FarmerService.getAll().catch(() => []),
        BuyerService.getAll().catch(() => []),
      ]);
      setTransporter(transporterData);
      setOrders(ordersData || []);
      setCrops(cropsData || []);
      setFarmers(farmersData || []);
      setBuyers(buyersData || []);

      const assignedList = myDeliveries || [];
      const allDelList = allDeliveries || [];
      const allOrdList = ordersData || [];

      // Unassigned pending deliveries
      const unassignedDeliveries = allDelList.filter((d) => {
        const s = (d.status || '').toLowerCase();
        const isUnassigned = !d.transporter || String(d.transporter?.userId) !== String(TRANSPORTER_ID);
        return isUnassigned && (s === 'pending' || s === 'unassigned');
      });

      // Existing delivery order IDs
      const existingOrderIds = new Set(
        [...assignedList, ...unassignedDeliveries].map((d) => String(d.order?.orderId || d.orderId))
      );

      // Unassigned pending/confirmed orders without a delivery record yet
      const unassignedOrders = allOrdList.filter((o) => {
        const s = (o.status || '').toLowerCase();
        return (s === 'pending' || s === 'confirmed') && !existingOrderIds.has(String(o.orderId));
      }).map((o) => ({
        deliveryId: `ord-${o.orderId}`,
        orderId: o.orderId,
        isVirtualOrder: true,
        status: 'PENDING',
        pickupLocation: 'Farm Agro Depot',
        deliveryLocation: 'Central Wholesale Market',
        rawOrder: o,
      }));

      const combined = [...assignedList, ...unassignedDeliveries, ...unassignedOrders];
      setDeliveries(combined);
    } catch (err) {
      Alert.alert('Connection Error', 'Could not reach backend microservices.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [TRANSPORTER_ID]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) fetchData();
    });
    return unsubscribe;
  }, [navigation, fetchData, loading]);

  const normalise = (s = '') => {
    const lower = s.toLowerCase().replace('_', '-');
    if (lower === 'in-transit') return 'shipped';
    return lower;
  };

  const getOrderMeta = (delivery) => {
    const orderId = delivery.order?.orderId || delivery.orderId;
    const order = delivery.rawOrder || orders.find((o) => String(o.orderId) === String(orderId));
    const crop = crops.find((c) => String(c.productId) === String(order?.productId));
    const farmer = farmers.find((f) => String(f.userId) === String(order?.farmerId));
    const buyer = order?.buyer || buyers.find((b) => String(b.userId) === String(order?.userId));

    return {
      orderId: orderId || '—',
      productName: crop?.productName || delivery.cropName || 'Fresh Agricultural Produce',
      quantity: order?.quantity ? `${order.quantity} KG` : delivery.quantity || 'Standard Batch',
      price: order?.price ? `Rs. ${Number(order.price).toLocaleString()}` : '',
      farmerName: farmer?.name || delivery.farmerName || 'Farmer / Supplier',
      farmerLocation: farmer?.location || farmer?.district || delivery.pickupLocation || 'Farm Agro Depot',
      buyerName: buyer?.name || delivery.buyerName || 'Buyer / Recipient',
      buyerLocation: buyer?.marketLocation || buyer?.district || delivery.deliveryLocation || 'Market Wholesale Center',
    };
  };

  const filtered = deliveries.filter((d) => {
    const normStatus = normalise(d.status);
    if (filter === 'all') return true;
    return normStatus === filter;
  });

  const activeDelivery = deliveries.find((d) => normalise(d.status) === 'shipped');

  const todayDeliveries = deliveries.filter((d) => normalise(d.status) === 'shipped').length;
  const totalDeliveries = deliveries.length;
  const completedCount  = deliveries.filter((d) => normalise(d.status) === 'delivered').length;

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.transporter} />
        <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 12 }]}>
          Loading deliveries…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.transporter} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.driverName}>{transporter?.name || 'Driver'}</Text>
            <View style={styles.vehicleBadge}>
              <Text style={styles.vehicleText}>🚛 {transporter?.vehiclePlateNo || '—'}</Text>
            </View>
          </View>
          <Avatar name={transporter?.name || 'T'} size={52} color={Colors.white} />
        </View>

        {/* Status toggle */}
        <View style={styles.availabilityRow}>
          <Text style={[Typography.body2, { color: Colors.white }]}>Availability Status</Text>
          <View style={styles.statusToggle}>
            <View style={styles.onlineDot} />
            <Text style={[Typography.body2, { color: Colors.white, fontWeight: '700' }]}>Online</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            colors={[Colors.transporter]}
          />
        }
      >
        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { label: "Active Trips",     val: String(todayDeliveries), icon: '🚗', color: Colors.transporter },
            { label: 'Total Deliveries', val: String(totalDeliveries), icon: '📅', color: Colors.buyer },
            { label: 'Completed',        val: String(completedCount),  icon: '✅', color: Colors.success },
            { label: 'Rating',           val: transporter ? `${transporter.rating}⭐` : '—', icon: '⭐', color: Colors.primary },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, Shadows.sm]}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={[Typography.h4, { color: s.color, fontWeight: '800' }]}>{s.val}</Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: 'center' }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Active delivery banner */}
        {activeDelivery && (
          <TouchableOpacity
            style={styles.activeBanner}
            onPress={() => navigation.navigate('DeliveryDetail', { delivery: activeDelivery, orderId: getOrderMeta(activeDelivery).orderId })}
          >
            <View style={styles.activePulse}>
              <Text style={{ fontSize: 28 }}>🚛</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[Typography.label, { color: Colors.transporter }]}>ACTIVE SHIPMENT</Text>
              <Text style={[Typography.h4, { color: Colors.textPrimary }]}>
                Delivery #{activeDelivery.deliveryId}
              </Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                Status: Shipped
              </Text>
            </View>
            <Text style={{ color: Colors.transporter, fontSize: 22 }}>→</Text>
          </TouchableOpacity>
        )}

        {/* Filter tabs */}
        <SectionHeader title="Delivery Tasks" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
          {[
            { label: 'All',       val: 'all' },
            { label: 'Shipped',   val: 'shipped' },
            { label: 'Pending',   val: 'pending' },
            { label: 'Delivered', val: 'delivered' },
          ].map((f) => (
            <TouchableOpacity
              key={f.val}
              onPress={() => setFilter(f.val)}
              style={[
                styles.filterTab,
                filter === f.val && { backgroundColor: Colors.transporter, borderColor: Colors.transporter },
              ]}
            >
              <Text
                style={[
                  Typography.body2,
                  { fontWeight: '600', color: filter === f.val ? Colors.white : Colors.textSecondary },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Delivery cards */}
        {filtered.length === 0 ? (
          <View style={[styles.emptyState, Shadows.sm]}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>🚛</Text>
            <Text style={[Typography.body1, { color: Colors.textSecondary }]}>No deliveries found</Text>
          </View>
        ) : (
          filtered.map((delivery) => {
            const statusNorm = normalise(delivery.status);
            const meta = getOrderMeta(delivery);
            return (
              <TouchableOpacity
                key={String(delivery.deliveryId)}
                style={[styles.deliveryCard, Shadows.md]}
                onPress={() => navigation.navigate('DeliveryDetail', { delivery, orderId: meta.orderId })}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[Typography.label, { color: Colors.transporter, fontWeight: '700' }]}>
                      ORDER #{meta.orderId} {typeof delivery.deliveryId === 'number' ? `(DEL-${delivery.deliveryId})` : ''}
                    </Text>
                  </View>
                  <StatusBadge status={statusNorm} />
                </View>

                {/* Product & Order Details Box */}
                <View style={styles.orderInfoBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>🌾</Text>
                    <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '700', flex: 1 }]}>
                      {meta.productName} <Text style={{ color: Colors.primary }}>({meta.quantity})</Text>
                    </Text>
                    {meta.price ? (
                      <Text style={[Typography.caption, { color: Colors.success, fontWeight: '800' }]}>
                        {meta.price}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>👨‍🌾</Text>
                    <Text style={[Typography.caption, { color: Colors.textSecondary, flex: 1 }]}>
                      Farmer: <Text style={{ color: Colors.textPrimary, fontWeight: '600' }}>{meta.farmerName}</Text> ({meta.farmerLocation})
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>🛒</Text>
                    <Text style={[Typography.caption, { color: Colors.textSecondary, flex: 1 }]}>
                      Buyer: <Text style={{ color: Colors.textPrimary, fontWeight: '600' }}>{meta.buyerName}</Text> ({meta.buyerLocation})
                    </Text>
                  </View>
                </View>

                {/* Route Visualizer */}
                <View style={styles.routeContainer}>
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[Typography.caption, { color: Colors.textMuted }]}>PICKUP</Text>
                      <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                        {delivery.pickupLocation || meta.farmerLocation}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: Colors.transporter }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[Typography.caption, { color: Colors.textMuted }]}>DESTINATION</Text>
                      <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                        {delivery.deliveryLocation || meta.buyerLocation}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Action buttons */}
                {statusNorm === 'shipped' && (
                  <Button
                    title="Mark as Delivered ✅"
                    onPress={async () => {
                      try {
                        const targetOrderId = delivery.order?.orderId || delivery.orderId || meta.orderId;
                        if (typeof delivery.deliveryId === 'number') {
                          await DeliveryService.update(delivery.deliveryId, {
                            ...delivery,
                            status: 'DELIVERED',
                            transporter: { userId: TRANSPORTER_ID },
                            orderId: targetOrderId,
                          });
                        }
                        if (targetOrderId && targetOrderId !== '—') {
                          await OrderService.update(targetOrderId, {
                            orderId: targetOrderId,
                            status: 'DELIVERED',
                          }).catch(() => null);
                        }
                        fetchData();
                      } catch (err) {
                        Alert.alert('Error', `Could not update status: ${err.message}`);
                      }
                    }}
                    roleColor={Colors.success}
                    size="sm"
                    style={{ marginTop: 12 }}
                  />
                )}
                {statusNorm === 'pending' && (
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                    <Button
                      title="Accept Job ✅"
                      roleColor={Colors.success}
                      size="sm"
                      style={{ flex: 1 }}
                      onPress={async () => {
                        try {
                          const targetOrderId = delivery.order?.orderId || delivery.orderId || meta.orderId;
                          if (delivery.isVirtualOrder) {
                            await DeliveryService.create({
                              orderId: targetOrderId,
                              pickupLocation: meta.farmerLocation,
                              deliveryLocation: meta.buyerLocation,
                              status: 'SHIPPED',
                              transporter: { userId: TRANSPORTER_ID },
                              date: new Date().toISOString().split('T')[0],
                            });
                          } else if (typeof delivery.deliveryId === 'number') {
                            await DeliveryService.update(delivery.deliveryId, {
                              ...delivery,
                              status: 'SHIPPED',
                              transporter: { userId: TRANSPORTER_ID },
                              orderId: targetOrderId,
                            });
                          }
                          if (targetOrderId && targetOrderId !== '—') {
                            await OrderService.update(targetOrderId, {
                              orderId: targetOrderId,
                              status: 'SHIPPED',
                            }).catch(() => null);
                          }
                          fetchData();
                        } catch (err) {
                          Alert.alert('Error', `Could not accept delivery: ${err.message}`);
                        }
                      }}
                    />
                    <Button
                      title="Decline"
                      variant="secondary"
                      roleColor={Colors.error}
                      size="sm"
                      style={{ flex: 1 }}
                      onPress={async () => {
                        try {
                          const targetOrderId = delivery.order?.orderId || delivery.orderId || meta.orderId;
                          if (typeof delivery.deliveryId === 'number') {
                            await DeliveryService.update(delivery.deliveryId, {
                              ...delivery,
                              status: 'CANCELLED',
                              transporter: { userId: TRANSPORTER_ID },
                              orderId: targetOrderId,
                            });
                          }
                          if (targetOrderId && targetOrderId !== '—') {
                            await OrderService.update(targetOrderId, {
                              orderId: targetOrderId,
                              status: 'CANCELLED',
                            }).catch(() => null);
                          }
                          fetchData();
                        } catch (err) {
                          Alert.alert('Error', `Could not decline delivery: ${err.message}`);
                        }
                      }}
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
    backgroundColor: Colors.transporter,
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: Spacing.md,
  },
  greeting: { ...Typography.body2, color: Colors.white + 'CC', marginBottom: 2 },
  driverName: { ...Typography.h2, color: Colors.white, fontWeight: '800', marginBottom: 6 },
  vehicleBadge: {
    backgroundColor: Colors.white + '20',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: Radii.pill, alignSelf: 'flex-start',
  },
  vehicleText: { ...Typography.caption, color: Colors.white },
  availabilityRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white + '15', borderRadius: Radii.lg, padding: Spacing.md,
  },
  statusToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.white + '20', paddingHorizontal: 14,
    paddingVertical: 6, borderRadius: Radii.pill,
  },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: Spacing.lg },
  statCard: {
    flex: 1, minWidth: '44%', backgroundColor: Colors.white,
    borderRadius: Radii.lg, padding: Spacing.md, alignItems: 'center', gap: 6,
  },
  statIcon: { fontSize: 28 },
  activeBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.transporterLight, borderRadius: Radii.xl,
    padding: Spacing.md, marginBottom: Spacing.lg,
    borderWidth: 2, borderColor: Colors.transporter + '50', ...Shadows.sm,
  },
  activePulse: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.transporter + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  emptyState: {
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    padding: Spacing.xl, alignItems: 'center',
  },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: Radii.pill, borderWidth: 1.5,
    borderColor: Colors.border, marginRight: 10, backgroundColor: Colors.white,
  },
  deliveryCard: {
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    padding: Spacing.lg, marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
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
});

export default TransporterHomeScreen;

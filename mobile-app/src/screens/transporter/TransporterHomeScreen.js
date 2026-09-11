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
import { DeliveryService, TransporterService } from '../../api';
import { useAuth } from '../../context/AuthContext';

// Logged-in transporter ID (matches dummy_data.sql user_id = 1 → Mahinda Bandara)
const TransporterHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const TRANSPORTER_ID = user?.userId ?? 1;
  const [transporter, setTransporter]   = useState(null);
  const [deliveries, setDeliveries]     = useState([]);
  const [filter, setFilter]             = useState('all');
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [transporterData, deliveriesData] = await Promise.all([
        TransporterService.getById(TRANSPORTER_ID),
        DeliveryService.getByTransporter(TRANSPORTER_ID),
      ]);
      setTransporter(transporterData);
      setDeliveries(deliveriesData || []);
    } catch (err) {
      Alert.alert('Connection Error', 'Could not reach backend. Is Spring Boot running on port 8085?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) fetchData();
    });
    return unsubscribe;
  }, [navigation, fetchData, loading]);

  const normalise = (s = '') => s.toLowerCase().replace('_', '-');

  const filtered = deliveries.filter((d) =>
    filter === 'all' ? true : normalise(d.status) === filter,
  );

  const activeDelivery = deliveries.find(
    (d) => normalise(d.status) === 'in-transit' || normalise(d.status) === 'in_transit',
  );

  const todayDeliveries  = deliveries.filter(d => normalise(d.status) === 'in-transit').length;
  const totalDeliveries  = deliveries.length;
  const completedCount   = deliveries.filter(d => normalise(d.status) === 'delivered').length;

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
            <Text style={styles.greeting}>Good Morning 🌅</Text>
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
            { label: "Today's Trips",    val: String(todayDeliveries), icon: '🚗', color: Colors.transporter },
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
            onPress={() => navigation.navigate('DeliveryDetail', { delivery: activeDelivery })}
          >
            <View style={styles.activePulse}>
              <Text style={{ fontSize: 28 }}>🚛</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[Typography.label, { color: Colors.transporter }]}>ACTIVE DELIVERY</Text>
              <Text style={[Typography.h4, { color: Colors.textPrimary }]}>
                Delivery #{activeDelivery.deliveryId}
              </Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                Status: {activeDelivery.status}
              </Text>
            </View>
            <Text style={{ color: Colors.transporter, fontSize: 22 }}>→</Text>
          </TouchableOpacity>
        )}

        {/* Filter tabs */}
        <SectionHeader title="Delivery Tasks" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
          {[
            { label: 'All',        val: 'all' },
            { label: 'In Transit', val: 'in-transit' },
            { label: 'Pending',    val: 'pending' },
            { label: 'Delivered',  val: 'delivered' },
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
            const statusLow = normalise(delivery.status);
            return (
              <TouchableOpacity
                key={delivery.deliveryId}
                style={[styles.deliveryCard, Shadows.md]}
                onPress={() => navigation.navigate('DeliveryDetail', { delivery })}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <Text style={[Typography.label, { color: Colors.textMuted }]}>DEL-{delivery.deliveryId}</Text>
                  <StatusBadge status={statusLow} />
                </View>

                {/* Route */}
                <View style={styles.routeContainer}>
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
                    <View>
                      <Text style={[Typography.caption, { color: Colors.textMuted }]}>PICKUP</Text>
                      <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                        Order #{delivery.order?.orderId || '—'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.routeLine} />
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: Colors.transporter }]} />
                    <View>
                      <Text style={[Typography.caption, { color: Colors.textMuted }]}>DELIVERY</Text>
                      <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                        Status: {delivery.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.deliveryDetails}>
                  <View style={styles.detailItem}>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>Delivery ID</Text>
                    <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                      #{delivery.deliveryId}
                    </Text>
                  </View>
                </View>

                {/* Action buttons */}
                {statusLow === 'in-transit' && (
                  <Button
                    title="Mark as Delivered ✅"
                    onPress={async () => {
                      try {
                        await DeliveryService.update(delivery.deliveryId, {
                          ...delivery,
                          status: 'DELIVERED',
                          transporter: { userId: TRANSPORTER_ID },
                          order: { orderId: delivery.order?.orderId },
                        });
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
                {statusLow === 'pending' && (
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                    <Button title="Accept" roleColor={Colors.success} size="sm" style={{ flex: 1 }}
                      onPress={async () => {
                        try {
                          await DeliveryService.update(delivery.deliveryId, {
                            ...delivery,
                            status: 'IN_TRANSIT',
                            transporter: { userId: TRANSPORTER_ID },
                            order: { orderId: delivery.order?.orderId },
                          });
                          fetchData();
                        } catch (err) {
                          Alert.alert('Error', `Could not accept delivery: ${err.message}`);
                        }
                      }} />
                    <Button title="Decline" variant="secondary" roleColor={Colors.error} size="sm" style={{ flex: 1 }}
                      onPress={async () => {
                        try {
                          await DeliveryService.update(delivery.deliveryId, {
                            ...delivery,
                            status: 'CANCELLED',
                            transporter: { userId: TRANSPORTER_ID },
                            order: { orderId: delivery.order?.orderId },
                          });
                          fetchData();
                        } catch (err) {
                          Alert.alert('Error', `Could not decline delivery: ${err.message}`);
                        }
                      }} />
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
    alignItems: 'center', marginBottom: 14,
  },
  routeContainer: { marginBottom: 14 },
  routePoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 4 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4, flexShrink: 0 },
  routeLine: { width: 2, height: 24, backgroundColor: Colors.border, marginLeft: 5, marginVertical: 2 },
  deliveryDetails: {
    flexDirection: 'row', gap: Spacing.xl,
    backgroundColor: Colors.background, borderRadius: Radii.lg, padding: Spacing.md,
  },
  detailItem: { gap: 4 },
});

export default TransporterHomeScreen;

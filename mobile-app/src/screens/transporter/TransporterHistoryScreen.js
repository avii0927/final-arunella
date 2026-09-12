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
import { Card, SectionHeader, StatusBadge, EmptyState } from '../../components';
import { DeliveryService, TransporterService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const TransporterHistoryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const TRANSPORTER_ID = user?.userId ?? 1;

  const [historyList, setHistoryList] = useState([]);
  const [transporter, setTransporter] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const [transporterData, deliveriesData] = await Promise.all([
        TransporterService.getById(TRANSPORTER_ID),
        DeliveryService.getByTransporter(TRANSPORTER_ID),
      ]);

      setTransporter(transporterData);

      const allDeliveries = deliveriesData || [];
      // History includes delivered and cancelled shipments
      const historyItems = allDeliveries.filter((d) => {
        const s = (d.status || '').toLowerCase();
        return s.includes('deliver') || s.includes('cancel');
      });

      setHistoryList(historyItems);
    } catch (err) {
      Alert.alert('Error', 'Could not load delivery history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) fetchHistory();
    });
    return unsubscribe;
  }, [navigation, fetchHistory, loading]);

  const normalise = (s = '') => s.toLowerCase().replace('_', '-');

  const filteredHistory = historyList.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'delivered') return normalise(d.status).includes('deliver');
    if (filter === 'cancelled') return normalise(d.status).includes('cancel');
    return true;
  });

  const completedCount = historyList.filter((d) => normalise(d.status).includes('deliver')).length;
  const cancelledCount = historyList.filter((d) => normalise(d.status).includes('cancel')).length;

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.transporter} />
        <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 12 }]}>
          Loading delivery history…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.transporter} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip History 📜</Text>
        <Text style={styles.headerSub}>Complete record of completed and cancelled deliveries.</Text>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{cancelledCount}</Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{transporter?.rating ? `${transporter.rating}⭐` : '5.0⭐'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchHistory();
            }}
            colors={[Colors.transporter]}
          />
        }
      >
        <SectionHeader title="Past Trips" />

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {[
            { label: 'All History', val: 'all' },
            { label: 'Delivered', val: 'delivered' },
            { label: 'Cancelled', val: 'cancelled' },
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
        </View>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <EmptyState
            icon="📜"
            title="No History Records"
            subtitle="You don't have any past completed or cancelled trips matching this filter."
          />
        ) : (
          filteredHistory.map((item) => {
            const isDelivered = normalise(item.status).includes('deliver');
            return (
              <TouchableOpacity
                key={item.deliveryId}
                style={[styles.historyCard, Shadows.md]}
                onPress={() => navigation.navigate('DeliveryDetail', { delivery: item })}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[Typography.h4, { color: Colors.textPrimary }]}>
                      Delivery #{item.deliveryId}
                    </Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                      Order #{item.order?.orderId || item.orderId || '—'}
                    </Text>
                  </View>
                  <StatusBadge status={isDelivered ? 'delivered' : 'cancelled'} />
                </View>

                {/* Route */}
                <View style={styles.routeContainer}>
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[Typography.caption, { color: Colors.textMuted }]}>PICKUP</Text>
                      <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                        {item.pickupLocation || 'Origin Agro Center'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.routeLine} />

                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, { backgroundColor: isDelivered ? Colors.success : Colors.error }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[Typography.caption, { color: Colors.textMuted }]}>DESTINATION</Text>
                      <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                        {item.deliveryLocation || 'Destination Hub'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Footer Date & Confirmation */}
                <View style={styles.cardFooter}>
                  <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                    📅 Date: {item.date || 'Recently Completed'}
                  </Text>
                </View>
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
  headerTitle: { ...Typography.h2, color: Colors.white, fontWeight: '800', marginBottom: 4 },
  headerSub: { ...Typography.body2, color: Colors.white + 'CC', marginBottom: Spacing.md },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white + '18',
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: { alignItems: 'center' },
  statNum: { ...Typography.h3, color: Colors.white, fontWeight: '800' },
  statLabel: { ...Typography.caption, color: Colors.white + 'CC' },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.white + '30' },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  filterRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  historyCard: {
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
  routeContainer: { marginBottom: 12 },
  routePoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 4 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4, flexShrink: 0 },
  routeLine: { width: 2, height: 20, backgroundColor: Colors.border, marginLeft: 5, marginVertical: 2 },
  cardFooter: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border + '60',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TransporterHistoryScreen;

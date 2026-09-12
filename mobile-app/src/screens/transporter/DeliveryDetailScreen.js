import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Card, Button, StatusBadge, SectionHeader } from '../../components';
import { DeliveryService, OrderService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const DeliveryDetailScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const TRANSPORTER_ID = user?.userId ?? 1;

  const passedDelivery = route.params?.delivery;
  const deliveryIdParam = route.params?.deliveryId || passedDelivery?.deliveryId;

  const [delivery, setDelivery] = useState(passedDelivery || null);
  const [orderDetails, setOrderDetails] = useState(passedDelivery?.order || null);
  const [loading, setLoading] = useState(!passedDelivery);
  const [updating, setUpdating] = useState(false);

  const fetchDeliveryDetails = async () => {
    try {
      if (!passedDelivery) setLoading(true);
      if (deliveryIdParam) {
        const deliveryData = await DeliveryService.getById(deliveryIdParam);
        if (deliveryData) {
          setDelivery(deliveryData);
          const activeOrderId = deliveryData.orderId || deliveryData.order?.orderId;
          if (activeOrderId) {
            try {
              const orderData = await OrderService.getById(activeOrderId);
              if (orderData) setOrderDetails(orderData);
            } catch (e) {
              console.log('Order fetch notice:', e.message);
            }
          }
        }
      }
    } catch (err) {
      console.log('Delivery fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryDetails();
  }, [deliveryIdParam]);

  const normaliseStatus = (s = '') => s.toLowerCase().replace('_', '-');

  const handleUpdateStatus = async (newStatus, successMsg) => {
    if (!delivery?.deliveryId) return;
    setUpdating(true);
    const orderIdVal = delivery?.orderId || delivery?.order?.orderId || orderDetails?.orderId;
    try {
      const updatedPayload = {
        ...delivery,
        deliveryId: delivery.deliveryId,
        orderId: orderIdVal,
        status: newStatus,
        transporter: { userId: TRANSPORTER_ID },
        date: delivery?.date || new Date().toISOString().split('T')[0],
      };
      await DeliveryService.update(delivery.deliveryId, updatedPayload);
      setDelivery((prev) => ({ ...prev, status: newStatus }));
      Alert.alert('Status Updated 🎉', successMsg, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', `Failed to update delivery status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleCall = (phone) => {
    if (!phone) {
      Alert.alert('No Contact Number', 'Contact phone number is not available for this entry.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Phone Call', `Dialing ${phone}...`);
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.transporter} />
        <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 12 }]}>
          Loading delivery details...
        </Text>
      </View>
    );
  }

  const statusNorm = normaliseStatus(delivery?.status || 'pending');

  // Timeline steps computation
  const isPending = statusNorm === 'pending';
  const isInTransit = statusNorm === 'in-transit' || statusNorm === 'in_transit';
  const isDelivered = statusNorm === 'delivered';
  const isCancelled = statusNorm === 'cancelled';

  // Derived real data
  const activeOrderId = delivery?.orderId || delivery?.order?.orderId || orderDetails?.orderId;
  const pickupAddr = delivery?.pickupLocation || orderDetails?.pickupLocation || orderDetails?.crop?.location || 'Address Pending';
  const dropoffAddr = delivery?.deliveryLocation || orderDetails?.deliveryAddress || 'Address Pending';
  
  const farmerContactName = orderDetails?.crop?.farmer?.name || delivery?.farmerName || 'Farmer / Supplier';
  const farmerContactPhone = orderDetails?.crop?.farmer?.phone || delivery?.farmerPhone;

  const buyerContactName = orderDetails?.buyer?.name || delivery?.buyerName || 'Buyer / Recipient';
  const buyerContactPhone = orderDetails?.buyer?.phone || delivery?.buyerPhone;

  const cropName = orderDetails?.crop?.name || delivery?.cropName || 'Agricultural Cargo';
  const cropQuantity = orderDetails?.quantity ? `${orderDetails.quantity} KG` : delivery?.quantity ? `${delivery.quantity}` : 'Standard Batch';
  const cargoCategory = orderDetails?.crop?.category || delivery?.cargoType || 'Perishable Produce';

  const numericPayout = Number(delivery?.totalPayout || orderDetails?.price || orderDetails?.totalPrice || 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.transporter} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerSubtitle}>DELIVERY SPECIFICATION</Text>
          <Text style={styles.headerTitle}>Delivery #{delivery?.deliveryId || deliveryIdParam || '—'}</Text>
        </View>

        <StatusBadge status={statusNorm} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Status Stepper / Progress Timeline */}
        <Card style={styles.timelineCard}>
          <Text style={[Typography.label, { color: Colors.textMuted, marginBottom: 12 }]}>
            SHIPMENT PROGRESS
          </Text>

          {isCancelled ? (
            <View style={styles.cancelledBanner}>
              <Text style={{ fontSize: 24 }}>🚫</Text>
              <View style={{ marginLeft: 12 }}>
                <Text style={[Typography.h4, { color: Colors.error }]}>Delivery Cancelled</Text>
                <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                  This trip request was rejected or cancelled.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.stepperContainer}>
              {/* Step 1 */}
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, styles.stepActive]}>
                  <Text style={styles.stepDotText}>✓</Text>
                </View>
                <Text style={styles.stepLabelActive}>Requested</Text>
              </View>

              <View style={[styles.stepLine, (isInTransit || isDelivered) && styles.lineActive]} />

              {/* Step 2 */}
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    (isInTransit || isDelivered) ? styles.stepActive : styles.stepInactive,
                  ]}
                >
                  <Text style={styles.stepDotText}>
                    {isDelivered ? '✓' : isInTransit ? '🚛' : '2'}
                  </Text>
                </View>
                <Text style={isInTransit || isDelivered ? styles.stepLabelActive : styles.stepLabelInactive}>
                  In Transit
                </Text>
              </View>

              <View style={[styles.stepLine, isDelivered && styles.lineActive]} />

              {/* Step 3 */}
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, isDelivered ? styles.stepActive : styles.stepInactive]}>
                  <Text style={styles.stepDotText}>{isDelivered ? '✓' : '3'}</Text>
                </View>
                <Text style={isDelivered ? styles.stepLabelActive : styles.stepLabelInactive}>
                  Delivered
                </Text>
              </View>
            </View>
          )}
        </Card>

        {/* Route Details Card */}
        <Card style={styles.sectionCard}>
          <SectionHeader title="Route & Navigation" />

          <View style={styles.routeBox}>
            {/* Pickup */}
            <View style={styles.routeRow}>
              <View style={[styles.routeIconBg, { backgroundColor: Colors.success + '20' }]}>
                <Text style={{ fontSize: 20 }}>🌾</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.caption, { color: Colors.textMuted }]}>PICKUP LOCATION</Text>
                <Text style={[Typography.body1, { color: Colors.textPrimary, fontWeight: '700' }]}>
                  {pickupAddr}
                </Text>
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 2 }]}>
                  Contact: {farmerContactName}
                </Text>
              </View>
              {farmerContactPhone ? (
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => handleCall(farmerContactPhone)}
                >
                  <Text style={{ fontSize: 16 }}>📞</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.verticalDivider} />

            {/* Dropoff */}
            <View style={styles.routeRow}>
              <View style={[styles.routeIconBg, { backgroundColor: Colors.transporter + '20' }]}>
                <Text style={{ fontSize: 20 }}>🏢</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.caption, { color: Colors.textMuted }]}>DELIVERY DESTINATION</Text>
                <Text style={[Typography.body1, { color: Colors.textPrimary, fontWeight: '700' }]}>
                  {dropoffAddr}
                </Text>
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 2 }]}>
                  Receiver: {buyerContactName}
                </Text>
              </View>
              {buyerContactPhone ? (
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => handleCall(buyerContactPhone)}
                >
                  <Text style={{ fontSize: 16 }}>📞</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </Card>

        {/* Cargo Specification Card */}
        <Card style={styles.sectionCard}>
          <SectionHeader title="Cargo & Package Info" />

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Reference:</Text>
              <Text style={styles.infoValue}>#{activeOrderId || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Crop / Product:</Text>
              <Text style={styles.infoValue}>{cropName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Weight/Qty:</Text>
              <Text style={styles.infoValue}>{cropQuantity}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cargo Handling:</Text>
              <Text style={[styles.infoValue, { color: Colors.warning, fontWeight: '700' }]}>
                {cargoCategory}
              </Text>
            </View>
          </View>
        </Card>

        {/* Financial & Compensation Card */}
        {numericPayout > 0 ? (
          <Card style={styles.sectionCard}>
            <SectionHeader title="Payment & Payout" />

            <View style={styles.payoutBox}>
              <View style={styles.payoutRow}>
                <Text style={[Typography.body2, { color: Colors.textSecondary }]}>Base Freight Amount</Text>
                <Text style={[Typography.body2, { color: Colors.textPrimary, fontWeight: '600' }]}>
                  LKR {numericPayout.toLocaleString()}
                </Text>
              </View>
              <View style={styles.payoutDivider} />
              <View style={styles.payoutRow}>
                <Text style={[Typography.h4, { color: Colors.textPrimary, fontWeight: '800' }]}>Total Driver Earnings</Text>
                <Text style={[Typography.h3, { color: Colors.success, fontWeight: '900' }]}>
                  LKR {numericPayout.toLocaleString()}
                </Text>
              </View>
            </View>
          </Card>
        ) : null}

        {/* Action Controls */}
        <View style={styles.actionsContainer}>
          {isPending && (
            <View style={{ gap: 12 }}>
              <Button
                title="Accept Delivery Request 🚛"
                roleColor={Colors.success}
                size="lg"
                loading={updating}
                onPress={() => handleUpdateStatus('IN_TRANSIT', 'You have accepted this delivery! Drive safely.')}
              />
              <Button
                title="Decline Delivery"
                variant="secondary"
                roleColor={Colors.error}
                size="md"
                disabled={updating}
                onPress={() => handleUpdateStatus('CANCELLED', 'Delivery request has been declined.')}
              />
            </View>
          )}

          {isInTransit && (
            <View style={{ gap: 12 }}>
              <Button
                title="Mark as Delivered ✅"
                roleColor={Colors.success}
                size="lg"
                loading={updating}
                onPress={() =>
                  Alert.alert(
                    'Confirm Delivery',
                    'Are you sure you have arrived at the drop-off location and completed the delivery?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Yes, Delivered!',
                        onPress: () =>
                          handleUpdateStatus('DELIVERED', 'Congratulations! Trip completed successfully.'),
                      },
                    ]
                  )
                }
              />
              <Button
                title="Navigate / Open Maps 🗺️"
                variant="secondary"
                roleColor={Colors.transporter}
                size="md"
                onPress={() =>
                  Alert.alert(
                    'GPS Navigation',
                    `Opening directions to ${dropoffAddr}...`
                  )
                }
              />
            </View>
          )}

          {isDelivered && (
            <View style={styles.completedNotice}>
              <Text style={{ fontSize: 32, marginBottom: 4 }}>🎉</Text>
              <Text style={[Typography.h4, { color: Colors.success, fontWeight: '800' }]}>
                Delivery Completed & Verified
              </Text>
              {numericPayout > 0 && (
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 4 }]}>
                  Payout of LKR {numericPayout.toLocaleString()} credited to your wallet balance.
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: Colors.transporter,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  backIcon: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.white,
    fontWeight: '800',
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.white + 'B3',
    letterSpacing: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  timelineCard: {
    marginBottom: Spacing.lg,
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '10',
    padding: Spacing.md,
    borderRadius: Radii.md,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepActive: {
    backgroundColor: Colors.transporter,
  },
  stepInactive: {
    backgroundColor: Colors.border,
  },
  stepDotText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  stepLabelActive: {
    ...Typography.caption,
    color: Colors.transporter,
    fontWeight: '700',
  },
  stepLabelInactive: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: Colors.border,
    marginBottom: 18,
    marginHorizontal: 4,
  },
  lineActive: {
    backgroundColor: Colors.transporter,
  },
  sectionCard: {
    marginBottom: Spacing.lg,
  },
  routeBox: {
    backgroundColor: Colors.background,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 2,
    height: 24,
    backgroundColor: Colors.border,
    marginLeft: 19,
    marginVertical: 4,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '60',
  },
  infoLabel: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  infoValue: {
    ...Typography.body2,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  payoutBox: {
    backgroundColor: Colors.background,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: 8,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  actionsContainer: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  completedNotice: {
    backgroundColor: Colors.success + '15',
    borderWidth: 1.5,
    borderColor: Colors.success + '40',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
});

export default DeliveryDetailScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button, Input, Card } from '../../components';
import { OrderService } from '../../api';
import { useAuth } from '../../context/AuthContext';

// Logged-in buyer ID (matches dummy_data.sql user_id = 1 → Nimal Fernando)
const PlaceOrderScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const BUYER_ID = user?.userId ?? 1;
  const item = route?.params?.item || {
    productName: 'Red Onion', pricePerKg: 280, stock: 450,
    productId: 101, farmerId: 1,
  };

  const marketLocation = user?.market_location || user?.marketLocation || user?.district || 'Buyer Market Location';
  const [qty, setQty]               = useState('50');
  const [submitting, setSubmitting] = useState(false);

  const totalKg  = parseInt(qty, 10) || 0;
  const subtotal = totalKg * (item.pricePerKg || 0);
  const delivery = 1500;
  const total    = subtotal + delivery;

  const handleConfirmOrder = async () => {
    if (!qty || parseInt(qty, 10) <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const farmerId = item.farmer?.userId || item.farmerId || (typeof item.farmer === 'number' ? item.farmer : (item.userId || 1));
    const productId = item.productId || item.id || 101;

    const orderPayload = {
      buyer:     { userId: BUYER_ID },
      farmerId:  farmerId,
      productId: productId,
      price:     subtotal,
      quantity:  parseInt(qty, 10),
      date:      today,
      status:    'PENDING',
    };

    try {
      setSubmitting(true);
      await OrderService.create(orderPayload);
      Alert.alert(
        'Order Placed! 🎉',
        `Your order for ${qty} kg of ${item.productName} has been placed successfully.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert('Order Failed', `Could not place order: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (navigation?.canGoBack && navigation.canGoBack() ? navigation.goBack() : navigation.navigate('BuyerApp'))}
          style={styles.backBtn}
        >
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={[Typography.h3, { color: Colors.textPrimary }]}>Place Order</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Product summary */}
        <Card style={styles.productCard}>
          <View style={styles.productRow}>
            <View style={[styles.productEmoji, { backgroundColor: Colors.buyerLight }]}>
              <Text style={{ fontSize: 36 }}>🌾</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.h4, { color: Colors.textPrimary }]}>{item.productName}</Text>
              <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                Stock: {item.stock} kg available
              </Text>
            </View>
            <View>
              <Text style={[Typography.h4, { color: Colors.buyer, fontWeight: '800' }]}>
                Rs. {item.pricePerKg}
              </Text>
              <Text style={[Typography.caption, { color: Colors.textMuted }]}>per kg</Text>
            </View>
          </View>
        </Card>

        {/* Quantity & auto delivery location */}
        <Text style={[Typography.label, { color: Colors.textSecondary, marginBottom: 10 }]}>ORDER DETAILS</Text>
        <Input
          label="Quantity (kg) *"
          value={qty}
          onChangeText={setQty}
          placeholder="Enter quantity in kg"
          icon="⚖️"
          keyboardType="numeric"
        />

        {/* Auto Buyer Market Location */}
        <View style={styles.marketBox}>
          <Text style={{ fontSize: 22, marginRight: 10 }}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={[Typography.caption, { color: Colors.textMuted, fontWeight: '700' }]}>
              DELIVERY LOCATION (BUYER MARKET)
            </Text>
            <Text style={[Typography.body1, { color: Colors.textPrimary, fontWeight: '600', marginTop: 2 }]}>
              {marketLocation}
            </Text>
          </View>
        </View>

        {/* Payment method */}
        <Text style={[Typography.label, { color: Colors.textSecondary, marginBottom: 12 }]}>
          PAYMENT METHOD
        </Text>
        <View style={[styles.paymentOption, { borderColor: Colors.buyer, backgroundColor: Colors.buyerLight }]}>
          <View style={[styles.paymentEmoji, { backgroundColor: Colors.buyer + '20' }]}>
            <Text style={{ fontSize: 24 }}>💵</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[Typography.body1, { color: Colors.textPrimary, fontWeight: '600' }]}>Cash on Delivery</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Pay when crops are delivered to your location</Text>
          </View>
          <View style={[styles.checkBadge, { backgroundColor: Colors.buyer }]}>
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '800' }}>✓</Text>
          </View>
        </View>

        {/* Order summary */}
        <Card style={{ marginTop: Spacing.md }}>
          <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: 14 }]}>Order Summary</Text>
          {[
            { label: `${item.productName} × ${qty} kg`, val: `Rs. ${subtotal.toLocaleString()}` },
            { label: 'Delivery Fee',                     val: `Rs. ${delivery.toLocaleString()}` },
          ].map((row) => (
            <View key={row.label} style={styles.summaryRow}>
              <Text style={[Typography.body2, { color: Colors.textSecondary }]}>{row.label}</Text>
              <Text style={[Typography.body2, { color: Colors.textPrimary }]}>{row.val}</Text>
            </View>
          ))}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Total</Text>
            <Text style={[Typography.h3, { color: Colors.buyer, fontWeight: '800' }]}>
              Rs. {total.toLocaleString()}
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={[Typography.body2, { color: Colors.textSecondary }]}>Total Amount</Text>
          <Text style={[Typography.h3, { color: Colors.buyer, fontWeight: '800' }]}>
            Rs. {total.toLocaleString()}
          </Text>
        </View>
        <Button
          title={submitting ? 'Placing Order…' : 'Confirm Order 🛒'}
          onPress={handleConfirmOrder}
          roleColor={Colors.buyer}
          size="md"
          style={{ flex: 1 }}
          disabled={submitting}
        />
        {submitting && <ActivityIndicator color={Colors.buyer} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  productCard: { marginBottom: Spacing.lg },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  productEmoji: { width: 64, height: 64, borderRadius: Radii.lg, alignItems: 'center', justifyContent: 'center' },
  marketBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
  },
  paymentOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    padding: Spacing.md, marginBottom: 10,
    borderWidth: 1.5, borderColor: Colors.border, ...Shadows.sm,
  },
  paymentEmoji: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  checkBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 12, marginTop: 4 },
  footer: {
    flexDirection: 'row', gap: 14, alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingBottom: 34, paddingTop: Spacing.md,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  footerTotal: { flex: 0 },
});

export default PlaceOrderScreen;

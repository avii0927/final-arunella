import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button, Card, Avatar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { CropService, OrderService, DeliveryService } from '../../api';

const roleColors = { farmer: Colors.farmer, buyer: Colors.buyer, transporter: Colors.transporter };
const roleLabels = { farmer: '👨‍🌾 Farmer', buyer: '🛒 Buyer', transporter: '🚛 Transporter' };
const roleEmojis = { farmer: '👨‍🌾', buyer: '🛒', transporter: '🚛' };

// ── Menu item extracted so onPress is stable (no inline arrow per item) ──
const MenuItem = ({ item, isLast, color, navigation }) => {
  const handlePress = useCallback(() => {
    if (item.route && navigation) navigation.navigate(item.route);
  }, [item.route, navigation]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.menuItem, !isLast && styles.menuItemBorder]}
    >
      <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
        <Text style={{ fontSize: 20 }}>{item.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[Typography.body1, { color: Colors.textPrimary, fontWeight: '600' }]}>{item.label}</Text>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{item.sub}</Text>
      </View>
      <Text style={{ color: Colors.textMuted, fontSize: 18 }}>›</Text>
    </TouchableOpacity>
  );
};

const ProfileScreen = ({ navigation: navProp, role: roleProp = 'farmer' }) => {
  const navHook = useNavigation();
  const navigation = navProp || navHook;
  const { user, role: authRole, logout } = useAuth();
  const role = authRole || roleProp;
  const color = roleColors[role];

  // Dynamic stats state
  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStatsLoading(false);
      return;
    }
    const userId = user.userId;

    const loadStats = async () => {
      try {
        if (role === 'farmer') {
          const [crops, orders] = await Promise.all([
            CropService.getByFarmer(userId),
            OrderService.getAll(),
          ]);
          setStats([
            { label: 'Listings', val: String(crops?.length ?? 0) },
            { label: 'Orders',   val: String(orders?.length ?? 0) },
            { label: 'Rating',   val: user.rating ? `${user.rating}⭐` : '—' },
          ]);
        } else if (role === 'buyer') {
          const orders = await OrderService.getByBuyer(userId);
          setStats([
            { label: 'Orders',  val: String(orders?.length ?? 0) },
            { label: 'Reviews', val: '—' },
            { label: 'Rating',  val: user.rating ? `${user.rating}⭐` : '—' },
          ]);
        } else if (role === 'transporter') {
          const deliveries = await DeliveryService.getByTransporter(userId);
          const completed = deliveries?.filter(d => d.status === 'DELIVERED').length ?? 0;
          setStats([
            { label: 'Deliveries',  val: String(deliveries?.length ?? 0) },
            { label: 'Completed',   val: String(completed) },
            { label: 'Rating',      val: user.rating ? `${user.rating}⭐` : '—' },
          ]);
        }
      } catch {
        // silently fall back to dash values
        setStats([{ label: '—', val: '—' }, { label: '—', val: '—' }, { label: 'Rating', val: '—' }]);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [user, role]);

  const menuSections = [
    {
      section: 'Account',
      items: [
        { icon: '👤', label: 'Personal Information', sub: 'Name, email, NIC, location & bank details', route: 'EditProfile' },
      ],
    },
    {
      section: 'Community & Legal',
      items: [
        ...(role === 'buyer' ? [{ icon: '⭐', label: 'Rate Farmer & Transporter', sub: 'Rate service & calculate average scores', route: 'Rating' }] : []),
        { icon: '📄', label: 'Terms & Privacy', sub: 'Legal documents', route: 'Terms' },
      ],
    },
  ].filter((s) => s.items.length > 0);

  // ── Stable handlers ─────────────────────────────────────────────────
  const handleGoBack = useCallback(() => {
    const homeTab = role === 'farmer' ? 'FarmerHome' : role === 'buyer' ? 'Marketplace' : 'TransporterHome';
    try {
      if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
        navigation.goBack();
      } else if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate(homeTab);
      }
    } catch {
      if (navigation && typeof navigation.navigate === 'function') navigation.navigate(homeTab);
    }
  }, [navigation, role]);

  const handleSignOut = useCallback(() => {
    logout();
    if (navigation && typeof navigation.reset === 'function') {
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    } else if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('Splash');
    }
  }, [navigation, logout]);

  const displayName = user?.name || 'User';
  const memberSince = user?.userId ? '2024' : '—';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={color} />

      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: color }]}>
        <View style={styles.profileTop}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backBtnWhite}>
            <Text style={{ fontSize: 20, color: Colors.white }}>←</Text>
          </TouchableOpacity>
          <Text style={[Typography.h4, { color: Colors.white }]}>My Profile</Text>
          <View style={styles.editBtn} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarBig, { backgroundColor: Colors.white + '20' }]}>
              <Text style={{ fontSize: 52 }}>{roleEmojis[role]}</Text>
            </View>
            <View style={[styles.verifiedBadge, { backgroundColor: Colors.success }]}>
              <Text style={{ color: Colors.white, fontSize: 10, fontWeight: '800' }}>✓</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <View style={[styles.rolePill, { backgroundColor: Colors.white + '25' }]}>
            <Text style={[Typography.body2, { color: Colors.white, fontWeight: '700' }]}>
              {roleLabels[role]}
            </Text>
          </View>
          <Text style={[Typography.caption, { color: Colors.white + 'CC', marginTop: 4 }]}>
            📍 {user?.district || '—'} · Member since {memberSince}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {statsLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            stats.map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={styles.statItem}>
                  <Text style={[Typography.h3, { color: Colors.white, fontWeight: '800' }]}>{s.val}</Text>
                  <Text style={[Typography.caption, { color: Colors.white + 'CC' }]}>{s.label}</Text>
                </View>
                {i < stats.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
            ))
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Verification status */}
        <View style={[styles.verifyCard, { borderColor: Colors.success + '40', backgroundColor: Colors.farmerLight }]}>
          <Text style={{ fontSize: 24 }}>✅</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[Typography.body1, { color: Colors.success, fontWeight: '700' }]}>Account Verified</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
              NIC and contact verified · Admin approved
            </Text>
          </View>
        </View>

        {/* Menu sections */}
        {menuSections.map((section) => (
          <View key={section.section} style={styles.menuSection}>
            <Text style={[Typography.label, { color: Colors.textMuted, marginBottom: 10 }]}>
              {section.section.toUpperCase()}
            </Text>
            <View style={[styles.menuCard, Shadows.sm]}>
              {section.items.map((item, index) => (
                <MenuItem
                  key={item.label}
                  item={item}
                  isLast={index === section.items.length - 1}
                  color={color}
                  navigation={navigation}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Sign out */}
        <Button
          title="Sign Out"
          variant="secondary"
          roleColor={Colors.error}
          size="lg"
          icon="🚪"
          onPress={handleSignOut}
          style={{ marginTop: 8 }}
        />
        <Text style={[Typography.caption, { color: Colors.textMuted, textAlign: 'center', marginTop: 12 }]}>
          Arunella v1.0.0 · Made for Sri Lankan Agriculture 🌿
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 52, paddingBottom: 28, paddingHorizontal: Spacing.lg, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  profileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  backBtnWhite: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.white + '20', alignItems: 'center', justifyContent: 'center' },
  editBtn: { width: 36, height: 36 },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.lg },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatarBig: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.white + '50' },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white },
  profileName: { ...Typography.h2, color: Colors.white, fontWeight: '800', marginBottom: 8 },
  rolePill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radii.pill },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white + '15', borderRadius: Radii.lg, padding: Spacing.md, minHeight: 56, justifyContent: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.white + '30' },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  verifyCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: Radii.lg, padding: Spacing.md, marginBottom: Spacing.lg },
  menuSection: { marginBottom: Spacing.lg },
  menuCard: { backgroundColor: Colors.white, borderRadius: Radii.lg, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

export default ProfileScreen;

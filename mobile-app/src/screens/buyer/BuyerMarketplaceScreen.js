import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Card, StatusBadge, SectionHeader, Avatar } from '../../components';
import { CropService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const categories = [
  { label: 'All',        emoji: '🌿' },
  { label: 'Vegetables', emoji: '🥦' },
  { label: 'Fruits',     emoji: '🍎' },
  { label: 'Grains',     emoji: '🌾' },
  { label: 'Spices',     emoji: '🌶️' },
];

const getCropEmoji = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('onion'))                    return '🧅';
  if (n.includes('cabbage'))                  return '🥬';
  if (n.includes('tomato'))                   return '🍅';
  if (n.includes('carrot'))                   return '🥕';
  if (n.includes('potato'))                   return '🥔';
  if (n.includes('chilli') || n.includes('pepper')) return '🌶️';
  if (n.includes('rice'))                     return '🍚';
  if (n.includes('banana'))                   return '🍌';
  return '🌾';
};

const matchesCategory = (crop, cat) => {
  if (!cat || cat === 'All') return true;
  if (crop.category && crop.category.toLowerCase() === cat.toLowerCase()) return true;

  const name = (crop.productName || '').toLowerCase();
  const desc = (crop.description || '').toLowerCase();
  const text = `${name} ${desc}`;

  if (cat === 'Vegetables') {
    return /onion|cabbage|tomato|carrot|potato|leek|brinjal|eggplant|pumpkin|cucumber|chilli|chili|pepper|beet|garlic|ginger|spinach|bean|cassava|manioc|gourd|gotukola|luffa|radish|koha|vegetable/.test(text);
  }
  if (cat === 'Fruits') {
    return /banana|apple|mango|papaya|pineapple|orange|lime|lemon|watermelon|avocado|passion|guava|rambutan|durian|fruit/.test(text);
  }
  if (cat === 'Grains') {
    return /rice|paddy|maize|corn|wheat|millet|kurakkan|barley|grain|dal|dhal|pulse|gram/.test(text);
  }
  if (cat === 'Spices') {
    return /chilli|chili|pepper|cardamom|cinnamon|clove|nutmeg|turmeric|mustard|curry|ginger|vanilla|spice/.test(text);
  }
  return true;
};

const BuyerMarketplaceScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [search, setSearch]         = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [listings, setListings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCrops = useCallback(async () => {
    try {
      const data = await CropService.getByStatus('AVAILABLE');
      setListings(data || []);
    } catch (err) {
      Alert.alert('Error', 'Could not load marketplace. Is the backend running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchCrops(); }, [fetchCrops]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) fetchCrops();
    });
    return unsubscribe;
  }, [navigation, fetchCrops, loading]);

  const filtered = listings.filter((l) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [
      l.productName,
      l.description,
      l.category,
      l.farmer?.name,
      l.farmer?.district,
      l.farmer?.location,
    ].some((field) => field && String(field).toLowerCase().includes(q));

    const matchesCat = matchesCategory(l, selectedCat);
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.buyer} />
        <Text style={[Typography.body2, { color: Colors.textSecondary, marginTop: 12 }]}>
          Loading marketplace…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.buyer} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.name}>{user?.name ? `Hi, ${user.name.split(' ')[0]}!` : 'Fresh Marketplace'}</Text>
          </View>
          <View style={styles.cartBtn}>
            <Text style={{ fontSize: 22 }}>🛒</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={{ fontSize: 18, marginRight: 10 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search crops..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchCrops(); }}
            colors={[Colors.buyer]}
          />
        }
      >
        {/* Quick stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Available Crops', val: String(listings.length), icon: '🥬' },
          ].map((s) => (
            <View key={s.label} style={[styles.miniStat, Shadows.sm]}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</Text>
              <Text style={[Typography.h4, { color: Colors.buyer, fontWeight: '800' }]}>{s.val}</Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Featured Banner */}
        <View style={[styles.featureBanner, { backgroundColor: Colors.buyer + '15' }]}>
          <View>
            <Text style={[Typography.label, { color: Colors.buyer }]}>FRESH DEALS</Text>
            <Text style={[Typography.h3, { color: Colors.textPrimary, fontWeight: '800', marginTop: 4 }]}>
              Season's Best Harvest
            </Text>
            <Text style={[Typography.body2, { color: Colors.textSecondary }]}>
              Direct from Sri Lankan farms
            </Text>
          </View>
          <Text style={{ fontSize: 60 }}>🥬</Text>
        </View>

        {/* Categories */}
        <SectionHeader title="Browse Categories" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.lg, marginLeft: -4 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              onPress={() => setSelectedCat(cat.label)}
              style={[
                styles.categoryPill,
                selectedCat === cat.label && { backgroundColor: Colors.buyer, borderColor: Colors.buyer },
              ]}
            >
              <Text style={{ fontSize: 18, marginRight: 6 }}>{cat.emoji}</Text>
              <Text
                style={[
                  Typography.body2,
                  { fontWeight: '600', color: selectedCat === cat.label ? Colors.white : Colors.textSecondary },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Listings */}
        <SectionHeader title={`${filtered.length} Listings`} actionLabel="Sort" />
        {filtered.length === 0 ? (
          <View style={[styles.emptyState, Shadows.sm]}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>🌿</Text>
            <Text style={[Typography.body1, { color: Colors.textSecondary }]}>No crops found</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((item) => (
              <TouchableOpacity
                key={item.productId}
                style={[styles.productCard, Shadows.md]}
                onPress={() => navigation.navigate('PlaceOrder', { item })}
              >
                {/* Emoji image area */}
                <View style={styles.productImage}>
                  <Text style={{ fontSize: 52 }}>{getCropEmoji(item.productName)}</Text>
                </View>

                {/* Info */}
                <View style={styles.productInfo}>
                  <Text style={[Typography.h4, { color: Colors.textPrimary }]}>{item.productName}</Text>
                  <View style={styles.districtRow}>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                      Stock: {item.stock} kg
                    </Text>
                  </View>
                  <View style={styles.priceRow}>
                    <View>
                      <Text style={[Typography.h4, { color: Colors.buyer, fontWeight: '800' }]}>
                        Rs. {item.pricePerKg}/kg
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.orderBtn, { backgroundColor: Colors.buyer }]}
                    onPress={() => navigation.navigate('PlaceOrder', { item })}
                  >
                    <Text style={[Typography.caption, { color: Colors.white, fontWeight: '700' }]}>
                      Order Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.buyer,
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: { ...Typography.body2, color: Colors.white + 'CC' },
  name: { ...Typography.h3, color: Colors.white, fontWeight: '800' },
  cartBtn: { position: 'relative' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  searchInput: { flex: 1, ...Typography.body1, color: Colors.textPrimary },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  miniStat: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: 12,
    alignItems: 'center',
  },
  featureBanner: {
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.buyer + '30',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radii.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 10,
    backgroundColor: Colors.white,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: {
    width: '47.5%',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  productImage: {
    height: 110,
    backgroundColor: Colors.buyerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: { padding: 12 },
  districtRow: { marginBottom: 4 },
  freshBadge: { marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  orderBtn: { paddingVertical: 8, borderRadius: Radii.md, alignItems: 'center' },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});

export default BuyerMarketplaceScreen;

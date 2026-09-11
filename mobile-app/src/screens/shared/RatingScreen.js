import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button, Card, Avatar, SectionHeader } from '../../components';
import { FarmerService, TransporterService } from '../../api';

const RatingScreen = ({ navigation }) => {
  const [activeChoice, setActiveChoice] = useState('farmer'); // 'farmer' | 'transporter'

  // Farmers state
  const [farmers,            setFarmers]            = useState([]);
  const [farmersLoading,     setFarmersLoading]     = useState(true);
  const [selectedFarmerId,   setSelectedFarmerId]   = useState(null);
  const [farmerStars,        setFarmerStars]        = useState(5);
  const [farmerComment,      setFarmerComment]      = useState('');
  const [farmerSubmitting,   setFarmerSubmitting]   = useState(false);

  // Transporters state
  const [transporters,           setTransporters]           = useState([]);
  const [transportersLoading,    setTransportersLoading]    = useState(true);
  const [selectedTransporterId,  setSelectedTransporterId]  = useState(null);
  const [transporterStars,       setTransporterStars]       = useState(5);
  const [transporterComment,     setTransporterComment]     = useState('');
  const [transporterSubmitting,  setTransporterSubmitting]  = useState(false);

  const [submittedMessage, setSubmittedMessage] = useState('');

  // ── Load data ────────────────────────────────────────────────
  useEffect(() => {
    FarmerService.getAll()
      .then((data) => {
        setFarmers(data || []);
        if (data && data.length > 0) setSelectedFarmerId(data[0].userId);
      })
      .catch(() => setFarmers([]))
      .finally(() => setFarmersLoading(false));
  }, []);

  useEffect(() => {
    TransporterService.getAll()
      .then((data) => {
        setTransporters(data || []);
        if (data && data.length > 0) setSelectedTransporterId(data[0].userId);
      })
      .catch(() => setTransporters([]))
      .finally(() => setTransportersLoading(false));
  }, []);

  const selectedFarmer      = farmers.find((f) => f.userId === selectedFarmerId)      || farmers[0];
  const selectedTransporter = transporters.find((t) => t.userId === selectedTransporterId) || transporters[0];

  // ── Submit farmer rating ─────────────────────────────────────
  const handleFarmerSubmit = useCallback(async () => {
    if (!selectedFarmer) return;
    try {
      setFarmerSubmitting(true);
      // Calculate new average: ((oldRating * reviewCount) + newStars) / (reviewCount + 1)
      // Since we don't store count, we do a simple weighted average from 1 prior review
      const oldRating   = Number(selectedFarmer.rating) || 0;
      const newRating   = ((oldRating + farmerStars) / 2).toFixed(2);
      await FarmerService.update(selectedFarmer.userId, {
        ...selectedFarmer,
        rating: parseFloat(newRating),
      });
      // Refresh list
      const updated = await FarmerService.getAll();
      setFarmers(updated || []);
      setSubmittedMessage(`⭐ Rating of ${farmerStars} stars submitted for Farmer ${selectedFarmer.name}!`);
      setFarmerComment('');
      setTimeout(() => setSubmittedMessage(''), 4000);
    } catch (err) {
      Alert.alert('Error', `Could not submit rating: ${err.message}`);
    } finally {
      setFarmerSubmitting(false);
    }
  }, [selectedFarmer, farmerStars]);

  // ── Submit transporter rating ────────────────────────────────
  const handleTransporterSubmit = useCallback(async () => {
    if (!selectedTransporter) return;
    try {
      setTransporterSubmitting(true);
      const oldRating  = Number(selectedTransporter.rating) || 0;
      const newRating  = ((oldRating + transporterStars) / 2).toFixed(2);
      await TransporterService.update(selectedTransporter.userId, {
        ...selectedTransporter,
        rating: parseFloat(newRating),
      });
      const updated = await TransporterService.getAll();
      setTransporters(updated || []);
      setSubmittedMessage(`⭐ Rating of ${transporterStars} stars submitted for Transporter ${selectedTransporter.name}!`);
      setTransporterComment('');
      setTimeout(() => setSubmittedMessage(''), 4000);
    } catch (err) {
      Alert.alert('Error', `Could not submit rating: ${err.message}`);
    } finally {
      setTransporterSubmitting(false);
    }
  }, [selectedTransporter, transporterStars]);

  const handleBack = useCallback(() => {
    try {
      if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
        navigation.goBack();
      } else if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('BuyerApp');
      }
    } catch (err) {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('BuyerApp');
      }
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={[Typography.h3, { color: Colors.textPrimary }]}>Rate & Reviews</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Success Alert Banner */}
        {submittedMessage ? (
          <View style={styles.successBanner}>
            <Text style={[Typography.body2, { color: Colors.white, fontWeight: '700' }]}>
              {submittedMessage}
            </Text>
          </View>
        ) : null}

        {/* Top 2 Choices Selector */}
        <Text style={[Typography.label, { color: Colors.textMuted, marginBottom: 10 }]}>
          SELECT WHO TO RATE
        </Text>
        <View style={styles.choiceToggle}>
          <TouchableOpacity
            onPress={() => setActiveChoice('farmer')}
            style={[
              styles.choiceBtn,
              activeChoice === 'farmer' && { backgroundColor: Colors.farmer, borderColor: Colors.farmer },
            ]}
          >
            <Text style={{ fontSize: 18, marginRight: 6 }}>👨‍🌾</Text>
            <Text
              style={[
                Typography.body1,
                { fontWeight: '700', color: activeChoice === 'farmer' ? Colors.white : Colors.textSecondary },
              ]}
            >
              Rate Farmer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveChoice('transporter')}
            style={[
              styles.choiceBtn,
              activeChoice === 'transporter' && { backgroundColor: Colors.transporter, borderColor: Colors.transporter },
            ]}
          >
            <Text style={{ fontSize: 18, marginRight: 6 }}>🚛</Text>
            <Text
              style={[
                Typography.body1,
                { fontWeight: '700', color: activeChoice === 'transporter' ? Colors.white : Colors.textSecondary },
              ]}
            >
              Rate Transporter
            </Text>
          </TouchableOpacity>
        </View>

        {/* Choice 1: RATE FARMER */}
        {activeChoice === 'farmer' && (
          <View>
            <Text style={[Typography.label, { color: Colors.textMuted, marginBottom: 8 }]}>
              CHOOSE FARMER
            </Text>
            {farmersLoading ? (
              <ActivityIndicator color={Colors.farmer} size="large" style={{ marginVertical: 20 }} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.lg }}>
                {farmers.map((f) => {
                  const isSel = f.userId === selectedFarmerId;
                  return (
                    <TouchableOpacity
                      key={f.userId}
                      onPress={() => setSelectedFarmerId(f.userId)}
                      style={[
                        styles.personCard,
                        isSel && { borderColor: Colors.farmer, backgroundColor: Colors.farmerLight },
                      ]}
                    >
                      <Avatar name={f.name} size={42} color={Colors.farmer} />
                      <View style={{ marginTop: 6, alignItems: 'center' }}>
                        <Text style={[Typography.body2, { fontWeight: '700', color: Colors.textPrimary }]}>
                          {f.name}
                        </Text>
                        <Text style={[Typography.caption, { color: Colors.textMuted }]}>{f.district}</Text>
                        <View style={styles.scorePill}>
                          <Text style={[Typography.caption, { color: Colors.farmer, fontWeight: '800' }]}>
                            ⭐ {f.rating ?? '—'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Rating Card */}
            {selectedFarmer && (
              <Card style={styles.formCard}>
                <View style={styles.targetHeader}>
                  <Avatar name={selectedFarmer.name} size={48} color={Colors.farmer} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[Typography.h4, { color: Colors.textPrimary }]}>{selectedFarmer.name}</Text>
                    <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                      📍 {selectedFarmer.district}
                    </Text>
                    <Text style={[Typography.body2, { color: Colors.farmer, fontWeight: '700', marginTop: 2 }]}>
                      Current Rating: ⭐ {selectedFarmer.rating ?? '—'} / 5.0
                    </Text>
                  </View>
                </View>

                {/* Star selector */}
                <Text style={[Typography.label, { color: Colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>
                  YOUR RATING FOR FARMER
                </Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setFarmerStars(star)}>
                      <Text style={{ fontSize: 36, opacity: star <= farmerStars ? 1 : 0.25 }}>⭐</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Comment text */}
                <Text style={[Typography.label, { color: Colors.textSecondary, marginTop: 16, marginBottom: 6 }]}>
                  FEEDBACK & COMMENTS
                </Text>
                <TextInput
                  style={styles.commentInput}
                  value={farmerComment}
                  onChangeText={setFarmerComment}
                  placeholder="How was crop freshness, packaging, and communication?"
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={3}
                />

                <Button
                  title={farmerSubmitting ? 'Submitting…' : 'Submit Farmer Rating ⭐'}
                  onPress={handleFarmerSubmit}
                  roleColor={Colors.farmer}
                  size="md"
                  style={{ marginTop: 16 }}
                  disabled={farmerSubmitting}
                />
              </Card>
            )}
          </View>
        )}

        {/* Choice 2: RATE TRANSPORTER */}
        {activeChoice === 'transporter' && (
          <View>
            <Text style={[Typography.label, { color: Colors.textMuted, marginBottom: 8 }]}>
              CHOOSE TRANSPORTER
            </Text>
            {transportersLoading ? (
              <ActivityIndicator color={Colors.transporter} size="large" style={{ marginVertical: 20 }} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.lg }}>
                {transporters.map((t) => {
                  const isSel = t.userId === selectedTransporterId;
                  return (
                    <TouchableOpacity
                      key={t.userId}
                      onPress={() => setSelectedTransporterId(t.userId)}
                      style={[
                        styles.personCard,
                        isSel && { borderColor: Colors.transporter, backgroundColor: Colors.transporterLight },
                      ]}
                    >
                      <Avatar name={t.name} size={42} color={Colors.transporter} />
                      <View style={{ marginTop: 6, alignItems: 'center' }}>
                        <Text style={[Typography.body2, { fontWeight: '700', color: Colors.textPrimary }]}>
                          {t.name}
                        </Text>
                        <Text style={[Typography.caption, { color: Colors.textMuted }]}>{t.vehiclePlateNo}</Text>
                        <View style={styles.scorePill}>
                          <Text style={[Typography.caption, { color: Colors.transporter, fontWeight: '800' }]}>
                            ⭐ {t.rating ?? '—'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Rating Card */}
            {selectedTransporter && (
              <Card style={styles.formCard}>
                <View style={styles.targetHeader}>
                  <Avatar name={selectedTransporter.name} size={48} color={Colors.transporter} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[Typography.h4, { color: Colors.textPrimary }]}>{selectedTransporter.name}</Text>
                    <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                      🚛 {selectedTransporter.vehiclePlateNo} · {selectedTransporter.district}
                    </Text>
                    <Text style={[Typography.body2, { color: Colors.transporter, fontWeight: '700', marginTop: 2 }]}>
                      Current Rating: ⭐ {selectedTransporter.rating ?? '—'} / 5.0
                    </Text>
                  </View>
                </View>

                {/* Star selector */}
                <Text style={[Typography.label, { color: Colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>
                  YOUR RATING FOR TRANSPORTER
                </Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setTransporterStars(star)}>
                      <Text style={{ fontSize: 36, opacity: star <= transporterStars ? 1 : 0.25 }}>⭐</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Comment text */}
                <Text style={[Typography.label, { color: Colors.textSecondary, marginTop: 16, marginBottom: 6 }]}>
                  FEEDBACK & COMMENTS
                </Text>
                <TextInput
                  style={styles.commentInput}
                  value={transporterComment}
                  onChangeText={setTransporterComment}
                  placeholder="How was delivery speed, cargo handling, and professionalism?"
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={3}
                />

                <Button
                  title={transporterSubmitting ? 'Submitting…' : 'Submit Transporter Rating ⭐'}
                  onPress={handleTransporterSubmit}
                  roleColor={Colors.transporter}
                  size="md"
                  style={{ marginTop: 16 }}
                  disabled={transporterSubmitting}
                />
              </Card>
            )}
          </View>
        )}

        {/* Live Rating Leaderboard */}
        <SectionHeader title="Current Rating Scores" />
        <Card style={{ marginBottom: Spacing.xl }}>
          <Text style={[Typography.body2, { color: Colors.textSecondary, marginBottom: 12 }]}>
            Ratings are updated in real-time from the database:
          </Text>

          <Text style={[Typography.label, { color: Colors.farmer, marginBottom: 6 }]}>FARMERS</Text>
          {farmersLoading ? (
            <ActivityIndicator color={Colors.farmer} />
          ) : (
            farmers.map((f) => (
              <View key={f.userId} style={styles.leaderRow}>
                <Text style={[Typography.body1, { color: Colors.textPrimary, fontWeight: '600' }]}>
                  👨‍🌾 {f.name}
                </Text>
                <Text style={[Typography.body1, { color: Colors.farmer, fontWeight: '800' }]}>
                  ⭐ {f.rating ?? '—'}
                </Text>
              </View>
            ))
          )}

          <View style={styles.divider} />

          <Text style={[Typography.label, { color: Colors.transporter, marginBottom: 6, marginTop: 8 }]}>TRANSPORTERS</Text>
          {transportersLoading ? (
            <ActivityIndicator color={Colors.transporter} />
          ) : (
            transporters.map((t) => (
              <View key={t.userId} style={styles.leaderRow}>
                <Text style={[Typography.body1, { color: Colors.textPrimary, fontWeight: '600' }]}>
                  🚛 {t.name}
                </Text>
                <Text style={[Typography.body1, { color: Colors.transporter, fontWeight: '800' }]}>
                  ⭐ {t.rating ?? '—'}
                </Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
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
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  successBanner: {
    backgroundColor: Colors.success, borderRadius: Radii.md,
    padding: Spacing.md, marginBottom: Spacing.md, alignItems: 'center',
  },
  choiceToggle: {
    flexDirection: 'row', gap: 10, marginBottom: Spacing.lg,
  },
  choiceBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: Radii.lg, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  personCard: {
    backgroundColor: Colors.white, borderRadius: Radii.lg, padding: 12,
    marginRight: 10, borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', width: 140, ...Shadows.sm,
  },
  scorePill: {
    backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radii.pill, marginTop: 4,
  },
  formCard: { marginBottom: Spacing.lg },
  targetHeader: { flexDirection: 'row', alignItems: 'center' },
  starsRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginVertical: 8 },
  commentInput: {
    backgroundColor: Colors.background, borderRadius: Radii.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    ...Typography.body1, color: Colors.textPrimary, textAlignVertical: 'top',
  },
  leaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
});

export default RatingScreen;

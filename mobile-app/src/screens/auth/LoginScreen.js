import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../theme';
import { Button, Input } from '../../components';
import { loginByRole, registerByRole } from '../../api';
import { useAuth } from '../../context/AuthContext';

const roleConfig = {
  farmer:      { label: 'Farmer',      emoji: '👨‍🌾', color: Colors.farmer,      bg: Colors.farmerLight },
  buyer:       { label: 'Buyer',       emoji: '🛒',  color: Colors.buyer,        bg: Colors.buyerLight },
  transporter: { label: 'Transporter', emoji: '🚛',  color: Colors.transporter,  bg: Colors.transporterLight },
};

const TAB_LABELS = ['Sign In', 'Register'];

const LoginScreen = ({ navigation, route }) => {
  const role = route?.params?.role || { id: 'farmer', label: 'Farmer', color: Colors.farmer };
  const rc = roleConfig[role.id] || roleConfig.farmer;
  const { login: authLogin } = useAuth();

  const [isLogin,      setIsLogin]      = useState(true);
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [name,         setName]         = useState('');
  const [nic,          setNic]          = useState('');
  const [contactNo,    setContactNo]    = useState('');
  const [district,     setDistrict]     = useState('');
  const [bankAccount,  setBankAccount]  = useState('');
  const [businessReg,  setBusinessReg]  = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [maxCapacity,  setMaxCapacity]  = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);

  const roleScreens = { farmer: 'FarmerApp', buyer: 'BuyerApp', transporter: 'TransporterApp' };

  // ── Sign In ────────────────────────────────────────────────
  const handleSignIn = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const user = await loginByRole(role.id, email.trim(), password.trim());
      authLogin(user, role.id);
      navigation.navigate(roleScreens[role.id] || 'FarmerApp');
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }, [email, password, role.id, authLogin, navigation]);

  // ── Register ───────────────────────────────────────────────
  const handleRegister = useCallback(async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in Name, Email and Password.');
      return;
    }

    const base = {
      name:      name.trim(),
      email:     email.trim(),
      password:  password.trim(),
      nic:       nic.trim() || null,
      contactNo: contactNo.trim() || null,
      district:  district.trim() || null,
      role:      role.id.toUpperCase(),
    };

    let payload = base;
    if (role.id === 'farmer') {
      payload = { ...base, bankAccountNo: bankAccount.trim() || null };
    } else if (role.id === 'buyer') {
      payload = { ...base, businessRegNo: businessReg.trim() || null };
    } else if (role.id === 'transporter') {
      payload = {
        ...base,
        vehiclePlateNo: vehiclePlate.trim() || null,
        maxCapacity: maxCapacity ? parseFloat(maxCapacity) : null,
      };
    }

    try {
      setLoading(true);
      const user = await registerByRole(role.id, payload);
      authLogin(user, role.id);
      navigation.navigate(roleScreens[role.id] || 'FarmerApp');
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  }, [name, email, password, nic, contactNo, district, bankAccount, businessReg, vehiclePlate, maxCapacity, role.id, authLogin, navigation]);

  const handleAuth = useCallback(() => {
    if (isLogin) handleSignIn();
    else handleRegister();
  }, [isLogin, handleSignIn, handleRegister]);

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('RoleSelect');
    }
  }, [navigation]);

  const handleSetSignIn   = useCallback(() => setIsLogin(true),  []);
  const handleSetRegister = useCallback(() => setIsLogin(false), []);
  const handleToggleMode  = useCallback(() => setIsLogin((prev) => !prev), []);

  const tabHandlers = [handleSetSignIn, handleSetRegister];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Role badge */}
        <View style={[styles.roleBadge, { backgroundColor: rc.bg }]}>
          <Text style={{ fontSize: 24, marginRight: 8 }}>{rc.emoji}</Text>
          <Text style={[Typography.body1, { color: rc.color, fontWeight: '700' }]}>
            {rc.label} Account
          </Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[Typography.h2, { color: Colors.textPrimary, fontWeight: '800' }]}>
            {isLogin ? 'Welcome back! 👋' : 'Create Account'}
          </Text>
          <Text style={[Typography.body1, { color: Colors.textSecondary, marginTop: 8 }]}>
            {isLogin
              ? 'Sign in to your Arunella account'
              : "Join Arunella and transform Sri Lanka's agriculture"}
          </Text>
        </View>

        {/* Sign In / Register toggle */}
        <View style={[styles.tabContainer, { borderColor: rc.color + '30' }]}>
          {TAB_LABELS.map((t, i) => (
            <TouchableOpacity
              key={t}
              onPress={tabHandlers[i]}
              style={[
                styles.tab,
                (isLogin ? i === 0 : i === 1) && { backgroundColor: rc.color },
              ]}
            >
              <Text
                style={[
                  Typography.button,
                  { color: (isLogin ? i === 0 : i === 1) ? Colors.white : Colors.textSecondary },
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          {!isLogin && (
            <Input label="Full Name *" value={name} onChangeText={setName} placeholder="e.g. Kamal Perera" icon="👤" />
          )}
          <Input
            label="Email Address *"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            icon="✉️"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password *"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            icon="🔐"
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? '👁️' : '🙈'}
            onRightIconPress={() => setShowPassword((p) => !p)}
          />
          {!isLogin && (
            <>
              <Input label="NIC Number"      value={nic}       onChangeText={setNic}       placeholder="e.g. 951234567V"    icon="🪪" />
              <Input label="Contact Number"  value={contactNo} onChangeText={setContactNo} placeholder="+94 77 123 4567"    icon="📱" keyboardType="phone-pad" />
              <Input label="District"        value={district}  onChangeText={setDistrict}  placeholder="e.g. Anuradhapura"  icon="📍" />
              {role.id === 'farmer'      && <Input label="Bank Account Number"         value={bankAccount}  onChangeText={setBankAccount}  placeholder="Savings account number" icon="🏦" />}
              {role.id === 'buyer'       && <Input label="Business Registration No."   value={businessReg}  onChangeText={setBusinessReg}  placeholder="e.g. PV 12345"          icon="📋" />}
              {role.id === 'transporter' && (
                <>
                  <Input label="Vehicle Plate Number"      value={vehiclePlate} onChangeText={setVehiclePlate} placeholder="e.g. WP-ABC-1234" icon="🚗" />
                  <Input label="Max. Vehicle Capacity (kg)" value={maxCapacity}  onChangeText={setMaxCapacity}  placeholder="e.g. 1000"        icon="⚖️" keyboardType="numeric" />
                </>
              )}
            </>
          )}

          {loading && (
            <ActivityIndicator color={rc.color} size="large" style={{ marginVertical: 12 }} />
          )}

          <Button
            title={loading ? (isLogin ? 'Signing In…' : 'Creating Account…') : (isLogin ? 'Sign In' : 'Create Account')}
            onPress={handleAuth}
            roleColor={rc.color}
            size="lg"
            style={{ marginTop: Spacing.md }}
            disabled={loading}
          />
        </View>

        {/* Switch mode */}
        <TouchableOpacity onPress={handleToggleMode} style={styles.switchMode}>
          <Text style={[Typography.body2, { color: Colors.textSecondary }]}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Text style={{ color: rc.color, fontWeight: '700' }}>
              {isLogin ? 'Register' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: 48, paddingBottom: 40 },
  backBtn: {
    marginBottom: Spacing.lg, width: 40, height: 40,
    borderRadius: 12, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', ...Shadows.sm,
  },
  backArrow: { fontSize: 22, color: Colors.textPrimary },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: Radii.pill, marginBottom: Spacing.md,
  },
  header: { marginBottom: Spacing.lg },
  tabContainer: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: Radii.lg, padding: 4,
    marginBottom: Spacing.lg, borderWidth: 1.5, ...Shadows.sm,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radii.md },
  form: { gap: 0 },
  switchMode: { alignItems: 'center', marginTop: Spacing.xl, paddingVertical: 8 },
});

export default LoginScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { apiService } from '../services/apiService';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErrorMessage('');
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // Authenticate against database via backend microservice
      const adminData = await apiService.loginAdmin(trimmedEmail, trimmedPassword);
      setLoading(false);
      onLogin({
        email: adminData.email || trimmedEmail,
        name: adminData.name || 'Admin User',
        role: 'Super Admin',
      });
    } catch (e) {
      // Fallback: If backend service is offline, allow default demo admin credentials
      if (trimmedEmail === 'admin@arunella.lk' && trimmedPassword === 'admin123') {
        setLoading(false);
        onLogin({ email: trimmedEmail, name: 'Super Admin', role: 'Super Admin' });
        return;
      }
      setLoading(false);
      setErrorMessage(e.message || 'Invalid admin email or password.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@arunella.lk');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <View style={styles.background}>
      <View style={styles.loginCard}>
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <View style={styles.logoBadge}>
            <MaterialIcons name="eco" size={32} color={colors.onPrimaryContainer} />
          </View>
          <Text style={styles.brandTitle}>Arunella</Text>
          <Text style={styles.brandSubtitle}>Admin Console Access</Text>
        </View>

        <Text style={styles.welcomeTitle}>Sign in to your account</Text>
        <Text style={styles.welcomeSub}>
          Enter your administrative credentials to access real-time network monitoring and logistics.
        </Text>

        {/* Error Alert */}
        {!!errorMessage && (
          <View style={styles.errorBanner}>
            <MaterialIcons name="error-outline" size={18} color={colors.error} style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Form Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="email" size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="admin@arunella.lk"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={handleSubmit}
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="lock" size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.onSurfaceVariant}
              secureTextEntry={!showPassword}
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color={colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options Row */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <MaterialIcons name="check" size={14} color={colors.onPrimary} />}
            </View>
            <Text style={styles.rememberText}>Remember this session</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.signInBtn, loading && styles.signInBtnLoading]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.signInBtnText}>
            {loading ? 'Authenticating...' : 'Sign In to Console'}
          </Text>
          {!loading && <MaterialIcons name="arrow-forward" size={18} color={colors.onPrimary} style={{ marginLeft: 8 }} />}
        </TouchableOpacity>

        {/* Demo Helper Box */}
        <View style={styles.demoBox}>
          <View style={styles.demoHeader}>
            <MaterialIcons name="info" size={16} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.demoTitle}>Quick Demo Access</Text>
          </View>
          <Text style={styles.demoText}>Pre-loaded with admin credentials for preview.</Text>
          <TouchableOpacity style={styles.demoFillBtn} onPress={handleFillDemo} activeOpacity={0.7}>
            <Text style={styles.demoFillBtnText}>Auto-fill Admin Credentials</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  loginCard: {
    width: 440,
    maxWidth: '100%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: colors.onErrorContainer,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceContainerLowest,
    height: 44,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.onSurface,
    ...Platform.select({
      web: { outlineStyle: 'none' },
    }),
  },
  eyeBtn: {
    padding: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  signInBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 9999,
    paddingVertical: 12,
    marginBottom: 24,
  },
  signInBtnLoading: {
    opacity: 0.7,
  },
  signInBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  demoBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  demoText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
    textAlign: 'center',
  },
  demoFillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: colors.secondaryContainer,
  },
  demoFillBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
});

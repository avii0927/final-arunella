import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../theme';

// ─── Button Component ────────────────────────────────────────────────
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  roleColor,
}) => {
  const bgColor = roleColor || Colors.primary;

  const variants = {
    primary: {
      backgroundColor: disabled ? Colors.textMuted : bgColor,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: bgColor,
    },
    ghost: {
      backgroundColor: 'rgba(45,125,70,0.08)',
      borderWidth: 0,
    },
    danger: {
      backgroundColor: Colors.error,
      borderWidth: 0,
    },
  };

  const sizes = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: Radii.sm },
    md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: Radii.md },
    lg: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: Radii.lg },
  };

  const textColor =
    variant === 'secondary'
      ? bgColor
      : variant === 'ghost'
      ? bgColor
      : Colors.white;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.button, variants[variant], sizes[size], style]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <Text style={{ marginRight: 8, fontSize: 18 }}>{icon}</Text>}
          <Text style={[Typography.button, { color: textColor }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── Input Component ─────────────────────────────────────────────────
export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  multiline,
  numberOfLines,
  keyboardType,
  autoCapitalize = 'sentences',
  error,
  style,
}) => (
  <View style={[styles.inputContainer, style]}>
    {label && (
      <Text style={[Typography.label, { color: Colors.textSecondary, marginBottom: 6 }]}>
        {label}
      </Text>
    )}
    <View style={[styles.inputWrapper, error && { borderColor: Colors.error }]}>
      {icon && <Text style={styles.inputIcon}>{icon}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && { height: (numberOfLines || 3) * 24, textAlignVertical: 'top', paddingTop: 12 },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={{ padding: 4 }}>
          <Text style={styles.inputIcon}>{rightIcon}</Text>
        </TouchableOpacity>
      )}
    </View>
    {error && (
      <Text style={[Typography.caption, { color: Colors.error, marginTop: 4 }]}>{error}</Text>
    )}
  </View>
);

// ─── Card Component ──────────────────────────────────────────────────
export const Card = ({ children, style, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.card, Shadows.md, style]}
    >
      {children}
    </Wrapper>
  );
};

// ─── Badge / Status Chip ─────────────────────────────────────────────
export const StatusBadge = ({ status, style }) => {
  const normalized = (status || '').toLowerCase().replace('_', '-');
  const statusMap = {
    active: { label: 'Active', bg: '#E8F5EB', text: Colors.primary },
    pending: { label: 'Pending', bg: '#FFF7E6', text: Colors.warning },
    confirmed: { label: 'Confirmed', bg: '#E8F5EB', text: Colors.farmer },
    shipped: { label: 'Shipped', bg: '#E3F0FF', text: Colors.buyer },
    'in-transit': { label: 'Shipped', bg: '#E3F0FF', text: Colors.buyer },
    delivered: { label: 'Delivered', bg: '#E8F5EB', text: Colors.success },
    cancelled: { label: 'Cancelled', bg: '#FFF1F1', text: Colors.error },
    expired: { label: 'Expired', bg: '#F5F5F5', text: Colors.textMuted },
    available: { label: 'Available', bg: '#E8F5EB', text: Colors.primary },
  };
  const s = statusMap[normalized] || statusMap[status] || statusMap.pending;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }, style]}>
      <Text style={[Typography.caption, { color: s.text, fontWeight: '600' }]}>{s.label}</Text>
    </View>
  );
};

// ─── Section Header ───────────────────────────────────────────────────
export const SectionHeader = ({ title, actionLabel, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={[Typography.h4, { color: Colors.textPrimary }]}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity onPress={onAction}>
        <Text style={[Typography.body2, { color: Colors.primary, fontWeight: '600' }]}>
          {actionLabel}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Empty State ─────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={[Typography.h3, { color: Colors.textPrimary, marginBottom: 8 }]}>{title}</Text>
    <Text style={[Typography.body2, { color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 }]}>
      {subtitle}
    </Text>
    {actionLabel && (
      <Button title={actionLabel} onPress={onAction} size="md" />
    )}
  </View>
);

// ─── Avatar ─────────────────────────────────────────────────────────
export const Avatar = ({ name, size = 44, color = Colors.primary }) => {
  const initial = name ? name[0].toUpperCase() : '?';
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color + '22',
        },
      ]}
    >
      <Text style={[Typography.h4, { color, fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    ...Typography.body1,
    color: Colors.textPrimary,
    paddingVertical: 14,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

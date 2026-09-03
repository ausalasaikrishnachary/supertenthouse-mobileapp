import { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: COLORS.primary[700],
    shadowColor: COLORS.primary[700],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  gold: {
    backgroundColor: COLORS.gold[400],
    shadowColor: COLORS.gold[400],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  dark: { backgroundColor: COLORS.neutral[900] },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary[300] },
  ghost: { backgroundColor: COLORS.neutral[100] },
};

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
  md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
  lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl },
};

const textVariantStyles: Record<Variant, TextStyle> = {
  primary: { color: COLORS.white },
  gold: { color: COLORS.neutral[900] },
  dark: { color: COLORS.white },
  outline: { color: COLORS.primary[700] },
  ghost: { color: COLORS.neutral[800] },
};

const textSizeStyles: Record<Size, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};

export function Button({ children, onPress, variant = 'primary', size = 'md', loading, disabled, style, fullWidth }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        { borderRadius: RADIUS.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? { width: '100%' } : {},
        disabled ? { opacity: 0.5 } : {},
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? COLORS.primary[600] : COLORS.white} size="small" />
      ) : (
        <Text style={[{ fontFamily: 'Inter-SemiBold' }, textVariantStyles[variant], textSizeStyles[size]]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

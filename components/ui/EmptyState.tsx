import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';

type Props = {
  icon: ReactNode;
  title: string;
  message: string;
};

export function EmptyState({ icon, title, message }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xxl * 2 },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md,
  },
  title: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[800], marginBottom: 6 },
  message: { fontSize: 14, color: COLORS.neutral[500], fontFamily: 'Inter-Regular', textAlign: 'center', paddingHorizontal: SPACING.xl },
});

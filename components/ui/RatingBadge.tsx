import { Star } from 'lucide-react-native';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

export function RatingBadge({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 12 : 14;
  return (
    <View style={[styles.badge, size === 'sm' && styles.badgeSm]}>
      <Star size={s - 2} color={COLORS.white} fill={COLORS.white} />
      <Text style={[styles.text, size === 'sm' && styles.textSm]}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  badgeSm: { paddingHorizontal: 6, paddingVertical: 2 },
  text: { color: COLORS.white, fontSize: 13, fontFamily: 'Inter-SemiBold' },
  textSm: { fontSize: 11 },
});

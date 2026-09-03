import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');

export function Skeleton({ width: w = '100%', height: h = 16, radius = 8, style }: { width?: number | string; height?: number | string; radius?: number; style?: any }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width: w as any, height: h as any, borderRadius: radius, backgroundColor: COLORS.neutral[200] }, animStyle, style]}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={cardStyles.card}>
      <Skeleton width="100%" height={180} radius={16} />
      <View style={cardStyles.body}>
        <Skeleton width="60%" height={12} />
        <Skeleton width="100%" height={14} style={{ marginTop: 8 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
          <Skeleton width={50} height={16} radius={8} />
          <Skeleton width={40} height={12} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 }}>
          <Skeleton width={70} height={18} />
          <Skeleton width={50} height={14} />
        </View>
      </View>
    </View>
  );
}

export function CategorySkeleton() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Skeleton width={72} height={72} radius={36} />
      <Skeleton width={60} height={10} style={{ marginTop: 8 }} />
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: (width - 48) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  body: { padding: 12 },
});

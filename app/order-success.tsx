// app/order-success.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { ZoomIn, FadeInDown, FadeIn } from 'react-native-reanimated';
import { Check, Share2, ShoppingBag, Calendar, MapPin, CreditCard } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ✅ Read params passed from checkout
  const params = useLocalSearchParams<{
    total?: string;
    orderId?: string;
    orderNumber?: string;
  }>();

  // ✅ Dynamic total (fallback to 0 if missing)
  const total = Number(params.total) || 0;

  // ✅ Dynamic booking ID — prefer backend orderId, else generate once
  const [fallbackBookingId] = useState('STH' + Date.now().toString().slice(-8));
  const bookingId = params.orderId
    ? `STH${String(params.orderId).slice(-8).padStart(8, '0')}`
    : fallbackBookingId;

  // ✅ Dynamic order number — prefer backend, else generate once
  const [fallbackOrderNumber] = useState(() => Math.floor(Math.random() * 100000));
  const orderNumber = params.orderNumber
    ? params.orderNumber
    : String(fallbackOrderNumber);

  // ✅ Format with Indian comma separators (e.g. 1,23,456)
  const formatINR = (value: number) =>
    value.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My Super Tent House booking is confirmed! Booking ID: ${bookingId}`,
      });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 230 }]}>
        {/* Success Animation */}
        <Animated.View entering={ZoomIn.springify().damping(8)} style={styles.successCircle}>
          <Animated.View entering={ZoomIn.delay(200).duration(400)}>
            <Check color={COLORS.white} size={64} strokeWidth={3} />
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.title}>Booking Confirmed!</Text>
        </Animated.View>

        {/* Actions — both buttons share the same fixed-width wrapper */}
        <View style={styles.actionsWrapper}>
          <Button onPress={() => router.replace('/(tabs)')} fullWidth size="lg">
            Continue Shopping
          </Button>

          <TouchableOpacity
            style={styles.ordersLink}
            onPress={() => router.replace('/(tabs)/orders')}
            activeOpacity={0.7}
          >
            <ShoppingBag color={COLORS.primary[600]} size={16} />
            <Text style={styles.ordersLinkText}>View My Orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  content: { flex: 1, alignItems: 'center' },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginTop: SPACING.lg,
    textAlign: 'center',
  },

  // ─── Actions wrapper — constrains both buttons to the same width ──────────
  actionsWrapper: {
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    alignSelf: 'center',
    alignItems: 'stretch',   // makes children fill the wrapper's width
  },

  ordersLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    width: '100%',
  },
  ordersLinkText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary[600],
  },

  // ─── Unused styles kept (in case you re-enable the card/QR sections) ──────
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8, textAlign: 'center', paddingHorizontal: SPACING.xl, lineHeight: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.lg, marginHorizontal: SPACING.lg, marginTop: SPACING.xl, width: '90%', ...SHADOWS.medium },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  cardLabel: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], flex: 1 },
  cardValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  cardDivider: { height: 1, backgroundColor: COLORS.neutral[100], marginVertical: SPACING.sm },
  cardTotal: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  qrCard: { alignItems: 'center', marginTop: SPACING.lg },
  qrPlaceholder: { width: 120, height: 120, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: COLORS.white, padding: 8, borderRadius: RADIUS.lg, ...SHADOWS.small },
  qrDot: { width: 13, height: 13 },
  qrText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8 },
  actions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg, paddingHorizontal: SPACING.lg },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.white, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, ...SHADOWS.small },
  actionText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[700] },
});
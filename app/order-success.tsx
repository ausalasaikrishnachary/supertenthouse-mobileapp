import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { ZoomIn, FadeInDown, FadeIn } from 'react-native-reanimated';
import { Check, Share2, ShoppingBag, Calendar, MapPin, CreditCard } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bookingId] = useState('STH' + Date.now().toString().slice(-8));

  const handleShare = async () => {
    try {
      await Share.share({ message: `My Super Tent House booking is confirmed! Booking ID: ${bookingId}` });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        {/* Success Animation */}
        <Animated.View entering={ZoomIn.springify().damping(8)} style={styles.successCircle}>
          <Animated.View entering={ZoomIn.delay(200).duration(400)}>
            <Check color={COLORS.white} size={64} strokeWidth={3} />
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>Your event is being prepared. We'll be in touch shortly.</Text>
        </Animated.View>

        {/* Booking Details Card */}
        <Animated.View entering={FadeIn.delay(600).duration(500)} style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Booking ID</Text>
            <Text style={styles.cardValue}>{bookingId}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Order Number</Text>
            <Text style={styles.cardValue}>#{Math.floor(Math.random() * 100000)}</Text>
          </View>
          {/* <View style={styles.cardRow}>
            <Calendar color={COLORS.neutral[400]} size={16} />
            <Text style={styles.cardValue}>Event on 15 Jul 2025, 6:00 PM</Text>
          </View> */}
          <View style={styles.cardRow}>
            <MapPin color={COLORS.neutral[400]} size={16} />
            <Text style={styles.cardValue} numberOfLines={1}>Grand Palace, Bengaluru</Text>
          </View>
          <View style={styles.cardRow}>
            <CreditCard color={COLORS.neutral[400]} size={16} />
            <Text style={styles.cardValue}>Paid via UPI</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Paid</Text>
            <Text style={styles.cardTotal}>₹66,120</Text>
          </View>
        </Animated.View>

        {/* QR Code Placeholder */}
        <Animated.View entering={FadeIn.delay(800)} style={styles.qrCard}>
          <View style={styles.qrPlaceholder}>
            {Array.from({ length: 64 }).map((_, i) => (
              <View key={i} style={[styles.qrDot, { backgroundColor: Math.random() > 0.5 ? COLORS.neutral[900] : 'transparent' }]} />
            ))}
          </View>
          <Text style={styles.qrText}>Scan for booking details</Text>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(1000)} style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Share2 color={COLORS.primary[600]} size={20} />
            <Text style={styles.actionText}>Share Booking</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ marginTop: SPACING.xl, paddingHorizontal: SPACING.lg }}>
          <Button onPress={() => router.replace('/(tabs)')} fullWidth size="lg">
            Continue Shopping
          </Button>
          <TouchableOpacity style={styles.ordersLink} onPress={() => router.replace('/(tabs)/orders')}>
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
  successCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', ...SHADOWS.large },
  title: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginTop: SPACING.lg, textAlign: 'center' },
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
  ordersLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: SPACING.md },
  ordersLinkText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600] },
});

import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuth } from '@/store/auth';

export default function SplashScreen() {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [state.isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.bgGradient} />
      <Animated.View entering={ZoomIn.duration(800)} style={styles.logoWrap}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>ST</Text>
        </View>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(400).duration(600)}>
        <Text style={styles.title}>Super Tent House</Text>
        <Text style={styles.subtitle}>Premium Event Decorations</Text>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(1200)} style={styles.footer}>
        <Text style={styles.footerText}>Making celebrations memorable since 1995</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary[900], alignItems: 'center', justifyContent: 'center' },
  bgGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: COLORS.primary[800],
  },
  logoWrap: { marginBottom: SPACING.lg },
  logoCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.gold[400], justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.gold[400], shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 30, elevation: 10,
  },
  logoText: { fontSize: 48, fontFamily: 'Inter-Bold', color: COLORS.primary[900] },
  title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.white, marginTop: SPACING.md },
  subtitle: { fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.gold[200], marginTop: 4, letterSpacing: 2 },
  footer: { position: 'absolute', bottom: 60 },
  footerText: { fontSize: 12, color: COLORS.neutral[400], fontFamily: 'Inter-Regular' },
});

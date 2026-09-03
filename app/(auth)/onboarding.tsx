import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Luxury Wedding Decorations',
    description: 'Transform your special day into a magical celebration with our premium decorations',
    image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Crystal Chandeliers & Lighting',
    description: 'Breathtaking lighting solutions that create the perfect ambiance for any event',
    image: 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Complete Event Management',
    description: 'From stage setup to catering, we handle every detail of your celebration',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<any>(null);

  const handleNext = () => {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
      setIndex(index + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => router.replace('/(auth)/login');

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== index) setIndex(i);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((slide, i) => (
          <View key={i} style={styles.slide}>
            <Animated.View entering={FadeIn.duration(600)}>
              <Image source={{ uri: slide.image }} style={styles.image} />
              <View style={styles.overlay} />
            </Animated.View>
            <View style={styles.content}>
              {i === index && (
                <Animated.View entering={SlideInRight.delay(200).duration(500)}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={styles.description}>{slide.description}</Text>
                </Animated.View>
              )}
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <Button onPress={handleNext} variant="gold" size="md">
            {index === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  slide: { width, flex: 1 },
  image: { width: '100%', height: '65%', resizeMode: 'cover' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.2)' },
  content: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  title: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], lineHeight: 32 },
  description: { fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: SPACING.md, lineHeight: 22 },
  footer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl, paddingTop: SPACING.md },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: SPACING.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.neutral[300] },
  dotActive: { width: 24, backgroundColor: COLORS.gold[400] },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skipText: { fontSize: 15, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
});

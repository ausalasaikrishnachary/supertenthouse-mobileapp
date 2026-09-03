import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, Star, Check } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Package } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PackageListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await mockApi.getPackages();
    setPackages(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const tierColors: Record<string, string> = {
    Basic: COLORS.primary[500],
    Premium: COLORS.gold[400],
    Luxury: COLORS.neutral[900],
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Event Packages</Text>
          <Text style={styles.subtitle}>Complete solutions for your celebrations</Text>
        </View>
      </View>

      <FlatList
        data={packages}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/package/${item.id}`)} activeOpacity={0.9}>
            {loading ? <Skeleton width="100%" height={200} radius={RADIUS.xxl} /> : (
              <>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardOverlay} />
                <View style={styles.cardContent}>
                  <View style={[styles.tierBadge, { backgroundColor: tierColors[item.tier] }]}>
                    <Text style={[styles.tierText, item.tier === 'Luxury' && { color: COLORS.gold[400] }]}>{item.tier.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                      <Users color={COLORS.white} size={14} />
                      <Text style={styles.metaText}>Up to {item.guestCapacity} guests</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Star color={COLORS.gold[400]} size={14} fill={COLORS.gold[400]} />
                      <Text style={styles.metaText}>{item.rating} ({item.reviewCount})</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  card: { height: 220, borderRadius: RADIUS.xxl, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOWS.medium },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.6)' },
  cardContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
  tierBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 8 },
  tierText: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.white },
  cardName: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.white },
  cardMeta: { flexDirection: 'row', gap: SPACING.md, marginTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[200] },
});

import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Search } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Category } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await mockApi.getCategories();
    setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Browse all our decoration collections</Text>
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')} activeOpacity={0.9}>
          <Search color={COLORS.neutral[400]} size={20} />
          <Text style={styles.searchPlaceholder}>Search categories...</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/category/${item.id}`)}
            activeOpacity={0.9}
          >
            <Animated.View entering={FadeIn.delay(index * 30)} style={styles.cardInner}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.cardCount}>{item.productCount} products</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No categories found</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2, marginBottom: SPACING.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, height: 50, borderWidth: 1, borderColor: COLORS.neutral[200], ...SHADOWS.small },
  searchPlaceholder: { fontSize: 14, color: COLORS.neutral[400], fontFamily: 'Inter-Regular', marginLeft: SPACING.sm },
  card: { flex: 1, margin: SPACING.sm / 2, height: 160, borderRadius: RADIUS.xxl, overflow: 'hidden', ...SHADOWS.medium },
  cardInner: { width: '100%', height: '100%' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.5)' },
  cardContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.md },
  cardName: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.white, lineHeight: 18 },
  cardCount: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.gold[200], marginTop: 2 },
  empty: { textAlign: 'center', paddingVertical: 40, color: COLORS.neutral[500] },
});

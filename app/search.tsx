import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X, TrendingUp } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const popularSearches = ['Wedding Decoration', 'Crystal Chandelier', 'Birthday Setup', 'Stage Decoration', 'Flower Bouquet', 'LED Lights'];

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    const data = await mockApi.search(q);
    setResults(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View style={styles.searchWrap}>
          <Search color={COLORS.neutral[400]} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, categories..."
            placeholderTextColor={COLORS.neutral[400]}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X color={COLORS.neutral[400]} size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!hasSearched ? (
        <View style={styles.suggestions}>
          <View style={styles.suggestHeader}>
            <TrendingUp color={COLORS.gold[500]} size={20} />
            <Text style={styles.suggestTitle}>Popular Searches</Text>
          </View>
          <View style={styles.suggestChips}>
            {popularSearches.map((s) => (
              <TouchableOpacity key={s} style={styles.suggestChip} onPress={() => setQuery(s)}>
                <Text style={styles.suggestChipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
        </View>
      ) : (
        <FlatList
          data={results}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
          renderItem={({ item, index }) => <ProductCard product={item} index={index} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyState
              icon={<Search color={COLORS.neutral[400]} size={36} />}
              title="No results found"
              message={`No products match "${query}"`}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, height: 50, borderWidth: 1, borderColor: COLORS.neutral[200], ...SHADOWS.small },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[900], marginLeft: SPACING.sm },
  suggestions: { padding: SPACING.lg },
  suggestHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  suggestTitle: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  suggestChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.lg, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.neutral[200], ...SHADOWS.small },
  suggestChipText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700] },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

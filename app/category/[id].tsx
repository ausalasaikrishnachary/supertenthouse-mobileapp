import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, Modal, Image, ScrollView, Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  ArrowLeft, SlidersHorizontal, X, Check, LayoutGrid, List,
  Star, ShoppingBag, Heart, Package, TrendingUp, ChevronDown,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useWishlist } from '@/store/wishlist';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type SortKey = 'popular' | 'price_low' | 'price_high' | 'rating';
type ViewMode = 'grid' | 'list';

// ─── List-view product card ──────────────────────────────────────────────────
function ListCard({ product, index }: { product: Product; index: number }) {
  const router = useRouter();
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();
  const isWL = has(product.id);

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(350)}>
      <TouchableOpacity
        style={lc.card}
        onPress={() => router.push(`/product/${product.id}`)}
        activeOpacity={0.88}
      >
        <View style={lc.imageWrap}>
          <Image source={{ uri: product.images?.[0] || 'https://via.placeholder.com/300x300' }} style={lc.image} />
          {product.discount > 0 && (
            <View style={lc.badge}>
              <Text style={lc.badgeText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        <View style={lc.body}>
          <Text style={lc.category}>{product.categoryName || 'Category'}</Text>
          <Text style={lc.name} numberOfLines={2}>{product.name || 'Product'}</Text>

          <View style={lc.ratingRow}>
            <RatingBadge rating={product.rating || 0} size="sm" />
            <Text style={lc.reviews}>({product.reviewCount || 0} reviews)</Text>
          </View>

          <View style={lc.priceRow}>
            <Text style={lc.price}>₹{product.price?.toLocaleString('en-IN') || '0'}</Text>
            {product.originalPrice > product.price && (
              <Text style={lc.original}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
            )}
          </View>

          <View style={lc.actions}>
            <TouchableOpacity
              style={lc.wishBtn}
              onPress={() => { toggle(product.id); show(isWL ? 'Removed' : 'Saved!', 'info'); }}
            >
              <Heart size={16} color={isWL ? COLORS.error : COLORS.neutral[500]} fill={isWL ? COLORS.error : 'transparent'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={lc.addBtn}
              onPress={() => {
                addItem({ 
                  id: `${product.id}_${Date.now()}`, 
                  productId: product.id, 
                  name: product.name || 'Product', 
                  image: product.images?.[0] || 'https://via.placeholder.com/300x300', 
                  price: product.price || 0, 
                  quantity: 1, 
                  type: 'product' 
                });
                show('Added to cart');
              }}
            >
              <ShoppingBag size={14} color={COLORS.white} />
              <Text style={lc.addText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const lc = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, marginBottom: SPACING.md,
    overflow: 'hidden', ...SHADOWS.medium,
  },
  imageWrap: { position: 'relative' },
  image: { width: 130, height: 160, resizeMode: 'cover' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.error, paddingHorizontal: 6, paddingVertical: 3, borderRadius: RADIUS.sm,
  },
  badgeText: { color: COLORS.white, fontSize: 10, fontFamily: 'Inter-Bold' },
  body: { flex: 1, padding: 14, justifyContent: 'space-between' },
  category: { fontSize: 10, fontFamily: 'Inter-Medium', color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], marginTop: 4, lineHeight: 19 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  reviews: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  price: { fontSize: 17, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  original: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  wishBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center',
  },
  addBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    backgroundColor: COLORS.primary[700], paddingVertical: 9, borderRadius: RADIUS.lg,
  },
  addText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.white },
});

// ─── Sort pill bar ────────────────────────────────────────────────────────────
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'popular',    label: 'Popular' },
  { key: 'price_low',  label: 'Price ↑' },
  { key: 'price_high', label: 'Price ↓' },
  { key: 'rating',     label: 'Top Rated' },
];

function SortBar({ sort, onChange }: { sort: SortKey; onChange: (k: SortKey) => void }) {
  return (
    <ScrollView
      horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: 8 }}
      style={{ flexShrink: 0 }}
    >
      {SORT_OPTIONS.map(o => (
        <TouchableOpacity
          key={o.key}
          style={[sb.pill, sort === o.key && sb.pillActive]}
          onPress={() => onChange(o.key)}
        >
          {sort === o.key && <TrendingUp size={12} color={COLORS.white} />}
          <Text style={[sb.pillText, sort === o.key && sb.pillTextActive]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const sb = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: COLORS.white, borderRadius: RADIUS.pill,
    borderWidth: 1, borderColor: COLORS.neutral[200], ...SHADOWS.small,
  },
  pillActive: { backgroundColor: COLORS.primary[700], borderColor: COLORS.primary[700] },
  pillText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
  pillTextActive: { color: COLORS.white, fontFamily: 'Inter-SemiBold' },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState<SortKey>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const scrollY = useRef(new RNAnimated.Value(0)).current;

  const headerBg = scrollY.interpolate({ inputRange: [80, 160], outputRange: ['rgba(18,27,51,0)', 'rgba(18,27,51,1)'], extrapolate: 'clamp' });
  const heroOpacity = scrollY.interpolate({ inputRange: [0, 140], outputRange: [1, 0], extrapolate: 'clamp' });
  const heroTranslate = scrollY.interpolate({ inputRange: [0, 160], outputRange: [0, -40], extrapolate: 'clamp' });

  const load = useCallback(async () => {
    try {
      console.log(`Loading category and products for ID: ${id}`);
      
      // Fetch categories and products in parallel
      const [cats, prods] = await Promise.all([
        mockApi.getCategories(),
        mockApi.getProductsByCategory(id),
      ]);
      
      // Find the category
      const foundCategory = cats.find(c => c.id === id);
      setCategory(foundCategory ?? null);
      
      // Filter out any invalid products
      const validProducts = prods.filter(p => p && p.id && p.id !== '0');
      setProducts(validProducts);
      setFiltered(validProducts);
      
      console.log(`Found ${validProducts.length} products for category ${id}`);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const applyFilters = useCallback((s?: SortKey) => {
    const activeSort = s ?? sort;
    let result = [...products];
    if (priceRange === 'low')  result = result.filter(p => p.price < 15000);
    if (priceRange === 'mid')  result = result.filter(p => p.price >= 15000 && p.price < 30000);
    if (priceRange === 'high') result = result.filter(p => p.price >= 30000);
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    if (inStockOnly)   result = result.filter(p => p.inStock);
    if (activeSort === 'price_low')  result.sort((a, b) => a.price - b.price);
    if (activeSort === 'price_high') result.sort((a, b) => b.price - a.price);
    if (activeSort === 'rating')     result.sort((a, b) => b.rating - a.rating);
    setFiltered(result);
  }, [products, priceRange, minRating, inStockOnly, sort]);

  const handleSort = (k: SortKey) => {
    setSort(k);
    applyFilters(k);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // Active filter count badge
  const activeFilters = (priceRange !== 'all' ? 1 : 0) + (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0);

  const avgRating = products.length
    ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1)
    : '0';

  return (
    <View style={styles.container}>

      {/* ── Floating header (fades in on scroll) ── */}
      <RNAnimated.View style={[styles.floatingHeader, { paddingTop: insets.top + 6, backgroundColor: headerBg as any }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.white} size={22} />
        </TouchableOpacity>
        <RNAnimated.Text style={styles.floatingTitle} numberOfLines={1}>
          {category?.name ?? 'Category'}
        </RNAnimated.Text>
        <TouchableOpacity style={styles.filterBtnFloat} onPress={() => setShowFilter(true)}>
          <SlidersHorizontal color={COLORS.white} size={20} />
          {activeFilters > 0 && (
            <View style={styles.filterDot}>
              <Text style={styles.filterDotText}>{activeFilters}</Text>
            </View>
          )}
        </TouchableOpacity>
      </RNAnimated.View>

      <RNAnimated.FlatList
        data={loading ? [] : filtered}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        showsVerticalScrollIndicator={false}
        onScroll={RNAnimated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold[400]} />}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={
          <>
            {/* ── Hero banner ── */}
            <RNAnimated.View style={[styles.hero, { opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }]}>
              {loading ? (
                <Skeleton width="100%" height={260} />
              ) : (
                <Image source={{ uri: category?.image }} style={styles.heroImage} />
              )}
              <View style={styles.heroOverlay} />
              {!loading && category && (
                <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.heroContent}>
                  <View style={styles.heroCategoryBadge}>
                    <Text style={styles.heroCategoryText}>COLLECTION</Text>
                  </View>
                  <Text style={styles.heroTitle}>{category.name}</Text>
                  <View style={styles.heroStats}>
                    <View style={styles.heroStat}>
                      <Package color={COLORS.gold[300]} size={14} />
                      <Text style={styles.heroStatText}>{products.length} Products</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStat}>
                      <Star color={COLORS.gold[300]} size={14} fill={COLORS.gold[300]} />
                      <Text style={styles.heroStatText}>{avgRating} Avg Rating</Text>
                    </View>
                  </View>
                </Animated.View>
              )}
            </RNAnimated.View>

            {/* ── Toolbar row ── */}
            <View style={styles.toolbar}>
              <View style={{ flex: 1 }}>
                <SortBar sort={sort} onChange={handleSort} />
              </View>
              <View style={styles.toolbarRight}>
                <TouchableOpacity
                  style={[styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive]}
                  onPress={() => setViewMode('grid')}
                >
                  <LayoutGrid size={17} color={viewMode === 'grid' ? COLORS.white : COLORS.neutral[500]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
                  onPress={() => setViewMode('list')}
                >
                  <List size={17} color={viewMode === 'list' ? COLORS.white : COLORS.neutral[500]} />
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Results count + filter button ── */}
            {!loading && (
              <Animated.View entering={FadeIn} style={styles.resultsRow}>
                <Text style={styles.resultsText}>
                  <Text style={styles.resultsCount}>{filtered.length}</Text> products found
                </Text>
                <TouchableOpacity style={styles.filterPill} onPress={() => setShowFilter(true)}>
                  <SlidersHorizontal size={14} color={activeFilters > 0 ? COLORS.white : COLORS.primary[600]} />
                  <Text style={[styles.filterPillText, activeFilters > 0 && { color: COLORS.white }]}>
                    Filters{activeFilters > 0 ? ` (${activeFilters})` : ''}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Skeleton grid */}
            {loading && (
              <View style={styles.skeletonGrid}>
                {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
              </View>
            )}
          </>
        }
        renderItem={({ item, index }) => {
          // Skip rendering invalid items
          if (!item || !item.id || item.id === '0') {
            return null;
          }
          
          return viewMode === 'list' ? (
            <View style={{ paddingHorizontal: SPACING.md }}>
              <ListCard product={item} index={index} />
            </View>
          ) : (
            <View style={styles.gridCell}>
              <ProductCard product={item} index={index} />
            </View>
          );
        }}
        keyExtractor={(item) => item.id || `item-${Math.random()}`}
        columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : undefined}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon={<SlidersHorizontal color={COLORS.neutral[400]} size={36} />}
              title="No products found"
              message="Try adjusting your filters"
            />
          ) : null
        }
      />

      {/* ── Filter bottom sheet ── */}
      <Modal visible={showFilter} animationType="slide" transparent statusBarTranslucent>
        <View style={fs.overlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowFilter(false)} />
          <View style={fs.sheet}>
            {/* Handle */}
            <View style={fs.handle} />

            {/* Header */}
            <View style={fs.header}>
              <View>
                <Text style={fs.title}>Filters & Sort</Text>
                {activeFilters > 0 && (
                  <Text style={fs.activeCount}>{activeFilters} filter{activeFilters > 1 ? 's' : ''} active</Text>
                )}
              </View>
              <View style={fs.headerActions}>
                {activeFilters > 0 && (
                  <TouchableOpacity style={fs.clearBtn} onPress={() => {
                    setPriceRange('all'); setMinRating(0); setInStockOnly(false);
                  }}>
                    <Text style={fs.clearText}>Clear all</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={fs.closeBtn} onPress={() => setShowFilter(false)}>
                  <X color={COLORS.neutral[600]} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Sort */}
              <View style={fs.section}>
                <Text style={fs.sectionTitle}>Sort By</Text>
                <View style={fs.chipRow}>
                  {([
                    { key: 'popular',    label: 'Most Popular' },
                    { key: 'price_low',  label: 'Price: Low → High' },
                    { key: 'price_high', label: 'Price: High → Low' },
                    { key: 'rating',     label: 'Top Rated' },
                  ] as const).map(s => (
                    <TouchableOpacity
                      key={s.key}
                      style={[fs.chip, sort === s.key && fs.chipActive]}
                      onPress={() => setSort(s.key)}
                    >
                      {sort === s.key && <Check size={13} color={COLORS.white} />}
                      <Text style={[fs.chipText, sort === s.key && fs.chipTextActive]}>{s.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range */}
              <View style={fs.section}>
                <Text style={fs.sectionTitle}>Price Range</Text>
                <View style={fs.chipRow}>
                  {([
                    { key: 'all',  label: 'All Prices' },
                    { key: 'low',  label: 'Under ₹15K' },
                    { key: 'mid',  label: '₹15K – ₹30K' },
                    { key: 'high', label: 'Above ₹30K' },
                  ] as const).map(p => (
                    <TouchableOpacity
                      key={p.key}
                      style={[fs.chip, priceRange === p.key && fs.chipActive]}
                      onPress={() => setPriceRange(p.key)}
                    >
                      {priceRange === p.key && <Check size={13} color={COLORS.white} />}
                      <Text style={[fs.chipText, priceRange === p.key && fs.chipTextActive]}>{p.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Rating */}
              <View style={fs.section}>
                <Text style={fs.sectionTitle}>Minimum Rating</Text>
                <View style={fs.ratingRow}>
                  {[0, 3, 4, 4.5].map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[fs.ratingBtn, minRating === r && fs.ratingBtnActive]}
                      onPress={() => setMinRating(r)}
                    >
                      {r > 0 && <Star size={13} color={minRating === r ? COLORS.white : COLORS.gold[500]} fill={minRating === r ? COLORS.white : COLORS.gold[500]} />}
                      <Text style={[fs.ratingText, minRating === r && fs.ratingTextActive]}>
                        {r === 0 ? 'All' : `${r}+`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Stock toggle */}
              <TouchableOpacity style={fs.toggleRow} onPress={() => setInStockOnly(v => !v)}>
                <View>
                  <Text style={fs.toggleLabel}>In Stock Only</Text>
                  <Text style={fs.toggleSub}>Show only available items</Text>
                </View>
                <View style={[fs.toggle, inStockOnly && fs.toggleActive]}>
                  <View style={[fs.toggleThumb, inStockOnly && fs.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            </ScrollView>

            <View style={fs.applyRow}>
              <Button
                onPress={() => { applyFilters(); setShowFilter(false); }}
                fullWidth size="lg"
              >
                Show {filtered.length} Results
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },

  // floating header
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md,
    paddingBottom: 12, gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
  },
  floatingTitle: {
    flex: 1, fontSize: 17, fontFamily: 'Inter-Bold', color: COLORS.white,
  },
  filterBtnFloat: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
  },
  filterDot: {
    position: 'absolute', top: -2, right: -2, width: 16, height: 16,
    borderRadius: 8, backgroundColor: COLORS.gold[400], justifyContent: 'center', alignItems: 'center',
  },
  filterDotText: { fontSize: 9, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },

  // hero
  hero: { height: 280, position: 'relative', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10,18,36,0.58)',
  },
  heroContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.lg, paddingBottom: SPACING.xl,
  },
  heroCategoryBadge: {
    alignSelf: 'flex-start', backgroundColor: COLORS.gold[400],
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 10,
  },
  heroCategoryText: { fontSize: 10, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], letterSpacing: 1 },
  heroTitle: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.white, lineHeight: 34 },
  heroStats: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 12 },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroStatText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[200] },
  heroStatDivider: { width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.3)' },

  // toolbar
  toolbar: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: SPACING.sm, paddingRight: SPACING.md,
    backgroundColor: COLORS.offWhite, gap: 8,
  },
  toolbarRight: { flexDirection: 'row', gap: 4 },
  viewBtn: {
    width: 36, height: 36, borderRadius: RADIUS.md,
    backgroundColor: COLORS.neutral[200], justifyContent: 'center', alignItems: 'center',
  },
  viewBtnActive: { backgroundColor: COLORS.primary[700] },

  // results bar
  resultsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm,
  },
  resultsText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  resultsCount: { fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  filterPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.pill, backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: COLORS.primary[200], ...SHADOWS.small,
  },
  filterPillText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600] },

  // grid
  columnWrapper: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  gridCell: { flex: 1 },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: SPACING.sm },
});

// ─── Filter sheet styles ──────────────────────────────────────────────────────
const fs = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,18,36,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '88%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.neutral[300], alignSelf: 'center', marginTop: 12,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100],
  },
  title: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  activeCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.primary[500], marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.lg, backgroundColor: COLORS.neutral[100] },
  clearText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600] },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center',
  },
  section: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  sectionTitle: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.neutral[800], marginBottom: SPACING.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: RADIUS.lg, backgroundColor: COLORS.neutral[100],
    borderWidth: 1, borderColor: COLORS.neutral[200],
  },
  chipActive: { backgroundColor: COLORS.primary[700], borderColor: COLORS.primary[700] },
  chipText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700] },
  chipTextActive: { color: COLORS.white },
  ratingRow: { flexDirection: 'row', gap: 10 },
  ratingBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 10, borderRadius: RADIUS.lg,
    backgroundColor: COLORS.neutral[100], borderWidth: 1, borderColor: COLORS.neutral[200],
  },
  ratingBtnActive: { backgroundColor: COLORS.primary[700], borderColor: COLORS.primary[700] },
  ratingText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[700] },
  ratingTextActive: { color: COLORS.white },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: SPACING.lg, marginTop: SPACING.lg,
    backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.xl, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.neutral[100],
  },
  toggleLabel: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  toggleSub: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  toggle: {
    width: 50, height: 28, borderRadius: 14,
    backgroundColor: COLORS.neutral[300], padding: 2, justifyContent: 'center',
  },
  toggleActive: { backgroundColor: COLORS.primary[700] },
  toggleThumb: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  toggleThumbActive: { alignSelf: 'flex-end' },
  applyRow: {
    padding: SPACING.lg, paddingBottom: 36,
    borderTopWidth: 1, borderTopColor: COLORS.neutral[100],
  },
});
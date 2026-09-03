// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
//   Dimensions, RefreshControl, FlatList, NativeScrollEvent, NativeSyntheticEvent,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import Animated, {
//   FadeIn, FadeInDown, FadeInRight,
//   useAnimatedStyle, useSharedValue, interpolate, Extrapolate,
// } from 'react-native-reanimated';
// import {
//   Search, Bell, Heart, MapPin, Mic, ChevronRight, Star,
//   Phone, MessageCircle, Mail, Sparkles, Award, Users, Clock, Shield,
//   ShoppingBag, TrendingUp,
// } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Category, Product } from '@/types';
// import { SectionHeader } from '@/components/ui/SectionHeader';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useAuth } from '@/store/auth';

// const { width } = Dimensions.get('window');

// // ─── Best‑Seller card ───────────────────────────────────────────────────────
// const RANK_COLORS = ['#D4A82E', '#8E9BAD', '#C07850'];
// const RANK_LABELS = ['#1 Best Seller', '#2 Top Rated', '#3 Popular'];

// function BestSellerCard({ product, rank, index }: { product: Product; rank: number; index: number }) {
//   const router = useRouter();
//   const { has, toggle } = useWishlist();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const isWishlisted = has(product.id);
//   const isGold = rank === 0;

//   const handleAdd = () => {
//     addItem({
//       id: `${product.id}_${Date.now()}`,
//       productId: product.id,
//       name: product.name,
//       image: product.images[0],
//       price: product.price,
//       quantity: 1,
//       type: 'product',
//     });
//     show('Added to cart');
//   };

//   return (
//     <Animated.View entering={FadeInRight.delay(index * 80).duration(400)}>
//       <TouchableOpacity
//         style={[bs.card, isGold && bs.cardGold]}
//         onPress={() => router.push(`/product/${product.id}`)}
//         activeOpacity={0.88}
//       >
//         {/* Rank ribbon */}
//         <View style={[bs.rankRibbon, { backgroundColor: RANK_COLORS[rank] ?? COLORS.neutral[400] }]}>
//           <TrendingUp color={rank === 0 ? COLORS.neutral[900] : COLORS.white} size={11} />
//           <Text style={[bs.rankText, rank !== 0 && { color: COLORS.white }]}>
//             {RANK_LABELS[rank] ?? `#${rank + 1}`}
//           </Text>
//         </View>

//         {/* Image */}
//         <View style={bs.imageWrap}>
//           <Image source={{ uri: product.images[0] }} style={bs.image} />
//           <TouchableOpacity
//             style={bs.wishBtn}
//             onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Saved!', 'info'); }}
//           >
//             <Heart
//               size={14}
//               color={isWishlisted ? COLORS.error : COLORS.white}
//               fill={isWishlisted ? COLORS.error : 'transparent'}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Body */}
//         <View style={bs.body}>
//           <Text style={bs.category}>{product.categoryName}</Text>
//           <Text style={bs.name} numberOfLines={2}>{product.name}</Text>

//           {/* Rating row */}
//           <View style={bs.ratingRow}>
//             <View style={bs.stars}>
//               {[1, 2, 3, 4, 5].map(s => (
//                 <Star
//                   key={s} size={10}
//                   color={COLORS.gold[400]}
//                   fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'}
//                 />
//               ))}
//             </View>
//             <Text style={bs.ratingVal}>{product.rating.toFixed(1)}</Text>
//             <Text style={bs.ratingCount}>({product.reviewCount})</Text>
//           </View>

//           {/* Sales indicator bar */}
//           <View style={bs.salesWrap}>
//             <Text style={bs.salesLabel}>Sales</Text>
//             <View style={bs.salesTrack}>
//               <Animated.View
//                 style={[
//                   bs.salesFill,
//                   {
//                     width: `${Math.min(100, 40 + rank * 0 + (product.reviewCount / 10))}%` as any,
//                     backgroundColor: RANK_COLORS[rank] ?? COLORS.primary[500],
//                   },
//                 ]}
//               />
//             </View>
//           </View>

//           {/* Price + CTA */}
//           <View style={bs.footer}>
//             <View>
//               <Text style={bs.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//               {product.originalPrice > product.price && (
//                 <Text style={bs.original}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//               )}
//             </View>
//             <TouchableOpacity style={[bs.addBtn, isGold && bs.addBtnGold]} onPress={handleAdd}>
//               <ShoppingBag size={14} color={isGold ? COLORS.neutral[900] : COLORS.white} />
//               <Text style={[bs.addText, isGold && { color: COLORS.neutral[900] }]}>Add</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// }

// const bs = StyleSheet.create({
//   card: {
//     width: 200,
//     marginRight: SPACING.md,
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.xxl,
//     overflow: 'hidden',
//     ...SHADOWS.medium,
//   },
//   cardGold: {
//     borderWidth: 1.5,
//     borderColor: COLORS.gold[300],
//   },
//   rankRibbon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     backgroundColor: COLORS.gold[400],
//   },
//   rankText: {
//     fontSize: 10,
//     fontFamily: 'Inter-Bold',
//     color: COLORS.neutral[900],
//     letterSpacing: 0.3,
//   },
//   imageWrap: { position: 'relative' },
//   image: { width: '100%', height: 140, resizeMode: 'cover' },
//   wishBtn: {
//     position: 'absolute', top: 8, right: 8,
//     width: 28, height: 28, borderRadius: 14,
//     backgroundColor: 'rgba(10,18,36,0.45)',
//     justifyContent: 'center', alignItems: 'center',
//   },
//   body: { padding: 12 },
//   category: {
//     fontSize: 10, fontFamily: 'Inter-Medium',
//     color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 0.5,
//   },
//   name: {
//     fontSize: 13, fontFamily: 'Inter-SemiBold',
//     color: COLORS.neutral[900], marginTop: 3, lineHeight: 17,
//   },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
//   stars: { flexDirection: 'row', gap: 1 },
//   ratingVal: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[800] },
//   ratingCount: { fontSize: 10, fontFamily: 'Inter-Regular', color: COLORS.neutral[400] },
//   salesWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
//   salesLabel: { fontSize: 9, fontFamily: 'Inter-Medium', color: COLORS.neutral[400], width: 28 },
//   salesTrack: {
//     flex: 1, height: 4, borderRadius: 2,
//     backgroundColor: COLORS.neutral[100], overflow: 'hidden',
//   },
//   salesFill: { height: '100%', borderRadius: 2 },
//   footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
//   price: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   original: {
//     fontSize: 10, fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[400], textDecorationLine: 'line-through', marginTop: 1,
//   },
//   addBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 4,
//     backgroundColor: COLORS.primary[700],
//     paddingVertical: 7, paddingHorizontal: 10,
//     borderRadius: RADIUS.md,
//   },
//   addBtnGold: { backgroundColor: COLORS.gold[400] },
//   addText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.white },
// });

// // ── Main screen ───────────────────────────────────────────────────────────────
// export default function HomeScreen() {
//   const router = useRouter();
//   const { state } = useAuth();
//   const { state: wishState } = useWishlist();
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [trending, setTrending] = useState<Product[]>([]);
//   const [bestSellers, setBestSellers] = useState<Product[]>([]);
//   const [newArrivals, setNewArrivals] = useState<Product[]>([]);
//   const [banners, setBanners] = useState<any[]>([]);
//   const [testimonials, setTestimonials] = useState<any[]>([]);
//   const [whyChoose, setWhyChoose] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [bannerIndex, setBannerIndex] = useState(0);
//   const bannerRef = useRef<FlatList>(null);

//   const loadData = useCallback(async () => {
//     const [cats, trend, best, newArr, bnr, tst, why] = await Promise.all([
//       mockApi.getCategories(),
//       mockApi.getTrending(),
//       mockApi.getBestSellers(),
//       mockApi.getNewArrivals(),
//       mockApi.getHeroBanners(),
//       mockApi.getTestimonials(),
//       mockApi.getWhyChooseUs(),
//     ]);
//     setCategories(cats.slice(0, 10));
//     setTrending(trend);
//     setBestSellers(best);
//     setNewArrivals(newArr);
//     setBanners(bnr);
//     setTestimonials(tst);
//     setWhyChoose(why);
//     setLoading(false);
//   }, []);

//   useEffect(() => { loadData(); }, [loadData]);

//   useEffect(() => {
//     if (banners.length === 0) return;
//     const timer = setInterval(() => {
//       setBannerIndex(prev => {
//         const next = (prev + 1) % banners.length;
//         bannerRef.current?.scrollToIndex({ index: next, animated: true });
//         return next;
//       });
//     }, 3500);
//     return () => clearInterval(timer);
//   }, [banners.length]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   }, [loadData]);

//   const scrollY = useSharedValue(0);
//   const headerStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(scrollY.value, [0, 100, 150], [0, 0.5, 1], Extrapolate.CLAMP),
//   }));

//   const iconMap: Record<string, any> = {
//     award: Award, users: Users, clock: Clock, shield: Shield, heart: Heart, phone: Phone,
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.stickyHeader, headerStyle]} />
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <View style={styles.locationWrap}>
//             <MapPin color={COLORS.primary[600]} size={16} />
//             <View>
//               <Text style={styles.locationLabel}>Deliver to</Text>
//               <Text style={styles.locationValue}>Bengaluru 560001</Text>
//             </View>
//           </View>
//           <View style={styles.headerActions}>
//             <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}>
//               <Bell color={COLORS.neutral[700]} size={22} />
//               <View style={styles.notifDot} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/wishlist')}>
//               <Heart color={COLORS.neutral[700]} size={22} />
//               {wishState.productIds.length > 0 && <View style={styles.notifDot} />}
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
//               <Image
//                 source={{ uri: state.user?.avatar || 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=200' }}
//                 style={styles.avatar}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')} activeOpacity={0.9}>
//           <Search color={COLORS.neutral[400]} size={20} />
//           <Text style={styles.searchPlaceholder}>Search for decorations, packages...</Text>
//           <View style={styles.micBtn}><Mic color={COLORS.white} size={18} /></View>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         onScroll={e => { scrollY.value = e.nativeEvent.contentOffset.y; }}
//         scrollEventThrottle={16}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
//       >
//         {/* Hero Banner */}
//         {loading ? (
//           <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.md }}>
//             <Skeleton width="100%" height={200} radius={RADIUS.xxl} />
//           </View>
//         ) : (
//           <View style={styles.bannerWrap}>
//             <FlatList
//               ref={bannerRef}
//               data={banners}
//               horizontal pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={e => setBannerIndex(Math.round(e.nativeEvent.contentOffset.x / (width - SPACING.md * 2)))}
//               scrollEventThrottle={16}
//               keyExtractor={item => item.id}
//               renderItem={({ item }) => (
//                 <View style={styles.banner}>
//                   <Image source={{ uri: item.image }} style={styles.bannerImage} />
//                   <View style={styles.bannerOverlay} />
//                   <View style={styles.bannerContent}>
//                     <Text style={styles.bannerTitle}>{item.title}</Text>
//                     <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
//                     <TouchableOpacity style={styles.bannerCta} onPress={() => router.push('/package-list')}>
//                       <Text style={styles.bannerCtaText}>{item.cta}</Text>
//                       <ChevronRight color={COLORS.neutral[900]} size={16} />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//             />
//             <View style={styles.bannerDots}>
//               {banners.map((_, i) => (
//                 <View key={i} style={[styles.bannerDot, i === bannerIndex && styles.bannerDotActive]} />
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Shop by Category */}
//         <View style={styles.section}>
//           <SectionHeader title="Shop by Category" subtitle="Explore our collections" onSeeAll={() => router.push('/(tabs)/categories')} />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {[1, 2, 3, 4, 5].map(i => (
//                 <View key={i} style={{ marginHorizontal: 8 }}>
//                   <Skeleton width={72} height={72} radius={36} />
//                   <Skeleton width={60} height={10} style={{ marginTop: 8 }} />
//                 </View>
//               ))}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {categories.map((cat, i) => (
//                 <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => router.push(`/category/${cat.id}`)} activeOpacity={0.8}>
//                   <Animated.View entering={FadeIn.delay(i * 40)} style={styles.categoryCircle}>
//                     <Image source={{ uri: cat.image }} style={styles.categoryImage} />
//                   </Animated.View>
//                   <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           )}
//         </View>

//         {/* Trending */}
//         <View style={styles.section}>
//           <SectionHeader title="Trending Now" subtitle="Most popular this week" onSeeAll={() => router.push('/(tabs)/categories')} />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//             </ScrollView>
//           )}
//         </View>

//         {/* Featured Event Packages */}
//         <View style={styles.section}>
//           <SectionHeader title="Event Packages" subtitle="Complete solutions for your events" onSeeAll={() => router.push('/package-list')} />
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//             {loading
//               ? [1, 2, 3].map(i => <Skeleton key={i} width={280} height={200} radius={RADIUS.xxl} style={{ marginRight: SPACING.md }} />)
//               : <PackageBanner />}
//           </ScrollView>
//         </View>

//         {/* ── BEST SELLERS ─────────────────────────────────────── */}
//         <View style={styles.section}>
//           {/* Section header with crown accent */}
//           <View style={styles.bsHeaderWrap}>
//             <View style={styles.bsHeaderLeft}>
//               <View style={styles.bsCrown}>
//                 <Star size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//               </View>
//               <View>
//                 <Text style={styles.bsTitle}>Best Sellers</Text>
//                 <Text style={styles.bsSubtitle}>Top picks by our customers</Text>
//               </View>
//             </View>
//             <TouchableOpacity style={styles.bsSeeAll} onPress={() => router.push('/(tabs)/categories')}>
//               <Text style={styles.bsSeeAllText}>See All</Text>
//               <ChevronRight size={15} color={COLORS.gold[500]} />
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => (
//                 <View key={i} style={{ width: 200, marginRight: SPACING.md }}>
//                   <Skeleton width="100%" height={300} radius={RADIUS.xxl} />
//                 </View>
//               ))}
//             </ScrollView>
//           ) : (
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 4 }}
//             >
//               {bestSellers.slice(0, 6).map((p, i) => (
//                 <BestSellerCard key={p.id} product={p} rank={i} index={i} />
//               ))}
//             </ScrollView>
//           )}
//         </View>

//         {/* New Arrivals */}
//         <View style={styles.section}>
//           <SectionHeader title="New Arrivals" subtitle="Fresh additions to our collection" />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//             </ScrollView>
//           )}
//         </View>

//         {/* Why Choose Us */}
//         <View style={styles.section}>
//           <SectionHeader title="Why Choose Super Tent House" subtitle="Trusted by 10,000+ customers" />
//           <View style={styles.whyGrid}>
//             {whyChoose.map((item, i) => {
//               const Icon = iconMap[item.icon] || Sparkles;
//               return (
//                 <Animated.View key={item.id} entering={FadeInDown.delay(i * 60)} style={styles.whyCard}>
//                   <View style={styles.whyIconWrap}><Icon color={COLORS.gold[500]} size={24} /></View>
//                   <Text style={styles.whyTitle}>{item.title}</Text>
//                   <Text style={styles.whyDesc}>{item.description}</Text>
//                 </Animated.View>
//               );
//             })}
//           </View>
//         </View>

//         {/* Testimonials */}
//         <View style={styles.section}>
//           <SectionHeader title="Customer Testimonials" subtitle="What our customers say" />
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//             {testimonials.map((t, i) => (
//               <Animated.View key={t.id} entering={FadeIn.delay(i * 80)} style={styles.testimonialCard}>
//                 <View style={styles.testStars}>
//                   {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />)}
//                 </View>
//                 <Text style={styles.testText}>"{t.text}"</Text>
//                 <View style={styles.testUser}>
//                   <Image source={{ uri: t.avatar }} style={styles.testAvatar} />
//                   <View>
//                     <Text style={styles.testName}>{t.name}</Text>
//                     <Text style={styles.testEvent}>{t.event}</Text>
//                   </View>
//                 </View>
//               </Animated.View>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Contact Us */}
//         <View style={styles.section}>
//           <View style={styles.contactCard}>
//             <Text style={styles.contactTitle}>Need Help?</Text>
//             <Text style={styles.contactSubtitle}>Our team is available 24/7 to assist you</Text>
//             <View style={styles.contactRow}>
//               <TouchableOpacity style={styles.contactBtn}>
//                 <Phone color={COLORS.white} size={20} />
//                 <Text style={styles.contactBtnText}>Call Now</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.contactBtnGreen}>
//                 <MessageCircle color={COLORS.white} size={20} />
//                 <Text style={styles.contactBtnText}>WhatsApp</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.contactBtnGold} onPress={() => router.push('/support')}>
//                 <Mail color={COLORS.neutral[900]} size={20} />
//                 <Text style={styles.contactBtnTextDark}>Email</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// }

// // ── PackageBanner sub-component ───────────────────────────────────────────────
// function PackageBanner() {
//   const router = useRouter();
//   const [pkgs, setPkgs] = useState<any[]>([]);
//   useEffect(() => { mockApi.getPackages().then(setPkgs); }, []);
//   return (
//     <>
//       {pkgs.map(pk => (
//         <TouchableOpacity key={pk.id} style={styles.pkgCard} onPress={() => router.push(`/package/${pk.id}`)} activeOpacity={0.9}>
//           <Image source={{ uri: pk.image }} style={styles.pkgImage} />
//           <View style={styles.pkgOverlay} />
//           <View style={styles.pkgContent}>
//             <View style={styles.pkgTierBadge}><Text style={styles.pkgTierText}>{pk.tier}</Text></View>
//             <Text style={styles.pkgName}>{pk.name}</Text>
//             <Text style={styles.pkgGuests}>Up to {pk.guestCapacity} guests</Text>
//             <View style={styles.pkgPriceRow}>
//               <Text style={styles.pkgPrice}>₹{pk.price.toLocaleString('en-IN')}</Text>
//               {pk.originalPrice > pk.price && <Text style={styles.pkgOriginal}>₹{pk.originalPrice.toLocaleString('en-IN')}</Text>}
//             </View>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </>
//   );
// }

// // ── Styles ────────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 130, backgroundColor: COLORS.white, zIndex: 1 },
//   header: { paddingHorizontal: SPACING.md, paddingTop: 50, paddingBottom: SPACING.sm, zIndex: 2 },
//   headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
//   locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   locationLabel: { fontSize: 10, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' },
//   locationValue: { fontSize: 13, color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold' },
//   headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
//   iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
//   avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.gold[400] },
//   searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, height: 52, borderWidth: 1, borderColor: COLORS.neutral[200], ...SHADOWS.small },
//   searchPlaceholder: { flex: 1, fontSize: 14, color: COLORS.neutral[400], fontFamily: 'Inter-Regular', marginLeft: SPACING.sm },
//   micBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary[700], justifyContent: 'center', alignItems: 'center' },
//   bannerWrap: { marginTop: SPACING.md, paddingHorizontal: SPACING.md },
//   banner: { width: width - SPACING.md * 2, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md },
//   bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.5)' },
//   bannerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
//   bannerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.white },
//   bannerSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[200], marginTop: 4 },
//   bannerCta: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.gold[400], paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.lg, alignSelf: 'flex-start', marginTop: SPACING.md },
//   bannerCtaText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: SPACING.sm },
//   bannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.neutral[300] },
//   bannerDotActive: { width: 20, backgroundColor: COLORS.primary[700] },
//   section: { marginTop: SPACING.xl },
//   categoryItem: { alignItems: 'center', marginRight: SPACING.md, width: 80 },
//   categoryCircle: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.gold[200], ...SHADOWS.small },
//   categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   categoryName: { fontSize: 11, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginTop: 6, textAlign: 'center', lineHeight: 14 },
//   // Best sellers header
//   bsHeaderWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
//   bsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   bsCrown: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.gold[50], borderWidth: 1.5, borderColor: COLORS.gold[200], justifyContent: 'center', alignItems: 'center' },
//   bsTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   bsSubtitle: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 1 },
//   bsSeeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
//   bsSeeAllText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.gold[500] },
//   // grid (kept for potential use)
//   grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: SPACING.md },
//   whyGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: SPACING.md },
//   whyCard: { width: (width - SPACING.md * 3) / 2, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
//   whyIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.gold[50], justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
//   whyTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   whyDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4, lineHeight: 16 },
//   testimonialCard: { width: 280, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.lg, marginRight: SPACING.md, ...SHADOWS.small },
//   testStars: { flexDirection: 'row', gap: 2, marginBottom: SPACING.sm },
//   testText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[700], lineHeight: 20 },
//   testUser: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
//   testAvatar: { width: 40, height: 40, borderRadius: 20 },
//   testName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   testEvent: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.gold[500] },
//   contactCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.primary[800], borderRadius: RADIUS.xxl, padding: SPACING.xl, ...SHADOWS.large },
//   contactTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.white },
//   contactSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 4 },
//   contactRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
//   contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary[600], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnGreen: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.success, paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnGold: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.gold[400], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.white },
//   contactBtnTextDark: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   pkgCard: { width: 280, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md, ...SHADOWS.medium },
//   pkgImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   pkgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.55)' },
//   pkgContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
//   pkgTierBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.gold[400], paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 8 },
//   pkgTierText: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   pkgName: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.white },
//   pkgGuests: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 2 },
//   pkgPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
//   pkgPrice: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.gold[300] },
//   pkgOriginal: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
// });







// app/(tabs)/index.tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
//   Dimensions, RefreshControl, FlatList,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import Animated, {
//   FadeIn, FadeInDown, FadeInRight,
//   useAnimatedStyle, useSharedValue, interpolate, Extrapolate,
// } from 'react-native-reanimated';
// import {
//   Search, Bell, Heart, MapPin, Mic, ChevronRight, Star,
//   Phone, MessageCircle, Mail, Sparkles, Award, Users, Clock, Shield,
//   ShoppingBag, TrendingUp,
// } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Category, Product, HeroBanner } from '@/types';
// import { SectionHeader } from '@/components/ui/SectionHeader';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useAuth } from '@/store/auth';

// const { width } = Dimensions.get('window');

// // ─── Best‑Seller card ───────────────────────────────────────────────────────
// const RANK_COLORS = ['#D4A82E', '#8E9BAD', '#C07850'];
// const RANK_LABELS = ['#1 Best Seller', '#2 Top Rated', '#3 Popular'];

// function BestSellerCard({ product, rank, index }: { product: Product; rank: number; index: number }) {
//   const router = useRouter();
//   const { has, toggle } = useWishlist();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const isWishlisted = has(product.id);
//   const isGold = rank === 0;

//   const handleAdd = () => {
//     addItem({
//       id: `${product.id}_${Date.now()}`,
//       productId: product.id,
//       name: product.name,
//       image: product.images[0],
//       price: product.price,
//       quantity: 1,
//       type: 'product',
//     });
//     show('Added to cart');
//   };

//   return (
//     <Animated.View entering={FadeInRight.delay(index * 80).duration(400)}>
//       <TouchableOpacity
//         style={[bs.card, isGold && bs.cardGold]}
//         onPress={() => router.push(`/product/${product.id}`)}
//         activeOpacity={0.88}
//       >
//         <View style={[bs.rankRibbon, { backgroundColor: RANK_COLORS[rank] ?? COLORS.neutral[400] }]}>
//           <TrendingUp color={rank === 0 ? COLORS.neutral[900] : COLORS.white} size={11} />
//           <Text style={[bs.rankText, rank !== 0 && { color: COLORS.white }]}>
//             {RANK_LABELS[rank] ?? `#${rank + 1}`}
//           </Text>
//         </View>

//         <View style={bs.imageWrap}>
//           <Image source={{ uri: product.images[0] }} style={bs.image} />
//           <TouchableOpacity
//             style={bs.wishBtn}
//             onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Saved!', 'info'); }}
//           >
//             <Heart
//               size={14}
//               color={isWishlisted ? COLORS.error : COLORS.white}
//               fill={isWishlisted ? COLORS.error : 'transparent'}
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={bs.body}>
//           <Text style={bs.category}>{product.categoryName}</Text>
//           <Text style={bs.name} numberOfLines={2}>{product.name}</Text>

//           <View style={bs.ratingRow}>
//             <View style={bs.stars}>
//               {[1, 2, 3, 4, 5].map(s => (
//                 <Star
//                   key={s} size={10}
//                   color={COLORS.gold[400]}
//                   fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'}
//                 />
//               ))}
//             </View>
//             <Text style={bs.ratingVal}>{product.rating.toFixed(1)}</Text>
//             <Text style={bs.ratingCount}>({product.reviewCount})</Text>
//           </View>

//           <View style={bs.salesWrap}>
//             <Text style={bs.salesLabel}>Sales</Text>
//             <View style={bs.salesTrack}>
//               <Animated.View
//                 style={[
//                   bs.salesFill,
//                   {
//                     width: `${Math.min(100, 40 + rank * 0 + (product.reviewCount / 10))}%` as any,
//                     backgroundColor: RANK_COLORS[rank] ?? COLORS.primary[500],
//                   },
//                 ]}
//               />
//             </View>
//           </View>

//           <View style={bs.footer}>
//             <View>
//               <Text style={bs.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//               {product.originalPrice > product.price && (
//                 <Text style={bs.original}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//               )}
//             </View>
//             <TouchableOpacity style={[bs.addBtn, isGold && bs.addBtnGold]} onPress={handleAdd}>
//               <ShoppingBag size={14} color={isGold ? COLORS.neutral[900] : COLORS.white} />
//               <Text style={[bs.addText, isGold && { color: COLORS.neutral[900] }]}>Add</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// }

// const bs = StyleSheet.create({
//   card: {
//     width: 200,
//     marginRight: SPACING.md,
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.xxl,
//     overflow: 'hidden',
//     ...SHADOWS.medium,
//   },
//   cardGold: {
//     borderWidth: 1.5,
//     borderColor: COLORS.gold[300],
//   },
//   rankRibbon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     backgroundColor: COLORS.gold[400],
//   },
//   rankText: {
//     fontSize: 10,
//     fontFamily: 'Inter-Bold',
//     color: COLORS.neutral[900],
//     letterSpacing: 0.3,
//   },
//   imageWrap: { position: 'relative' },
//   image: { width: '100%', height: 140, resizeMode: 'cover' },
//   wishBtn: {
//     position: 'absolute', top: 8, right: 8,
//     width: 28, height: 28, borderRadius: 14,
//     backgroundColor: 'rgba(10,18,36,0.45)',
//     justifyContent: 'center', alignItems: 'center',
//   },
//   body: { padding: 12 },
//   category: {
//     fontSize: 10, fontFamily: 'Inter-Medium',
//     color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 0.5,
//   },
//   name: {
//     fontSize: 13, fontFamily: 'Inter-SemiBold',
//     color: COLORS.neutral[900], marginTop: 3, lineHeight: 17,
//   },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
//   stars: { flexDirection: 'row', gap: 1 },
//   ratingVal: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[800] },
//   ratingCount: { fontSize: 10, fontFamily: 'Inter-Regular', color: COLORS.neutral[400] },
//   salesWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
//   salesLabel: { fontSize: 9, fontFamily: 'Inter-Medium', color: COLORS.neutral[400], width: 28 },
//   salesTrack: {
//     flex: 1, height: 4, borderRadius: 2,
//     backgroundColor: COLORS.neutral[100], overflow: 'hidden',
//   },
//   salesFill: { height: '100%', borderRadius: 2 },
//   footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
//   price: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   original: {
//     fontSize: 10, fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[400], textDecorationLine: 'line-through', marginTop: 1,
//   },
//   addBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 4,
//     backgroundColor: COLORS.primary[700],
//     paddingVertical: 7, paddingHorizontal: 10,
//     borderRadius: RADIUS.md,
//   },
//   addBtnGold: { backgroundColor: COLORS.gold[400] },
//   addText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.white },
// });

// // ── Main screen ───────────────────────────────────────────────────────────────
// export default function HomeScreen() {
//   const router = useRouter();
//   const { state } = useAuth();
//   const { state: wishState } = useWishlist();
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [trending, setTrending] = useState<Product[]>([]);
//   const [bestSellers, setBestSellers] = useState<Product[]>([]);
//   const [newArrivals, setNewArrivals] = useState<Product[]>([]);
//   const [banners, setBanners] = useState<HeroBanner[]>([]);
//   const [testimonials, setTestimonials] = useState<any[]>([]);
//   const [whyChoose, setWhyChoose] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [bannerIndex, setBannerIndex] = useState(0);
//   const bannerRef = useRef<FlatList>(null);

//   const loadData = useCallback(async () => {
//     const [cats, trend, best, newArr, bnr, tst, why] = await Promise.all([
//       mockApi.getCategories(),
//       mockApi.getTrending(),
//       mockApi.getBestSellers(),
//       mockApi.getNewArrivals(),
//       mockApi.getHeroBanners(),
//       mockApi.getTestimonials(),
//       mockApi.getWhyChooseUs(),
//     ]);
//     setCategories(cats.slice(0, 10));
//     setTrending(trend);
//     setBestSellers(best);
//     setNewArrivals(newArr);
//     setBanners(bnr || []);
//     setTestimonials(tst);
//     setWhyChoose(why);
//     setLoading(false);
//   }, []);

//   useEffect(() => { loadData(); }, [loadData]);

//   useEffect(() => {
//     if (banners.length === 0) return;
//     const timer = setInterval(() => {
//       setBannerIndex(prev => {
//         const next = (prev + 1) % banners.length;
//         bannerRef.current?.scrollToIndex({ index: next, animated: true });
//         return next;
//       });
//     }, 4000);
//     return () => clearInterval(timer);
//   }, [banners.length]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   }, [loadData]);

//   const scrollY = useSharedValue(0);
//   const headerStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(scrollY.value, [0, 100, 150], [0, 0.5, 1], Extrapolate.CLAMP),
//   }));

//   const iconMap: Record<string, any> = {
//     award: Award, users: Users, clock: Clock, shield: Shield, heart: Heart, phone: Phone,
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.stickyHeader, headerStyle]} />
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <View style={styles.locationWrap}>
//             <MapPin color={COLORS.primary[600]} size={16} />
//             <View>
//               <Text style={styles.locationLabel}>Deliver to</Text>
//               <Text style={styles.locationValue}>Bengaluru 560001</Text>
//             </View>
//           </View>
//           <View style={styles.headerActions}>
//             <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}>
//               <Bell color={COLORS.neutral[700]} size={22} />
//               <View style={styles.notifDot} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/wishlist')}>
//               <Heart color={COLORS.neutral[700]} size={22} />
//               {wishState.productIds.length > 0 && <View style={styles.notifDot} />}
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
//               <Image
//                 source={{ uri: state.user?.avatar || 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=200' }}
//                 style={styles.avatar}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')} activeOpacity={0.9}>
//           <Search color={COLORS.neutral[400]} size={20} />
//           <Text style={styles.searchPlaceholder}>Search for decorations, packages...</Text>
//           <View style={styles.micBtn}><Mic color={COLORS.white} size={18} /></View>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         onScroll={e => { scrollY.value = e.nativeEvent.contentOffset.y; }}
//         scrollEventThrottle={16}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
//       >
//         {/* Hero Banner */}
//         {loading ? (
//           <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.md }}>
//             <Skeleton width="100%" height={200} radius={RADIUS.xxl} />
//           </View>
//         ) : banners.length > 0 ? (
//           <View style={styles.bannerWrap}>
//             <FlatList
//               ref={bannerRef}
//               data={banners}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={e => {
//                 const offset = e.nativeEvent.contentOffset.x;
//                 const index = Math.round(offset / (width - SPACING.md * 2));
//                 setBannerIndex(index);
//               }}
//               scrollEventThrottle={16}
//               keyExtractor={item => item.id}
//               renderItem={({ item }) => (
//                 <View style={styles.banner}>
//                   <Image source={{ uri: item.image }} style={styles.bannerImage} />
//                   <View style={styles.bannerOverlay} />
//                   <View style={styles.bannerContent}>
//                     <Text style={styles.bannerTitle}>{item.title}</Text>
//                     <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
//                     <TouchableOpacity 
//                       style={styles.bannerCta} 
//                       onPress={() => {
//                         if (item.ctaLink && item.ctaLink !== '/') {
//                           router.push(item.ctaLink);
//                         } else {
//                           router.push('/package-list');
//                         }
//                       }}
//                     >
//                       <Text style={styles.bannerCtaText}>{item.cta}</Text>
//                       <ChevronRight color={COLORS.neutral[900]} size={16} />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//             />
//             <View style={styles.bannerDots}>
//               {banners.map((_, i) => (
//                 <View key={i} style={[styles.bannerDot, i === bannerIndex && styles.bannerDotActive]} />
//               ))}
//             </View>
//           </View>
//         ) : null}

//         {/* Shop by Category */}
//         <View style={styles.section}>
//           <SectionHeader title="Shop by Category" subtitle="Explore our collections" onSeeAll={() => router.push('/(tabs)/categories')} />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {[1, 2, 3, 4, 5].map(i => (
//                 <View key={i} style={{ marginHorizontal: 8 }}>
//                   <Skeleton width={72} height={72} radius={36} />
//                   <Skeleton width={60} height={10} style={{ marginTop: 8 }} />
//                 </View>
//               ))}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {categories.map((cat, i) => (
//                 <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => router.push(`/category/${cat.id}`)} activeOpacity={0.8}>
//                   <Animated.View entering={FadeIn.delay(i * 40)} style={styles.categoryCircle}>
//                     <Image source={{ uri: cat.image }} style={styles.categoryImage} />
//                   </Animated.View>
//                   <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           )}
//         </View>

//         {/* Trending */}
//         <View style={styles.section}>
//           <SectionHeader title="Trending Now" subtitle="Most popular this week" onSeeAll={() => router.push('/(tabs)/categories')} />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//             </ScrollView>
//           )}
//         </View>

//         {/* Featured Event Packages */}
//         <View style={styles.section}>
//           <SectionHeader title="Event Packages" subtitle="Complete solutions for your events" onSeeAll={() => router.push('/package-list')} />
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//             {loading
//               ? [1, 2, 3].map(i => <Skeleton key={i} width={280} height={200} radius={RADIUS.xxl} style={{ marginRight: SPACING.md }} />)
//               : <PackageBanner />}
//           </ScrollView>
//         </View>

//         {/* Best Sellers */}
//         <View style={styles.section}>
//           <View style={styles.bsHeaderWrap}>
//             <View style={styles.bsHeaderLeft}>
//               <View style={styles.bsCrown}>
//                 <Star size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//               </View>
//               <View>
//                 <Text style={styles.bsTitle}>Best Sellers</Text>
//                 <Text style={styles.bsSubtitle}>Top picks by our customers</Text>
//               </View>
//             </View>
//             <TouchableOpacity style={styles.bsSeeAll} onPress={() => router.push('/(tabs)/categories')}>
//               <Text style={styles.bsSeeAllText}>See All</Text>
//               <ChevronRight size={15} color={COLORS.gold[500]} />
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => (
//                 <View key={i} style={{ width: 200, marginRight: SPACING.md }}>
//                   <Skeleton width="100%" height={300} radius={RADIUS.xxl} />
//                 </View>
//               ))}
//             </ScrollView>
//           ) : (
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 4 }}
//             >
//               {bestSellers.slice(0, 6).map((p, i) => (
//                 <BestSellerCard key={p.id} product={p} rank={i} index={i} />
//               ))}
//             </ScrollView>
//           )}
//         </View>

//         {/* New Arrivals */}
//         <View style={styles.section}>
//           <SectionHeader title="New Arrivals" subtitle="Fresh additions to our collection" />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//             </ScrollView>
//           )}
//         </View>

//         {/* Why Choose Us */}
//         <View style={styles.section}>
//           <SectionHeader title="Why Choose Super Tent House" subtitle="Trusted by 10,000+ customers" />
//           <View style={styles.whyGrid}>
//             {whyChoose.map((item, i) => {
//               const Icon = iconMap[item.icon] || Sparkles;
//               return (
//                 <Animated.View key={item.id} entering={FadeInDown.delay(i * 60)} style={styles.whyCard}>
//                   <View style={styles.whyIconWrap}><Icon color={COLORS.gold[500]} size={24} /></View>
//                   <Text style={styles.whyTitle}>{item.title}</Text>
//                   <Text style={styles.whyDesc}>{item.description}</Text>
//                 </Animated.View>
//               );
//             })}
//           </View>
//         </View>

//         {/* Testimonials */}
//         <View style={styles.section}>
//           <SectionHeader title="Customer Testimonials" subtitle="What our customers say" />
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//             {testimonials.map((t, i) => (
//               <Animated.View key={t.id} entering={FadeIn.delay(i * 80)} style={styles.testimonialCard}>
//                 <View style={styles.testStars}>
//                   {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />)}
//                 </View>
//                 <Text style={styles.testText}>"{t.text}"</Text>
//                 <View style={styles.testUser}>
//                   <Image source={{ uri: t.avatar }} style={styles.testAvatar} />
//                   <View>
//                     <Text style={styles.testName}>{t.name}</Text>
//                     <Text style={styles.testEvent}>{t.event}</Text>
//                   </View>
//                 </View>
//               </Animated.View>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Contact Us */}
//         <View style={styles.section}>
//           <View style={styles.contactCard}>
//             <Text style={styles.contactTitle}>Need Help?</Text>
//             <Text style={styles.contactSubtitle}>Our team is available 24/7 to assist you</Text>
//             <View style={styles.contactRow}>
//               <TouchableOpacity style={styles.contactBtn}>
//                 <Phone color={COLORS.white} size={20} />
//                 <Text style={styles.contactBtnText}>Call Now</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.contactBtnGreen}>
//                 <MessageCircle color={COLORS.white} size={20} />
//                 <Text style={styles.contactBtnText}>WhatsApp</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.contactBtnGold} onPress={() => router.push('/support')}>
//                 <Mail color={COLORS.neutral[900]} size={20} />
//                 <Text style={styles.contactBtnTextDark}>Email</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// }

// // ── PackageBanner sub-component ───────────────────────────────────────────────
// function PackageBanner() {
//   const router = useRouter();
//   const [pkgs, setPkgs] = useState<any[]>([]);
//   useEffect(() => { mockApi.getPackages().then(setPkgs); }, []);
//   return (
//     <>
//       {pkgs.map(pk => (
//         <TouchableOpacity key={pk.id} style={styles.pkgCard} onPress={() => router.push(`/package/${pk.id}`)} activeOpacity={0.9}>
//           <Image source={{ uri: pk.image }} style={styles.pkgImage} />
//           <View style={styles.pkgOverlay} />
//           <View style={styles.pkgContent}>
//             <View style={styles.pkgTierBadge}><Text style={styles.pkgTierText}>{pk.tier}</Text></View>
//             <Text style={styles.pkgName}>{pk.name}</Text>
//             <Text style={styles.pkgGuests}>Up to {pk.guestCapacity} guests</Text>
//             <View style={styles.pkgPriceRow}>
//               <Text style={styles.pkgPrice}>₹{pk.price.toLocaleString('en-IN')}</Text>
//               {pk.originalPrice > pk.price && <Text style={styles.pkgOriginal}>₹{pk.originalPrice.toLocaleString('en-IN')}</Text>}
//             </View>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 130, backgroundColor: COLORS.white, zIndex: 1 },
//   header: { paddingHorizontal: SPACING.md, paddingTop: 50, paddingBottom: SPACING.sm, zIndex: 2 },
//   headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
//   locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   locationLabel: { fontSize: 10, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' },
//   locationValue: { fontSize: 13, color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold' },
//   headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
//   iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
//   avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.gold[400] },
//   searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, height: 52, borderWidth: 1, borderColor: COLORS.neutral[200], ...SHADOWS.small },
//   searchPlaceholder: { flex: 1, fontSize: 14, color: COLORS.neutral[400], fontFamily: 'Inter-Regular', marginLeft: SPACING.sm },
//   micBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary[700], justifyContent: 'center', alignItems: 'center' },
//   bannerWrap: { marginTop: SPACING.md, paddingHorizontal: SPACING.md },
//   banner: { width: width - SPACING.md * 2, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md },
//   bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.5)' },
//   bannerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
//   bannerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.white },
//   bannerSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[200], marginTop: 4 },
//   bannerCta: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.gold[400], paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.lg, alignSelf: 'flex-start', marginTop: SPACING.md },
//   bannerCtaText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: SPACING.sm },
//   bannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.neutral[300] },
//   bannerDotActive: { width: 20, backgroundColor: COLORS.primary[700] },
//   section: { marginTop: SPACING.xl },
//   categoryItem: { alignItems: 'center', marginRight: SPACING.md, width: 80 },
//   categoryCircle: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.gold[200], ...SHADOWS.small },
//   categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   categoryName: { fontSize: 11, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginTop: 6, textAlign: 'center', lineHeight: 14 },
//   bsHeaderWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
//   bsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   bsCrown: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.gold[50], borderWidth: 1.5, borderColor: COLORS.gold[200], justifyContent: 'center', alignItems: 'center' },
//   bsTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   bsSubtitle: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 1 },
//   bsSeeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
//   bsSeeAllText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.gold[500] },
//   whyGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: SPACING.md },
//   whyCard: { width: (width - SPACING.md * 3) / 2, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
//   whyIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.gold[50], justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
//   whyTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   whyDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4, lineHeight: 16 },
//   testimonialCard: { width: 280, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.lg, marginRight: SPACING.md, ...SHADOWS.small },
//   testStars: { flexDirection: 'row', gap: 2, marginBottom: SPACING.sm },
//   testText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[700], lineHeight: 20 },
//   testUser: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
//   testAvatar: { width: 40, height: 40, borderRadius: 20 },
//   testName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   testEvent: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.gold[500] },
//   contactCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.primary[800], borderRadius: RADIUS.xxl, padding: SPACING.xl, ...SHADOWS.large },
//   contactTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.white },
//   contactSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 4 },
//   contactRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
//   contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary[600], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnGreen: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.success, paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnGold: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.gold[400], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.white },
//   contactBtnTextDark: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   pkgCard: { width: 280, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md, ...SHADOWS.medium },
//   pkgImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   pkgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.55)' },
//   pkgContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
//   pkgTierBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.gold[400], paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 8 },
//   pkgTierText: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   pkgName: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.white },
//   pkgGuests: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 2 },
//   pkgPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
//   pkgPrice: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.gold[300] },
//   pkgOriginal: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
// });





// app/(tabs)/index.tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
//   Dimensions, RefreshControl, FlatList,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import Animated, {
//   FadeIn, FadeInDown, FadeInRight,
//   useAnimatedStyle, useSharedValue, interpolate, Extrapolate,
// } from 'react-native-reanimated';
// import {
//   Search, Bell, Heart, MapPin, Mic, ChevronRight, Star,
//   Phone, MessageCircle, Mail, Sparkles, Award, Users, Clock, Shield,
//   ShoppingBag, TrendingUp,
// } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Category, Product, HeroBanner } from '@/types';
// import { SectionHeader } from '@/components/ui/SectionHeader';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useAuth } from '@/store/auth';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';

// const { width } = Dimensions.get('window');

// // ─── Best‑Seller card ───────────────────────────────────────────────────────
// const RANK_COLORS = ['#D4A82E', '#8E9BAD', '#C07850'];
// const RANK_LABELS = ['#1 Best Seller', '#2 Top Rated', '#3 Popular'];

// function BestSellerCard({ product, rank, index }: { product: Product; rank: number; index: number }) {
//   const router = useRouter();
//   const { has, toggle } = useWishlist();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const isWishlisted = has(product.id);
//   const isGold = rank === 0;

//   const handleAdd = () => {
//     addItem({
//       id: `${product.id}_${Date.now()}`,
//       productId: product.id,
//       name: product.name,
//       image: product.images[0],
//       price: product.price,
//       quantity: 1,
//       type: 'product',
//     });
//     show('Added to cart');
//   };

//   return (
//     <Animated.View entering={FadeInRight.delay(index * 80).duration(400)}>
//       <TouchableOpacity
//         style={[bs.card, isGold && bs.cardGold]}
//         onPress={() => router.push(`/product/${product.id}`)}
//         activeOpacity={0.88}
//       >
//         <View style={[bs.rankRibbon, { backgroundColor: RANK_COLORS[rank] ?? COLORS.neutral[400] }]}>
//           <TrendingUp color={rank === 0 ? COLORS.neutral[900] : COLORS.white} size={11} />
//           <Text style={[bs.rankText, rank !== 0 && { color: COLORS.white }]}>
//             {RANK_LABELS[rank] ?? `#${rank + 1}`}
//           </Text>
//         </View>

//         <View style={bs.imageWrap}>
//           <Image source={{ uri: product.images[0] }} style={bs.image} />
//           <TouchableOpacity
//             style={bs.wishBtn}
//             onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Saved!', 'info'); }}
//           >
//             <Heart
//               size={14}
//               color={isWishlisted ? COLORS.error : COLORS.white}
//               fill={isWishlisted ? COLORS.error : 'transparent'}
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={bs.body}>
//           <Text style={bs.category}>{product.categoryName}</Text>
//           <Text style={bs.name} numberOfLines={2}>{product.name}</Text>

//           <View style={bs.ratingRow}>
//             <View style={bs.stars}>
//               {[1, 2, 3, 4, 5].map(s => (
//                 <Star
//                   key={s} size={10}
//                   color={COLORS.gold[400]}
//                   fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'}
//                 />
//               ))}
//             </View>
//             <Text style={bs.ratingVal}>{product.rating.toFixed(1)}</Text>
//             <Text style={bs.ratingCount}>({product.reviewCount})</Text>
//           </View>

//           <View style={bs.salesWrap}>
//             <Text style={bs.salesLabel}>Sales</Text>
//             <View style={bs.salesTrack}>
//               <Animated.View
//                 style={[
//                   bs.salesFill,
//                   {
//                     width: `${Math.min(100, 40 + rank * 0 + (product.reviewCount / 10))}%` as any,
//                     backgroundColor: RANK_COLORS[rank] ?? COLORS.primary[500],
//                   },
//                 ]}
//               />
//             </View>
//           </View>

//           <View style={bs.footer}>
//             <View>
//               <Text style={bs.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//               {product.originalPrice > product.price && (
//                 <Text style={bs.original}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//               )}
//             </View>
//             <TouchableOpacity style={[bs.addBtn, isGold && bs.addBtnGold]} onPress={handleAdd}>
//               <ShoppingBag size={14} color={isGold ? COLORS.neutral[900] : COLORS.white} />
//               <Text style={[bs.addText, isGold && { color: COLORS.neutral[900] }]}>Add</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// }

// const bs = StyleSheet.create({
//   card: {
//     width: 200,
//     marginRight: SPACING.md,
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.xxl,
//     overflow: 'hidden',
//     ...SHADOWS.medium,
//   },
//   cardGold: {
//     borderWidth: 1.5,
//     borderColor: COLORS.gold[300],
//   },
//   rankRibbon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     backgroundColor: COLORS.gold[400],
//   },
//   rankText: {
//     fontSize: 10,
//     fontFamily: 'Inter-Bold',
//     color: COLORS.neutral[900],
//     letterSpacing: 0.3,
//   },
//   imageWrap: { position: 'relative' },
//   image: { width: '100%', height: 140, resizeMode: 'cover' },
//   wishBtn: {
//     position: 'absolute', top: 8, right: 8,
//     width: 28, height: 28, borderRadius: 14,
//     backgroundColor: 'rgba(10,18,36,0.45)',
//     justifyContent: 'center', alignItems: 'center',
//   },
//   body: { padding: 12 },
//   category: {
//     fontSize: 10, fontFamily: 'Inter-Medium',
//     color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 0.5,
//   },
//   name: {
//     fontSize: 13, fontFamily: 'Inter-SemiBold',
//     color: COLORS.neutral[900], marginTop: 3, lineHeight: 17,
//   },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
//   stars: { flexDirection: 'row', gap: 1 },
//   ratingVal: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[800] },
//   ratingCount: { fontSize: 10, fontFamily: 'Inter-Regular', color: COLORS.neutral[400] },
//   salesWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
//   salesLabel: { fontSize: 9, fontFamily: 'Inter-Medium', color: COLORS.neutral[400], width: 28 },
//   salesTrack: {
//     flex: 1, height: 4, borderRadius: 2,
//     backgroundColor: COLORS.neutral[100], overflow: 'hidden',
//   },
//   salesFill: { height: '100%', borderRadius: 2 },
//   footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
//   price: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   original: {
//     fontSize: 10, fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[400], textDecorationLine: 'line-through', marginTop: 1,
//   },
//   addBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 4,
//     backgroundColor: COLORS.primary[700],
//     paddingVertical: 7, paddingHorizontal: 10,
//     borderRadius: RADIUS.md,
//   },
//   addBtnGold: { backgroundColor: COLORS.gold[400] },
//   addText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.white },
// });

// // ── Main screen ───────────────────────────────────────────────────────────────
// export default function HomeScreen() {
//   const router = useRouter();
//   const { state } = useAuth();
//   const { state: wishState } = useWishlist();
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [trending, setTrending] = useState<Product[]>([]);
//   const [bestSellers, setBestSellers] = useState<Product[]>([]);
//   const [newArrivals, setNewArrivals] = useState<Product[]>([]);
//   const [banners, setBanners] = useState<HeroBanner[]>([]);
//   const [testimonials, setTestimonials] = useState<any[]>([]);
//   const [whyChoose, setWhyChoose] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [bannerIndex, setBannerIndex] = useState(0);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const bannerRef = useRef<FlatList>(null);
//   const customerId = state.user?.id;

//   // ─── Fetch unread notification count ──────────────────────────────────────
//   const fetchUnreadCount = useCallback(async () => {
//     if (!customerId) {
//       setUnreadCount(0);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE_URL}/notifications/${customerId}/unread-count`);
//       if (response.data.success) {
//         setUnreadCount(response.data.count);
//       }
//     } catch (error) {
//       console.error('Failed to fetch unread count:', error);
//     }
//   }, [customerId]);

//   useEffect(() => {
//     fetchUnreadCount();
//   }, [fetchUnreadCount]);

//   const loadData = useCallback(async () => {
//     const [cats, trend, best, newArr, bnr, tst, why] = await Promise.all([
//       mockApi.getCategories(),
//       mockApi.getTrending(),
//       mockApi.getBestSellers(),
//       mockApi.getNewArrivals(),
//       mockApi.getHeroBanners(),
//       mockApi.getTestimonials(),
//       mockApi.getWhyChooseUs(),
//     ]);
//     setCategories(cats.slice(0, 10));
//     setTrending(trend);
//     setBestSellers(best);
//     setNewArrivals(newArr);
//     setBanners(bnr || []);
//     setTestimonials(tst);
//     setWhyChoose(why);
//     setLoading(false);
//   }, []);

//   useEffect(() => { loadData(); }, [loadData]);

//   useEffect(() => {
//     if (banners.length === 0) return;
//     const timer = setInterval(() => {
//       setBannerIndex(prev => {
//         const next = (prev + 1) % banners.length;
//         bannerRef.current?.scrollToIndex({ index: next, animated: true });
//         return next;
//       });
//     }, 4000);
//     return () => clearInterval(timer);
//   }, [banners.length]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadData();
//     await fetchUnreadCount();
//     setRefreshing(false);
//   }, [loadData, fetchUnreadCount]);

//   const scrollY = useSharedValue(0);
//   const headerStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(scrollY.value, [0, 100, 150], [0, 0.5, 1], Extrapolate.CLAMP),
//   }));

//   const iconMap: Record<string, any> = {
//     award: Award, users: Users, clock: Clock, shield: Shield, heart: Heart, phone: Phone,
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.stickyHeader, headerStyle]} />
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <View style={styles.locationWrap}>
//             <MapPin color={COLORS.primary[600]} size={16} />
//             <View>
//               <Text style={styles.locationLabel}>Deliver to</Text>
//               <Text style={styles.locationValue}>Bengaluru 560001</Text>
//             </View>
//           </View>
//           <View style={styles.headerActions}>
//             <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}>
//               <Bell color={COLORS.neutral[700]} size={22} />
//               {unreadCount > 0 && (
//                 <View style={styles.notifBadge}>
//                   <Text style={styles.notifBadgeText}>
//                     {unreadCount > 9 ? '9+' : unreadCount}
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/wishlist')}>
//               <Heart color={COLORS.neutral[700]} size={22} />
//               {wishState.productIds.length > 0 && <View style={styles.notifDot} />}
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
//               <Image
//                 source={{ uri: state.user?.avatar || 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=200' }}
//                 style={styles.avatar}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')} activeOpacity={0.9}>
//           <Search color={COLORS.neutral[400]} size={20} />
//           <Text style={styles.searchPlaceholder}>Search for decorations, packages...</Text>
//           <View style={styles.micBtn}><Mic color={COLORS.white} size={18} /></View>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         onScroll={e => { scrollY.value = e.nativeEvent.contentOffset.y; }}
//         scrollEventThrottle={16}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
//       >
//         {/* Hero Banner */}
//         {loading ? (
//           <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.md }}>
//             <Skeleton width="100%" height={200} radius={RADIUS.xxl} />
//           </View>
//         ) : banners.length > 0 ? (
//           <View style={styles.bannerWrap}>
//             <FlatList
//               ref={bannerRef}
//               data={banners}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={e => {
//                 const offset = e.nativeEvent.contentOffset.x;
//                 const index = Math.round(offset / (width - SPACING.md * 2));
//                 setBannerIndex(index);
//               }}
//               scrollEventThrottle={16}
//               keyExtractor={item => item.id}
//               renderItem={({ item }) => (
//                 <View style={styles.banner}>
//                   <Image source={{ uri: item.image }} style={styles.bannerImage} />
//                   <View style={styles.bannerOverlay} />
//                   <View style={styles.bannerContent}>
//                     <Text style={styles.bannerTitle}>{item.title}</Text>
//                     <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
//                     <TouchableOpacity 
//                       style={styles.bannerCta} 
//                       onPress={() => {
//                         if (item.ctaLink && item.ctaLink !== '/') {
//                           router.push(item.ctaLink);
//                         } else {
//                           router.push('/package-list');
//                         }
//                       }}
//                     >
//                       <Text style={styles.bannerCtaText}>{item.cta}</Text>
//                       <ChevronRight color={COLORS.neutral[900]} size={16} />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//             />
//             <View style={styles.bannerDots}>
//               {banners.map((_, i) => (
//                 <View key={i} style={[styles.bannerDot, i === bannerIndex && styles.bannerDotActive]} />
//               ))}
//             </View>
//           </View>
//         ) : null}

//         {/* Shop by Category */}
//         <View style={styles.section}>
//           <SectionHeader title="Shop by Category" subtitle="Explore our collections" onSeeAll={() => router.push('/(tabs)/categories')} />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {[1, 2, 3, 4, 5].map(i => (
//                 <View key={i} style={{ marginHorizontal: 8 }}>
//                   <Skeleton width={72} height={72} radius={36} />
//                   <Skeleton width={60} height={10} style={{ marginTop: 8 }} />
//                 </View>
//               ))}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {categories.map((cat, i) => (
//                 <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => router.push(`/category/${cat.id}`)} activeOpacity={0.8}>
//                   <Animated.View entering={FadeIn.delay(i * 40)} style={styles.categoryCircle}>
//                     <Image source={{ uri: cat.image }} style={styles.categoryImage} />
//                   </Animated.View>
//                   <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           )}
//         </View>

//         {/* Trending */}
//         <View style={styles.section}>
//           <SectionHeader title="Trending Now" subtitle="Most popular this week" onSeeAll={() => router.push('/(tabs)/categories')} />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//             </ScrollView>
//           )}
//         </View>

//         {/* Featured Event Packages */}
//         <View style={styles.section}>
//           <SectionHeader title="Event Packages" subtitle="Complete solutions for your events" onSeeAll={() => router.push('/package-list')} />
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//             {loading
//               ? [1, 2, 3].map(i => <Skeleton key={i} width={280} height={200} radius={RADIUS.xxl} style={{ marginRight: SPACING.md }} />)
//               : <PackageBanner />}
//           </ScrollView>
//         </View>

//         {/* Best Sellers */}
//         <View style={styles.section}>
//           <View style={styles.bsHeaderWrap}>
//             <View style={styles.bsHeaderLeft}>
//               <View style={styles.bsCrown}>
//                 <Star size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//               </View>
//               <View>
//                 <Text style={styles.bsTitle}>Best Sellers</Text>
//                 <Text style={styles.bsSubtitle}>Top picks by our customers</Text>
//               </View>
//             </View>
//             <TouchableOpacity style={styles.bsSeeAll} onPress={() => router.push('/(tabs)/categories')}>
//               <Text style={styles.bsSeeAllText}>See All</Text>
//               <ChevronRight size={15} color={COLORS.gold[500]} />
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => (
//                 <View key={i} style={{ width: 200, marginRight: SPACING.md }}>
//                   <Skeleton width="100%" height={300} radius={RADIUS.xxl} />
//                 </View>
//               ))}
//             </ScrollView>
//           ) : (
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 4 }}
//             >
//               {bestSellers.slice(0, 6).map((p, i) => (
//                 <BestSellerCard key={p.id} product={p} rank={i} index={i} />
//               ))}
//             </ScrollView>
//           )}
//         </View>

//         {/* New Arrivals */}
//         <View style={styles.section}>
//           <SectionHeader title="New Arrivals" subtitle="Fresh additions to our collection" />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//             </ScrollView>
//           )}
//         </View>

//         {/* Why Choose Us */}
//         <View style={styles.section}>
//           <SectionHeader title="Why Choose Super Tent House" subtitle="Trusted by 10,000+ customers" />
//           <View style={styles.whyGrid}>
//             {whyChoose.map((item, i) => {
//               const Icon = iconMap[item.icon] || Sparkles;
//               return (
//                 <Animated.View key={item.id} entering={FadeInDown.delay(i * 60)} style={styles.whyCard}>
//                   <View style={styles.whyIconWrap}><Icon color={COLORS.gold[500]} size={24} /></View>
//                   <Text style={styles.whyTitle}>{item.title}</Text>
//                   <Text style={styles.whyDesc}>{item.description}</Text>
//                 </Animated.View>
//               );
//             })}
//           </View>
//         </View>

//         {/* Testimonials */}
//         <View style={styles.section}>
//           <SectionHeader title="Customer Testimonials" subtitle="What our customers say" />
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//             {testimonials.map((t, i) => (
//               <Animated.View key={t.id} entering={FadeIn.delay(i * 80)} style={styles.testimonialCard}>
//                 <View style={styles.testStars}>
//                   {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />)}
//                 </View>
//                 <Text style={styles.testText}>"{t.text}"</Text>
//                 <View style={styles.testUser}>
//                   <Image source={{ uri: t.avatar }} style={styles.testAvatar} />
//                   <View>
//                     <Text style={styles.testName}>{t.name}</Text>
//                     <Text style={styles.testEvent}>{t.event}</Text>
//                   </View>
//                 </View>
//               </Animated.View>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Contact Us */}
//         <View style={styles.section}>
//           <View style={styles.contactCard}>
//             <Text style={styles.contactTitle}>Need Help?</Text>
//             <Text style={styles.contactSubtitle}>Our team is available 24/7 to assist you</Text>
//             <View style={styles.contactRow}>
//               <TouchableOpacity style={styles.contactBtn}>
//                 <Phone color={COLORS.white} size={20} />
//                 <Text style={styles.contactBtnText}>Call Now</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.contactBtnGreen}>
//                 <MessageCircle color={COLORS.white} size={20} />
//                 <Text style={styles.contactBtnText}>WhatsApp</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.contactBtnGold} onPress={() => router.push('/support')}>
//                 <Mail color={COLORS.neutral[900]} size={20} />
//                 <Text style={styles.contactBtnTextDark}>Email</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// }

// // ── PackageBanner sub-component ───────────────────────────────────────────────
// function PackageBanner() {
//   const router = useRouter();
//   const [pkgs, setPkgs] = useState<any[]>([]);
//   useEffect(() => { mockApi.getPackages().then(setPkgs); }, []);
//   return (
//     <>
//       {pkgs.map(pk => (
//         <TouchableOpacity key={pk.id} style={styles.pkgCard} onPress={() => router.push(`/package/${pk.id}`)} activeOpacity={0.9}>
//           <Image source={{ uri: pk.image }} style={styles.pkgImage} />
//           <View style={styles.pkgOverlay} />
//           <View style={styles.pkgContent}>
//             <View style={styles.pkgTierBadge}><Text style={styles.pkgTierText}>{pk.tier}</Text></View>
//             <Text style={styles.pkgName}>{pk.name}</Text>
//             <Text style={styles.pkgGuests}>Up to {pk.guestCapacity} guests</Text>
//             <View style={styles.pkgPriceRow}>
//               <Text style={styles.pkgPrice}>₹{pk.price.toLocaleString('en-IN')}</Text>
//               {pk.originalPrice > pk.price && <Text style={styles.pkgOriginal}>₹{pk.originalPrice.toLocaleString('en-IN')}</Text>}
//             </View>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 130, backgroundColor: COLORS.white, zIndex: 1 },
//   header: { paddingHorizontal: SPACING.md, paddingTop: 50, paddingBottom: SPACING.sm, zIndex: 2 },
//   headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
//   locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   locationLabel: { fontSize: 10, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' },
//   locationValue: { fontSize: 13, color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold' },
//   headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
//   iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
//   notifBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: COLORS.error,
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//     borderWidth: 1.5,
//     borderColor: COLORS.white,
//   },
//   notifBadgeText: {
//     color: COLORS.white,
//     fontSize: 9,
//     fontFamily: 'Inter-Bold',
//     textAlign: 'center',
//   },
//   avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.gold[400] },
//   searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, height: 52, borderWidth: 1, borderColor: COLORS.neutral[200], ...SHADOWS.small },
//   searchPlaceholder: { flex: 1, fontSize: 14, color: COLORS.neutral[400], fontFamily: 'Inter-Regular', marginLeft: SPACING.sm },
//   micBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary[700], justifyContent: 'center', alignItems: 'center' },
//   bannerWrap: { marginTop: SPACING.md, paddingHorizontal: SPACING.md },
//   banner: { width: width - SPACING.md * 2, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md },
//   bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.5)' },
//   bannerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
//   bannerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.white },
//   bannerSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[200], marginTop: 4 },
//   bannerCta: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.gold[400], paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.lg, alignSelf: 'flex-start', marginTop: SPACING.md },
//   bannerCtaText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: SPACING.sm },
//   bannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.neutral[300] },
//   bannerDotActive: { width: 20, backgroundColor: COLORS.primary[700] },
//   section: { marginTop: SPACING.xl },
//   categoryItem: { alignItems: 'center', marginRight: SPACING.md, width: 80 },
//   categoryCircle: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.gold[200], ...SHADOWS.small },
//   categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   categoryName: { fontSize: 11, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginTop: 6, textAlign: 'center', lineHeight: 14 },
//   bsHeaderWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
//   bsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   bsCrown: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.gold[50], borderWidth: 1.5, borderColor: COLORS.gold[200], justifyContent: 'center', alignItems: 'center' },
//   bsTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   bsSubtitle: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 1 },
//   bsSeeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
//   bsSeeAllText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.gold[500] },
//   whyGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: SPACING.md },
//   whyCard: { width: (width - SPACING.md * 3) / 2, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
//   whyIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.gold[50], justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
//   whyTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   whyDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4, lineHeight: 16 },
//   testimonialCard: { width: 280, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.lg, marginRight: SPACING.md, ...SHADOWS.small },
//   testStars: { flexDirection: 'row', gap: 2, marginBottom: SPACING.sm },
//   testText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[700], lineHeight: 20 },
//   testUser: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
//   testAvatar: { width: 40, height: 40, borderRadius: 20 },
//   testName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   testEvent: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.gold[500] },
//   contactCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.primary[800], borderRadius: RADIUS.xxl, padding: SPACING.xl, ...SHADOWS.large },
//   contactTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.white },
//   contactSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 4 },
//   contactRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
//   contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary[600], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnGreen: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.success, paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnGold: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.gold[400], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.white },
//   contactBtnTextDark: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   pkgCard: { width: 280, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md, ...SHADOWS.medium },
//   pkgImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   pkgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.55)' },
//   pkgContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
//   pkgTierBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.gold[400], paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 8 },
//   pkgTierText: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   pkgName: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.white },
//   pkgGuests: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 2 },
//   pkgPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
//   pkgPrice: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.gold[300] },
//   pkgOriginal: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
// });





// // app/(tabs)/index.tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
//   Dimensions, RefreshControl, FlatList,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import Animated, {
//   FadeIn, FadeInDown, FadeInRight,
//   useAnimatedStyle, useSharedValue, interpolate, Extrapolate,
// } from 'react-native-reanimated';
// import {
//   Search, Bell, Heart, MapPin, Mic, ChevronRight, Star,
//   Phone, MessageCircle, Mail, Sparkles, Award, Users, Clock, Shield,
//   ShoppingBag, TrendingUp,
// } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Category, Product, HeroBanner } from '@/types';
// import { SectionHeader } from '@/components/ui/SectionHeader';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useAuth } from '@/store/auth';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';

// const { width } = Dimensions.get('window');

// // ─── Best‑Seller card ───────────────────────────────────────────────────────
// const RANK_COLORS = ['#D4A82E', '#8E9BAD', '#C07850'];
// const RANK_LABELS = ['#1 Best Seller', '#2 Top Rated', '#3 Popular'];

// function BestSellerCard({ product, rank, index }: { product: Product; rank: number; index: number }) {
//   const router = useRouter();
//   const { has, toggle } = useWishlist();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const isWishlisted = has(product.id);
//   const isGold = rank === 0;

//   const handleAdd = () => {
//     addItem({
//       id: `${product.id}_${Date.now()}`,
//       productId: product.id,
//       name: product.name,
//       image: product.images[0],
//       price: product.price,
//       quantity: 1,
//       type: 'product',
//     });
//     show('Added to cart');
//   };

//   return (
//     <Animated.View entering={FadeInRight.delay(index * 80).duration(400)}>
//       <TouchableOpacity
//         style={[bs.card, isGold && bs.cardGold]}
//         onPress={() => router.push(`/product/${product.id}`)}
//         activeOpacity={0.88}
//       >
//         <View style={[bs.rankRibbon, { backgroundColor: RANK_COLORS[rank] ?? COLORS.neutral[400] }]}>
//           <TrendingUp color={rank === 0 ? COLORS.neutral[900] : COLORS.white} size={11} />
//           <Text style={[bs.rankText, rank !== 0 && { color: COLORS.white }]}>
//             {RANK_LABELS[rank] ?? `#${rank + 1}`}
//           </Text>
//         </View>

//         <View style={bs.imageWrap}>
//           <Image source={{ uri: product.images[0] }} style={bs.image} />
//           <TouchableOpacity
//             style={bs.wishBtn}
//             onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Saved!', 'info'); }}
//           >
//             <Heart
//               size={14}
//               color={isWishlisted ? COLORS.error : COLORS.white}
//               fill={isWishlisted ? COLORS.error : 'transparent'}
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={bs.body}>
//           <Text style={bs.category}>{product.categoryName}</Text>
//           <Text style={bs.name} numberOfLines={2}>{product.name}</Text>

//           <View style={bs.ratingRow}>
//             <View style={bs.stars}>
//               {[1, 2, 3, 4, 5].map(s => (
//                 <Star
//                   key={s} size={10}
//                   color={COLORS.gold[400]}
//                   fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'}
//                 />
//               ))}
//             </View>
//             <Text style={bs.ratingVal}>{product.rating.toFixed(1)}</Text>
//             <Text style={bs.ratingCount}>({product.reviewCount})</Text>
//           </View>

//           <View style={bs.salesWrap}>
//             <Text style={bs.salesLabel}>Sales</Text>
//             <View style={bs.salesTrack}>
//               <Animated.View
//                 style={[
//                   bs.salesFill,
//                   {
//                     width: `${Math.min(100, 40 + rank * 0 + (product.reviewCount / 10))}%` as any,
//                     backgroundColor: RANK_COLORS[rank] ?? COLORS.primary[500],
//                   },
//                 ]}
//               />
//             </View>
//           </View>

//           <View style={bs.footer}>
//             <View>
//               <Text style={bs.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//               {product.originalPrice > product.price && (
//                 <Text style={bs.original}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//               )}
//             </View>
//             <TouchableOpacity style={[bs.addBtn, isGold && bs.addBtnGold]} onPress={handleAdd}>
//               <ShoppingBag size={14} color={isGold ? COLORS.neutral[900] : COLORS.white} />
//               <Text style={[bs.addText, isGold && { color: COLORS.neutral[900] }]}>Add</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// }

// const bs = StyleSheet.create({
//   card: {
//     width: 200,
//     marginRight: SPACING.md,
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.xxl,
//     overflow: 'hidden',
//     ...SHADOWS.medium,
//   },
//   cardGold: {
//     borderWidth: 1.5,
//     borderColor: COLORS.gold[300],
//   },
//   rankRibbon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     backgroundColor: COLORS.gold[400],
//   },
//   rankText: {
//     fontSize: 10,
//     fontFamily: 'Inter-Bold',
//     color: COLORS.neutral[900],
//     letterSpacing: 0.3,
//   },
//   imageWrap: { position: 'relative' },
//   image: { width: '100%', height: 140, resizeMode: 'cover' },
//   wishBtn: {
//     position: 'absolute', top: 8, right: 8,
//     width: 28, height: 28, borderRadius: 14,
//     backgroundColor: 'rgba(10,18,36,0.45)',
//     justifyContent: 'center', alignItems: 'center',
//   },
//   body: { padding: 12 },
//   category: {
//     fontSize: 10, fontFamily: 'Inter-Medium',
//     color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 0.5,
//   },
//   name: {
//     fontSize: 13, fontFamily: 'Inter-SemiBold',
//     color: COLORS.neutral[900], marginTop: 3, lineHeight: 17,
//   },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
//   stars: { flexDirection: 'row', gap: 1 },
//   ratingVal: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[800] },
//   ratingCount: { fontSize: 10, fontFamily: 'Inter-Regular', color: COLORS.neutral[400] },
//   salesWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
//   salesLabel: { fontSize: 9, fontFamily: 'Inter-Medium', color: COLORS.neutral[400], width: 28 },
//   salesTrack: {
//     flex: 1, height: 4, borderRadius: 2,
//     backgroundColor: COLORS.neutral[100], overflow: 'hidden',
//   },
//   salesFill: { height: '100%', borderRadius: 2 },
//   footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
//   price: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   original: {
//     fontSize: 10, fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[400], textDecorationLine: 'line-through', marginTop: 1,
//   },
//   addBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 4,
//     backgroundColor: COLORS.primary[700],
//     paddingVertical: 7, paddingHorizontal: 10,
//     borderRadius: RADIUS.md,
//   },
//   addBtnGold: { backgroundColor: COLORS.gold[400] },
//   addText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.white },
// });

// // ── Main screen ───────────────────────────────────────────────────────────────
// export default function HomeScreen() {
//   const router = useRouter();
//   const { state } = useAuth();
//   const { state: wishState } = useWishlist();
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [trending, setTrending] = useState<Product[]>([]);
//   const [bestSellers, setBestSellers] = useState<Product[]>([]);
//   const [newArrivals, setNewArrivals] = useState<Product[]>([]);
//   const [banners, setBanners] = useState<HeroBanner[]>([]);
//   const [testimonials, setTestimonials] = useState<any[]>([]);
//   const [whyChoose, setWhyChoose] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [bannerIndex, setBannerIndex] = useState(0);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const bannerRef = useRef<FlatList>(null);
//   const customerId = state.user?.id;

//   // ─── Fetch unread notification count ──────────────────────────────────────
//   const fetchUnreadCount = useCallback(async () => {
//     if (!customerId) {
//       setUnreadCount(0);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE_URL}/notifications/${customerId}/unread-count`);
//       if (response.data.success) {
//         setUnreadCount(response.data.count);
//       }
//     } catch (error) {
//       console.error('Failed to fetch unread count:', error);
//     }
//   }, [customerId]);

//   useEffect(() => {
//     fetchUnreadCount();
//   }, [fetchUnreadCount]);

//   // ─── FIX: Updated loadData with proper banner mapping ──────────────────────
//   const loadData = useCallback(async () => {
//     const [cats, trend, best, newArr, bnr, tst, why] = await Promise.all([
//       mockApi.getCategories(),
//       mockApi.getTrending(),
//       mockApi.getBestSellers(),
//       mockApi.getNewArrivals(),
//       mockApi.getHeroBanners(),
//       mockApi.getTestimonials(),
//       mockApi.getWhyChooseUs(),
//     ]);
//     setCategories(cats.slice(0, 10));
//     setTrending(trend);
//     setBestSellers(best);
//     setNewArrivals(newArr);
    
//     // ─── FIX: Properly map banners to HeroBanner type ──────────────────────
//     const validBanners = (bnr || []).map((banner: any) => ({
//       id: banner.id || String(Math.random()),
//       title: banner.title || '',
//       subtitle: banner.subtitle || '',
//       image: banner.image || '',
//       cta: banner.cta || banner.cta_text || 'Learn More',
//       ctaLink: banner.ctaLink || banner.cta_link || '/',
//       displayOrder: banner.displayOrder || banner.display_order || 0,
//       isActive: banner.isActive !== undefined ? banner.isActive : true,
//     }));
//     setBanners(validBanners);
    
//     setTestimonials(tst);
//     setWhyChoose(why);
//     setLoading(false);
//   }, []);

//   useEffect(() => { loadData(); }, [loadData]);

//   useEffect(() => {
//     if (banners.length === 0) return;
//     const timer = setInterval(() => {
//       setBannerIndex(prev => {
//         const next = (prev + 1) % banners.length;
//         bannerRef.current?.scrollToIndex({ index: next, animated: true });
//         return next;
//       });
//     }, 4000);
//     return () => clearInterval(timer);
//   }, [banners.length]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadData();
//     await fetchUnreadCount();
//     setRefreshing(false);
//   }, [loadData, fetchUnreadCount]);

//   const scrollY = useSharedValue(0);
//   const headerStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(scrollY.value, [0, 100, 150], [0, 0.5, 1], Extrapolate.CLAMP),
//   }));

//   const iconMap: Record<string, any> = {
//     award: Award, users: Users, clock: Clock, shield: Shield, heart: Heart, phone: Phone,
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.stickyHeader, headerStyle]} />
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <View style={styles.locationWrap}>
//             <MapPin color={COLORS.primary[600]} size={16} />
//             <View>
//               <Text style={styles.locationLabel}>Deliver to</Text>
//               <Text style={styles.locationValue}>Bengaluru 560001</Text>
//             </View>
//           </View>
//           <View style={styles.headerActions}>
//             <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}>
//               <Bell color={COLORS.neutral[700]} size={22} />
//               {unreadCount > 0 && (
//                 <View style={styles.notifBadge}>
//                   <Text style={styles.notifBadgeText}>
//                     {unreadCount > 9 ? '9+' : unreadCount}
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/wishlist')}>
//               <Heart color={COLORS.neutral[700]} size={22} />
//               {wishState.productIds.length > 0 && <View style={styles.notifDot} />}
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
//               <Image
//                 source={{ uri: state.user?.avatar || 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=200' }}
//                 style={styles.avatar}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')} activeOpacity={0.9}>
//           <Search color={COLORS.neutral[400]} size={20} />
//           <Text style={styles.searchPlaceholder}>Search for decorations, packages...</Text>
//           <View style={styles.micBtn}><Mic color={COLORS.white} size={18} /></View>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         onScroll={e => { scrollY.value = e.nativeEvent.contentOffset.y; }}
//         scrollEventThrottle={16}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
//       >
//         {/* Hero Banner */}
//         {loading ? (
//           <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.md }}>
//             <Skeleton width="100%" height={200} radius={RADIUS.xxl} />
//           </View>
//         ) : banners.length > 0 ? (
//           <View style={styles.bannerWrap}>
//             <FlatList
//               ref={bannerRef}
//               data={banners}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={e => {
//                 const offset = e.nativeEvent.contentOffset.x;
//                 const index = Math.round(offset / (width - SPACING.md * 2));
//                 setBannerIndex(index);
//               }}
//               scrollEventThrottle={16}
//               keyExtractor={item => item.id}
//               renderItem={({ item }) => (
//                 <View style={styles.banner}>
//                   <Image source={{ uri: item.image }} style={styles.bannerImage} />
//                   <View style={styles.bannerOverlay} />
//                   <View style={styles.bannerContent}>
//                     <Text style={styles.bannerTitle}>{item.title}</Text>
//                     <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
//                     <TouchableOpacity 
//                       style={styles.bannerCta} 
//                       onPress={() => {
//                         if (item.ctaLink && item.ctaLink !== '/') {
//                           router.push(item.ctaLink);
//                         } else {
//                           router.push('/package-list');
//                         }
//                       }}
//                     >
//                       <Text style={styles.bannerCtaText}>{item.cta}</Text>
//                       <ChevronRight color={COLORS.neutral[900]} size={16} />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//             />
//             <View style={styles.bannerDots}>
//               {banners.map((_, i) => (
//                 <View key={i} style={[styles.bannerDot, i === bannerIndex && styles.bannerDotActive]} />
//               ))}
//             </View>
//           </View>
//         ) : null}

//         {/* Shop by Category */}
//         <View style={styles.section}>
//           <SectionHeader title="Shop by Category" subtitle="Explore our collections" onSeeAll={() => router.push('/(tabs)/categories')} />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {[1, 2, 3, 4, 5].map(i => (
//                 <View key={i} style={{ marginHorizontal: 8 }}>
//                   <Skeleton width={72} height={72} radius={36} />
//                   <Skeleton width={60} height={10} style={{ marginTop: 8 }} />
//                 </View>
//               ))}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {categories.map((cat, i) => (
//                 <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => router.push(`/category/${cat.id}`)} activeOpacity={0.8}>
//                   <Animated.View entering={FadeIn.delay(i * 40)} style={styles.categoryCircle}>
//                     <Image source={{ uri: cat.image }} style={styles.categoryImage} />
//                   </Animated.View>
//                   <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           )}
//         </View>

//         {/* Trending */}
//         <View style={styles.section}>
//           <SectionHeader title="Trending Now" subtitle="Most popular this week" onSeeAll={() => router.push('/(tabs)/categories')} />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//             </ScrollView>
//           )}
//         </View>

//         {/* Featured Event Packages */}
//         <View style={styles.section}>
//           <SectionHeader title="Event Packages" subtitle="Complete solutions for your events" onSeeAll={() => router.push('/package-list')} />
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//             {loading
//               ? [1, 2, 3].map(i => <Skeleton key={i} width={280} height={200} radius={RADIUS.xxl} style={{ marginRight: SPACING.md }} />)
//               : <PackageBanner />}
//           </ScrollView>
//         </View>

//         {/* Best Sellers */}
//         <View style={styles.section}>
//           <View style={styles.bsHeaderWrap}>
//             <View style={styles.bsHeaderLeft}>
//               <View style={styles.bsCrown}>
//                 <Star size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//               </View>
//               <View>
//                 <Text style={styles.bsTitle}>Best Sellers</Text>
//                 <Text style={styles.bsSubtitle}>Top picks by our customers</Text>
//               </View>
//             </View>
//             <TouchableOpacity style={styles.bsSeeAll} onPress={() => router.push('/(tabs)/categories')}>
//               <Text style={styles.bsSeeAllText}>See All</Text>
//               <ChevronRight size={15} color={COLORS.gold[500]} />
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => (
//                 <View key={i} style={{ width: 200, marginRight: SPACING.md }}>
//                   <Skeleton width="100%" height={300} radius={RADIUS.xxl} />
//                 </View>
//               ))}
//             </ScrollView>
//           ) : (
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 4 }}
//             >
//               {bestSellers.slice(0, 6).map((p, i) => (
//                 <BestSellerCard key={p.id} product={p} rank={i} index={i} />
//               ))}
//             </ScrollView>
//           )}
//         </View>

//         {/* New Arrivals */}
//         <View style={styles.section}>
//           <SectionHeader title="New Arrivals" subtitle="Fresh additions to our collection" />
//           {loading ? (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
//             </ScrollView>
//           ) : (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//               {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//             </ScrollView>
//           )}
//         </View>

//         {/* Why Choose Us */}
//         <View style={styles.section}>
//           <SectionHeader title="Why Choose Super Tent House" subtitle="Trusted by 10,000+ customers" />
//           <View style={styles.whyGrid}>
//             {whyChoose.map((item, i) => {
//               const Icon = iconMap[item.icon] || Sparkles;
//               return (
//                 <Animated.View key={item.id} entering={FadeInDown.delay(i * 60)} style={styles.whyCard}>
//                   <View style={styles.whyIconWrap}><Icon color={COLORS.gold[500]} size={24} /></View>
//                   <Text style={styles.whyTitle}>{item.title}</Text>
//                   <Text style={styles.whyDesc}>{item.description}</Text>
//                 </Animated.View>
//               );
//             })}
//           </View>
//         </View>

//         {/* Testimonials */}
//         <View style={styles.section}>
//           <SectionHeader title="Customer Testimonials" subtitle="What our customers say" />
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//             {testimonials.map((t, i) => (
//               <Animated.View key={t.id} entering={FadeIn.delay(i * 80)} style={styles.testimonialCard}>
//                 <View style={styles.testStars}>
//                   {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />)}
//                 </View>
//                 <Text style={styles.testText}>"{t.text}"</Text>
//                 <View style={styles.testUser}>
//                   <Image source={{ uri: t.avatar }} style={styles.testAvatar} />
//                   <View>
//                     <Text style={styles.testName}>{t.name}</Text>
//                     <Text style={styles.testEvent}>{t.event}</Text>
//                   </View>
//                 </View>
//               </Animated.View>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Contact Us */}
//         <View style={styles.section}>
//           <View style={styles.contactCard}>
//             <Text style={styles.contactTitle}>Need Help?</Text>
//             <Text style={styles.contactSubtitle}>Our team is available 24/7 to assist you</Text>
//             <View style={styles.contactRow}>
//               <TouchableOpacity style={styles.contactBtn}>
//                 <Phone color={COLORS.white} size={20} />
//                 <Text style={styles.contactBtnText}>Call Now</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.contactBtnGreen}>
//                 <MessageCircle color={COLORS.white} size={20} />
//                 <Text style={styles.contactBtnText}>WhatsApp</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.contactBtnGold} onPress={() => router.push('/support')}>
//                 <Mail color={COLORS.neutral[900]} size={20} />
//                 <Text style={styles.contactBtnTextDark}>Email</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// }

// // ── PackageBanner sub-component ───────────────────────────────────────────────
// function PackageBanner() {
//   const router = useRouter();
//   const [pkgs, setPkgs] = useState<any[]>([]);
//   useEffect(() => { mockApi.getPackages().then(setPkgs); }, []);
//   return (
//     <>
//       {pkgs.map(pk => (
//         <TouchableOpacity key={pk.id} style={styles.pkgCard} onPress={() => router.push(`/package/${pk.id}`)} activeOpacity={0.9}>
//           <Image source={{ uri: pk.image }} style={styles.pkgImage} />
//           <View style={styles.pkgOverlay} />
//           <View style={styles.pkgContent}>
//             <View style={styles.pkgTierBadge}><Text style={styles.pkgTierText}>{pk.tier}</Text></View>
//             <Text style={styles.pkgName}>{pk.name}</Text>
//             <Text style={styles.pkgGuests}>Up to {pk.guestCapacity} guests</Text>
//             <View style={styles.pkgPriceRow}>
//               <Text style={styles.pkgPrice}>₹{pk.price.toLocaleString('en-IN')}</Text>
//               {pk.originalPrice > pk.price && <Text style={styles.pkgOriginal}>₹{pk.originalPrice.toLocaleString('en-IN')}</Text>}
//             </View>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </>
//   );
// }

// // ─── Styles ──────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 130, backgroundColor: COLORS.white, zIndex: 1 },
//   header: { paddingHorizontal: SPACING.md, paddingTop: 50, paddingBottom: SPACING.sm, zIndex: 2 },
//   headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
//   locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   locationLabel: { fontSize: 10, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' },
//   locationValue: { fontSize: 13, color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold' },
//   headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
//   iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
//   notifBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: COLORS.error,
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//     borderWidth: 1.5,
//     borderColor: COLORS.white,
//   },
//   notifBadgeText: {
//     color: COLORS.white,
//     fontSize: 9,
//     fontFamily: 'Inter-Bold',
//     textAlign: 'center',
//   },
//   avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.gold[400] },
//   searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, height: 52, borderWidth: 1, borderColor: COLORS.neutral[200], ...SHADOWS.small },
//   searchPlaceholder: { flex: 1, fontSize: 14, color: COLORS.neutral[400], fontFamily: 'Inter-Regular', marginLeft: SPACING.sm },
//   micBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary[700], justifyContent: 'center', alignItems: 'center' },
//   bannerWrap: { marginTop: SPACING.md, paddingHorizontal: SPACING.md },
//   banner: { width: width - SPACING.md * 2, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md },
//   bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.5)' },
//   bannerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
//   bannerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.white },
//   bannerSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[200], marginTop: 4 },
//   bannerCta: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.gold[400], paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.lg, alignSelf: 'flex-start', marginTop: SPACING.md },
//   bannerCtaText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: SPACING.sm },
//   bannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.neutral[300] },
//   bannerDotActive: { width: 20, backgroundColor: COLORS.primary[700] },
//   section: { marginTop: SPACING.xl },
//   categoryItem: { alignItems: 'center', marginRight: SPACING.md, width: 80 },
//   categoryCircle: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.gold[200], ...SHADOWS.small },
//   categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   categoryName: { fontSize: 11, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginTop: 6, textAlign: 'center', lineHeight: 14 },
//   bsHeaderWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
//   bsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   bsCrown: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.gold[50], borderWidth: 1.5, borderColor: COLORS.gold[200], justifyContent: 'center', alignItems: 'center' },
//   bsTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   bsSubtitle: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 1 },
//   bsSeeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
//   bsSeeAllText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.gold[500] },
//   whyGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: SPACING.md },
//   whyCard: { width: (width - SPACING.md * 3) / 2, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
//   whyIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.gold[50], justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
//   whyTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   whyDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4, lineHeight: 16 },
//   testimonialCard: { width: 280, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.lg, marginRight: SPACING.md, ...SHADOWS.small },
//   testStars: { flexDirection: 'row', gap: 2, marginBottom: SPACING.sm },
//   testText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[700], lineHeight: 20 },
//   testUser: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
//   testAvatar: { width: 40, height: 40, borderRadius: 20 },
//   testName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   testEvent: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.gold[500] },
//   contactCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.primary[800], borderRadius: RADIUS.xxl, padding: SPACING.xl, ...SHADOWS.large },
//   contactTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.white },
//   contactSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 4 },
//   contactRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
//   contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary[600], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnGreen: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.success, paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnGold: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.gold[400], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
//   contactBtnText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.white },
//   contactBtnTextDark: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   pkgCard: { width: 280, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md, ...SHADOWS.medium },
//   pkgImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   pkgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.55)' },
//   pkgContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
//   pkgTierBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.gold[400], paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 8 },
//   pkgTierText: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   pkgName: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.white },
//   pkgGuests: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 2 },
//   pkgPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
//   pkgPrice: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.gold[300] },
//   pkgOriginal: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
// });






// app/(tabs)/index.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  Dimensions, RefreshControl, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn, FadeInDown, FadeInRight,
  useAnimatedStyle, useSharedValue, interpolate, Extrapolate,
} from 'react-native-reanimated';
import {
  Search, Bell, Heart, MapPin, Mic, ChevronRight, Star,
  Phone, MessageCircle, Mail, Sparkles, Award, Users, Clock, Shield,
  ShoppingBag, TrendingUp,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Category, Product, HeroBanner } from '@/types';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useWishlist } from '@/store/wishlist';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { useAuth } from '@/store/auth';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';

const { width } = Dimensions.get('window');

// ─── Best‑Seller card ───────────────────────────────────────────────────────
const RANK_COLORS = ['#D4A82E', '#8E9BAD', '#C07850'];
const RANK_LABELS = ['#1 Best Seller', '#2 Top Rated', '#3 Popular'];

function BestSellerCard({ product, rank, index }: { product: Product; rank: number; index: number }) {
  const router = useRouter();
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();
  const isWishlisted = has(product.id);
  const isGold = rank === 0;

  const handleAdd = () => {
    addItem({
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      type: 'product',
    });
    show('Added to cart');
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).duration(400)}>
      <TouchableOpacity
        style={[bs.card, isGold && bs.cardGold]}
        onPress={() => router.push(`/product/${product.id}`)}
        activeOpacity={0.88}
      >
        <View style={[bs.rankRibbon, { backgroundColor: RANK_COLORS[rank] ?? COLORS.neutral[400] }]}>
          <TrendingUp color={rank === 0 ? COLORS.neutral[900] : COLORS.white} size={11} />
          <Text style={[bs.rankText, rank !== 0 && { color: COLORS.white }]}>
            {RANK_LABELS[rank] ?? `#${rank + 1}`}
          </Text>
        </View>

        <View style={bs.imageWrap}>
          <Image source={{ uri: product.images[0] }} style={bs.image} />
          <TouchableOpacity
            style={bs.wishBtn}
            onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Saved!', 'info'); }}
          >
            <Heart
              size={14}
              color={isWishlisted ? COLORS.error : COLORS.white}
              fill={isWishlisted ? COLORS.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={bs.body}>
          <Text style={bs.category}>{product.categoryName}</Text>
          <Text style={bs.name} numberOfLines={2}>{product.name}</Text>

          <View style={bs.ratingRow}>
            <View style={bs.stars}>
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s} size={10}
                  color={COLORS.gold[400]}
                  fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'}
                />
              ))}
            </View>
            <Text style={bs.ratingVal}>{product.rating.toFixed(1)}</Text>
            <Text style={bs.ratingCount}>({product.reviewCount})</Text>
          </View>

          <View style={bs.salesWrap}>
            <Text style={bs.salesLabel}>Sales</Text>
            <View style={bs.salesTrack}>
              <Animated.View
                style={[
                  bs.salesFill,
                  {
                    width: `${Math.min(100, 40 + rank * 0 + (product.reviewCount / 10))}%` as any,
                    backgroundColor: RANK_COLORS[rank] ?? COLORS.primary[500],
                  },
                ]}
              />
            </View>
          </View>

          <View style={bs.footer}>
            <View>
              <Text style={bs.price}>₹{product.price.toLocaleString('en-IN')}</Text>
              {product.originalPrice > product.price && (
                <Text style={bs.original}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
              )}
            </View>
            <TouchableOpacity style={[bs.addBtn, isGold && bs.addBtnGold]} onPress={handleAdd}>
              <ShoppingBag size={14} color={isGold ? COLORS.neutral[900] : COLORS.white} />
              <Text style={[bs.addText, isGold && { color: COLORS.neutral[900] }]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const bs = StyleSheet.create({
  card: {
    width: 200,
    marginRight: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  cardGold: {
    borderWidth: 1.5,
    borderColor: COLORS.gold[300],
  },
  rankRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.gold[400],
  },
  rankText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    letterSpacing: 0.3,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 140, resizeMode: 'cover' },
  wishBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(10,18,36,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  body: { padding: 12 },
  category: {
    fontSize: 10, fontFamily: 'Inter-Medium',
    color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 0.5,
  },
  name: {
    fontSize: 13, fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900], marginTop: 3, lineHeight: 17,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  stars: { flexDirection: 'row', gap: 1 },
  ratingVal: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[800] },
  ratingCount: { fontSize: 10, fontFamily: 'Inter-Regular', color: COLORS.neutral[400] },
  salesWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  salesLabel: { fontSize: 9, fontFamily: 'Inter-Medium', color: COLORS.neutral[400], width: 28 },
  salesTrack: {
    flex: 1, height: 4, borderRadius: 2,
    backgroundColor: COLORS.neutral[100], overflow: 'hidden',
  },
  salesFill: { height: '100%', borderRadius: 2 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  price: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  original: {
    fontSize: 10, fontFamily: 'Inter-Regular',
    color: COLORS.neutral[400], textDecorationLine: 'line-through', marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primary[700],
    paddingVertical: 7, paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  addBtnGold: { backgroundColor: COLORS.gold[400] },
  addText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.white },
});

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const { state } = useAuth();
  const { state: wishState } = useWishlist();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [whyChoose, setWhyChoose] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const bannerRef = useRef<FlatList>(null);
  const customerId = state.user?.id;

  // ─── Fetch unread notification count ──────────────────────────────────────
  const fetchUnreadCount = useCallback(async () => {
    if (!customerId) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/${customerId}/unread-count`);
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, [customerId]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // ─── FIX: Updated loadData with proper banner mapping ──────────────────────
  const loadData = useCallback(async () => {
    const [cats, trend, best, newArr, bnr, tst, why] = await Promise.all([
      mockApi.getCategories(),
      mockApi.getTrending(),
      mockApi.getBestSellers(),
      mockApi.getNewArrivals(),
      mockApi.getHeroBanners(),
      mockApi.getTestimonials(),
      mockApi.getWhyChooseUs(),
    ]);
    setCategories(cats.slice(0, 10));
    setTrending(trend);
    setBestSellers(best);
    setNewArrivals(newArr);
    
    // ─── FIX: Properly map banners to HeroBanner type ──────────────────────
    const validBanners = (bnr || []).map((banner: any) => ({
      id: banner.id || String(Math.random()),
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: banner.image || '',
      cta: banner.cta || banner.cta_text || 'Learn More',
      ctaLink: banner.ctaLink || banner.cta_link || '/',
      displayOrder: banner.displayOrder || banner.display_order || 0,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    }));
    setBanners(validBanners);
    
    setTestimonials(tst);
    setWhyChoose(why);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % banners.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    await fetchUnreadCount();
    setRefreshing(false);
  }, [loadData, fetchUnreadCount]);

  const scrollY = useSharedValue(0);
  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 100, 150], [0, 0.5, 1], Extrapolate.CLAMP),
  }));

  const iconMap: Record<string, any> = {
    award: Award, users: Users, clock: Clock, shield: Shield, heart: Heart, phone: Phone,
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.stickyHeader, headerStyle]} />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* ─── REPLACED: Location with Logo ─────────────────────────────── */}
          <TouchableOpacity 
            style={styles.logoWrap} 
            onPress={() => router.push('/')}
            activeOpacity={0.8}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoEmoji}>🏕️</Text>
              </View>
              <View style={styles.logoTextContainer}>
                <Text style={styles.logoText}>Super Tent</Text>
                <Text style={styles.logoSubtext}>House</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}>
              <Bell color={COLORS.neutral[700]} size={22} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/wishlist')}>
              <Heart color={COLORS.neutral[700]} size={22} />
              {wishState.productIds.length > 0 && <View style={styles.notifDot} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Image
                source={{ uri: state.user?.avatar || 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=200' }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')} activeOpacity={0.9}>
          <Search color={COLORS.neutral[400]} size={20} />
          <Text style={styles.searchPlaceholder}>Search for decorations, packages...</Text>
          <View style={styles.micBtn}><Mic color={COLORS.white} size={18} /></View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={e => { scrollY.value = e.nativeEvent.contentOffset.y; }}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
      >
        {/* Hero Banner */}
        {loading ? (
          <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.md }}>
            <Skeleton width="100%" height={200} radius={RADIUS.xxl} />
          </View>
        ) : banners.length > 0 ? (
          <View style={styles.bannerWrap}>
            <FlatList
              ref={bannerRef}
              data={banners}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={e => {
                const offset = e.nativeEvent.contentOffset.x;
                const index = Math.round(offset / (width - SPACING.md * 2));
                setBannerIndex(index);
              }}
              scrollEventThrottle={16}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.banner}>
                  <Image source={{ uri: item.image }} style={styles.bannerImage} />
                  <View style={styles.bannerOverlay} />
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                    <TouchableOpacity 
                      style={styles.bannerCta} 
                      onPress={() => {
                        if (item.ctaLink && item.ctaLink !== '/') {
                          router.push(item.ctaLink);
                        } else {
                          router.push('/package-list');
                        }
                      }}
                    >
                      <Text style={styles.bannerCtaText}>{item.cta}</Text>
                      <ChevronRight color={COLORS.neutral[900]} size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <View style={styles.bannerDots}>
              {banners.map((_, i) => (
                <View key={i} style={[styles.bannerDot, i === bannerIndex && styles.bannerDotActive]} />
              ))}
            </View>
          </View>
        ) : null}

        {/* Shop by Category */}
        <View style={styles.section}>
          <SectionHeader title="Shop by Category" subtitle="Explore our collections" onSeeAll={() => router.push('/(tabs)/categories')} />
          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3, 4, 5].map(i => (
                <View key={i} style={{ marginHorizontal: 8 }}>
                  <Skeleton width={72} height={72} radius={36} />
                  <Skeleton width={60} height={10} style={{ marginTop: 8 }} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
              {categories.map((cat, i) => (
                <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => router.push(`/category/${cat.id}`)} activeOpacity={0.8}>
                  <Animated.View entering={FadeIn.delay(i * 40)} style={styles.categoryCircle}>
                    <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                  </Animated.View>
                  <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <SectionHeader title="Trending Now" subtitle="Most popular this week" onSeeAll={() => router.push('/(tabs)/categories')} />
          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
              {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
              {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
            </ScrollView>
          )}
        </View>

        {/* Featured Event Packages */}
        <View style={styles.section}>
          <SectionHeader title="Event Packages" subtitle="Complete solutions for your events" onSeeAll={() => router.push('/package-list')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
            {loading
              ? [1, 2, 3].map(i => <Skeleton key={i} width={280} height={200} radius={RADIUS.xxl} style={{ marginRight: SPACING.md }} />)
              : <PackageBanner />}
          </ScrollView>
        </View>

        {/* Best Sellers */}
        <View style={styles.section}>
          <View style={styles.bsHeaderWrap}>
            <View style={styles.bsHeaderLeft}>
              <View style={styles.bsCrown}>
                <Star size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
              </View>
              <View>
                <Text style={styles.bsTitle}>Best Sellers</Text>
                <Text style={styles.bsSubtitle}>Top picks by our customers</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bsSeeAll} onPress={() => router.push('/(tabs)/categories')}>
              <Text style={styles.bsSeeAllText}>See All</Text>
              <ChevronRight size={15} color={COLORS.gold[500]} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
              {[1, 2, 3].map(i => (
                <View key={i} style={{ width: 200, marginRight: SPACING.md }}>
                  <Skeleton width="100%" height={300} radius={RADIUS.xxl} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 4 }}
            >
              {bestSellers.slice(0, 6).map((p, i) => (
                <BestSellerCard key={p.id} product={p} rank={i} index={i} />
              ))}
            </ScrollView>
          )}
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <SectionHeader title="New Arrivals" subtitle="Fresh additions to our collection" />
          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
              {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
              {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
            </ScrollView>
          )}
        </View>

        {/* Why Choose Us */}
        <View style={styles.section}>
          <SectionHeader title="Why Choose Super Tent House" subtitle="Trusted by 10,000+ customers" />
          <View style={styles.whyGrid}>
            {whyChoose.map((item, i) => {
              const Icon = iconMap[item.icon] || Sparkles;
              return (
                <Animated.View key={item.id} entering={FadeInDown.delay(i * 60)} style={styles.whyCard}>
                  <View style={styles.whyIconWrap}><Icon color={COLORS.gold[500]} size={24} /></View>
                  <Text style={styles.whyTitle}>{item.title}</Text>
                  <Text style={styles.whyDesc}>{item.description}</Text>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <SectionHeader title="Customer Testimonials" subtitle="What our customers say" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
            {testimonials.map((t, i) => (
              <Animated.View key={t.id} entering={FadeIn.delay(i * 80)} style={styles.testimonialCard}>
                <View style={styles.testStars}>
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={COLORS.gold[400]} />)}
                </View>
                <Text style={styles.testText}>"{t.text}"</Text>
                <View style={styles.testUser}>
                  <Image source={{ uri: t.avatar }} style={styles.testAvatar} />
                  <View>
                    <Text style={styles.testName}>{t.name}</Text>
                    <Text style={styles.testEvent}>{t.event}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Contact Us */}
        <View style={styles.section}>
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Need Help?</Text>
            <Text style={styles.contactSubtitle}>Our team is available 24/7 to assist you</Text>
            <View style={styles.contactRow}>
              <TouchableOpacity style={styles.contactBtn}>
                <Phone color={COLORS.white} size={20} />
                <Text style={styles.contactBtnText}>Call Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtnGreen}>
                <MessageCircle color={COLORS.white} size={20} />
                <Text style={styles.contactBtnText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtnGold} onPress={() => router.push('/support')}>
                <Mail color={COLORS.neutral[900]} size={20} />
                <Text style={styles.contactBtnTextDark}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ── PackageBanner sub-component ───────────────────────────────────────────────
function PackageBanner() {
  const router = useRouter();
  const [pkgs, setPkgs] = useState<any[]>([]);
  useEffect(() => { mockApi.getPackages().then(setPkgs); }, []);
  return (
    <>
      {pkgs.map(pk => (
        <TouchableOpacity key={pk.id} style={styles.pkgCard} onPress={() => router.push(`/package/${pk.id}`)} activeOpacity={0.9}>
          <Image source={{ uri: pk.image }} style={styles.pkgImage} />
          <View style={styles.pkgOverlay} />
          <View style={styles.pkgContent}>
            <View style={styles.pkgTierBadge}><Text style={styles.pkgTierText}>{pk.tier}</Text></View>
            <Text style={styles.pkgName}>{pk.name}</Text>
            <Text style={styles.pkgGuests}>Up to {pk.guestCapacity} guests</Text>
            <View style={styles.pkgPriceRow}>
              <Text style={styles.pkgPrice}>₹{pk.price.toLocaleString('en-IN')}</Text>
              {pk.originalPrice > pk.price && <Text style={styles.pkgOriginal}>₹{pk.originalPrice.toLocaleString('en-IN')}</Text>}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 130, backgroundColor: COLORS.white, zIndex: 1 },
  header: { paddingHorizontal: SPACING.md, paddingTop: 50, paddingBottom: SPACING.sm, zIndex: 2 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  
  // ─── NEW: Logo styles ─────────────────────────────────────────────────────
  logoWrap: { flex: 1 },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.gold[400],
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  logoEmoji: {
    fontSize: 20,
  },
  logoTextContainer: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.primary[800],
    letterSpacing: -0.5,
    lineHeight: 20,
  },
  logoSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.gold[500],
    letterSpacing: 0.5,
    lineHeight: 14,
    marginTop: -1,
  },
  
  locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationLabel: { fontSize: 10, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' },
  locationValue: { fontSize: 13, color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  notifBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.gold[400] },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, height: 52, borderWidth: 1, borderColor: COLORS.neutral[200], ...SHADOWS.small },
  searchPlaceholder: { flex: 1, fontSize: 14, color: COLORS.neutral[400], fontFamily: 'Inter-Regular', marginLeft: SPACING.sm },
  micBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary[700], justifyContent: 'center', alignItems: 'center' },
  bannerWrap: { marginTop: SPACING.md, paddingHorizontal: SPACING.md },
  banner: { width: width - SPACING.md * 2, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.5)' },
  bannerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
  bannerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.white },
  bannerSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[200], marginTop: 4 },
  bannerCta: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.gold[400], paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.lg, alignSelf: 'flex-start', marginTop: SPACING.md },
  bannerCtaText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: SPACING.sm },
  bannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.neutral[300] },
  bannerDotActive: { width: 20, backgroundColor: COLORS.primary[700] },
  section: { marginTop: SPACING.xl },
  categoryItem: { alignItems: 'center', marginRight: SPACING.md, width: 80 },
  categoryCircle: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.gold[200], ...SHADOWS.small },
  categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryName: { fontSize: 11, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginTop: 6, textAlign: 'center', lineHeight: 14 },
  bsHeaderWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  bsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bsCrown: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.gold[50], borderWidth: 1.5, borderColor: COLORS.gold[200], justifyContent: 'center', alignItems: 'center' },
  bsTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  bsSubtitle: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 1 },
  bsSeeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  bsSeeAllText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.gold[500] },
  whyGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: SPACING.md },
  whyCard: { width: (width - SPACING.md * 3) / 2, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
  whyIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.gold[50], justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  whyTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  whyDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4, lineHeight: 16 },
  testimonialCard: { width: 280, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.lg, marginRight: SPACING.md, ...SHADOWS.small },
  testStars: { flexDirection: 'row', gap: 2, marginBottom: SPACING.sm },
  testText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[700], lineHeight: 20 },
  testUser: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
  testAvatar: { width: 40, height: 40, borderRadius: 20 },
  testName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  testEvent: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.gold[500] },
  contactCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.primary[800], borderRadius: RADIUS.xxl, padding: SPACING.xl, ...SHADOWS.large },
  contactTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.white },
  contactSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 4 },
  contactRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary[600], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
  contactBtnGreen: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.success, paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
  contactBtnGold: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.gold[400], paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
  contactBtnText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.white },
  contactBtnTextDark: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  pkgCard: { width: 280, height: 200, borderRadius: RADIUS.xxl, overflow: 'hidden', marginRight: SPACING.md, ...SHADOWS.medium },
  pkgImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  pkgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.55)' },
  pkgContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
  pkgTierBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.gold[400], paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 8 },
  pkgTierText: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  pkgName: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.white },
  pkgGuests: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[300], marginTop: 2 },
  pkgPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  pkgPrice: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.gold[300] },
  pkgOriginal: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
});
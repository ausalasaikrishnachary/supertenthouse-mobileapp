// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
// import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Check } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/Button';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// export default function ProductDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { has, toggle } = useWishlist();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [related, setRelated] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');

//   const load = useCallback(async () => {
//     const p = await mockApi.getProduct(id);
//     setProduct(p || null);
//     if (p) {
//       const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
//       setRelated(rels);
//     }
//     setLoading(false);
//   }, [id]);

//   useEffect(() => { load(); }, [load]);

//   const handleAddCart = () => {
//     if (!product) return;
//     addItem({
//       id: `${product.id}_${Date.now()}`,
//       productId: product.id,
//       name: product.name,
//       image: product.images[0],
//       price: product.price,
//       quantity: qty,
//       type: 'product',
//     });
//     show('Added to cart');
//   };

//   const handleBuyNow = () => {
//     handleAddCart();
//     router.push('/checkout');
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
//     } catch {}
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={{ padding: SPACING.md }}>
//           <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
//           <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
//           <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
//           <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
//         </View>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text>Product not found</Text>
//         <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
//       </View>
//     );
//   }

//   const isWishlisted = has(product.id);
//   const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
//     const count = product.reviews.filter(r => Math.round(r.rating) === stars).length;
//     const pct = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
//     return { stars, count, pct };
//   });

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* Image Gallery */}
//         <View style={styles.galleryWrap}>
//           <FlatList
//             data={product.images}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
//             scrollEventThrottle={16}
//             keyExtractor={(_, i) => i.toString()}
//             renderItem={({ item }) => (
//               <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
//             )}
//           />
//           <View style={styles.galleryDots}>
//             {product.images.map((_, i) => (
//               <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
//             ))}
//           </View>
//         </View>

//         {/* Header Actions */}
//         <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={22} />
//           </TouchableOpacity>
//           <View style={styles.floatBtnRow}>
//             <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
//               <Share2 color={COLORS.neutral[800]} size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//               <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[800]} size={20} fill={isWishlisted ? COLORS.error : 'transparent'} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Product Info */}
//         <View style={styles.infoSection}>
//           <View style={styles.categoryRow}>
//             <Text style={styles.categoryText}>{product.categoryName}</Text>
//             {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
//           </View>
//           <Text style={styles.productName}>{product.name}</Text>
//           <View style={styles.ratingRow}>
//             <RatingBadge rating={product.rating} />
//             <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
//             {product.inStock ? (
//               <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
//             ) : (
//               <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
//             )}
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//             {product.originalPrice > product.price && (
//               <>
//                 <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//                 <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
//               </>
//             )}
//           </View>

//           {/* Colors */}
//           <View style={styles.colorSection}>
//             <Text style={styles.colorLabel}>Available Colors</Text>
//             <View style={styles.colorRow}>
//               {product.colors.map((c, i) => (
//                 <TouchableOpacity
//                   key={i}
//                   style={[styles.colorDot, { backgroundColor: c }, selectedColor === i && styles.colorDotActive]}
//                   onPress={() => setSelectedColor(i)}
//                 >
//                   {selectedColor === i && <Check color={c === '#FFFFFF' ? COLORS.neutral[900] : COLORS.white} size={16} />}
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Quantity */}
//           <View style={styles.qtySection}>
//             <Text style={styles.qtyLabel}>Quantity</Text>
//             <View style={styles.qtyControl}>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
//                 <Minus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//               <Text style={styles.qtyValue}>{qty}</Text>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
//                 <Plus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Tabs */}
//           <View style={styles.tabsRow}>
//             {([
//               { key: 'description', label: 'Description' },
//               { key: 'specs', label: 'Specs' },
//               { key: 'reviews', label: 'Reviews' },
//               { key: 'faq', label: 'FAQ' },
//             ] as const).map((t) => (
//               <TouchableOpacity
//                 key={t.key}
//                 style={[styles.tab, activeTab === t.key && styles.tabActive]}
//                 onPress={() => setActiveTab(t.key)}
//               >
//                 <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Tab Content */}
//           {activeTab === 'description' && (
//             <View style={styles.tabContent}>
//               <Text style={styles.descriptionText}>{product.description}</Text>
//               <Text style={styles.featuresTitle}>Key Features</Text>
//               {product.features.map((f, i) => (
//                 <View key={i} style={styles.featureRow}>
//                   <View style={styles.featureDot} />
//                   <Text style={styles.featureText}>{f}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {activeTab === 'specs' && (
//             <View style={styles.tabContent}>
//               {product.specifications.map((s, i) => (
//                 <View key={i} style={styles.specRow}>
//                   <Text style={styles.specLabel}>{s.label}</Text>
//                   <Text style={styles.specValue}>{s.value}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {activeTab === 'reviews' && (
//             <View style={styles.tabContent}>
//               <View style={styles.ratingSummary}>
//                 <View style={styles.ratingBig}>
//                   <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
//                   <View style={styles.ratingStars}>
//                     {[1,2,3,4,5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
//                   </View>
//                   <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
//                 </View>
//                 <View style={styles.ratingBreakdown}>
//                   {ratingBreakdown.map((r) => (
//                     <View key={r.stars} style={styles.breakdownRow}>
//                       <Text style={styles.breakdownLabel}>{r.stars}★</Text>
//                       <View style={styles.breakdownBar}>
//                         <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
//                       </View>
//                       <Text style={styles.breakdownCount}>{r.count}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               {product.reviews.map((review) => (
//                 <View key={review.id} style={styles.reviewCard}>
//                   <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
//                   <View style={styles.reviewBody}>
//                     <View style={styles.reviewHeader}>
//                       <Text style={styles.reviewName}>{review.userName}</Text>
//                       <View style={styles.reviewStars}>
//                         {[1,2,3,4,5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
//                       </View>
//                     </View>
//                     <Text style={styles.reviewComment}>{review.comment}</Text>
//                     <Text style={styles.reviewDate}>{review.date}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           )}

//           {activeTab === 'faq' && (
//             <View style={styles.tabContent}>
//               {[
//                 { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
//                 { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
//                 { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
//                 { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
//               ].map((f, i) => (
//                 <View key={i} style={styles.faqItem}>
//                   <Text style={styles.faqQ}>{f.q}</Text>
//                   <Text style={styles.faqA}>{f.a}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* Delivery Info */}
//           <View style={styles.deliveryCard}>
//             <View style={styles.deliveryRow}>
//               <Truck color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Free Delivery</Text>
//                 <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Shield color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Quality Assured</Text>
//                 <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <RotateCcw color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Flexible Booking</Text>
//                 <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
//               </View>
//             </View>
//           </View>

//           {/* Related Products */}
//           {related.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You May Also Like</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//                 {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.wishAction} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//           <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
//         </TouchableOpacity>
//         <Button onPress={handleAddCart} variant="outline" size="lg" style={{ flex: 1 }}>
//           <ShoppingBag size={18} color={COLORS.primary[700]} /> Add to Cart
//         </Button>
//         <Button onPress={handleBuyNow} variant="gold" size="lg" style={{ flex: 1 }}>Buy Now</Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   galleryWrap: { width: width, height: 350, position: 'relative' },
//   galleryImage: { width, height: 350 },
//   galleryDots: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
//   galleryDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
//   galleryDotActive: { width: 24, backgroundColor: COLORS.white },
//   floatingHeader: { position: 'absolute', left: SPACING.md, right: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
//   floatBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   floatBtnRow: { flexDirection: 'row', gap: 8 },
//   infoSection: { backgroundColor: COLORS.white, marginTop: -20, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg },
//   categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   categoryText: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 1 },
//   bestBadge: { backgroundColor: COLORS.gold[400], paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm },
//   bestText: { fontSize: 9, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   productName: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginTop: 6, lineHeight: 28 },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.sm },
//   reviewCount: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.success + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm, marginLeft: 'auto' },
//   stockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
//   stockText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.success },
//   priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
//   price: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   originalPrice: { fontSize: 16, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
//   discountBadge: { backgroundColor: COLORS.error + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
//   discountText: { fontSize: 12, fontFamily: 'Inter-Bold', color: COLORS.error },
//   colorSection: { marginTop: SPACING.lg },
//   colorLabel: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[800], marginBottom: SPACING.sm },
//   colorRow: { flexDirection: 'row', gap: 10 },
//   colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: COLORS.neutral[200], justifyContent: 'center', alignItems: 'center' },
//   colorDotActive: { borderColor: COLORS.primary[600], borderWidth: 3 },
//   qtySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.lg },
//   qtyLabel: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[800] },
//   qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.lg, paddingHorizontal: 4 },
//   qtyBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
//   qtyValue: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   tabsRow: { flexDirection: 'row', marginTop: SPACING.xl, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[200] },
//   tab: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center' },
//   tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary[700] },
//   tabText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[500] },
//   tabTextActive: { color: COLORS.primary[700], fontFamily: 'Inter-SemiBold' },
//   tabContent: { marginTop: SPACING.md },
//   descriptionText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], lineHeight: 22 },
//   featuresTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], marginTop: SPACING.md, marginBottom: SPACING.sm },
//   featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
//   featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gold[400] },
//   featureText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[700] },
//   specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   specLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   specValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   ratingSummary: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.lg },
//   ratingBig: { alignItems: 'center' },
//   ratingBigValue: { fontSize: 36, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   ratingStars: { flexDirection: 'row', gap: 2, marginTop: 4 },
//   ratingCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
//   ratingBreakdown: { flex: 1, gap: 4 },
//   breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   breakdownLabel: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[600], width: 28 },
//   breakdownBar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: COLORS.neutral[200] },
//   breakdownFill: { height: '100%', borderRadius: 3, backgroundColor: COLORS.gold[400] },
//   breakdownCount: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], width: 20 },
//   reviewCard: { flexDirection: 'row', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
//   reviewBody: { flex: 1, marginLeft: SPACING.md },
//   reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   reviewName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   reviewStars: { flexDirection: 'row', gap: 1 },
//   reviewComment: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
//   reviewDate: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
//   faqItem: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   faqQ: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   faqA: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
//   deliveryCard: { marginTop: SPACING.lg, backgroundColor: COLORS.primary[50], borderRadius: RADIUS.xl, padding: SPACING.md, gap: SPACING.md },
//   deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   deliveryTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   deliveryDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   relatedSection: { marginTop: SPACING.xl },
//   relatedTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
//   bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, paddingBottom: 30, borderTopWidth: 1, borderTopColor: COLORS.neutral[100], ...SHADOWS.large },
//   wishAction: { width: 52, height: 52, borderRadius: RADIUS.lg, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
// });






// // app/product/[id].tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
// import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Check } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/Button';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// export default function ProductDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { has, toggle } = useWishlist();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [related, setRelated] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');

//   const load = useCallback(async () => {
//     const p = await mockApi.getProduct(id);
//     setProduct(p || null);
//     if (p) {
//       const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
//       setRelated(rels);
//     }
//     setLoading(false);
//   }, [id]);

//   useEffect(() => { load(); }, [load]);

//   const handleAddCart = () => {
//     if (!product) return;
//     addItem({
//       id: `${product.id}_${Date.now()}`,
//       productId: product.id,
//       name: product.name,
//       image: product.images[0],
//       price: product.price,
//       quantity: qty,
//       type: 'product',
//     });
//     show('Added to cart');
//   };

//   const handleBuyNow = () => {
//     handleAddCart();
//     router.push('/checkout');
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
//     } catch {}
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={{ padding: SPACING.md }}>
//           <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
//           <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
//           <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
//           <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
//         </View>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text>Product not found</Text>
//         <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
//       </View>
//     );
//   }

//   const isWishlisted = has(product.id);

//   // Safely get reviews array
//   const reviews = Array.isArray(product.reviews) ? product.reviews : [];

//   const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
//     const count = reviews.filter(r => Math.round(r.rating) === stars).length;
//     const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
//     return { stars, count, pct };
//   });

//   // Safely get features array
//   const features = Array.isArray(product.features) ? product.features : [];

//   // Safely get colors array
//   const colors = Array.isArray(product.colors) ? product.colors : ['#6C63FF'];

//   // Safely get specifications - handle both array and object
//   const getSpecsArray = () => {
//     const specs = product.specifications;
//     if (!specs) return [];

//     if (Array.isArray(specs)) {
//       return specs;
//     }

//     if (typeof specs === 'object') {
//       return Object.entries(specs).map(([key, value]) => ({
//         label: key.charAt(0).toUpperCase() + key.slice(1),
//         value: String(value)
//       }));
//     }

//     return [];
//   };

//   const specifications = getSpecsArray();

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* Image Gallery */}
//         <View style={styles.galleryWrap}>
//           <FlatList
//             data={product.images}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
//             scrollEventThrottle={16}
//             keyExtractor={(_, i) => i.toString()}
//             renderItem={({ item }) => (
//               <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
//             )}
//           />
//           <View style={styles.galleryDots}>
//             {product.images.map((_, i) => (
//               <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
//             ))}
//           </View>
//         </View>

//         {/* Header Actions */}
//         <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={22} />
//           </TouchableOpacity>
//           <View style={styles.floatBtnRow}>
//             <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
//               <Share2 color={COLORS.neutral[800]} size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//               <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[800]} size={20} fill={isWishlisted ? COLORS.error : 'transparent'} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Product Info */}
//         <View style={styles.infoSection}>
//           <View style={styles.categoryRow}>
//             <Text style={styles.categoryText}>{product.categoryName}</Text>
//             {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
//           </View>
//           <Text style={styles.productName}>{product.name}</Text>
//           <View style={styles.ratingRow}>
//             <RatingBadge rating={product.rating} />
//             <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
//             {product.inStock ? (
//               <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
//             ) : (
//               <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
//             )}
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//             {product.originalPrice > product.price && (
//               <>
//                 <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//                 <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
//               </>
//             )}
//           </View>

//           {/* Colors */}
//           {colors.length > 0 && (
//             <View style={styles.colorSection}>
//               <Text style={styles.colorLabel}>Available Colors</Text>
//               <View style={styles.colorRow}>
//                 {colors.map((c, i) => (
//                   <TouchableOpacity
//                     key={i}
//                     style={[styles.colorDot, { backgroundColor: c }, selectedColor === i && styles.colorDotActive]}
//                     onPress={() => setSelectedColor(i)}
//                   >
//                     {selectedColor === i && <Check color={c === '#FFFFFF' ? COLORS.neutral[900] : COLORS.white} size={16} />}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Quantity */}
//           <View style={styles.qtySection}>
//             <Text style={styles.qtyLabel}>Quantity</Text>
//             <View style={styles.qtyControl}>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
//                 <Minus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//               <Text style={styles.qtyValue}>{qty}</Text>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
//                 <Plus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Tabs */}
//           <View style={styles.tabsRow}>
//             {([
//               { key: 'description', label: 'Description' },
//               { key: 'specs', label: 'Specs' },
//               { key: 'reviews', label: 'Reviews' },
//               { key: 'faq', label: 'FAQ' },
//             ] as const).map((t) => (
//               <TouchableOpacity
//                 key={t.key}
//                 style={[styles.tab, activeTab === t.key && styles.tabActive]}
//                 onPress={() => setActiveTab(t.key)}
//               >
//                 <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Tab Content */}
//           {activeTab === 'description' && (
//             <View style={styles.tabContent}>
//               <Text style={styles.descriptionText}>{product.description}</Text>
//               {features.length > 0 && (
//                 <>
//                   <Text style={styles.featuresTitle}>Key Features</Text>
//                   {features.map((f, i) => (
//                     <View key={i} style={styles.featureRow}>
//                       <View style={styles.featureDot} />
//                       <Text style={styles.featureText}>{f}</Text>
//                     </View>
//                   ))}
//                 </>
//               )}
//             </View>
//           )}

//           {activeTab === 'specs' && (
//             <View style={styles.tabContent}>
//               {specifications.length > 0 ? (
//                 specifications.map((s, i) => (
//                   <View key={i} style={styles.specRow}>
//                     <Text style={styles.specLabel}>{s.label}</Text>
//                     <Text style={styles.specValue}>{s.value}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No specifications available</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'reviews' && (
//             <View style={styles.tabContent}>
//               <View style={styles.ratingSummary}>
//                 <View style={styles.ratingBig}>
//                   <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
//                   <View style={styles.ratingStars}>
//                     {[1,2,3,4,5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
//                   </View>
//                   <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
//                 </View>
//                 <View style={styles.ratingBreakdown}>
//                   {ratingBreakdown.map((r) => (
//                     <View key={r.stars} style={styles.breakdownRow}>
//                       <Text style={styles.breakdownLabel}>{r.stars}★</Text>
//                       <View style={styles.breakdownBar}>
//                         <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
//                       </View>
//                       <Text style={styles.breakdownCount}>{r.count}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               {reviews.length > 0 ? (
//                 reviews.map((review) => (
//                   <View key={review.id} style={styles.reviewCard}>
//                     <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
//                     <View style={styles.reviewBody}>
//                       <View style={styles.reviewHeader}>
//                         <Text style={styles.reviewName}>{review.userName}</Text>
//                         <View style={styles.reviewStars}>
//                           {[1,2,3,4,5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
//                         </View>
//                       </View>
//                       <Text style={styles.reviewComment}>{review.comment}</Text>
//                       <Text style={styles.reviewDate}>{review.date}</Text>
//                     </View>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No reviews yet</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'faq' && (
//             <View style={styles.tabContent}>
//               {[
//                 { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
//                 { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
//                 { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
//                 { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
//               ].map((f, i) => (
//                 <View key={i} style={styles.faqItem}>
//                   <Text style={styles.faqQ}>{f.q}</Text>
//                   <Text style={styles.faqA}>{f.a}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* Delivery Info */}
//           <View style={styles.deliveryCard}>
//             <View style={styles.deliveryRow}>
//               <Truck color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Free Delivery</Text>
//                 <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Shield color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Quality Assured</Text>
//                 <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <RotateCcw color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Flexible Booking</Text>
//                 <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
//               </View>
//             </View>
//           </View>

//           {/* Related Products */}
//           {related.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You May Also Like</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//                 {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.wishAction} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//           <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
//         </TouchableOpacity>
//         <Button onPress={handleAddCart} variant="outline" size="lg" style={{ flex: 1 }}>
//           <ShoppingBag size={18} color={COLORS.primary[700]} /> Add to Cart
//         </Button>
//         <Button onPress={handleBuyNow} variant="gold" size="lg" style={{ flex: 1 }}>Buy Now</Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   galleryWrap: { width: width, height: 350, position: 'relative' },
//   galleryImage: { width, height: 350 },
//   galleryDots: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
//   galleryDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
//   galleryDotActive: { width: 24, backgroundColor: COLORS.white },
//   floatingHeader: { position: 'absolute', left: SPACING.md, right: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
//   floatBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   floatBtnRow: { flexDirection: 'row', gap: 8 },
//   infoSection: { backgroundColor: COLORS.white, marginTop: -20, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg },
//   categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   categoryText: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[500], textTransform: 'uppercase', letterSpacing: 1 },
//   bestBadge: { backgroundColor: COLORS.gold[400], paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm },
//   bestText: { fontSize: 9, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   productName: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginTop: 6, lineHeight: 28 },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.sm },
//   reviewCount: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.success + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm, marginLeft: 'auto' },
//   stockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
//   stockText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.success },
//   priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
//   price: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   originalPrice: { fontSize: 16, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
//   discountBadge: { backgroundColor: COLORS.error + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
//   discountText: { fontSize: 12, fontFamily: 'Inter-Bold', color: COLORS.error },
//   colorSection: { marginTop: SPACING.lg },
//   colorLabel: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[800], marginBottom: SPACING.sm },
//   colorRow: { flexDirection: 'row', gap: 10 },
//   colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: COLORS.neutral[200], justifyContent: 'center', alignItems: 'center' },
//   colorDotActive: { borderColor: COLORS.primary[600], borderWidth: 3 },
//   qtySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.lg },
//   qtyLabel: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[800] },
//   qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.lg, paddingHorizontal: 4 },
//   qtyBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
//   qtyValue: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   tabsRow: { flexDirection: 'row', marginTop: SPACING.xl, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[200] },
//   tab: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center' },
//   tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary[700] },
//   tabText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[500] },
//   tabTextActive: { color: COLORS.primary[700], fontFamily: 'Inter-SemiBold' },
//   tabContent: { marginTop: SPACING.md },
//   descriptionText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], lineHeight: 22 },
//   featuresTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], marginTop: SPACING.md, marginBottom: SPACING.sm },
//   featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
//   featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gold[400] },
//   featureText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[700] },
//   specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   specLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   specValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   noDataText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], textAlign: 'center', paddingVertical: SPACING.lg },
//   ratingSummary: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.lg },
//   ratingBig: { alignItems: 'center' },
//   ratingBigValue: { fontSize: 36, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   ratingStars: { flexDirection: 'row', gap: 2, marginTop: 4 },
//   ratingCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
//   ratingBreakdown: { flex: 1, gap: 4 },
//   breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   breakdownLabel: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[600], width: 28 },
//   breakdownBar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: COLORS.neutral[200] },
//   breakdownFill: { height: '100%', borderRadius: 3, backgroundColor: COLORS.gold[400] },
//   breakdownCount: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], width: 20 },
//   reviewCard: { flexDirection: 'row', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
//   reviewBody: { flex: 1, marginLeft: SPACING.md },
//   reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   reviewName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   reviewStars: { flexDirection: 'row', gap: 1 },
//   reviewComment: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
//   reviewDate: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
//   faqItem: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   faqQ: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   faqA: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
//   deliveryCard: { marginTop: SPACING.lg, backgroundColor: COLORS.primary[50], borderRadius: RADIUS.xl, padding: SPACING.md, gap: SPACING.md },
//   deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   deliveryTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   deliveryDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   relatedSection: { marginTop: SPACING.xl },
//   relatedTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
//   bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, paddingBottom: 30, borderTopWidth: 1, borderTopColor: COLORS.neutral[100], ...SHADOWS.large },
//   wishAction: { width: 52, height: 52, borderRadius: RADIUS.lg, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
// });




// app/product/[id].tsx - UPDATED with color-image switching
// app/product/[id].tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
// import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi, getFullImageUrl } from '@/services/api';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/Button';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// // ─── Helper: Check if color is light ──────────────────────────────────────────
// const isLightColor = (hex: string): boolean => {
//   const hexColor = hex.replace('#', '');
//   const r = parseInt(hexColor.substr(0, 2), 16);
//   const g = parseInt(hexColor.substr(2, 2), 16);
//   const b = parseInt(hexColor.substr(4, 2), 16);
//   const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//   return brightness > 128;
// };

// // ─── Helper: Get color name from hex ──────────────────────────────────────────
// const getColorName = (hex: string): string => {
//   const colorMap: Record<string, string> = {
//     '#FF0000': 'Red',
//     '#DC143C': 'Crimson',
//     '#800000': 'Maroon',
//     '#FF69B4': 'Pink',
//     '#FF1493': 'Hot Pink',
//     '#FF8C00': 'Orange',
//     '#FFD700': 'Gold',
//     '#FFFF00': 'Yellow',
//     '#00FF00': 'Lime',
//     '#008000': 'Green',
//     '#008080': 'Teal',
//     '#00FFFF': 'Cyan',
//     '#87CEEB': 'Sky Blue',
//     '#0000FF': 'Blue',
//     '#000080': 'Navy',
//     '#4B0082': 'Indigo',
//     '#800080': 'Purple',
//     '#EE82EE': 'Violet',
//     '#FF00FF': 'Magenta',
//     '#A52A2A': 'Brown',
//     '#F5F5DC': 'Beige',
//     '#FFFFFF': 'White',
//     '#808080': 'Gray',
//     '#000000': 'Black',
//     '#C0C0C0': 'Silver',
//     '#B76E79': 'Rose Gold',
//     '#B87333': 'Copper',
//     '#CD7F32': 'Bronze',
//     '#50C878': 'Emerald',
//     '#0F52BA': 'Sapphire',
//     '#9B111E': 'Ruby',
//     '#6C63FF': 'Purple',
//   };
//   return colorMap[hex] || hex;
// };

// export default function ProductDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { has, toggle } = useWishlist();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [related, setRelated] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');

//   // ─── State for color-image mapping ──────────────────────────────────────────
//   const [colorImagesMap, setColorImagesMap] = useState<Record<string, string[]>>({});
//   const [currentColorImages, setCurrentColorImages] = useState<string[]>([]);

//   const load = useCallback(async () => {
//     console.log(`🔍 Loading product with ID: ${id}`);
//     try {
//       const p = await mockApi.getProduct(id);

//       console.log('📦 Full product data:', JSON.stringify(p, null, 2));
//       console.log('🎨 Colors:', p?.colors);
//       console.log('🖼️ Color Images Map:', p?.color_images);
//       console.log('📸 General Images:', p?.images);

//       setProduct(p || null);

//       // ─── Set up color-image mapping ────────────────────────────────────────────
//       if (p?.color_images && Object.keys(p.color_images).length > 0) {
//         console.log('✅ Color images found:', Object.keys(p.color_images));

//         // Process color images to ensure full URLs
//         const processedColorImages: Record<string, string[]> = {};
//         Object.keys(p.color_images).forEach(color => {
//           const images = p.color_images[color];
//           if (Array.isArray(images) && images.length > 0) {
//             processedColorImages[color] = images.map(img => getFullImageUrl(img));
//             console.log(`  ${color}: ${processedColorImages[color].length} images`);
//           }
//         });

//         setColorImagesMap(processedColorImages);

//         // Set initial images based on first color
//         const firstColor = p.colors?.[0];
//         if (firstColor && processedColorImages[firstColor] && processedColorImages[firstColor].length > 0) {
//           setCurrentColorImages(processedColorImages[firstColor]);
//           console.log(`✅ Using ${processedColorImages[firstColor].length} images for ${firstColor}`);
//         } else {
//           // Fallback to general images
//           const generalImages = p.images?.map(img => getFullImageUrl(img)) || [];
//           setCurrentColorImages(generalImages);
//           console.log('📸 Using general images (no images for first color)');
//         }
//       } else {
//         const generalImages = p?.images?.map(img => getFullImageUrl(img)) || [];
//         setCurrentColorImages(generalImages);
//         console.log('📸 Using general images');
//       }

//       if (p) {
//         const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
//         setRelated(rels);
//       }
//     } catch (error) {
//       console.error('Error loading product:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => { load(); }, [load]);

//   // ─── Handle color selection - update images ──────────────────────────────────
//   const handleColorSelect = (index: number) => {
//     setSelectedColor(index);
//     const colors = product?.colors || [];
//     const selectedColorHex = colors[index];

//     console.log(`🎨 Color selected: ${selectedColorHex} (${getColorName(selectedColorHex)})`);
//     console.log(`📊 Available color images keys:`, Object.keys(colorImagesMap));
//     console.log(`📊 Images for ${selectedColorHex}:`, colorImagesMap[selectedColorHex]);

//     // Check if we have color-specific images for this color
//     if (selectedColorHex && colorImagesMap[selectedColorHex] && colorImagesMap[selectedColorHex].length > 0) {
//       setCurrentColorImages(colorImagesMap[selectedColorHex]);
//       console.log(`🖼️ Showing ${colorImagesMap[selectedColorHex].length} images for ${getColorName(selectedColorHex)}`);
//     } else {
//       // Fallback to general images
//       const generalImages = product?.images?.map(img => getFullImageUrl(img)) || [];
//       setCurrentColorImages(generalImages);
//       console.log(`📸 Using general images (${generalImages.length} images) for ${getColorName(selectedColorHex)}`);
//     }
//     setActiveImage(0); // Reset to first image
//   };

//   const handleAddCart = () => {
//     if (!product) return;
//     addItem({
//       id: `${product.id}_${Date.now()}`,
//       productId: product.id,
//       name: product.name,
//       image: product.images[0],
//       price: product.price,
//       quantity: qty,
//       type: 'product',
//     });
//     show('Added to cart');
//   };

//   const handleBuyNow = () => {
//     handleAddCart();
//     router.push('/checkout');
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
//     } catch {}
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={{ padding: SPACING.md }}>
//           <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
//           <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
//           <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
//           <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
//         </View>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text>Product not found</Text>
//         <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
//       </View>
//     );
//   }

//   const isWishlisted = has(product.id);

//   // Safely get reviews array
//   const reviews = Array.isArray(product.reviews) ? product.reviews : [];

//   const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
//     const count = reviews.filter(r => Math.round(r.rating) === stars).length;
//     const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
//     return { stars, count, pct };
//   });

//   // Safely get features array
//   const features = Array.isArray(product.features) ? product.features : [];

//   // Safely get colors array
//   const colors = Array.isArray(product.colors) ? product.colors : ['#6C63FF'];

//   // Safely get sizes array
//   const sizes = Array.isArray(product.sizes) ? product.sizes : [];

//   // Safely get specifications - handle both array and object
//   const getSpecsArray = () => {
//     const specs = product.specifications;
//     if (!specs) return [];

//     if (Array.isArray(specs)) {
//       return specs;
//     }

//     if (typeof specs === 'object') {
//       return Object.entries(specs).map(([key, value]) => ({
//         label: key.charAt(0).toUpperCase() + key.slice(1),
//         value: String(value)
//       }));
//     }

//     return [];
//   };

//   const specifications = getSpecsArray();

//   // ─── Use currentColorImages for gallery ──────────────────────────────────────
//   const displayImages = currentColorImages.length > 0 ? currentColorImages : product.images.map(img => getFullImageUrl(img));

//   console.log('🖼️ Display images count:', displayImages.length);

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

//         {/* ─── Image Gallery ────────────────────────────────────────────────────── */}
//         <View style={styles.galleryWrap}>
//           {displayImages.length > 0 ? (
//             <FlatList
//               data={displayImages}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
//               scrollEventThrottle={16}
//               keyExtractor={(_, i) => i.toString()}
//               renderItem={({ item }) => (
//                 <Image 
//                   source={{ uri: item }} 
//                   style={styles.galleryImage} 
//                   resizeMode="cover"
//                   onError={(e) => {
//                     console.log('Image load error:', item);
//                   }}
//                 />
//               )}
//             />
//           ) : (
//             <View style={[styles.galleryImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.neutral[100] }]}>
//               <Text style={{ color: COLORS.neutral[500] }}>No images available</Text>
//             </View>
//           )}
//           {displayImages.length > 1 && (
//             <View style={styles.galleryDots}>
//               {displayImages.map((_, i) => (
//                 <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
//               ))}
//             </View>
//           )}

//           {/* ─── Show color indicator on images ────────────────────────────────── */}
//           {colors.length > 0 && colors[selectedColor] && (
//             <View style={styles.colorIndicator}>
//               <View 
//                 style={[styles.colorIndicatorDot, { backgroundColor: colors[selectedColor] }]} 
//               />
//               <Text style={styles.colorIndicatorText}>
//                 {getColorName(colors[selectedColor])}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* ─── Header Actions ────────────────────────────────────────────────── */}
//         <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={22} />
//           </TouchableOpacity>
//           <View style={styles.floatBtnRow}>
//             <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
//               <Share2 color={COLORS.neutral[800]} size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//               <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[800]} size={20} fill={isWishlisted ? COLORS.error : 'transparent'} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ─── Product Info ────────────────────────────────────────────────────── */}
//         <View style={styles.infoSection}>
//           <View style={styles.categoryRow}>
//             <Text style={styles.categoryText}>{product.categoryName}</Text>
//             {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
//           </View>
//           <Text style={styles.productName}>{product.name}</Text>
//           <View style={styles.ratingRow}>
//             <RatingBadge rating={product.rating} />
//             <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
//             {product.inStock ? (
//               <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
//             ) : (
//               <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
//             )}
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//             {product.originalPrice > product.price && (
//               <>
//                 <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//                 <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
//               </>
//             )}
//           </View>

//           {/* ─── Colors - with color switching ────────────────────────────────── */}
//           {colors.length > 0 && (
//             <View style={styles.colorSection}>
//               <Text style={styles.colorLabel}>
//                 Available Colors 
//                 <Text style={styles.colorCount}>
//                   ({colors.length} {colors.length === 1 ? 'color' : 'colors'})
//                 </Text>
//               </Text>
//               <View style={styles.colorRow}>
//                 {colors.map((c, i) => (
//                   <TouchableOpacity
//                     key={i}
//                     style={[
//                       styles.colorDot, 
//                       { backgroundColor: c },
//                       selectedColor === i && styles.colorDotActive
//                     ]}
//                     onPress={() => handleColorSelect(i)}
//                   >
//                     {selectedColor === i && (
//                       <Check 
//                         color={isLightColor(c) ? COLORS.neutral[900] : COLORS.white} 
//                         size={16} 
//                       />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               {colors[selectedColor] && (
//                 <View style={styles.selectedColorInfo}>
//                   <Text style={styles.selectedColorName}>
//                     Selected: {getColorName(colors[selectedColor])}
//                   </Text>
//                   {colorImagesMap[colors[selectedColor]] && (
//                     <Text style={styles.selectedColorImageCount}>
//                       {colorImagesMap[colors[selectedColor]].length} image{colorImagesMap[colors[selectedColor]].length !== 1 ? 's' : ''} available
//                     </Text>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}

//           {/* ─── Sizes ────────────────────────────────────────────────────────── */}
//           {sizes.length > 0 && (
//             <View style={styles.sizeSection}>
//               <Text style={styles.sizeLabel}>Available Sizes</Text>
//               <View style={styles.sizeRow}>
//                 {sizes.map((size, i) => (
//                   <View key={i} style={styles.sizeTag}>
//                     <Text style={styles.sizeText}>{size}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* ─── Quantity ────────────────────────────────────────────────────── */}
//           <View style={styles.qtySection}>
//             <Text style={styles.qtyLabel}>Quantity</Text>
//             <View style={styles.qtyControl}>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
//                 <Minus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//               <Text style={styles.qtyValue}>{qty}</Text>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
//                 <Plus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* ─── Tabs ──────────────────────────────────────────────────────────── */}
//           <View style={styles.tabsRow}>
//             {([
//               { key: 'description', label: 'Description' },
//               { key: 'specs', label: 'Specs' },
//               { key: 'reviews', label: 'Reviews' },
//               { key: 'faq', label: 'FAQ' },
//             ] as const).map((t) => (
//               <TouchableOpacity
//                 key={t.key}
//                 style={[styles.tab, activeTab === t.key && styles.tabActive]}
//                 onPress={() => setActiveTab(t.key)}
//               >
//                 <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* ─── Tab Content ──────────────────────────────────────────────────── */}
//           {activeTab === 'description' && (
//             <View style={styles.tabContent}>
//               <Text style={styles.descriptionText}>
//                 {product.description || 'No description available for this product.'}
//               </Text>
//               {features.length > 0 && (
//                 <>
//                   <Text style={styles.featuresTitle}>Key Features</Text>
//                   {features.map((f, i) => (
//                     <View key={i} style={styles.featureRow}>
//                       <View style={styles.featureDot} />
//                       <Text style={styles.featureText}>{f}</Text>
//                     </View>
//                   ))}
//                 </>
//               )}
//             </View>
//           )}

//           {activeTab === 'specs' && (
//             <View style={styles.tabContent}>
//               {specifications.length > 0 ? (
//                 specifications.map((s, i) => (
//                   <View key={i} style={styles.specRow}>
//                     <Text style={styles.specLabel}>{s.label}</Text>
//                     <Text style={styles.specValue}>{s.value}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No specifications available</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'reviews' && (
//             <View style={styles.tabContent}>
//               <View style={styles.ratingSummary}>
//                 <View style={styles.ratingBig}>
//                   <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
//                   <View style={styles.ratingStars}>
//                     {[1,2,3,4,5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
//                   </View>
//                   <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
//                 </View>
//                 <View style={styles.ratingBreakdown}>
//                   {ratingBreakdown.map((r) => (
//                     <View key={r.stars} style={styles.breakdownRow}>
//                       <Text style={styles.breakdownLabel}>{r.stars}★</Text>
//                       <View style={styles.breakdownBar}>
//                         <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
//                       </View>
//                       <Text style={styles.breakdownCount}>{r.count}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               {reviews.length > 0 ? (
//                 reviews.map((review) => (
//                   <View key={review.id} style={styles.reviewCard}>
//                     <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
//                     <View style={styles.reviewBody}>
//                       <View style={styles.reviewHeader}>
//                         <Text style={styles.reviewName}>{review.userName}</Text>
//                         <View style={styles.reviewStars}>
//                           {[1,2,3,4,5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
//                         </View>
//                       </View>
//                       <Text style={styles.reviewComment}>{review.comment}</Text>
//                       <Text style={styles.reviewDate}>{review.date}</Text>
//                     </View>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No reviews yet</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'faq' && (
//             <View style={styles.tabContent}>
//               {[
//                 { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
//                 { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
//                 { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
//                 { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
//               ].map((f, i) => (
//                 <View key={i} style={styles.faqItem}>
//                   <Text style={styles.faqQ}>{f.q}</Text>
//                   <Text style={styles.faqA}>{f.a}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* ─── Delivery Info ────────────────────────────────────────────────── */}
//           <View style={styles.deliveryCard}>
//             <View style={styles.deliveryRow}>
//               <Truck color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Free Delivery</Text>
//                 <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Shield color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Quality Assured</Text>
//                 <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <RotateCcw color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Flexible Booking</Text>
//                 <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
//               </View>
//             </View>
//           </View>

//           {/* ─── Related Products ────────────────────────────────────────────── */}
//           {related.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You May Also Like</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//                 {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* ─── Bottom Actions ────────────────────────────────────────────────────── */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.wishAction} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//           <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
//         </TouchableOpacity>
//         <Button onPress={handleAddCart} variant="outline" size="lg" style={{ flex: 1 }}>
//           <ShoppingBag size={18} color={COLORS.primary[700]} /> Add to Cart
//         </Button>
//         <Button onPress={handleBuyNow} variant="gold" size="lg" style={{ flex: 1 }}>Buy Now</Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },

//   galleryWrap: { width: width, height: 350, position: 'relative' },
//   galleryImage: { width, height: 350 },
//   galleryDots: { 
//     position: 'absolute', 
//     bottom: 16, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     justifyContent: 'center', 
//     gap: 6 
//   },
//   galleryDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: 'rgba(255,255,255,0.5)' 
//   },
//   galleryDotActive: { 
//     width: 24, 
//     backgroundColor: COLORS.white 
//   },

//   // ─── Color indicator on image ────────────────────────────────────────────────
//   colorIndicator: {
//     position: 'absolute',
//     bottom: 50,
//     right: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: RADIUS.pill,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   colorIndicatorDot: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   colorIndicatorText: {
//     color: COLORS.white,
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//   },

//   floatingHeader: { 
//     position: 'absolute', 
//     left: SPACING.md, 
//     right: SPACING.md, 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     zIndex: 10 
//   },
//   floatBtn: { 
//     width: 42, 
//     height: 42, 
//     borderRadius: 21, 
//     backgroundColor: 'rgba(255,255,255,0.9)', 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     ...SHADOWS.small 
//   },
//   floatBtnRow: { flexDirection: 'row', gap: 8 },

//   infoSection: { 
//     backgroundColor: COLORS.white, 
//     marginTop: -20, 
//     borderTopLeftRadius: RADIUS.xxl, 
//     borderTopRightRadius: RADIUS.xxl, 
//     padding: SPACING.lg 
//   },

//   categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   categoryText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500], 
//     textTransform: 'uppercase', 
//     letterSpacing: 1 
//   },
//   bestBadge: { 
//     backgroundColor: COLORS.gold[400], 
//     paddingHorizontal: 8, 
//     paddingVertical: 2, 
//     borderRadius: RADIUS.sm 
//   },
//   bestText: { 
//     fontSize: 9, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },

//   productName: { 
//     fontSize: 22, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     marginTop: 6, 
//     lineHeight: 28 
//   },

//   ratingRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8, 
//     marginTop: SPACING.sm 
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   stockBadge: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 4, 
//     backgroundColor: COLORS.success + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm, 
//     marginLeft: 'auto' 
//   },
//   stockDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.success 
//   },
//   stockText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.success 
//   },

//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginTop: SPACING.md 
//   },
//   price: { 
//     fontSize: 26, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   originalPrice: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: COLORS.error + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm 
//   },
//   discountText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.error 
//   },

//   // ─── Color Section ───────────────────────────────────────────────────────────
//   colorSection: { marginTop: SPACING.lg },
//   colorLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   colorCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//     marginLeft: 4,
//   },
//   colorRow: { 
//     flexDirection: 'row', 
//     gap: 10, 
//     flexWrap: 'wrap' 
//   },
//   colorDot: { 
//     width: 36, 
//     height: 36, 
//     borderRadius: 18, 
//     borderWidth: 2, 
//     borderColor: COLORS.neutral[200], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   colorDotActive: { 
//     borderColor: COLORS.primary[600], 
//     borderWidth: 3 
//   },
//   selectedColorInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 6,
//     flexWrap: 'wrap',
//   },
//   selectedColorName: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600] 
//   },
//   selectedColorImageCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.primary[500],
//     backgroundColor: COLORS.primary[50],
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: RADIUS.sm,
//   },

//   // ─── Size Section ────────────────────────────────────────────────────────────
//   sizeSection: { marginTop: SPACING.lg },
//   sizeLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   sizeRow: { 
//     flexDirection: 'row', 
//     gap: 8, 
//     flexWrap: 'wrap' 
//   },
//   sizeTag: { 
//     paddingHorizontal: 14, 
//     paddingVertical: 6, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.pill, 
//     borderWidth: 1, 
//     borderColor: COLORS.neutral[200] 
//   },
//   sizeText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[700] 
//   },

//   qtySection: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     marginTop: SPACING.lg 
//   },
//   qtyLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800] 
//   },
//   qtyControl: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 16, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.lg, 
//     paddingHorizontal: 4 
//   },
//   qtyBtn: { 
//     width: 36, 
//     height: 36, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   qtyValue: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },

//   tabsRow: { 
//     flexDirection: 'row', 
//     marginTop: SPACING.xl, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[200] 
//   },
//   tab: { 
//     flex: 1, 
//     paddingVertical: SPACING.sm, 
//     alignItems: 'center' 
//   },
//   tabActive: { 
//     borderBottomWidth: 2, 
//     borderBottomColor: COLORS.primary[700] 
//   },
//   tabText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500] 
//   },
//   tabTextActive: { 
//     color: COLORS.primary[700], 
//     fontFamily: 'Inter-SemiBold' 
//   },

//   tabContent: { marginTop: SPACING.md },

//   descriptionText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     lineHeight: 22 
//   },
//   featuresTitle: { 
//     fontSize: 15, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900], 
//     marginTop: SPACING.md, 
//     marginBottom: SPACING.sm 
//   },
//   featureRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginBottom: 8 
//   },
//   featureDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   featureText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[700] 
//   },

//   specRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: SPACING.sm, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   specLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   specValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   noDataText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     textAlign: 'center', 
//     paddingVertical: SPACING.lg 
//   },

//   ratingSummary: { 
//     flexDirection: 'row', 
//     gap: SPACING.lg, 
//     marginBottom: SPACING.lg, 
//     padding: SPACING.md, 
//     backgroundColor: COLORS.neutral[50], 
//     borderRadius: RADIUS.lg 
//   },
//   ratingBig: { alignItems: 'center' },
//   ratingBigValue: { 
//     fontSize: 36, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   ratingStars: { flexDirection: 'row', gap: 2, marginTop: 4 },
//   ratingCount: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 4 
//   },
//   ratingBreakdown: { flex: 1, gap: 4 },
//   breakdownRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8 
//   },
//   breakdownLabel: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[600], 
//     width: 28 
//   },
//   breakdownBar: { 
//     flex: 1, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.neutral[200] 
//   },
//   breakdownFill: { 
//     height: '100%', 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   breakdownCount: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     width: 20 
//   },

//   reviewCard: { 
//     flexDirection: 'row', 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   reviewAvatar: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20 
//   },
//   reviewBody: { 
//     flex: 1, 
//     marginLeft: SPACING.md 
//   },
//   reviewHeader: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center' 
//   },
//   reviewName: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   reviewComment: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },
//   reviewDate: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     marginTop: 4 
//   },

//   faqItem: { 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   faqQ: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   faqA: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },

//   deliveryCard: { 
//     marginTop: SPACING.lg, 
//     backgroundColor: COLORS.primary[50], 
//     borderRadius: RADIUS.xl, 
//     padding: SPACING.md, 
//     gap: SPACING.md 
//   },
//   deliveryRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 12 
//   },
//   deliveryTitle: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   deliveryDesc: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 2 
//   },

//   relatedSection: { marginTop: SPACING.xl },
//   relatedTitle: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     paddingHorizontal: SPACING.md, 
//     marginBottom: SPACING.md 
//   },

//   bottomBar: { 
//     position: 'absolute', 
//     bottom: 0, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: SPACING.sm, 
//     backgroundColor: COLORS.white, 
//     paddingHorizontal: SPACING.md, 
//     paddingVertical: SPACING.md, 
//     paddingBottom: 30, 
//     borderTopWidth: 1, 
//     borderTopColor: COLORS.neutral[100], 
//     ...SHADOWS.large 
//   },
//   wishAction: { 
//     width: 52, 
//     height: 52, 
//     borderRadius: RADIUS.lg, 
//     backgroundColor: COLORS.neutral[100], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
// });




// app/product/[id].tsx
// // app/product/[id].tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
// import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi, getFullImageUrl } from '@/services/api';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/Button';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// // ─── Helper: Check if color is light ──────────────────────────────────────────
// const isLightColor = (hex: string): boolean => {
//   const hexColor = hex.replace('#', '');
//   const r = parseInt(hexColor.substr(0, 2), 16);
//   const g = parseInt(hexColor.substr(2, 2), 16);
//   const b = parseInt(hexColor.substr(4, 2), 16);
//   const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//   return brightness > 128;
// };

// // ─── Helper: Get color name from hex ──────────────────────────────────────────
// const getColorName = (hex: string): string => {
//   const colorMap: Record<string, string> = {
//     '#FF0000': 'Red',
//     '#DC143C': 'Crimson',
//     '#800000': 'Maroon',
//     '#FF69B4': 'Pink',
//     '#FF1493': 'Hot Pink',
//     '#FF8C00': 'Orange',
//     '#FFD700': 'Gold',
//     '#FFFF00': 'Yellow',
//     '#00FF00': 'Lime',
//     '#008000': 'Green',
//     '#008080': 'Teal',
//     '#00FFFF': 'Cyan',
//     '#87CEEB': 'Sky Blue',
//     '#0000FF': 'Blue',
//     '#000080': 'Navy',
//     '#4B0082': 'Indigo',
//     '#800080': 'Purple',
//     '#EE82EE': 'Violet',
//     '#FF00FF': 'Magenta',
//     '#A52A2A': 'Brown',
//     '#F5F5DC': 'Beige',
//     '#FFFFFF': 'White',
//     '#808080': 'Gray',
//     '#000000': 'Black',
//     '#C0C0C0': 'Silver',
//     '#B76E79': 'Rose Gold',
//     '#B87333': 'Copper',
//     '#CD7F32': 'Bronze',
//     '#50C878': 'Emerald',
//     '#0F52BA': 'Sapphire',
//     '#9B111E': 'Ruby',
//     '#6C63FF': 'Purple',
//   };
//   return colorMap[hex] || hex;
// };

// export default function ProductDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { has, toggle } = useWishlist();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [related, setRelated] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');

//   // ─── State for color-image mapping ──────────────────────────────────────────
//   const [colorImagesMap, setColorImagesMap] = useState<Record<string, string[]>>({});
//   const [currentColorImages, setCurrentColorImages] = useState<string[]>([]);

//   const load = useCallback(async () => {
//     console.log(`🔍 Loading product with ID: ${id}`);
//     try {
//       const p = await mockApi.getProduct(id);

//       console.log('📦 Full product data:', JSON.stringify(p, null, 2));
//       console.log('🎨 Colors:', p?.colors);
//       console.log('🖼️ Color Images Map:', p?.color_images);
//       console.log('📸 General Images:', p?.images);
//       console.log('📝 Description:', p?.description);

//       setProduct(p || null);

//       // ─── Set up color-image mapping ────────────────────────────────────────────
//       if (p?.color_images && Object.keys(p.color_images).length > 0) {
//         console.log('✅ Color images found:', Object.keys(p.color_images));

//         const processedColorImages: Record<string, string[]> = {};
//         Object.keys(p.color_images).forEach(color => {
//           const images = p.color_images?.[color];
//           if (Array.isArray(images) && images.length > 0) {
//             processedColorImages[color] = images.map(img => getFullImageUrl(img));
//             console.log(`  ${color}: ${processedColorImages[color].length} images`);
//           }
//         });

//         setColorImagesMap(processedColorImages);

//         const firstColor = p.colors?.[0];
//         if (firstColor && processedColorImages[firstColor] && processedColorImages[firstColor].length > 0) {
//           setCurrentColorImages(processedColorImages[firstColor]);
//           console.log(`✅ Using ${processedColorImages[firstColor].length} images for ${firstColor}`);
//         } else {
//           const generalImages = p.images?.map(img => getFullImageUrl(img)) || [];
//           setCurrentColorImages(generalImages);
//           console.log('📸 Using general images (no images for first color)');
//         }
//       } else {
//         const generalImages = p?.images?.map(img => getFullImageUrl(img)) || [];
//         setCurrentColorImages(generalImages);
//         console.log('📸 Using general images');
//       }

//       if (p) {
//         const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
//         setRelated(rels);
//       }
//     } catch (error) {
//       console.error('Error loading product:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => { load(); }, [load]);

//   // ─── Handle color selection - update images ──────────────────────────────────
//   const handleColorSelect = (index: number) => {
//     setSelectedColor(index);
//     const colors = product?.colors || [];
//     const selectedColorHex = colors[index];

//     console.log(`🎨 Color selected: ${selectedColorHex} (${getColorName(selectedColorHex)})`);
//     console.log(`📊 Available color images keys:`, Object.keys(colorImagesMap));
//     console.log(`📊 Images for ${selectedColorHex}:`, colorImagesMap[selectedColorHex]);

//     if (selectedColorHex && colorImagesMap[selectedColorHex] && colorImagesMap[selectedColorHex].length > 0) {
//       const validImages = colorImagesMap[selectedColorHex].filter(img => 
//         img && (img.startsWith('http') || img.includes('uploads/'))
//       );

//       if (validImages.length > 0) {
//         setCurrentColorImages(validImages);
//         console.log(`🖼️ Showing ${validImages.length} valid images for ${getColorName(selectedColorHex)}`);
//       } else {
//         const generalImages = product?.images?.map(img => getFullImageUrl(img)) || [];
//         setCurrentColorImages(generalImages);
//         console.log(`📸 Using general images (color images invalid)`);
//       }
//     } else {
//       const generalImages = product?.images?.map(img => getFullImageUrl(img)) || [];
//       setCurrentColorImages(generalImages);
//       console.log(`📸 Using general images (no color images)`);
//     }
//     setActiveImage(0);
//   };

//   const handleAddCart = () => {
//     if (!product) return;
//     addItem({
//       id: `${product.id}_${Date.now()}`,
//       productId: product.id,
//       name: product.name,
//       image: product.images[0],
//       price: product.price,
//       quantity: qty,
//       type: 'product',
//     });
//     show('Added to cart');
//   };

//   const handleBuyNow = () => {
//     handleAddCart();
//     router.push('/checkout');
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
//     } catch {}
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={{ padding: SPACING.md }}>
//           <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
//           <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
//           <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
//           <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
//         </View>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text>Product not found</Text>
//         <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
//       </View>
//     );
//   }

//   const isWishlisted = has(product.id);

//   const reviews = Array.isArray(product.reviews) ? product.reviews : [];

//   const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
//     const count = reviews.filter(r => Math.round(r.rating) === stars).length;
//     const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
//     return { stars, count, pct };
//   });

//   const features = Array.isArray(product.features) ? product.features : [];
//   const colors = Array.isArray(product.colors) ? product.colors : ['#6C63FF'];
//   const sizes = Array.isArray(product.sizes) ? product.sizes : [];

//   const getSpecsArray = () => {
//     const specs = product.specifications;
//     if (!specs) return [];

//     if (Array.isArray(specs)) {
//       return specs;
//     }

//     if (typeof specs === 'object') {
//       return Object.entries(specs).map(([key, value]) => ({
//         label: key.charAt(0).toUpperCase() + key.slice(1),
//         value: String(value)
//       }));
//     }

//     return [];
//   };

//   const specifications = getSpecsArray();
//   const displayImages = currentColorImages.length > 0 ? currentColorImages : product.images.map(img => getFullImageUrl(img));

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

//         {/* ─── Image Gallery ────────────────────────────────────────────────────── */}
//         <View style={styles.galleryWrap}>
//           {displayImages.length > 0 ? (
//             <FlatList
//               data={displayImages}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
//               scrollEventThrottle={16}
//               keyExtractor={(_, i) => i.toString()}
//               renderItem={({ item }) => (
//                 <Image 
//                   source={{ uri: item }} 
//                   style={styles.galleryImage} 
//                   resizeMode="cover"
//                   onError={(e) => {
//                     console.log('Image load error:', item);
//                   }}
//                 />
//               )}
//             />
//           ) : (
//             <View style={[styles.galleryImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.neutral[100] }]}>
//               <Text style={{ color: COLORS.neutral[500] }}>No images available</Text>
//             </View>
//           )}
//           {displayImages.length > 1 && (
//             <View style={styles.galleryDots}>
//               {displayImages.map((_, i) => (
//                 <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
//               ))}
//             </View>
//           )}

//           {colors.length > 0 && colors[selectedColor] && (
//             <View style={styles.colorIndicator}>
//               <View 
//                 style={[styles.colorIndicatorDot, { backgroundColor: colors[selectedColor] }]} 
//               />
//               <Text style={styles.colorIndicatorText}>
//                 {getColorName(colors[selectedColor])}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* ─── Header Actions ────────────────────────────────────────────────── */}
//         <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={22} />
//           </TouchableOpacity>
//           <View style={styles.floatBtnRow}>
//             <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
//               <Share2 color={COLORS.neutral[800]} size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//               <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[800]} size={20} fill={isWishlisted ? COLORS.error : 'transparent'} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ─── Product Info ────────────────────────────────────────────────────── */}
//         <View style={styles.infoSection}>
//           <View style={styles.categoryRow}>
//             <Text style={styles.categoryText}>{product.categoryName}</Text>
//             {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
//           </View>
//           <Text style={styles.productName}>{product.name}</Text>
//           <View style={styles.ratingRow}>
//             <RatingBadge rating={product.rating} />
//             <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
//             {product.inStock ? (
//               <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
//             ) : (
//               <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
//             )}
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//             {product.originalPrice > product.price && (
//               <>
//                 <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//                 <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
//               </>
//             )}
//           </View>

//           {/* ─── Description Preview ──────────────────────────────────────────── */}
//           {product.description && (
//             <View style={styles.descriptionPreview}>
//               <Text style={styles.descriptionPreviewLabel}>Description</Text>
//               <Text style={styles.descriptionPreviewText} numberOfLines={3}>
//                 {product.description}
//               </Text>
//               {product.description.length > 100 && (
//                 <TouchableOpacity onPress={() => setActiveTab('description')}>
//                   <Text style={styles.readMore}>Read More</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {/* ─── Colors - with color switching ────────────────────────────────── */}
//           {colors.length > 0 && (
//             <View style={styles.colorSection}>
//               <Text style={styles.colorLabel}>
//                 Available Colors 
//                 <Text style={styles.colorCount}>
//                   ({colors.length} {colors.length === 1 ? 'color' : 'colors'})
//                 </Text>
//               </Text>
//               <View style={styles.colorRow}>
//                 {colors.map((c, i) => (
//                   <TouchableOpacity
//                     key={i}
//                     style={[
//                       styles.colorDot, 
//                       { backgroundColor: c },
//                       selectedColor === i && styles.colorDotActive
//                     ]}
//                     onPress={() => handleColorSelect(i)}
//                   >
//                     {selectedColor === i && (
//                       <Check 
//                         color={isLightColor(c) ? COLORS.neutral[900] : COLORS.white} 
//                         size={16} 
//                       />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               {colors[selectedColor] && (
//                 <View style={styles.selectedColorInfo}>
//                   <Text style={styles.selectedColorName}>
//                     Selected: {getColorName(colors[selectedColor])}
//                   </Text>
//                   {colorImagesMap[colors[selectedColor]] && (
//                     <Text style={styles.selectedColorImageCount}>
//                       {colorImagesMap[colors[selectedColor]].length} image{colorImagesMap[colors[selectedColor]].length !== 1 ? 's' : ''} available
//                     </Text>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}

//           {/* ─── Sizes ────────────────────────────────────────────────────────── */}
//           {sizes.length > 0 && (
//             <View style={styles.sizeSection}>
//               <Text style={styles.sizeLabel}>Available Sizes</Text>
//               <View style={styles.sizeRow}>
//                 {sizes.map((size, i) => (
//                   <View key={i} style={styles.sizeTag}>
//                     <Text style={styles.sizeText}>{size}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* ─── Quantity ────────────────────────────────────────────────────── */}
//           <View style={styles.qtySection}>
//             <Text style={styles.qtyLabel}>Quantity</Text>
//             <View style={styles.qtyControl}>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
//                 <Minus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//               <Text style={styles.qtyValue}>{qty}</Text>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
//                 <Plus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* ─── Tabs ──────────────────────────────────────────────────────────── */}
//           <View style={styles.tabsRow}>
//             {([
//               { key: 'description', label: 'Description' },
//               { key: 'specs', label: 'Specs' },
//               { key: 'reviews', label: 'Reviews' },
//               { key: 'faq', label: 'FAQ' },
//             ] as const).map((t) => (
//               <TouchableOpacity
//                 key={t.key}
//                 style={[styles.tab, activeTab === t.key && styles.tabActive]}
//                 onPress={() => setActiveTab(t.key)}
//               >
//                 <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* ─── Tab Content ──────────────────────────────────────────────────── */}
//           {activeTab === 'description' && (
//             <View style={styles.tabContent}>
//               <Text style={styles.descriptionText}>
//                 {product.description || 'No description available for this product.'}
//               </Text>
//               {features.length > 0 && (
//                 <>
//                   <Text style={styles.featuresTitle}>Key Features</Text>
//                   {features.map((f, i) => (
//                     <View key={i} style={styles.featureRow}>
//                       <View style={styles.featureDot} />
//                       <Text style={styles.featureText}>{f}</Text>
//                     </View>
//                   ))}
//                 </>
//               )}
//             </View>
//           )}

//           {activeTab === 'specs' && (
//             <View style={styles.tabContent}>
//               {specifications.length > 0 ? (
//                 specifications.map((s, i) => (
//                   <View key={i} style={styles.specRow}>
//                     <Text style={styles.specLabel}>{s.label}</Text>
//                     <Text style={styles.specValue}>{s.value}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No specifications available</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'reviews' && (
//             <View style={styles.tabContent}>
//               <View style={styles.ratingSummary}>
//                 <View style={styles.ratingBig}>
//                   <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
//                   <View style={styles.ratingStars}>
//                     {[1,2,3,4,5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
//                   </View>
//                   <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
//                 </View>
//                 <View style={styles.ratingBreakdown}>
//                   {ratingBreakdown.map((r) => (
//                     <View key={r.stars} style={styles.breakdownRow}>
//                       <Text style={styles.breakdownLabel}>{r.stars}★</Text>
//                       <View style={styles.breakdownBar}>
//                         <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
//                       </View>
//                       <Text style={styles.breakdownCount}>{r.count}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               {reviews.length > 0 ? (
//                 reviews.map((review) => (
//                   <View key={review.id} style={styles.reviewCard}>
//                     <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
//                     <View style={styles.reviewBody}>
//                       <View style={styles.reviewHeader}>
//                         <Text style={styles.reviewName}>{review.userName}</Text>
//                         <View style={styles.ratingStars}>
//                           {[1,2,3,4,5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
//                         </View>
//                       </View>
//                       <Text style={styles.reviewComment}>{review.comment}</Text>
//                       <Text style={styles.reviewDate}>{review.date}</Text>
//                     </View>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No reviews yet</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'faq' && (
//             <View style={styles.tabContent}>
//               {[
//                 { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
//                 { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
//                 { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
//                 { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
//               ].map((f, i) => (
//                 <View key={i} style={styles.faqItem}>
//                   <Text style={styles.faqQ}>{f.q}</Text>
//                   <Text style={styles.faqA}>{f.a}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* ─── Delivery Info ────────────────────────────────────────────────── */}
//           <View style={styles.deliveryCard}>
//             <View style={styles.deliveryRow}>
//               <Truck color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Free Delivery</Text>
//                 <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Shield color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Quality Assured</Text>
//                 <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <RotateCcw color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Flexible Booking</Text>
//                 <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
//               </View>
//             </View>
//           </View>

//           {/* ─── Related Products ────────────────────────────────────────────── */}
//           {related.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You May Also Like</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//                 {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* ─── Bottom Actions ────────────────────────────────────────────────────── */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.wishAction} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//           <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
//         </TouchableOpacity>
//         <Button onPress={handleAddCart} variant="outline" size="lg" style={{ flex: 1 }}>
//           <ShoppingBag size={18} color={COLORS.primary[700]} /> Add to Cart
//         </Button>
//         <Button onPress={handleBuyNow} variant="gold" size="lg" style={{ flex: 1 }}>Buy Now</Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },

//   galleryWrap: { width: width, height: 350, position: 'relative' },
//   galleryImage: { width, height: 350 },
//   galleryDots: { 
//     position: 'absolute', 
//     bottom: 16, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     justifyContent: 'center', 
//     gap: 6 
//   },
//   galleryDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: 'rgba(255,255,255,0.5)' 
//   },
//   galleryDotActive: { 
//     width: 24, 
//     backgroundColor: COLORS.white 
//   },

//   colorIndicator: {
//     position: 'absolute',
//     bottom: 50,
//     right: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: RADIUS.pill,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   colorIndicatorDot: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   colorIndicatorText: {
//     color: COLORS.white,
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//   },

//   floatingHeader: { 
//     position: 'absolute', 
//     left: SPACING.md, 
//     right: SPACING.md, 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     zIndex: 10 
//   },
//   floatBtn: { 
//     width: 42, 
//     height: 42, 
//     borderRadius: 21, 
//     backgroundColor: 'rgba(255,255,255,0.9)', 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     ...SHADOWS.small 
//   },
//   floatBtnRow: { flexDirection: 'row', gap: 8 },

//   infoSection: { 
//     backgroundColor: COLORS.white, 
//     marginTop: -20, 
//     borderTopLeftRadius: RADIUS.xxl, 
//     borderTopRightRadius: RADIUS.xxl, 
//     padding: SPACING.lg 
//   },

//   categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   categoryText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500], 
//     textTransform: 'uppercase', 
//     letterSpacing: 1 
//   },
//   bestBadge: { 
//     backgroundColor: COLORS.gold[400], 
//     paddingHorizontal: 8, 
//     paddingVertical: 2, 
//     borderRadius: RADIUS.sm 
//   },
//   bestText: { 
//     fontSize: 9, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },

//   productName: { 
//     fontSize: 22, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     marginTop: 6, 
//     lineHeight: 28 
//   },

//   ratingRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8, 
//     marginTop: SPACING.sm 
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   stockBadge: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 4, 
//     backgroundColor: COLORS.success + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm, 
//     marginLeft: 'auto' 
//   },
//   stockDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.success 
//   },
//   stockText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.success 
//   },

//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginTop: SPACING.md 
//   },
//   price: { 
//     fontSize: 26, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   originalPrice: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: COLORS.error + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm 
//   },
//   discountText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.error 
//   },

//   // ─── Description Preview Styles ─────────────────────────────────────────────
//   descriptionPreview: {
//     marginTop: SPACING.md,
//     paddingTop: SPACING.md,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.neutral[100],
//   },
//   descriptionPreviewLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.neutral[800],
//     marginBottom: 4,
//   },
//   descriptionPreviewText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[600],
//     lineHeight: 20,
//   },
//   readMore: {
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.primary[600],
//     marginTop: 4,
//   },

//   colorSection: { marginTop: SPACING.lg },
//   colorLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   colorCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//     marginLeft: 4,
//   },
//   colorRow: { 
//     flexDirection: 'row', 
//     gap: 10, 
//     flexWrap: 'wrap' 
//   },
//   colorDot: { 
//     width: 36, 
//     height: 36, 
//     borderRadius: 18, 
//     borderWidth: 2, 
//     borderColor: COLORS.neutral[200], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   colorDotActive: { 
//     borderColor: COLORS.primary[600], 
//     borderWidth: 3 
//   },
//   selectedColorInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 6,
//     flexWrap: 'wrap',
//   },
//   selectedColorName: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600] 
//   },
//   selectedColorImageCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.primary[500],
//     backgroundColor: COLORS.primary[50],
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: RADIUS.sm,
//   },

//   sizeSection: { marginTop: SPACING.lg },
//   sizeLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   sizeRow: { 
//     flexDirection: 'row', 
//     gap: 8, 
//     flexWrap: 'wrap' 
//   },
//   sizeTag: { 
//     paddingHorizontal: 14, 
//     paddingVertical: 6, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.pill, 
//     borderWidth: 1, 
//     borderColor: COLORS.neutral[200] 
//   },
//   sizeText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[700] 
//   },

//   qtySection: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     marginTop: SPACING.lg 
//   },
//   qtyLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800] 
//   },
//   qtyControl: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 16, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.lg, 
//     paddingHorizontal: 4 
//   },
//   qtyBtn: { 
//     width: 36, 
//     height: 36, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   qtyValue: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },

//   tabsRow: { 
//     flexDirection: 'row', 
//     marginTop: SPACING.xl, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[200] 
//   },
//   tab: { 
//     flex: 1, 
//     paddingVertical: SPACING.sm, 
//     alignItems: 'center' 
//   },
//   tabActive: { 
//     borderBottomWidth: 2, 
//     borderBottomColor: COLORS.primary[700] 
//   },
//   tabText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500] 
//   },
//   tabTextActive: { 
//     color: COLORS.primary[700], 
//     fontFamily: 'Inter-SemiBold' 
//   },

//   tabContent: { marginTop: SPACING.md },

//   descriptionText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     lineHeight: 22 
//   },
//   featuresTitle: { 
//     fontSize: 15, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900], 
//     marginTop: SPACING.md, 
//     marginBottom: SPACING.sm 
//   },
//   featureRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginBottom: 8 
//   },
//   featureDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   featureText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[700] 
//   },

//   specRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: SPACING.sm, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   specLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   specValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   noDataText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     textAlign: 'center', 
//     paddingVertical: SPACING.lg 
//   },

//   ratingSummary: { 
//     flexDirection: 'row', 
//     gap: SPACING.lg, 
//     marginBottom: SPACING.lg, 
//     padding: SPACING.md, 
//     backgroundColor: COLORS.neutral[50], 
//     borderRadius: RADIUS.lg 
//   },
//   ratingBig: { alignItems: 'center' },
//   ratingBigValue: { 
//     fontSize: 36, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   ratingStars: { 
//     flexDirection: 'row', 
//     gap: 2, 
//     marginTop: 4 
//   },
//   ratingCount: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 4 
//   },
//   ratingBreakdown: { flex: 1, gap: 4 },
//   breakdownRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8 
//   },
//   breakdownLabel: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[600], 
//     width: 28 
//   },
//   breakdownBar: { 
//     flex: 1, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.neutral[200] 
//   },
//   breakdownFill: { 
//     height: '100%', 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   breakdownCount: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     width: 20 
//   },

//   reviewCard: { 
//     flexDirection: 'row', 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   reviewAvatar: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20 
//   },
//   reviewBody: { 
//     flex: 1, 
//     marginLeft: SPACING.md 
//   },
//   reviewHeader: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center' 
//   },
//   reviewName: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   reviewComment: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },
//   reviewDate: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     marginTop: 4 
//   },

//   faqItem: { 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   faqQ: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   faqA: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },

//   deliveryCard: { 
//     marginTop: SPACING.lg, 
//     backgroundColor: COLORS.primary[50], 
//     borderRadius: RADIUS.xl, 
//     padding: SPACING.md, 
//     gap: SPACING.md 
//   },
//   deliveryRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 12 
//   },
//   deliveryTitle: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   deliveryDesc: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 2 
//   },

//   relatedSection: { marginTop: SPACING.xl },
//   relatedTitle: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     paddingHorizontal: SPACING.md, 
//     marginBottom: SPACING.md 
//   },

//   bottomBar: { 
//     position: 'absolute', 
//     bottom: 0, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: SPACING.sm, 
//     backgroundColor: COLORS.white, 
//     paddingHorizontal: SPACING.md, 
//     paddingVertical: SPACING.md, 
//     paddingBottom: 30, 
//     borderTopWidth: 1, 
//     borderTopColor: COLORS.neutral[100], 
//     ...SHADOWS.large 
//   },
//   wishAction: { 
//     width: 52, 
//     height: 52, 
//     borderRadius: RADIUS.lg, 
//     backgroundColor: COLORS.neutral[100], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
// });





// app/product/[id].tsx
// // app/product/[id].tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
// import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi, getFullImageUrl, API_BASE_URL } from '@/services/api';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/Button';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuth } from '@/store/auth';
// import axios from 'axios';

// const { width } = Dimensions.get('window');

// // ─── Helper: Check if color is light ──────────────────────────────────────────
// const isLightColor = (hex: string): boolean => {
//   const hexColor = hex.replace('#', '');
//   const r = parseInt(hexColor.substr(0, 2), 16);
//   const g = parseInt(hexColor.substr(2, 2), 16);
//   const b = parseInt(hexColor.substr(4, 2), 16);
//   const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//   return brightness > 128;
// };

// // ─── Helper: Get color name from hex ──────────────────────────────────────────
// const getColorName = (hex: string): string => {
//   const colorMap: Record<string, string> = {
//     '#FF0000': 'Red',
//     '#DC143C': 'Crimson',
//     '#800000': 'Maroon',
//     '#FF69B4': 'Pink',
//     '#FF1493': 'Hot Pink',
//     '#FF8C00': 'Orange',
//     '#FFD700': 'Gold',
//     '#FFFF00': 'Yellow',
//     '#00FF00': 'Lime',
//     '#008000': 'Green',
//     '#008080': 'Teal',
//     '#00FFFF': 'Cyan',
//     '#87CEEB': 'Sky Blue',
//     '#0000FF': 'Blue',
//     '#000080': 'Navy',
//     '#4B0082': 'Indigo',
//     '#800080': 'Purple',
//     '#EE82EE': 'Violet',
//     '#FF00FF': 'Magenta',
//     '#A52A2A': 'Brown',
//     '#F5F5DC': 'Beige',
//     '#FFFFFF': 'White',
//     '#808080': 'Gray',
//     '#000000': 'Black',
//     '#C0C0C0': 'Silver',
//     '#B76E79': 'Rose Gold',
//     '#B87333': 'Copper',
//     '#CD7F32': 'Bronze',
//     '#50C878': 'Emerald',
//     '#0F52BA': 'Sapphire',
//     '#9B111E': 'Ruby',
//     '#6C63FF': 'Purple',
//   };
//   return colorMap[hex] || hex;
// };

// export default function ProductDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { has, toggle } = useWishlist();
//   const { addItem, fetchCart } = useCart();
//   const { state: authState } = useAuth();
//   const { show } = useToast();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [related, setRelated] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');
//   const [addingToCart, setAddingToCart] = useState(false);

//   // ─── State for color-image mapping ──────────────────────────────────────────
//   const [colorImagesMap, setColorImagesMap] = useState<Record<string, string[]>>({});
//   const [currentColorImages, setCurrentColorImages] = useState<string[]>([]);

//   const customerId = authState.user?.id;

//   const load = useCallback(async () => {
//     console.log(`🔍 Loading product with ID: ${id}`);
//     try {
//       const p = await mockApi.getProduct(id);

//       setProduct(p || null);

//       // ─── Set up color-image mapping ────────────────────────────────────────────
//       if (p?.color_images && Object.keys(p.color_images).length > 0) {
//         const processedColorImages: Record<string, string[]> = {};
//         Object.keys(p.color_images).forEach(color => {
//           const images = p.color_images?.[color];
//           if (Array.isArray(images) && images.length > 0) {
//             processedColorImages[color] = images.map(img => getFullImageUrl(img));
//           }
//         });
//         setColorImagesMap(processedColorImages);

//         const firstColor = p.colors?.[0];
//         if (firstColor && processedColorImages[firstColor] && processedColorImages[firstColor].length > 0) {
//           setCurrentColorImages(processedColorImages[firstColor]);
//         } else {
//           setCurrentColorImages(p.images || []);
//         }
//       } else {
//         setCurrentColorImages(p?.images || []);
//       }

//       if (p) {
//         const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
//         setRelated(rels);
//       }
//     } catch (error) {
//       console.error('Error loading product:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => { load(); }, [load]);

//   // ─── Handle color selection - update images ──────────────────────────────────
//   const handleColorSelect = (index: number) => {
//     setSelectedColor(index);
//     const colors = product?.colors || [];
//     const selectedColorHex = colors[index];

//     if (selectedColorHex && colorImagesMap[selectedColorHex] && colorImagesMap[selectedColorHex].length > 0) {
//       setCurrentColorImages(colorImagesMap[selectedColorHex]);
//     } else {
//       setCurrentColorImages(product?.images || []);
//     }
//     setActiveImage(0);
//   };

//   // ─── ADD TO CART - FIXED ──────────────────────────────────────────────────────
//  // app/product/[id].tsx - Fix the handleAddCart function

// // ─── ADD TO CART - FIXED FOR MULTIPLE ITEMS ──────────────────────────────────────
// // app/product/[id].tsx - Fix the handleAddCart function

// // ─── ADD TO CART - FIXED FOR MULTIPLE ITEMS ──────────────────────────────────────
// // In app/product/[id].tsx, update the handleAddCart function

// const handleAddCart = async () => {
//   if (!product) return;

//   if (!customerId) {
//     show('Please login to add items to cart', 'error');
//     router.push('/(auth)/login');
//     return;
//   }

//   setAddingToCart(true);
//   try {
//     const productId = product.id;
//     const productName = product.name;
//     const productPrice = product.price;
//     const productImage = product.images?.[0] || '';

//     console.log('📦 Adding to cart with customerId:', customerId);
//     console.log('📦 Product data:', {
//       id: productId,
//       name: productName,
//       price: productPrice,
//       image: productImage,
//     });

//     // Create cart item
//     const cartItem = {
//       id: `${productId}_${Date.now()}`,
//       productId: productId,
//       name: productName,
//       image: productImage,
//       price: productPrice,
//       quantity: qty,
//       type: 'product' as const,
//     };

//     // Add to cart (this will sync with backend)
//     await addItem(cartItem, customerId);

//     // Refresh cart from server
//     await fetchCart(customerId);

//     show('Added to cart 🛒');
//   } catch (error: any) {
//     console.error('Error adding to cart:', error);
//     show(error.response?.data?.message || 'Failed to add to cart', 'error');
//   } finally {
//     setAddingToCart(false);
//   }
// };

//   const handleBuyNow = async () => {
//     await handleAddCart();
//     router.push('/checkout');
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
//     } catch {}
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={{ padding: SPACING.md }}>
//           <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
//           <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
//           <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
//           <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
//         </View>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text>Product not found</Text>
//         <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
//       </View>
//     );
//   }

//   const isWishlisted = has(product.id);

//   const reviews = Array.isArray(product.reviews) ? product.reviews : [];

//   const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
//     const count = reviews.filter(r => Math.round(r.rating) === stars).length;
//     const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
//     return { stars, count, pct };
//   });

//   const features = Array.isArray(product.features) ? product.features : [];
//   const colors = Array.isArray(product.colors) ? product.colors : ['#6C63FF'];
//   const sizes = Array.isArray(product.sizes) ? product.sizes : [];

//   const getSpecsArray = () => {
//     const specs = product.specifications;
//     if (!specs) return [];

//     if (Array.isArray(specs)) {
//       return specs;
//     }

//     if (typeof specs === 'object') {
//       return Object.entries(specs).map(([key, value]) => ({
//         label: key.charAt(0).toUpperCase() + key.slice(1),
//         value: String(value)
//       }));
//     }

//     return [];
//   };

//   const specifications = getSpecsArray();
//   const displayImages = currentColorImages.length > 0 ? currentColorImages : product.images;

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

//         {/* ─── Image Gallery ────────────────────────────────────────────────────── */}
//         <View style={styles.galleryWrap}>
//           {displayImages.length > 0 ? (
//             <FlatList
//               data={displayImages}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
//               scrollEventThrottle={16}
//               keyExtractor={(_, i) => i.toString()}
//               renderItem={({ item }) => (
//                 <Image 
//                   source={{ uri: item }} 
//                   style={styles.galleryImage} 
//                   resizeMode="cover"
//                   onError={(e) => {
//                     console.log('Image load error:', item);
//                   }}
//                 />
//               )}
//             />
//           ) : (
//             <View style={[styles.galleryImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.neutral[100] }]}>
//               <Text style={{ color: COLORS.neutral[500] }}>No images available</Text>
//             </View>
//           )}
//           {displayImages.length > 1 && (
//             <View style={styles.galleryDots}>
//               {displayImages.map((_, i) => (
//                 <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
//               ))}
//             </View>
//           )}

//           {colors.length > 0 && colors[selectedColor] && (
//             <View style={styles.colorIndicator}>
//               <View 
//                 style={[styles.colorIndicatorDot, { backgroundColor: colors[selectedColor] }]} 
//               />
//               <Text style={styles.colorIndicatorText}>
//                 {getColorName(colors[selectedColor])}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* ─── Header Actions ────────────────────────────────────────────────── */}
//         <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={22} />
//           </TouchableOpacity>
//           <View style={styles.floatBtnRow}>
//             <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
//               <Share2 color={COLORS.neutral[800]} size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//               <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[800]} size={20} fill={isWishlisted ? COLORS.error : 'transparent'} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ─── Product Info ────────────────────────────────────────────────────── */}
//         <View style={styles.infoSection}>
//           <View style={styles.categoryRow}>
//             <Text style={styles.categoryText}>{product.categoryName}</Text>
//             {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
//           </View>
//           <Text style={styles.productName}>{product.name}</Text>
//           <View style={styles.ratingRow}>
//             <RatingBadge rating={product.rating} />
//             <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
//             {product.inStock ? (
//               <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
//             ) : (
//               <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
//             )}
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//             {product.originalPrice > product.price && (
//               <>
//                 <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//                 <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
//               </>
//             )}
//           </View>

//           {/* ─── Description Preview ──────────────────────────────────────────── */}
//           {product.description && (
//             <View style={styles.descriptionPreview}>
//               <Text style={styles.descriptionPreviewLabel}>Description</Text>
//               <Text style={styles.descriptionPreviewText} numberOfLines={3}>
//                 {product.description}
//               </Text>
//               {product.description.length > 100 && (
//                 <TouchableOpacity onPress={() => setActiveTab('description')}>
//                   <Text style={styles.readMore}>Read More</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {/* ─── Colors - with color switching ────────────────────────────────── */}
//           {colors.length > 0 && (
//             <View style={styles.colorSection}>
//               <Text style={styles.colorLabel}>
//                 Available Colors 
//                 <Text style={styles.colorCount}>
//                   ({colors.length} {colors.length === 1 ? 'color' : 'colors'})
//                 </Text>
//               </Text>
//               <View style={styles.colorRow}>
//                 {colors.map((c, i) => (
//                   <TouchableOpacity
//                     key={i}
//                     style={[
//                       styles.colorDot, 
//                       { backgroundColor: c },
//                       selectedColor === i && styles.colorDotActive
//                     ]}
//                     onPress={() => handleColorSelect(i)}
//                   >
//                     {selectedColor === i && (
//                       <Check 
//                         color={isLightColor(c) ? COLORS.neutral[900] : COLORS.white} 
//                         size={16} 
//                       />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               {colors[selectedColor] && (
//                 <View style={styles.selectedColorInfo}>
//                   <Text style={styles.selectedColorName}>
//                     Selected: {getColorName(colors[selectedColor])}
//                   </Text>
//                   {colorImagesMap[colors[selectedColor]] && (
//                     <Text style={styles.selectedColorImageCount}>
//                       {colorImagesMap[colors[selectedColor]].length} image{colorImagesMap[colors[selectedColor]].length !== 1 ? 's' : ''} available
//                     </Text>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}

//           {/* ─── Sizes ────────────────────────────────────────────────────────── */}
//           {sizes.length > 0 && (
//             <View style={styles.sizeSection}>
//               <Text style={styles.sizeLabel}>Available Sizes</Text>
//               <View style={styles.sizeRow}>
//                 {sizes.map((size, i) => (
//                   <View key={i} style={styles.sizeTag}>
//                     <Text style={styles.sizeText}>{size}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* ─── Quantity ────────────────────────────────────────────────────── */}
//           <View style={styles.qtySection}>
//             <Text style={styles.qtyLabel}>Quantity</Text>
//             <View style={styles.qtyControl}>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
//                 <Minus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//               <Text style={styles.qtyValue}>{qty}</Text>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
//                 <Plus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* ─── Tabs ──────────────────────────────────────────────────────────── */}
//           <View style={styles.tabsRow}>
//             {([
//               { key: 'description', label: 'Description' },
//               { key: 'specs', label: 'Specs' },
//               { key: 'reviews', label: 'Reviews' },
//               { key: 'faq', label: 'FAQ' },
//             ] as const).map((t) => (
//               <TouchableOpacity
//                 key={t.key}
//                 style={[styles.tab, activeTab === t.key && styles.tabActive]}
//                 onPress={() => setActiveTab(t.key)}
//               >
//                 <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* ─── Tab Content ──────────────────────────────────────────────────── */}
//           {activeTab === 'description' && (
//             <View style={styles.tabContent}>
//               <Text style={styles.descriptionText}>
//                 {product.description || 'No description available for this product.'}
//               </Text>
//               {features.length > 0 && (
//                 <>
//                   <Text style={styles.featuresTitle}>Key Features</Text>
//                   {features.map((f, i) => (
//                     <View key={i} style={styles.featureRow}>
//                       <View style={styles.featureDot} />
//                       <Text style={styles.featureText}>{f}</Text>
//                     </View>
//                   ))}
//                 </>
//               )}
//             </View>
//           )}

//           {activeTab === 'specs' && (
//             <View style={styles.tabContent}>
//               {specifications.length > 0 ? (
//                 specifications.map((s, i) => (
//                   <View key={i} style={styles.specRow}>
//                     <Text style={styles.specLabel}>{s.label}</Text>
//                     <Text style={styles.specValue}>{s.value}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No specifications available</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'reviews' && (
//             <View style={styles.tabContent}>
//               <View style={styles.ratingSummary}>
//                 <View style={styles.ratingBig}>
//                   <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
//                   <View style={styles.ratingStars}>
//                     {[1,2,3,4,5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
//                   </View>
//                   <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
//                 </View>
//                 <View style={styles.ratingBreakdown}>
//                   {ratingBreakdown.map((r) => (
//                     <View key={r.stars} style={styles.breakdownRow}>
//                       <Text style={styles.breakdownLabel}>{r.stars}★</Text>
//                       <View style={styles.breakdownBar}>
//                         <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
//                       </View>
//                       <Text style={styles.breakdownCount}>{r.count}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               {reviews.length > 0 ? (
//                 reviews.map((review) => (
//                   <View key={review.id} style={styles.reviewCard}>
//                     <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
//                     <View style={styles.reviewBody}>
//                       <View style={styles.reviewHeader}>
//                         <Text style={styles.reviewName}>{review.userName}</Text>
//                         <View style={styles.ratingStars}>
//                           {[1,2,3,4,5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
//                         </View>
//                       </View>
//                       <Text style={styles.reviewComment}>{review.comment}</Text>
//                       <Text style={styles.reviewDate}>{review.date}</Text>
//                     </View>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No reviews yet</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'faq' && (
//             <View style={styles.tabContent}>
//               {[
//                 { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
//                 { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
//                 { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
//                 { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
//               ].map((f, i) => (
//                 <View key={i} style={styles.faqItem}>
//                   <Text style={styles.faqQ}>{f.q}</Text>
//                   <Text style={styles.faqA}>{f.a}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* ─── Delivery Info ────────────────────────────────────────────────── */}
//           <View style={styles.deliveryCard}>
//             <View style={styles.deliveryRow}>
//               <Truck color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Free Delivery</Text>
//                 <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Shield color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Quality Assured</Text>
//                 <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <RotateCcw color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Flexible Booking</Text>
//                 <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
//               </View>
//             </View>
//           </View>

//           {/* ─── Related Products ────────────────────────────────────────────── */}
//           {related.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You May Also Like</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//                 {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* ─── Bottom Actions ────────────────────────────────────────────────────── */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.wishAction} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//           <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
//         </TouchableOpacity>
//         <Button 
//           onPress={handleAddCart} 
//           variant="outline" 
//           size="lg" 
//           style={{ flex: 1 }}
//           loading={addingToCart}
//           disabled={addingToCart}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[700]} /> 
//           {addingToCart ? 'Adding...' : 'Add to Cart'}
//         </Button>
//         <Button 
//           onPress={handleBuyNow} 
//           variant="gold" 
//           size="lg" 
//           style={{ flex: 1 }}
//           loading={addingToCart}
//           disabled={addingToCart}
//         >
//           Buy Now
//         </Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },

//   galleryWrap: { width: width, height: 350, position: 'relative' },
//   galleryImage: { width, height: 350 },
//   galleryDots: { 
//     position: 'absolute', 
//     bottom: 16, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     justifyContent: 'center', 
//     gap: 6 
//   },
//   galleryDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: 'rgba(255,255,255,0.5)' 
//   },
//   galleryDotActive: { 
//     width: 24, 
//     backgroundColor: COLORS.white 
//   },

//   colorIndicator: {
//     position: 'absolute',
//     bottom: 50,
//     right: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: RADIUS.pill,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   colorIndicatorDot: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   colorIndicatorText: {
//     color: COLORS.white,
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//   },

//   floatingHeader: { 
//     position: 'absolute', 
//     left: SPACING.md, 
//     right: SPACING.md, 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     zIndex: 10 
//   },
//   floatBtn: { 
//     width: 42, 
//     height: 42, 
//     borderRadius: 21, 
//     backgroundColor: 'rgba(255,255,255,0.9)', 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     ...SHADOWS.small 
//   },
//   floatBtnRow: { flexDirection: 'row', gap: 8 },

//   infoSection: { 
//     backgroundColor: COLORS.white, 
//     marginTop: -20, 
//     borderTopLeftRadius: RADIUS.xxl, 
//     borderTopRightRadius: RADIUS.xxl, 
//     padding: SPACING.lg 
//   },

//   categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   categoryText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500], 
//     textTransform: 'uppercase', 
//     letterSpacing: 1 
//   },
//   bestBadge: { 
//     backgroundColor: COLORS.gold[400], 
//     paddingHorizontal: 8, 
//     paddingVertical: 2, 
//     borderRadius: RADIUS.sm 
//   },
//   bestText: { 
//     fontSize: 9, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },

//   productName: { 
//     fontSize: 22, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     marginTop: 6, 
//     lineHeight: 28 
//   },

//   ratingRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8, 
//     marginTop: SPACING.sm 
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   stockBadge: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 4, 
//     backgroundColor: COLORS.success + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm, 
//     marginLeft: 'auto' 
//   },
//   stockDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.success 
//   },
//   stockText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.success 
//   },

//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginTop: SPACING.md 
//   },
//   price: { 
//     fontSize: 26, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   originalPrice: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: COLORS.error + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm 
//   },
//   discountText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.error 
//   },

//   // ─── Description Preview Styles ─────────────────────────────────────────────
//   descriptionPreview: {
//     marginTop: SPACING.md,
//     paddingTop: SPACING.md,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.neutral[100],
//   },
//   descriptionPreviewLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.neutral[800],
//     marginBottom: 4,
//   },
//   descriptionPreviewText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[600],
//     lineHeight: 20,
//   },
//   readMore: {
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.primary[600],
//     marginTop: 4,
//   },

//   colorSection: { marginTop: SPACING.lg },
//   colorLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   colorCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//     marginLeft: 4,
//   },
//   colorRow: { 
//     flexDirection: 'row', 
//     gap: 10, 
//     flexWrap: 'wrap' 
//   },
//   colorDot: { 
//     width: 36, 
//     height: 36, 
//     borderRadius: 18, 
//     borderWidth: 2, 
//     borderColor: COLORS.neutral[200], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   colorDotActive: { 
//     borderColor: COLORS.primary[600], 
//     borderWidth: 3 
//   },
//   selectedColorInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 6,
//     flexWrap: 'wrap',
//   },
//   selectedColorName: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600] 
//   },
//   selectedColorImageCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.primary[500],
//     backgroundColor: COLORS.primary[50],
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: RADIUS.sm,
//   },

//   sizeSection: { marginTop: SPACING.lg },
//   sizeLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   sizeRow: { 
//     flexDirection: 'row', 
//     gap: 8, 
//     flexWrap: 'wrap' 
//   },
//   sizeTag: { 
//     paddingHorizontal: 14, 
//     paddingVertical: 6, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.pill, 
//     borderWidth: 1, 
//     borderColor: COLORS.neutral[200] 
//   },
//   sizeText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[700] 
//   },

//   qtySection: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     marginTop: SPACING.lg 
//   },
//   qtyLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800] 
//   },
//   qtyControl: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 16, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.lg, 
//     paddingHorizontal: 4 
//   },
//   qtyBtn: { 
//     width: 36, 
//     height: 36, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   qtyValue: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },

//   tabsRow: { 
//     flexDirection: 'row', 
//     marginTop: SPACING.xl, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[200] 
//   },
//   tab: { 
//     flex: 1, 
//     paddingVertical: SPACING.sm, 
//     alignItems: 'center' 
//   },
//   tabActive: { 
//     borderBottomWidth: 2, 
//     borderBottomColor: COLORS.primary[700] 
//   },
//   tabText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500] 
//   },
//   tabTextActive: { 
//     color: COLORS.primary[700], 
//     fontFamily: 'Inter-SemiBold' 
//   },

//   tabContent: { marginTop: SPACING.md },

//   descriptionText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     lineHeight: 22 
//   },
//   featuresTitle: { 
//     fontSize: 15, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900], 
//     marginTop: SPACING.md, 
//     marginBottom: SPACING.sm 
//   },
//   featureRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginBottom: 8 
//   },
//   featureDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   featureText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[700] 
//   },

//   specRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: SPACING.sm, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   specLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   specValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   noDataText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     textAlign: 'center', 
//     paddingVertical: SPACING.lg 
//   },

//   ratingSummary: { 
//     flexDirection: 'row', 
//     gap: SPACING.lg, 
//     marginBottom: SPACING.lg, 
//     padding: SPACING.md, 
//     backgroundColor: COLORS.neutral[50], 
//     borderRadius: RADIUS.lg 
//   },
//   ratingBig: { alignItems: 'center' },
//   ratingBigValue: { 
//     fontSize: 36, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   ratingStars: { 
//     flexDirection: 'row', 
//     gap: 2, 
//     marginTop: 4 
//   },
//   ratingCount: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 4 
//   },
//   ratingBreakdown: { flex: 1, gap: 4 },
//   breakdownRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8 
//   },
//   breakdownLabel: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[600], 
//     width: 28 
//   },
//   breakdownBar: { 
//     flex: 1, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.neutral[200] 
//   },
//   breakdownFill: { 
//     height: '100%', 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   breakdownCount: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     width: 20 
//   },

//   reviewCard: { 
//     flexDirection: 'row', 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   reviewAvatar: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20 
//   },
//   reviewBody: { 
//     flex: 1, 
//     marginLeft: SPACING.md 
//   },
//   reviewHeader: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center' 
//   },
//   reviewName: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   reviewComment: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },
//   reviewDate: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     marginTop: 4 
//   },

//   faqItem: { 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   faqQ: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   faqA: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },

//   deliveryCard: { 
//     marginTop: SPACING.lg, 
//     backgroundColor: COLORS.primary[50], 
//     borderRadius: RADIUS.xl, 
//     padding: SPACING.md, 
//     gap: SPACING.md 
//   },
//   deliveryRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 12 
//   },
//   deliveryTitle: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   deliveryDesc: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 2 
//   },

//   relatedSection: { marginTop: SPACING.xl },
//   relatedTitle: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     paddingHorizontal: SPACING.md, 
//     marginBottom: SPACING.md 
//   },

//   bottomBar: { 
//     position: 'absolute', 
//     bottom: 0, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: SPACING.sm, 
//     backgroundColor: COLORS.white, 
//     paddingHorizontal: SPACING.md, 
//     paddingVertical: SPACING.md, 
//     paddingBottom: 30, 
//     borderTopWidth: 1, 
//     borderTopColor: COLORS.neutral[100], 
//     ...SHADOWS.large 
//   },
//   wishAction: { 
//     width: 52, 
//     height: 52, 
//     borderRadius: RADIUS.lg, 
//     backgroundColor: COLORS.neutral[100], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
// });





// // app/product/[id].tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
// import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi, getFullImageUrl, API_BASE_URL } from '@/services/api';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/Button';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuth } from '@/store/auth';
// import axios from 'axios';

// const { width } = Dimensions.get('window');

// // ─── Helper: Check if color is light ──────────────────────────────────────────
// const isLightColor = (hex: string): boolean => {
//   const hexColor = hex.replace('#', '');
//   const r = parseInt(hexColor.substr(0, 2), 16);
//   const g = parseInt(hexColor.substr(2, 2), 16);
//   const b = parseInt(hexColor.substr(4, 2), 16);
//   const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//   return brightness > 128;
// };

// // ─── Helper: Get color name from hex ──────────────────────────────────────────
// const getColorName = (hex: string): string => {
//   const colorMap: Record<string, string> = {
//     '#FF0000': 'Red',
//     '#DC143C': 'Crimson',
//     '#800000': 'Maroon',
//     '#FF69B4': 'Pink',
//     '#FF1493': 'Hot Pink',
//     '#FF8C00': 'Orange',
//     '#FFD700': 'Gold',
//     '#FFFF00': 'Yellow',
//     '#00FF00': 'Lime',
//     '#008000': 'Green',
//     '#008080': 'Teal',
//     '#00FFFF': 'Cyan',
//     '#87CEEB': 'Sky Blue',
//     '#0000FF': 'Blue',
//     '#000080': 'Navy',
//     '#4B0082': 'Indigo',
//     '#800080': 'Purple',
//     '#EE82EE': 'Violet',
//     '#FF00FF': 'Magenta',
//     '#A52A2A': 'Brown',
//     '#F5F5DC': 'Beige',
//     '#FFFFFF': 'White',
//     '#808080': 'Gray',
//     '#000000': 'Black',
//     '#C0C0C0': 'Silver',
//     '#B76E79': 'Rose Gold',
//     '#B87333': 'Copper',
//     '#CD7F32': 'Bronze',
//     '#50C878': 'Emerald',
//     '#0F52BA': 'Sapphire',
//     '#9B111E': 'Ruby',
//     '#6C63FF': 'Purple',
//   };
//   return colorMap[hex] || hex;
// };

// export default function ProductDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { has, toggle } = useWishlist();
//   const { addItem, fetchCart } = useCart();
//   const { state: authState } = useAuth();
//   const { show } = useToast();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [related, setRelated] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');
//   const [addingToCart, setAddingToCart] = useState(false);

//   // ─── State for color-image mapping ──────────────────────────────────────────
//   const [colorImagesMap, setColorImagesMap] = useState<Record<string, string[]>>({});
//   const [currentColorImages, setCurrentColorImages] = useState<string[]>([]);

//   const customerId = authState.user?.id;

//   const load = useCallback(async () => {
//     console.log(`🔍 Loading product with ID: ${id}`);
//     try {
//       const p = await mockApi.getProduct(id);

//       setProduct(p || null);

//       // ─── Set up color-image mapping ────────────────────────────────────────────
//       if (p?.color_images && Object.keys(p.color_images).length > 0) {
//         const processedColorImages: Record<string, string[]> = {};
//         Object.keys(p.color_images).forEach(color => {
//           const images = p.color_images?.[color];
//           if (Array.isArray(images) && images.length > 0) {
//             processedColorImages[color] = images.map(img => getFullImageUrl(img));
//           }
//         });
//         setColorImagesMap(processedColorImages);

//         const firstColor = p.colors?.[0];
//         if (firstColor && processedColorImages[firstColor] && processedColorImages[firstColor].length > 0) {
//           setCurrentColorImages(processedColorImages[firstColor]);
//         } else {
//           setCurrentColorImages(p.images || []);
//         }
//       } else {
//         setCurrentColorImages(p?.images || []);
//       }

//       if (p) {
//         const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
//         setRelated(rels);
//       }
//     } catch (error) {
//       console.error('Error loading product:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   // app/product/[id].tsx - Add this near the top of the component

// // Debug auth state
// useEffect(() => {
//   console.log('🔍 Auth state in product screen:', {
//     isAuthenticated: authState.isAuthenticated,
//     user: authState.user,
//     userId: authState.user?.id,
//     token: authState.token ? 'exists' : 'not found'
//   });
// }, [authState]);

//   // ─── Handle color selection - update images ──────────────────────────────────
//   const handleColorSelect = (index: number) => {
//     setSelectedColor(index);
//     const colors = product?.colors || [];
//     const selectedColorHex = colors[index];

//     if (selectedColorHex && colorImagesMap[selectedColorHex] && colorImagesMap[selectedColorHex].length > 0) {
//       setCurrentColorImages(colorImagesMap[selectedColorHex]);
//     } else {
//       setCurrentColorImages(product?.images || []);
//     }
//     setActiveImage(0);
//   };

//   // ─── ADD TO CART - FIXED ──────────────────────────────────────────────────────
// // app/product/[id].tsx - FIXED handleAddCart

// // app/product/[id].tsx - FIXED handleAddCart

// // app/product/[id].tsx - FIXED handleAddCart with better error handling

// // app/product/[id].tsx - FIXED handleAddCart

// const handleAddCart = async () => {
//   if (!product) return;

//   // IMPORTANT: Get customerId from auth state correctly
//   const customerId = authState.user?.id;

//   console.log('📦 Current auth state:', authState);
//   console.log('📦 Current customerId:', customerId);
//   console.log('📦 User object:', authState.user);

//   // Check if user is logged in
//   if (!authState.isAuthenticated || !customerId) {
//     show('Please login to add items to cart', 'error');
//     router.push('/(auth)/login');
//     return;
//   }

//   setAddingToCart(true);
//   try {
//     const productId = product.id;
//     const productName = product.name;
//     const productPrice = product.price;
//     const productImage = product.images?.[0] || '';

//     console.log('📦 Adding to cart with customerId:', customerId);
//     console.log('📦 Product data:', {
//       id: productId,
//       name: productName,
//       price: productPrice,
//       image: productImage,
//       quantity: qty
//     });

//     // Create cart item with the selected quantity
//     const cartItem = {
//       id: productId,
//       productId: productId,
//       name: productName,
//       image: productImage,
//       price: productPrice,
//       quantity: qty,
//       type: 'product' as const,
//     };

//     // Add to cart with customerId - THIS MUST BE PASSED
//     await addItem(cartItem, customerId);

//     // Refresh cart from server
//     await fetchCart(customerId);

//     show(`${qty} item${qty > 1 ? 's' : ''} added to cart 🛒`);
//   } catch (error: any) {
//     console.error('Error adding to cart:', error);
//     console.error('Error response:', error.response?.data);
//     show(error.response?.data?.message || 'Failed to add to cart', 'error');
//   } finally {
//     setAddingToCart(false);
//   }
// };

//   const handleBuyNow = async () => {
//     await handleAddCart();
//     router.push('/checkout');
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
//     } catch {}
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={{ padding: SPACING.md }}>
//           <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
//           <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
//           <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
//           <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
//         </View>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text>Product not found</Text>
//         <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
//       </View>
//     );
//   }

//   const isWishlisted = has(product.id);

//   const reviews = Array.isArray(product.reviews) ? product.reviews : [];

//   const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
//     const count = reviews.filter(r => Math.round(r.rating) === stars).length;
//     const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
//     return { stars, count, pct };
//   });

//   const features = Array.isArray(product.features) ? product.features : [];
//   const colors = Array.isArray(product.colors) ? product.colors : ['#6C63FF'];
//   const sizes = Array.isArray(product.sizes) ? product.sizes : [];

//   const getSpecsArray = () => {
//     const specs = product.specifications;
//     if (!specs) return [];

//     if (Array.isArray(specs)) {
//       return specs;
//     }

//     if (typeof specs === 'object') {
//       return Object.entries(specs).map(([key, value]) => ({
//         label: key.charAt(0).toUpperCase() + key.slice(1),
//         value: String(value)
//       }));
//     }

//     return [];
//   };

//   const specifications = getSpecsArray();
//   const displayImages = currentColorImages.length > 0 ? currentColorImages : product.images;

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

//         {/* ─── Image Gallery ────────────────────────────────────────────────────── */}
//         <View style={styles.galleryWrap}>
//           {displayImages.length > 0 ? (
//             <FlatList
//               data={displayImages}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
//               scrollEventThrottle={16}
//               keyExtractor={(_, i) => i.toString()}
//               renderItem={({ item }) => (
//                 <Image 
//                   source={{ uri: item }} 
//                   style={styles.galleryImage} 
//                   resizeMode="cover"
//                   onError={(e) => {
//                     console.log('Image load error:', item);
//                   }}
//                 />
//               )}
//             />
//           ) : (
//             <View style={[styles.galleryImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.neutral[100] }]}>
//               <Text style={{ color: COLORS.neutral[500] }}>No images available</Text>
//             </View>
//           )}
//           {displayImages.length > 1 && (
//             <View style={styles.galleryDots}>
//               {displayImages.map((_, i) => (
//                 <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
//               ))}
//             </View>
//           )}

//           {colors.length > 0 && colors[selectedColor] && (
//             <View style={styles.colorIndicator}>
//               <View 
//                 style={[styles.colorIndicatorDot, { backgroundColor: colors[selectedColor] }]} 
//               />
//               <Text style={styles.colorIndicatorText}>
//                 {getColorName(colors[selectedColor])}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* ─── Header Actions ────────────────────────────────────────────────── */}
//         <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={22} />
//           </TouchableOpacity>
//           <View style={styles.floatBtnRow}>
//             <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
//               <Share2 color={COLORS.neutral[800]} size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//               <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[800]} size={20} fill={isWishlisted ? COLORS.error : 'transparent'} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ─── Product Info ────────────────────────────────────────────────────── */}
//         <View style={styles.infoSection}>
//           <View style={styles.categoryRow}>
//             <Text style={styles.categoryText}>{product.categoryName}</Text>
//             {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
//           </View>
//           <Text style={styles.productName}>{product.name}</Text>
//           <View style={styles.ratingRow}>
//             <RatingBadge rating={product.rating} />
//             <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
//             {product.inStock ? (
//               <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
//             ) : (
//               <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
//             )}
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//             {product.originalPrice > product.price && (
//               <>
//                 <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//                 <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
//               </>
//             )}
//           </View>

//           {/* ─── Description Preview ──────────────────────────────────────────── */}
//           {product.description && (
//             <View style={styles.descriptionPreview}>
//               <Text style={styles.descriptionPreviewLabel}>Description</Text>
//               <Text style={styles.descriptionPreviewText} numberOfLines={3}>
//                 {product.description}
//               </Text>
//               {product.description.length > 100 && (
//                 <TouchableOpacity onPress={() => setActiveTab('description')}>
//                   <Text style={styles.readMore}>Read More</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {/* ─── Colors - with color switching ────────────────────────────────── */}
//           {colors.length > 0 && (
//             <View style={styles.colorSection}>
//               <Text style={styles.colorLabel}>
//                 Available Colors 
//                 <Text style={styles.colorCount}>
//                   ({colors.length} {colors.length === 1 ? 'color' : 'colors'})
//                 </Text>
//               </Text>
//               <View style={styles.colorRow}>
//                 {colors.map((c, i) => (
//                   <TouchableOpacity
//                     key={i}
//                     style={[
//                       styles.colorDot, 
//                       { backgroundColor: c },
//                       selectedColor === i && styles.colorDotActive
//                     ]}
//                     onPress={() => handleColorSelect(i)}
//                   >
//                     {selectedColor === i && (
//                       <Check 
//                         color={isLightColor(c) ? COLORS.neutral[900] : COLORS.white} 
//                         size={16} 
//                       />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               {colors[selectedColor] && (
//                 <View style={styles.selectedColorInfo}>
//                   <Text style={styles.selectedColorName}>
//                     Selected: {getColorName(colors[selectedColor])}
//                   </Text>
//                   {colorImagesMap[colors[selectedColor]] && (
//                     <Text style={styles.selectedColorImageCount}>
//                       {colorImagesMap[colors[selectedColor]].length} image{colorImagesMap[colors[selectedColor]].length !== 1 ? 's' : ''} available
//                     </Text>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}

//           {/* ─── Sizes ────────────────────────────────────────────────────────── */}
//           {sizes.length > 0 && (
//             <View style={styles.sizeSection}>
//               <Text style={styles.sizeLabel}>Available Sizes</Text>
//               <View style={styles.sizeRow}>
//                 {sizes.map((size, i) => (
//                   <View key={i} style={styles.sizeTag}>
//                     <Text style={styles.sizeText}>{size}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* ─── Quantity ────────────────────────────────────────────────────── */}
//           <View style={styles.qtySection}>
//             <Text style={styles.qtyLabel}>Quantity</Text>
//             <View style={styles.qtyControl}>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
//                 <Minus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//               <Text style={styles.qtyValue}>{qty}</Text>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
//                 <Plus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* ─── Tabs ──────────────────────────────────────────────────────────── */}
//           <View style={styles.tabsRow}>
//             {([
//               { key: 'description', label: 'Description' },
//               { key: 'specs', label: 'Specs' },
//               { key: 'reviews', label: 'Reviews' },
//               { key: 'faq', label: 'FAQ' },
//             ] as const).map((t) => (
//               <TouchableOpacity
//                 key={t.key}
//                 style={[styles.tab, activeTab === t.key && styles.tabActive]}
//                 onPress={() => setActiveTab(t.key)}
//               >
//                 <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* ─── Tab Content ──────────────────────────────────────────────────── */}
//           {activeTab === 'description' && (
//             <View style={styles.tabContent}>
//               <Text style={styles.descriptionText}>
//                 {product.description || 'No description available for this product.'}
//               </Text>
//               {features.length > 0 && (
//                 <>
//                   <Text style={styles.featuresTitle}>Key Features</Text>
//                   {features.map((f, i) => (
//                     <View key={i} style={styles.featureRow}>
//                       <View style={styles.featureDot} />
//                       <Text style={styles.featureText}>{f}</Text>
//                     </View>
//                   ))}
//                 </>
//               )}
//             </View>
//           )}

//           {activeTab === 'specs' && (
//             <View style={styles.tabContent}>
//               {specifications.length > 0 ? (
//                 specifications.map((s, i) => (
//                   <View key={i} style={styles.specRow}>
//                     <Text style={styles.specLabel}>{s.label}</Text>
//                     <Text style={styles.specValue}>{s.value}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No specifications available</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'reviews' && (
//             <View style={styles.tabContent}>
//               <View style={styles.ratingSummary}>
//                 <View style={styles.ratingBig}>
//                   <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
//                   <View style={styles.ratingStars}>
//                     {[1,2,3,4,5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
//                   </View>
//                   <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
//                 </View>
//                 <View style={styles.ratingBreakdown}>
//                   {ratingBreakdown.map((r) => (
//                     <View key={r.stars} style={styles.breakdownRow}>
//                       <Text style={styles.breakdownLabel}>{r.stars}★</Text>
//                       <View style={styles.breakdownBar}>
//                         <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
//                       </View>
//                       <Text style={styles.breakdownCount}>{r.count}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               {reviews.length > 0 ? (
//                 reviews.map((review) => (
//                   <View key={review.id} style={styles.reviewCard}>
//                     <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
//                     <View style={styles.reviewBody}>
//                       <View style={styles.reviewHeader}>
//                         <Text style={styles.reviewName}>{review.userName}</Text>
//                         <View style={styles.ratingStars}>
//                           {[1,2,3,4,5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
//                         </View>
//                       </View>
//                       <Text style={styles.reviewComment}>{review.comment}</Text>
//                       <Text style={styles.reviewDate}>{review.date}</Text>
//                     </View>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No reviews yet</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'faq' && (
//             <View style={styles.tabContent}>
//               {[
//                 { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
//                 { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
//                 { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
//                 { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
//               ].map((f, i) => (
//                 <View key={i} style={styles.faqItem}>
//                   <Text style={styles.faqQ}>{f.q}</Text>
//                   <Text style={styles.faqA}>{f.a}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* ─── Delivery Info ────────────────────────────────────────────────── */}
//           <View style={styles.deliveryCard}>
//             <View style={styles.deliveryRow}>
//               <Truck color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Free Delivery</Text>
//                 <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Shield color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Quality Assured</Text>
//                 <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <RotateCcw color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Flexible Booking</Text>
//                 <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
//               </View>
//             </View>
//           </View>

//           {/* ─── Related Products ────────────────────────────────────────────── */}
//           {related.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You May Also Like</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//                 {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* ─── Bottom Actions ────────────────────────────────────────────────────── */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.wishAction} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//           <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
//         </TouchableOpacity>
//         <Button 
//           onPress={handleAddCart} 
//           variant="outline" 
//           size="lg" 
//           style={{ flex: 1 }}
//           loading={addingToCart}
//           disabled={addingToCart}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[700]} /> 
//           {addingToCart ? 'Adding...' : 'Add to Cart'}
//         </Button>
//         <Button 
//           onPress={handleBuyNow} 
//           variant="gold" 
//           size="lg" 
//           style={{ flex: 1 }}
//           loading={addingToCart}
//           disabled={addingToCart}
//         >
//           Buy Now
//         </Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },

//   galleryWrap: { width: width, height: 350, position: 'relative' },
//   galleryImage: { width, height: 350 },
//   galleryDots: { 
//     position: 'absolute', 
//     bottom: 16, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     justifyContent: 'center', 
//     gap: 6 
//   },
//   galleryDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: 'rgba(255,255,255,0.5)' 
//   },
//   galleryDotActive: { 
//     width: 24, 
//     backgroundColor: COLORS.white 
//   },

//   colorIndicator: {
//     position: 'absolute',
//     bottom: 50,
//     right: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: RADIUS.pill,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   colorIndicatorDot: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   colorIndicatorText: {
//     color: COLORS.white,
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//   },

//   floatingHeader: { 
//     position: 'absolute', 
//     left: SPACING.md, 
//     right: SPACING.md, 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     zIndex: 10 
//   },
//   floatBtn: { 
//     width: 42, 
//     height: 42, 
//     borderRadius: 21, 
//     backgroundColor: 'rgba(255,255,255,0.9)', 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     ...SHADOWS.small 
//   },
//   floatBtnRow: { flexDirection: 'row', gap: 8 },

//   infoSection: { 
//     backgroundColor: COLORS.white, 
//     marginTop: -20, 
//     borderTopLeftRadius: RADIUS.xxl, 
//     borderTopRightRadius: RADIUS.xxl, 
//     padding: SPACING.lg 
//   },

//   categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   categoryText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500], 
//     textTransform: 'uppercase', 
//     letterSpacing: 1 
//   },
//   bestBadge: { 
//     backgroundColor: COLORS.gold[400], 
//     paddingHorizontal: 8, 
//     paddingVertical: 2, 
//     borderRadius: RADIUS.sm 
//   },
//   bestText: { 
//     fontSize: 9, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },

//   productName: { 
//     fontSize: 22, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     marginTop: 6, 
//     lineHeight: 28 
//   },

//   ratingRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8, 
//     marginTop: SPACING.sm 
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   stockBadge: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 4, 
//     backgroundColor: COLORS.success + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm, 
//     marginLeft: 'auto' 
//   },
//   stockDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.success 
//   },
//   stockText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.success 
//   },

//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginTop: SPACING.md 
//   },
//   price: { 
//     fontSize: 26, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   originalPrice: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: COLORS.error + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm 
//   },
//   discountText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.error 
//   },

//   // ─── Description Preview Styles ─────────────────────────────────────────────
//   descriptionPreview: {
//     marginTop: SPACING.md,
//     paddingTop: SPACING.md,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.neutral[100],
//   },
//   descriptionPreviewLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.neutral[800],
//     marginBottom: 4,
//   },
//   descriptionPreviewText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[600],
//     lineHeight: 20,
//   },
//   readMore: {
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.primary[600],
//     marginTop: 4,
//   },

//   colorSection: { marginTop: SPACING.lg },
//   colorLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   colorCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//     marginLeft: 4,
//   },
//   colorRow: { 
//     flexDirection: 'row', 
//     gap: 10, 
//     flexWrap: 'wrap' 
//   },
//   colorDot: { 
//     width: 36, 
//     height: 36, 
//     borderRadius: 18, 
//     borderWidth: 2, 
//     borderColor: COLORS.neutral[200], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   colorDotActive: { 
//     borderColor: COLORS.primary[600], 
//     borderWidth: 3 
//   },
//   selectedColorInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 6,
//     flexWrap: 'wrap',
//   },
//   selectedColorName: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600] 
//   },
//   selectedColorImageCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.primary[500],
//     backgroundColor: COLORS.primary[50],
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: RADIUS.sm,
//   },

//   sizeSection: { marginTop: SPACING.lg },
//   sizeLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   sizeRow: { 
//     flexDirection: 'row', 
//     gap: 8, 
//     flexWrap: 'wrap' 
//   },
//   sizeTag: { 
//     paddingHorizontal: 14, 
//     paddingVertical: 6, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.pill, 
//     borderWidth: 1, 
//     borderColor: COLORS.neutral[200] 
//   },
//   sizeText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[700] 
//   },

//   qtySection: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     marginTop: SPACING.lg 
//   },
//   qtyLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800] 
//   },
//   qtyControl: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 16, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.lg, 
//     paddingHorizontal: 4 
//   },
//   qtyBtn: { 
//     width: 36, 
//     height: 36, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   qtyValue: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },

//   tabsRow: { 
//     flexDirection: 'row', 
//     marginTop: SPACING.xl, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[200] 
//   },
//   tab: { 
//     flex: 1, 
//     paddingVertical: SPACING.sm, 
//     alignItems: 'center' 
//   },
//   tabActive: { 
//     borderBottomWidth: 2, 
//     borderBottomColor: COLORS.primary[700] 
//   },
//   tabText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500] 
//   },
//   tabTextActive: { 
//     color: COLORS.primary[700], 
//     fontFamily: 'Inter-SemiBold' 
//   },

//   tabContent: { marginTop: SPACING.md },

//   descriptionText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     lineHeight: 22 
//   },
//   featuresTitle: { 
//     fontSize: 15, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900], 
//     marginTop: SPACING.md, 
//     marginBottom: SPACING.sm 
//   },
//   featureRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginBottom: 8 
//   },
//   featureDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   featureText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[700] 
//   },

//   specRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: SPACING.sm, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   specLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   specValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   noDataText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     textAlign: 'center', 
//     paddingVertical: SPACING.lg 
//   },

//   ratingSummary: { 
//     flexDirection: 'row', 
//     gap: SPACING.lg, 
//     marginBottom: SPACING.lg, 
//     padding: SPACING.md, 
//     backgroundColor: COLORS.neutral[50], 
//     borderRadius: RADIUS.lg 
//   },
//   ratingBig: { alignItems: 'center' },
//   ratingBigValue: { 
//     fontSize: 36, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   ratingStars: { 
//     flexDirection: 'row', 
//     gap: 2, 
//     marginTop: 4 
//   },
//   ratingCount: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 4 
//   },
//   ratingBreakdown: { flex: 1, gap: 4 },
//   breakdownRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8 
//   },
//   breakdownLabel: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[600], 
//     width: 28 
//   },
//   breakdownBar: { 
//     flex: 1, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.neutral[200] 
//   },
//   breakdownFill: { 
//     height: '100%', 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   breakdownCount: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     width: 20 
//   },

//   reviewCard: { 
//     flexDirection: 'row', 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   reviewAvatar: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20 
//   },
//   reviewBody: { 
//     flex: 1, 
//     marginLeft: SPACING.md 
//   },
//   reviewHeader: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center' 
//   },
//   reviewName: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   reviewComment: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },
//   reviewDate: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     marginTop: 4 
//   },

//   faqItem: { 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   faqQ: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   faqA: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },

//   deliveryCard: { 
//     marginTop: SPACING.lg, 
//     backgroundColor: COLORS.primary[50], 
//     borderRadius: RADIUS.xl, 
//     padding: SPACING.md, 
//     gap: SPACING.md 
//   },
//   deliveryRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 12 
//   },
//   deliveryTitle: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   deliveryDesc: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 2 
//   },

//   relatedSection: { marginTop: SPACING.xl },
//   relatedTitle: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     paddingHorizontal: SPACING.md, 
//     marginBottom: SPACING.md 
//   },

//   bottomBar: { 
//     position: 'absolute', 
//     bottom: 0, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: SPACING.sm, 
//     backgroundColor: COLORS.white, 
//     paddingHorizontal: SPACING.md, 
//     paddingVertical: SPACING.md, 
//     paddingBottom: 30, 
//     borderTopWidth: 1, 
//     borderTopColor: COLORS.neutral[100], 
//     ...SHADOWS.large 
//   },
//   wishAction: { 
//     width: 52, 
//     height: 52, 
//     borderRadius: RADIUS.lg, 
//     backgroundColor: COLORS.neutral[100], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
// });






// // app/product/[id].tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share, ActivityIndicator } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
// import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi, getFullImageUrl, API_BASE_URL } from '@/services/api';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/Button';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { ProductCard } from '@/components/ProductCard';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuth } from '@/store/auth';
// import axios from 'axios';

// const { width } = Dimensions.get('window');

// // ─── Helper: Check if color is light ──────────────────────────────────────────
// const isLightColor = (hex: string): boolean => {
//   const hexColor = hex.replace('#', '');
//   const r = parseInt(hexColor.substr(0, 2), 16);
//   const g = parseInt(hexColor.substr(2, 2), 16);
//   const b = parseInt(hexColor.substr(4, 2), 16);
//   const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//   return brightness > 128;
// };

// // ─── Helper: Get color name from hex ──────────────────────────────────────────
// const getColorName = (hex: string): string => {
//   const colorMap: Record<string, string> = {
//     '#FF0000': 'Red',
//     '#DC143C': 'Crimson',
//     '#800000': 'Maroon',
//     '#FF69B4': 'Pink',
//     '#FF1493': 'Hot Pink',
//     '#FF8C00': 'Orange',
//     '#FFD700': 'Gold',
//     '#FFFF00': 'Yellow',
//     '#00FF00': 'Lime',
//     '#008000': 'Green',
//     '#008080': 'Teal',
//     '#00FFFF': 'Cyan',
//     '#87CEEB': 'Sky Blue',
//     '#0000FF': 'Blue',
//     '#000080': 'Navy',
//     '#4B0082': 'Indigo',
//     '#800080': 'Purple',
//     '#EE82EE': 'Violet',
//     '#FF00FF': 'Magenta',
//     '#A52A2A': 'Brown',
//     '#F5F5DC': 'Beige',
//     '#FFFFFF': 'White',
//     '#808080': 'Gray',
//     '#000000': 'Black',
//     '#C0C0C0': 'Silver',
//     '#B76E79': 'Rose Gold',
//     '#B87333': 'Copper',
//     '#CD7F32': 'Bronze',
//     '#50C878': 'Emerald',
//     '#0F52BA': 'Sapphire',
//     '#9B111E': 'Ruby',
//     '#6C63FF': 'Purple',
//   };
//   return colorMap[hex] || hex;
// };

// export default function ProductDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { has, toggle } = useWishlist();
//   const { addItem, fetchCart } = useCart();
//   const { state: authState } = useAuth();
//   const { show } = useToast();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [related, setRelated] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(0);
//   const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');
//   const [addingToCart, setAddingToCart] = useState(false);

//   // ─── State for color-image mapping ──────────────────────────────────────────
//   const [colorImagesMap, setColorImagesMap] = useState<Record<string, string[]>>({});
//   const [currentColorImages, setCurrentColorImages] = useState<string[]>([]);

//   // ─── Debug auth state ────────────────────────────────────────────────────────
//   useEffect(() => {
//     console.log('🔍 Product screen auth state:', {
//       isAuthenticated: authState.isAuthenticated,
//       user: authState.user,
//       userId: authState.user?.id,
//       isLoading: authState.isLoading,
//       fullAuthState: authState
//     });
//   }, [authState]);

//   const load = useCallback(async () => {
//     console.log(`🔍 Loading product with ID: ${id}`);
//     try {
//       const p = await mockApi.getProduct(id);

//       setProduct(p || null);

//       // ─── Set up color-image mapping ────────────────────────────────────────────
//       if (p?.color_images && Object.keys(p.color_images).length > 0) {
//         const processedColorImages: Record<string, string[]> = {};
//         Object.keys(p.color_images).forEach(color => {
//           const images = p.color_images?.[color];
//           if (Array.isArray(images) && images.length > 0) {
//             processedColorImages[color] = images.map(img => getFullImageUrl(img));
//           }
//         });
//         setColorImagesMap(processedColorImages);

//         const firstColor = p.colors?.[0];
//         if (firstColor && processedColorImages[firstColor] && processedColorImages[firstColor].length > 0) {
//           setCurrentColorImages(processedColorImages[firstColor]);
//         } else {
//           setCurrentColorImages(p.images || []);
//         }
//       } else {
//         setCurrentColorImages(p?.images || []);
//       }

//       if (p) {
//         const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
//         setRelated(rels);
//       }
//     } catch (error) {
//       console.error('Error loading product:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => { load(); }, [load]);

//   // ─── Handle color selection - update images ──────────────────────────────────
//   const handleColorSelect = (index: number) => {
//     setSelectedColor(index);
//     const colors = product?.colors || [];
//     const selectedColorHex = colors[index];

//     if (selectedColorHex && colorImagesMap[selectedColorHex] && colorImagesMap[selectedColorHex].length > 0) {
//       setCurrentColorImages(colorImagesMap[selectedColorHex]);
//     } else {
//       setCurrentColorImages(product?.images || []);
//     }
//     setActiveImage(0);
//   };

//   // ─── ADD TO CART - FIXED ──────────────────────────────────────────────────────
//   // app/product/[id].tsx - Update the handleAddCart function

// // app/product/[id].tsx - Replace the handleAddCart function

// const handleAddCart = async () => {
//   if (!product) return;

//   // Try to get customerId from auth state first
//   let customerId = authState.user?.id;

//   // If auth state doesn't have it, try to get from localStorage directly
//   if (!customerId) {
//     try {
//       const userStr = localStorage.getItem('auth_user');
//       if (userStr) {
//         const user = JSON.parse(userStr);
//         customerId = user.id;
//         console.log('📦 Got customerId from localStorage directly:', customerId);
//       }
//     } catch (error) {
//       console.error('❌ Failed to get user from localStorage:', error);
//     }
//   }

//   console.log('📦 Auth state in product screen:', {
//     isAuthenticated: authState.isAuthenticated,
//     user: authState.user,
//     userId: authState.user?.id,
//     isLoading: authState.isLoading,
//     customerIdFromState: authState.user?.id,
//     customerIdFromStorage: customerId
//   });

//   // If still no customerId, user is not logged in
//   if (!customerId) {
//     console.log('❌ No customerId found');
//     show('Please login to add items to cart', 'error');
//     router.push('/(auth)/login');
//     return;
//   }

//   setAddingToCart(true);
//   try {
//     const productId = product.id;
//     const productName = product.name;
//     const productPrice = product.price;
//     const productImage = product.images?.[0] || '';

//     console.log('📦 Adding to cart with customerId:', customerId);
//     console.log('📦 Product data:', {
//       id: productId,
//       name: productName,
//       price: productPrice,
//       image: productImage,
//       quantity: qty
//     });

//     // Create cart item with the selected quantity
//     const cartItem = {
//       id: `${productId}_${Date.now()}`,
//       productId: productId,
//       name: productName,
//       image: productImage,
//       price: productPrice,
//       quantity: qty,
//       type: 'product' as const,
//     };

//     // Pass customerId explicitly
//     await addItem(cartItem, customerId);

//     // Refresh cart from server
//     const updatedCart = await fetchCart(customerId);
//     console.log('📦 Cart after adding:', updatedCart);

//     show(`${qty} item${qty > 1 ? 's' : ''} added to cart 🛒`);
//   } catch (error: any) {
//     console.error('❌ Error adding to cart:', error);
//     console.error('Error details:', error.response?.data || error.message);
//     show(error.response?.data?.message || 'Failed to add to cart', 'error');
//   } finally {
//     setAddingToCart(false);
//   }
// };
//   const handleBuyNow = async () => {
//     await handleAddCart();
//     router.push('/checkout');
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
//     } catch {}
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={{ padding: SPACING.md }}>
//           <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
//           <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
//           <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
//           <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
//         </View>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text>Product not found</Text>
//         <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
//       </View>
//     );
//   }

//   const isWishlisted = has(product.id);

//   const reviews = Array.isArray(product.reviews) ? product.reviews : [];

//   const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
//     const count = reviews.filter(r => Math.round(r.rating) === stars).length;
//     const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
//     return { stars, count, pct };
//   });

//   const features = Array.isArray(product.features) ? product.features : [];
//   const colors = Array.isArray(product.colors) ? product.colors : ['#6C63FF'];
//   const sizes = Array.isArray(product.sizes) ? product.sizes : [];

//   const getSpecsArray = () => {
//     const specs = product.specifications;
//     if (!specs) return [];

//     if (Array.isArray(specs)) {
//       return specs;
//     }

//     if (typeof specs === 'object') {
//       return Object.entries(specs).map(([key, value]) => ({
//         label: key.charAt(0).toUpperCase() + key.slice(1),
//         value: String(value)
//       }));
//     }

//     return [];
//   };

//   const specifications = getSpecsArray();
//   const displayImages = currentColorImages.length > 0 ? currentColorImages : product.images;

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

//         {/* ─── Image Gallery ────────────────────────────────────────────────────── */}
//         <View style={styles.galleryWrap}>
//           {displayImages.length > 0 ? (
//             <FlatList
//               data={displayImages}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
//               scrollEventThrottle={16}
//               keyExtractor={(_, i) => i.toString()}
//               renderItem={({ item }) => (
//                 <Image 
//                   source={{ uri: item }} 
//                   style={styles.galleryImage} 
//                   resizeMode="cover"
//                   onError={(e) => {
//                     console.log('Image load error:', item);
//                   }}
//                 />
//               )}
//             />
//           ) : (
//             <View style={[styles.galleryImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.neutral[100] }]}>
//               <Text style={{ color: COLORS.neutral[500] }}>No images available</Text>
//             </View>
//           )}
//           {displayImages.length > 1 && (
//             <View style={styles.galleryDots}>
//               {displayImages.map((_, i) => (
//                 <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
//               ))}
//             </View>
//           )}

//           {colors.length > 0 && colors[selectedColor] && (
//             <View style={styles.colorIndicator}>
//               <View 
//                 style={[styles.colorIndicatorDot, { backgroundColor: colors[selectedColor] }]} 
//               />
//               <Text style={styles.colorIndicatorText}>
//                 {getColorName(colors[selectedColor])}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* ─── Header Actions ────────────────────────────────────────────────── */}
//         <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={22} />
//           </TouchableOpacity>
//           <View style={styles.floatBtnRow}>
//             <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
//               <Share2 color={COLORS.neutral[800]} size={20} />
//             </TouchableOpacity>
//            // app/product/[id].tsx - Update the wishlist toggle

// // ─── Update the wishlist toggle in the floating header ──────────────────────
// <TouchableOpacity style={styles.floatBtn} onPress={() => { 
//   const customerId = authState.user?.id;
//   const productData = {
//     name: product.name,
//     price: product.price,
//     image: product.images?.[0] || '',
//   };
//   toggle(product.id, customerId, productData);
//   show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); 
// }}>
//   <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[800]} size={20} fill={isWishlisted ? COLORS.error : 'transparent'} />
// </TouchableOpacity>

// // ─── Update the wishlist toggle in the bottom bar ──────────────────────────
// <TouchableOpacity style={styles.wishAction} onPress={() => { 
//   const customerId = authState.user?.id;
//   const productData = {
//     name: product.name,
//     price: product.price,
//     image: product.images?.[0] || '',
//   };
//   toggle(product.id, customerId, productData);
//   show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); 
// }}>
//   <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
// </TouchableOpacity>
//           </View>
//         </View>

//         {/* ─── Product Info ────────────────────────────────────────────────────── */}
//         <View style={styles.infoSection}>
//           <View style={styles.categoryRow}>
//             <Text style={styles.categoryText}>{product.categoryName}</Text>
//             {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
//           </View>
//           <Text style={styles.productName}>{product.name}</Text>
//           <View style={styles.ratingRow}>
//             <RatingBadge rating={product.rating} />
//             <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
//             {product.inStock ? (
//               <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
//             ) : (
//               <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
//             )}
//           </View>

//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
//             {product.originalPrice > product.price && (
//               <>
//                 <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
//                 <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
//               </>
//             )}
//           </View>

//           {/* ─── Description Preview ──────────────────────────────────────────── */}
//           {product.description && (
//             <View style={styles.descriptionPreview}>
//               <Text style={styles.descriptionPreviewLabel}>Description</Text>
//               <Text style={styles.descriptionPreviewText} numberOfLines={3}>
//                 {product.description}
//               </Text>
//               {product.description.length > 100 && (
//                 <TouchableOpacity onPress={() => setActiveTab('description')}>
//                   <Text style={styles.readMore}>Read More</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {/* ─── Colors - with color switching ────────────────────────────────── */}
//           {colors.length > 0 && (
//             <View style={styles.colorSection}>
//               <Text style={styles.colorLabel}>
//                 Available Colors 
//                 <Text style={styles.colorCount}>
//                   ({colors.length} {colors.length === 1 ? 'color' : 'colors'})
//                 </Text>
//               </Text>
//               <View style={styles.colorRow}>
//                 {colors.map((c, i) => (
//                   <TouchableOpacity
//                     key={i}
//                     style={[
//                       styles.colorDot, 
//                       { backgroundColor: c },
//                       selectedColor === i && styles.colorDotActive
//                     ]}
//                     onPress={() => handleColorSelect(i)}
//                   >
//                     {selectedColor === i && (
//                       <Check 
//                         color={isLightColor(c) ? COLORS.neutral[900] : COLORS.white} 
//                         size={16} 
//                       />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               {colors[selectedColor] && (
//                 <View style={styles.selectedColorInfo}>
//                   <Text style={styles.selectedColorName}>
//                     Selected: {getColorName(colors[selectedColor])}
//                   </Text>
//                   {colorImagesMap[colors[selectedColor]] && (
//                     <Text style={styles.selectedColorImageCount}>
//                       {colorImagesMap[colors[selectedColor]].length} image{colorImagesMap[colors[selectedColor]].length !== 1 ? 's' : ''} available
//                     </Text>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}

//           {/* ─── Sizes ────────────────────────────────────────────────────────── */}
//           {sizes.length > 0 && (
//             <View style={styles.sizeSection}>
//               <Text style={styles.sizeLabel}>Available Sizes</Text>
//               <View style={styles.sizeRow}>
//                 {sizes.map((size, i) => (
//                   <View key={i} style={styles.sizeTag}>
//                     <Text style={styles.sizeText}>{size}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* ─── Quantity ────────────────────────────────────────────────────── */}
//           <View style={styles.qtySection}>
//             <Text style={styles.qtyLabel}>Quantity</Text>
//             <View style={styles.qtyControl}>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
//                 <Minus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//               <Text style={styles.qtyValue}>{qty}</Text>
//               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
//                 <Plus color={COLORS.neutral[700]} size={18} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* ─── Tabs ──────────────────────────────────────────────────────────── */}
//           <View style={styles.tabsRow}>
//             {([
//               { key: 'description', label: 'Description' },
//               { key: 'specs', label: 'Specs' },
//               { key: 'reviews', label: 'Reviews' },
//               { key: 'faq', label: 'FAQ' },
//             ] as const).map((t) => (
//               <TouchableOpacity
//                 key={t.key}
//                 style={[styles.tab, activeTab === t.key && styles.tabActive]}
//                 onPress={() => setActiveTab(t.key)}
//               >
//                 <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* ─── Tab Content ──────────────────────────────────────────────────── */}
//           {activeTab === 'description' && (
//             <View style={styles.tabContent}>
//               <Text style={styles.descriptionText}>
//                 {product.description || 'No description available for this product.'}
//               </Text>
//               {features.length > 0 && (
//                 <>
//                   <Text style={styles.featuresTitle}>Key Features</Text>
//                   {features.map((f, i) => (
//                     <View key={i} style={styles.featureRow}>
//                       <View style={styles.featureDot} />
//                       <Text style={styles.featureText}>{f}</Text>
//                     </View>
//                   ))}
//                 </>
//               )}
//             </View>
//           )}

//           {activeTab === 'specs' && (
//             <View style={styles.tabContent}>
//               {specifications.length > 0 ? (
//                 specifications.map((s, i) => (
//                   <View key={i} style={styles.specRow}>
//                     <Text style={styles.specLabel}>{s.label}</Text>
//                     <Text style={styles.specValue}>{s.value}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No specifications available</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'reviews' && (
//             <View style={styles.tabContent}>
//               <View style={styles.ratingSummary}>
//                 <View style={styles.ratingBig}>
//                   <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
//                   <View style={styles.ratingStars}>
//                     {[1,2,3,4,5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
//                   </View>
//                   <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
//                 </View>
//                 <View style={styles.ratingBreakdown}>
//                   {ratingBreakdown.map((r) => (
//                     <View key={r.stars} style={styles.breakdownRow}>
//                       <Text style={styles.breakdownLabel}>{r.stars}★</Text>
//                       <View style={styles.breakdownBar}>
//                         <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
//                       </View>
//                       <Text style={styles.breakdownCount}>{r.count}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               {reviews.length > 0 ? (
//                 reviews.map((review) => (
//                   <View key={review.id} style={styles.reviewCard}>
//                     <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
//                     <View style={styles.reviewBody}>
//                       <View style={styles.reviewHeader}>
//                         <Text style={styles.reviewName}>{review.userName}</Text>
//                         <View style={styles.ratingStars}>
//                           {[1,2,3,4,5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
//                         </View>
//                       </View>
//                       <Text style={styles.reviewComment}>{review.comment}</Text>
//                       <Text style={styles.reviewDate}>{review.date}</Text>
//                     </View>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.noDataText}>No reviews yet</Text>
//               )}
//             </View>
//           )}

//           {activeTab === 'faq' && (
//             <View style={styles.tabContent}>
//               {[
//                 { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
//                 { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
//                 { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
//                 { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
//               ].map((f, i) => (
//                 <View key={i} style={styles.faqItem}>
//                   <Text style={styles.faqQ}>{f.q}</Text>
//                   <Text style={styles.faqA}>{f.a}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           {/* ─── Delivery Info ────────────────────────────────────────────────── */}
//           <View style={styles.deliveryCard}>
//             <View style={styles.deliveryRow}>
//               <Truck color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Free Delivery</Text>
//                 <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Shield color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Quality Assured</Text>
//                 <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <RotateCcw color={COLORS.primary[600]} size={20} />
//               <View>
//                 <Text style={styles.deliveryTitle}>Flexible Booking</Text>
//                 <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
//               </View>
//             </View>
//           </View>

//           {/* ─── Related Products ────────────────────────────────────────────── */}
//           {related.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>You May Also Like</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
//                 {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* ─── Bottom Actions ────────────────────────────────────────────────────── */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.wishAction} onPress={() => { toggle(product.id); show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info'); }}>
//           <Heart color={isWishlisted ? COLORS.error : COLORS.neutral[600]} size={22} fill={isWishlisted ? COLORS.error : 'transparent'} />
//         </TouchableOpacity>
//         <Button 
//           onPress={handleAddCart} 
//           variant="outline" 
//           size="lg" 
//           style={{ flex: 1 }}
//           loading={addingToCart}
//           disabled={addingToCart}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[700]} /> 
//           {addingToCart ? 'Adding...' : 'Add to Cart'}
//         </Button>
//         <Button 
//           onPress={handleBuyNow} 
//           variant="gold" 
//           size="lg" 
//           style={{ flex: 1 }}
//           loading={addingToCart}
//           disabled={addingToCart}
//         >
//           Buy Now
//         </Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },

//   galleryWrap: { width: width, height: 350, position: 'relative' },
//   galleryImage: { width, height: 350 },
//   galleryDots: { 
//     position: 'absolute', 
//     bottom: 16, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     justifyContent: 'center', 
//     gap: 6 
//   },
//   galleryDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: 'rgba(255,255,255,0.5)' 
//   },
//   galleryDotActive: { 
//     width: 24, 
//     backgroundColor: COLORS.white 
//   },

//   colorIndicator: {
//     position: 'absolute',
//     bottom: 50,
//     right: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: RADIUS.pill,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   colorIndicatorDot: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   colorIndicatorText: {
//     color: COLORS.white,
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//   },

//   floatingHeader: { 
//     position: 'absolute', 
//     left: SPACING.md, 
//     right: SPACING.md, 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     zIndex: 10 
//   },
//   floatBtn: { 
//     width: 42, 
//     height: 42, 
//     borderRadius: 21, 
//     backgroundColor: 'rgba(255,255,255,0.9)', 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     ...SHADOWS.small 
//   },
//   floatBtnRow: { flexDirection: 'row', gap: 8 },

//   infoSection: { 
//     backgroundColor: COLORS.white, 
//     marginTop: -20, 
//     borderTopLeftRadius: RADIUS.xxl, 
//     borderTopRightRadius: RADIUS.xxl, 
//     padding: SPACING.lg 
//   },

//   categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   categoryText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500], 
//     textTransform: 'uppercase', 
//     letterSpacing: 1 
//   },
//   bestBadge: { 
//     backgroundColor: COLORS.gold[400], 
//     paddingHorizontal: 8, 
//     paddingVertical: 2, 
//     borderRadius: RADIUS.sm 
//   },
//   bestText: { 
//     fontSize: 9, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },

//   productName: { 
//     fontSize: 22, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     marginTop: 6, 
//     lineHeight: 28 
//   },

//   ratingRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8, 
//     marginTop: SPACING.sm 
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   stockBadge: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 4, 
//     backgroundColor: COLORS.success + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm, 
//     marginLeft: 'auto' 
//   },
//   stockDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.success 
//   },
//   stockText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.success 
//   },

//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginTop: SPACING.md 
//   },
//   price: { 
//     fontSize: 26, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   originalPrice: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: COLORS.error + '20', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: RADIUS.sm 
//   },
//   discountText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.error 
//   },

//   descriptionPreview: {
//     marginTop: SPACING.md,
//     paddingTop: SPACING.md,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.neutral[100],
//   },
//   descriptionPreviewLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.neutral[800],
//     marginBottom: 4,
//   },
//   descriptionPreviewText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[600],
//     lineHeight: 20,
//   },
//   readMore: {
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.primary[600],
//     marginTop: 4,
//   },

//   colorSection: { marginTop: SPACING.lg },
//   colorLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   colorCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//     marginLeft: 4,
//   },
//   colorRow: { 
//     flexDirection: 'row', 
//     gap: 10, 
//     flexWrap: 'wrap' 
//   },
//   colorDot: { 
//     width: 36, 
//     height: 36, 
//     borderRadius: 18, 
//     borderWidth: 2, 
//     borderColor: COLORS.neutral[200], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   colorDotActive: { 
//     borderColor: COLORS.primary[600], 
//     borderWidth: 3 
//   },
//   selectedColorInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 6,
//     flexWrap: 'wrap',
//   },
//   selectedColorName: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600] 
//   },
//   selectedColorImageCount: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.primary[500],
//     backgroundColor: COLORS.primary[50],
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: RADIUS.sm,
//   },

//   sizeSection: { marginTop: SPACING.lg },
//   sizeLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800], 
//     marginBottom: SPACING.sm 
//   },
//   sizeRow: { 
//     flexDirection: 'row', 
//     gap: 8, 
//     flexWrap: 'wrap' 
//   },
//   sizeTag: { 
//     paddingHorizontal: 14, 
//     paddingVertical: 6, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.pill, 
//     borderWidth: 1, 
//     borderColor: COLORS.neutral[200] 
//   },
//   sizeText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[700] 
//   },

//   qtySection: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     marginTop: SPACING.lg 
//   },
//   qtyLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[800] 
//   },
//   qtyControl: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 16, 
//     backgroundColor: COLORS.neutral[100], 
//     borderRadius: RADIUS.lg, 
//     paddingHorizontal: 4 
//   },
//   qtyBtn: { 
//     width: 36, 
//     height: 36, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   qtyValue: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },

//   tabsRow: { 
//     flexDirection: 'row', 
//     marginTop: SPACING.xl, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[200] 
//   },
//   tab: { 
//     flex: 1, 
//     paddingVertical: SPACING.sm, 
//     alignItems: 'center' 
//   },
//   tabActive: { 
//     borderBottomWidth: 2, 
//     borderBottomColor: COLORS.primary[700] 
//   },
//   tabText: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[500] 
//   },
//   tabTextActive: { 
//     color: COLORS.primary[700], 
//     fontFamily: 'Inter-SemiBold' 
//   },

//   tabContent: { marginTop: SPACING.md },

//   descriptionText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     lineHeight: 22 
//   },
//   featuresTitle: { 
//     fontSize: 15, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900], 
//     marginTop: SPACING.md, 
//     marginBottom: SPACING.sm 
//   },
//   featureRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginBottom: 8 
//   },
//   featureDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   featureText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[700] 
//   },

//   specRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: SPACING.sm, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   specLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   specValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   noDataText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     textAlign: 'center', 
//     paddingVertical: SPACING.lg 
//   },

//   ratingSummary: { 
//     flexDirection: 'row', 
//     gap: SPACING.lg, 
//     marginBottom: SPACING.lg, 
//     padding: SPACING.md, 
//     backgroundColor: COLORS.neutral[50], 
//     borderRadius: RADIUS.lg 
//   },
//   ratingBig: { alignItems: 'center' },
//   ratingBigValue: { 
//     fontSize: 36, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   ratingStars: { 
//     flexDirection: 'row', 
//     gap: 2, 
//     marginTop: 4 
//   },
//   ratingCount: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 4 
//   },
//   ratingBreakdown: { flex: 1, gap: 4 },
//   breakdownRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8 
//   },
//   breakdownLabel: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: COLORS.neutral[600], 
//     width: 28 
//   },
//   breakdownBar: { 
//     flex: 1, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: COLORS.neutral[200] 
//   },
//   breakdownFill: { 
//     height: '100%', 
//     borderRadius: 3, 
//     backgroundColor: COLORS.gold[400] 
//   },
//   breakdownCount: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     width: 20 
//   },

//   reviewCard: { 
//     flexDirection: 'row', 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   reviewAvatar: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20 
//   },
//   reviewBody: { 
//     flex: 1, 
//     marginLeft: SPACING.md 
//   },
//   reviewHeader: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center' 
//   },
//   reviewName: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   reviewComment: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },
//   reviewDate: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[400], 
//     marginTop: 4 
//   },

//   faqItem: { 
//     paddingVertical: SPACING.md, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   faqQ: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   faqA: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },

//   deliveryCard: { 
//     marginTop: SPACING.lg, 
//     backgroundColor: COLORS.primary[50], 
//     borderRadius: RADIUS.xl, 
//     padding: SPACING.md, 
//     gap: SPACING.md 
//   },
//   deliveryRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 12 
//   },
//   deliveryTitle: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900] 
//   },
//   deliveryDesc: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 2 
//   },

//   relatedSection: { marginTop: SPACING.xl },
//   relatedTitle: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900], 
//     paddingHorizontal: SPACING.md, 
//     marginBottom: SPACING.md 
//   },

//   bottomBar: { 
//     position: 'absolute', 
//     bottom: 0, 
//     left: 0, 
//     right: 0, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: SPACING.sm, 
//     backgroundColor: COLORS.white, 
//     paddingHorizontal: SPACING.md, 
//     paddingVertical: SPACING.md, 
//     paddingBottom: 30, 
//     borderTopWidth: 1, 
//     borderTopColor: COLORS.neutral[100], 
//     ...SHADOWS.large 
//   },
//   wishAction: { 
//     width: 52, 
//     height: 52, 
//     borderRadius: RADIUS.lg, 
//     backgroundColor: COLORS.neutral[100], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
// });






// app/product/[id].tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Share, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi, getFullImageUrl, API_BASE_URL } from '@/services/api';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWishlist } from '@/store/wishlist';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/auth';
import axios from 'axios';

const { width } = Dimensions.get('window');

// ─── Helper: Check if color is light ──────────────────────────────────────────
const isLightColor = (hex: string): boolean => {
  const hexColor = hex.replace('#', '');
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

// ─── Helper: Get color name from hex ──────────────────────────────────────────
const getColorName = (hex: string): string => {
  const colorMap: Record<string, string> = {
    '#FF0000': 'Red',
    '#DC143C': 'Crimson',
    '#800000': 'Maroon',
    '#FF69B4': 'Pink',
    '#FF1493': 'Hot Pink',
    '#FF8C00': 'Orange',
    '#FFD700': 'Gold',
    '#FFFF00': 'Yellow',
    '#00FF00': 'Lime',
    '#008000': 'Green',
    '#008080': 'Teal',
    '#00FFFF': 'Cyan',
    '#87CEEB': 'Sky Blue',
    '#0000FF': 'Blue',
    '#000080': 'Navy',
    '#4B0082': 'Indigo',
    '#800080': 'Purple',
    '#EE82EE': 'Violet',
    '#FF00FF': 'Magenta',
    '#A52A2A': 'Brown',
    '#F5F5DC': 'Beige',
    '#FFFFFF': 'White',
    '#808080': 'Gray',
    '#000000': 'Black',
    '#C0C0C0': 'Silver',
    '#B76E79': 'Rose Gold',
    '#B87333': 'Copper',
    '#CD7F32': 'Bronze',
    '#50C878': 'Emerald',
    '#0F52BA': 'Sapphire',
    '#9B111E': 'Ruby',
    '#6C63FF': 'Purple',
  };
  return colorMap[hex] || hex;
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { has, toggle } = useWishlist();
  const { addItem, fetchCart } = useCart();
  const { state: authState } = useAuth();
  const { show } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faq'>('description');
  const [addingToCart, setAddingToCart] = useState(false);

  const [colorImagesMap, setColorImagesMap] = useState<Record<string, string[]>>({});
  const [currentColorImages, setCurrentColorImages] = useState<string[]>([]);

  // ─── Debug auth state ────────────────────────────────────────────────────────
  useEffect(() => {
    console.log('🔍 Product screen auth state:', {
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      userId: authState.user?.id,
      isLoading: authState.isLoading,
      fullAuthState: authState
    });
  }, [authState]);

  const load = useCallback(async () => {
    console.log(`🔍 Loading product with ID: ${id}`);
    try {
      const p = await mockApi.getProduct(id);

      setProduct(p || null);

      if (p?.color_images && Object.keys(p.color_images).length > 0) {
        const processedColorImages: Record<string, string[]> = {};
        Object.keys(p.color_images).forEach(color => {
          const images = p.color_images?.[color];
          if (Array.isArray(images) && images.length > 0) {
            processedColorImages[color] = images.map(img => getFullImageUrl(img));
          }
        });
        setColorImagesMap(processedColorImages);

        const firstColor = p.colors?.[0];
        if (firstColor && processedColorImages[firstColor] && processedColorImages[firstColor].length > 0) {
          setCurrentColorImages(processedColorImages[firstColor]);
        } else {
          setCurrentColorImages(p.images || []);
        }
      } else {
        setCurrentColorImages(p?.images || []);
      }

      if (p) {
        const rels = (await Promise.all(p.relatedIds.map((rid) => mockApi.getProduct(rid)))).filter(Boolean) as Product[];
        setRelated(rels);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleColorSelect = (index: number) => {
    setSelectedColor(index);
    const colors = product?.colors || [];
    const selectedColorHex = colors[index];

    if (selectedColorHex && colorImagesMap[selectedColorHex] && colorImagesMap[selectedColorHex].length > 0) {
      setCurrentColorImages(colorImagesMap[selectedColorHex]);
    } else {
      setCurrentColorImages(product?.images || []);
    }
    setActiveImage(0);
  };

  // ─── ADD TO CART ─────────────────────────────────────────────────────────────
  const handleAddCart = async () => {
    if (!product) return;

    let customerId = authState.user?.id;

    if (!customerId) {
      try {
        const userStr = localStorage.getItem('auth_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          customerId = user.id;
          console.log('📦 Got customerId from localStorage directly:', customerId);
        }
      } catch (error) {
        console.error('❌ Failed to get user from localStorage:', error);
      }
    }

    console.log('📦 Auth state in product screen:', {
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      userId: authState.user?.id,
      isLoading: authState.isLoading,
      customerIdFromState: authState.user?.id,
      customerIdFromStorage: customerId
    });

    if (!customerId) {
      console.log('❌ No customerId found');
      show('Please login to add items to cart', 'error');
      router.push('/(auth)/login');
      return;
    }

    setAddingToCart(true);
    try {
      const productId = product.id;
      const productName = product.name;
      const productPrice = product.price;
      const productImage = product.images?.[0] || '';

      console.log('📦 Adding to cart with customerId:', customerId);
      console.log('📦 Product data:', {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: qty
      });

      const cartItem = {
        id: `${productId}_${Date.now()}`,
        productId: productId,
        name: productName,
        image: productImage,
        price: productPrice,
        quantity: qty,
        type: 'product' as const,
      };

      await addItem(cartItem, customerId);

      const updatedCart = await fetchCart(customerId);
      console.log('📦 Cart after adding:', updatedCart);

      show(`${qty} item${qty > 1 ? 's' : ''} added to cart 🛒`);
    } catch (error: any) {
      console.error('❌ Error adding to cart:', error);
      console.error('Error details:', error.response?.data || error.message);
      show(error.response?.data?.message || 'Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddCart();
    router.push('/checkout');
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out ${product?.name} on Super Tent House!` });
    } catch { }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={{ padding: SPACING.md }}>
          <Skeleton width="100%" height={350} radius={RADIUS.xxl} />
          <Skeleton width="60%" height={20} style={{ marginTop: SPACING.md }} />
          <Skeleton width="100%" height={40} style={{ marginTop: SPACING.sm }} />
          <Skeleton width="100%" height={120} style={{ marginTop: SPACING.md }} />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Product not found</Text>
        <Button onPress={() => router.back()} style={{ marginTop: SPACING.md }}>Go Back</Button>
      </View>
    );
  }

  const isWishlisted = has(product.id);

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];

  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, pct };
  });

  const features = Array.isArray(product.features) ? product.features : [];
  const colors = Array.isArray(product.colors) ? product.colors : ['#6C63FF'];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  const getSpecsArray = () => {
    const specs = product.specifications;
    if (!specs) return [];

    if (Array.isArray(specs)) {
      return specs;
    }

    if (typeof specs === 'object') {
      return Object.entries(specs).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: String(value)
      }));
    }

    return [];
  };

  const specifications = getSpecsArray();
  const displayImages = currentColorImages.length > 0 ? currentColorImages : product.images;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ─── Image Gallery ────────────────────────────────────────────────────── */}
        <View style={styles.galleryWrap}>
          {displayImages.length > 0 ? (
            <FlatList
              data={displayImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width)))}
              scrollEventThrottle={16}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                  onError={(e) => {
                    console.log('Image load error:', item);
                  }}
                />
              )}
            />
          ) : (
            <View style={[styles.galleryImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.neutral[100] }]}>
              <Text style={{ color: COLORS.neutral[500] }}>No images available</Text>
            </View>
          )}
          {displayImages.length > 1 && (
            <View style={styles.galleryDots}>
              {displayImages.map((_, i) => (
                <View key={i} style={[styles.galleryDot, i === activeImage && styles.galleryDotActive]} />
              ))}
            </View>
          )}

          {colors.length > 0 && colors[selectedColor] && (
            <View style={styles.colorIndicator}>
              <View
                style={[styles.colorIndicatorDot, { backgroundColor: colors[selectedColor] }]}
              />
              <Text style={styles.colorIndicatorText}>
                {getColorName(colors[selectedColor])}
              </Text>
            </View>
          )}
        </View>

        {/* ─── Header Actions ────────────────────────────────────────────────── */}
        <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
          <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.neutral[800]} size={22} />
          </TouchableOpacity>
          <View style={styles.floatBtnRow}>
            <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
              <Share2 color={COLORS.neutral[800]} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.floatBtn}
              onPress={() => {
                const customerId = authState.user?.id;
                const productData = {
                  name: product.name,
                  price: product.price,
                  image: product.images?.[0] || '',
                };
                toggle(product.id, customerId, productData);
                show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
              }}
            >
              <Heart
                color={isWishlisted ? COLORS.error : COLORS.neutral[800]}
                size={20}
                fill={isWishlisted ? COLORS.error : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Product Info ────────────────────────────────────────────────────── */}
        <View style={styles.infoSection}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>{product.categoryName}</Text>
            {product.isBestSeller && <View style={styles.bestBadge}><Text style={styles.bestText}>BESTSELLER</Text></View>}
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.ratingRow}>
            <RatingBadge rating={product.rating} />
            <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
            {product.inStock ? (
              <View style={styles.stockBadge}><View style={styles.stockDot} /><Text style={styles.stockText}>In Stock</Text></View>
            ) : (
              <View style={[styles.stockBadge, { backgroundColor: COLORS.error + '20' }]}><Text style={[styles.stockText, { color: COLORS.error }]}>Out of Stock</Text></View>
            )}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
            {product.originalPrice > product.price && (
              <>
                <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
                <View style={styles.discountBadge}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>
              </>
            )}
          </View>

          {/* ─── Description Preview ──────────────────────────────────────────── */}
          {product.description && (
            <View style={styles.descriptionPreview}>
              <Text style={styles.descriptionPreviewLabel}>Description</Text>
              <Text style={styles.descriptionPreviewText} numberOfLines={3}>
                {product.description}
              </Text>
              {product.description.length > 100 && (
                <TouchableOpacity onPress={() => setActiveTab('description')}>
                  <Text style={styles.readMore}>Read More</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ─── Colors - with color switching ────────────────────────────────── */}
          {colors.length > 0 && (
            <View style={styles.colorSection}>
              <Text style={styles.colorLabel}>
                Available Colors
                <Text style={styles.colorCount}>
                  ({colors.length} {colors.length === 1 ? 'color' : 'colors'})
                </Text>
              </Text>
              <View style={styles.colorRow}>
                {colors.map((c, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      selectedColor === i && styles.colorDotActive
                    ]}
                    onPress={() => handleColorSelect(i)}
                  >
                    {selectedColor === i && (
                      <Check
                        color={isLightColor(c) ? COLORS.neutral[900] : COLORS.white}
                        size={16}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {colors[selectedColor] && (
                <View style={styles.selectedColorInfo}>
                  <Text style={styles.selectedColorName}>
                    Selected: {getColorName(colors[selectedColor])}
                  </Text>
                  {colorImagesMap[colors[selectedColor]] && (
                    <Text style={styles.selectedColorImageCount}>
                      {colorImagesMap[colors[selectedColor]].length} image{colorImagesMap[colors[selectedColor]].length !== 1 ? 's' : ''} available
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* ─── Sizes ────────────────────────────────────────────────────────── */}
          {sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <Text style={styles.sizeLabel}>Available Sizes</Text>
              <View style={styles.sizeRow}>
                {sizes.map((size, i) => (
                  <View key={i} style={styles.sizeTag}>
                    <Text style={styles.sizeText}>{size}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ─── Quantity ────────────────────────────────────────────────────── */}
          <View style={styles.qtySection}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                <Minus color={COLORS.neutral[700]} size={18} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                <Plus color={COLORS.neutral[700]} size={18} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── Tabs ──────────────────────────────────────────────────────────── */}
          <View style={styles.tabsRow}>
            {([
              { key: 'description', label: 'Description' },
              { key: 'specs', label: 'Specs' },
              { key: 'reviews', label: 'Reviews' },
              { key: 'faq', label: 'FAQ' },
            ] as const).map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, activeTab === t.key && styles.tabActive]}
                onPress={() => setActiveTab(t.key)}
              >
                <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ─── Tab Content ──────────────────────────────────────────────────── */}
          {activeTab === 'description' && (
            <View style={styles.tabContent}>
              <Text style={styles.descriptionText}>
                {product.description || 'No description available for this product.'}
              </Text>
              {features.length > 0 && (
                <>
                  <Text style={styles.featuresTitle}>Key Features</Text>
                  {features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <View style={styles.featureDot} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}

          {activeTab === 'specs' && (
            <View style={styles.tabContent}>
              {specifications.length > 0 ? (
                specifications.map((s, i) => (
                  <View key={i} style={styles.specRow}>
                    <Text style={styles.specLabel}>{s.label}</Text>
                    <Text style={styles.specValue}>{s.value}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No specifications available</Text>
              )}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={styles.tabContent}>
              <View style={styles.ratingSummary}>
                <View style={styles.ratingBig}>
                  <Text style={styles.ratingBigValue}>{product.rating.toFixed(1)}</Text>
                  <View style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} color={COLORS.gold[400]} fill={s <= Math.round(product.rating) ? COLORS.gold[400] : 'transparent'} />)}
                  </View>
                  <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
                </View>
                <View style={styles.ratingBreakdown}>
                  {ratingBreakdown.map((r) => (
                    <View key={r.stars} style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>{r.stars}★</Text>
                      <View style={styles.breakdownBar}>
                        <View style={[styles.breakdownFill, { width: `${r.pct}%` }]} />
                      </View>
                      <Text style={styles.breakdownCount}>{r.count}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
                    <View style={styles.reviewBody}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewName}>{review.userName}</Text>
                        <View style={styles.ratingStars}>
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={11} color={COLORS.gold[400]} fill={s <= review.rating ? COLORS.gold[400] : 'transparent'} />)}
                        </View>
                      </View>
                      <Text style={styles.reviewComment}>{review.comment}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No reviews yet</Text>
              )}
            </View>
          )}

          {activeTab === 'faq' && (
            <View style={styles.tabContent}>
              {[
                { q: 'Is installation included?', a: 'Yes, professional installation is included with all our products.' },
                { q: 'What is the rental period?', a: 'Standard rental period is 1-3 days. Extended periods available on request.' },
                { q: 'Do you provide delivery?', a: 'Yes, free delivery for orders above ₹50,000 within the city.' },
                { q: 'Can I customize the decoration?', a: 'Absolutely! We offer full customization to match your event theme.' },
              ].map((f, i) => (
                <View key={i} style={styles.faqItem}>
                  <Text style={styles.faqQ}>{f.q}</Text>
                  <Text style={styles.faqA}>{f.a}</Text>
                </View>
              ))}
            </View>
          )}

          {/* ─── Delivery Info ────────────────────────────────────────────────── */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <Truck color={COLORS.primary[600]} size={20} />
              <View>
                <Text style={styles.deliveryTitle}>Free Delivery</Text>
                <Text style={styles.deliveryDesc}>On orders above ₹50,000</Text>
              </View>
            </View>
            <View style={styles.deliveryRow}>
              <Shield color={COLORS.primary[600]} size={20} />
              <View>
                <Text style={styles.deliveryTitle}>Quality Assured</Text>
                <Text style={styles.deliveryDesc}>Premium materials guaranteed</Text>
              </View>
            </View>
            <View style={styles.deliveryRow}>
              <RotateCcw color={COLORS.primary[600]} size={20} />
              <View>
                <Text style={styles.deliveryTitle}>Flexible Booking</Text>
                <Text style={styles.deliveryDesc}>Reschedule anytime before event</Text>
              </View>
            </View>
          </View>

          {/* ─── Related Products ────────────────────────────────────────────── */}
          {related.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>You May Also Like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
                {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} horizontal />)}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ─── Bottom Actions ────────────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.wishAction}
          onPress={() => {
            const customerId = authState.user?.id;
            const productData = {
              name: product.name,
              price: product.price,
              image: product.images?.[0] || '',
            };
            toggle(product.id, customerId, productData);
            show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
          }}
        >
          <Heart
            color={isWishlisted ? COLORS.error : COLORS.neutral[600]}
            size={22}
            fill={isWishlisted ? COLORS.error : 'transparent'}
          />
        </TouchableOpacity>
     <Button 
  onPress={handleAddCart} 
  variant="outline" 
  size="lg" 
  style={{ flex: 1, paddingHorizontal: 0 }}
  contentStyle={{ paddingHorizontal: 8 }}
  loading={addingToCart}
  disabled={addingToCart}
>
  {addingToCart ? 'Adding...' : 'Add to Cart'}
</Button>
<Button 
  onPress={handleBuyNow} 
  variant="gold" 
  size="lg" 
  style={{ flex: 1, paddingHorizontal: 0 }}
  contentStyle={{ paddingHorizontal: 8 }}
  loading={addingToCart}
  disabled={addingToCart}
>
  Buy Now
</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },

  galleryWrap: { width: width, height: 350, position: 'relative' },
  galleryImage: { width, height: 350 },
  galleryDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6
  },
  galleryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  galleryDotActive: {
    width: 24,
    backgroundColor: COLORS.white
  },

  colorIndicator: {
    position: 'absolute',
    bottom: 50,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  colorIndicatorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  colorIndicatorText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  floatingHeader: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  floatBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small
  },
  floatBtnRow: { flexDirection: 'row', gap: 8 },

  infoSection: {
    backgroundColor: COLORS.white,
    marginTop: -20,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.lg
  },

  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  bestBadge: {
    backgroundColor: COLORS.gold[400],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm
  },
  bestText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900]
  },

  productName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginTop: 6,
    lineHeight: 28
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.sm
  },
  reviewCount: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500]
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    marginLeft: 'auto'
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success
  },
  stockText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.success
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: SPACING.md
  },
  price: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900]
  },
  originalPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[400],
    textDecorationLine: 'line-through'
  },
  discountBadge: {
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm
  },
  discountText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: COLORS.error
  },

  descriptionPreview: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  descriptionPreviewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[800],
    marginBottom: 4,
  },
  descriptionPreviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    lineHeight: 20,
  },
  readMore: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary[600],
    marginTop: 4,
  },

  colorSection: { marginTop: SPACING.lg },
  colorLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[800],
    marginBottom: SPACING.sm
  },
  colorCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    marginLeft: 4,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap'
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorDotActive: {
    borderColor: COLORS.primary[600],
    borderWidth: 3
  },
  selectedColorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  selectedColorName: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600]
  },
  selectedColorImageCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.primary[500],
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },

  sizeSection: { marginTop: SPACING.lg },
  sizeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[800],
    marginBottom: SPACING.sm
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  sizeTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.neutral[100],
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.neutral[200]
  },
  sizeText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[700]
  },

  qtySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.lg
  },
  qtyLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[800]
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS.neutral[100],
    borderRadius: RADIUS.lg,
    paddingHorizontal: 4
  },
  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900]
  },

  tabsRow: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200]
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center'
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary[700]
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[500]
  },
  tabTextActive: {
    color: COLORS.primary[700],
    fontFamily: 'Inter-SemiBold'
  },

  tabContent: { marginTop: SPACING.md },

  descriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    lineHeight: 22
  },
  featuresTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900],
    marginTop: SPACING.md,
    marginBottom: SPACING.sm
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold[400]
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[700]
  },

  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100]
  },
  specLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500]
  },
  specValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900]
  },
  noDataText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    textAlign: 'center',
    paddingVertical: SPACING.lg
  },

  ratingSummary: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.lg
  },
  ratingBig: { alignItems: 'center' },
  ratingBigValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900]
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4
  },
  ratingCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    marginTop: 4
  },
  ratingBreakdown: { flex: 1, gap: 4 },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  breakdownLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[600],
    width: 28
  },
  breakdownBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.neutral[200]
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.gold[400]
  },
  breakdownCount: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    width: 20
  },

  reviewCard: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100]
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  reviewBody: {
    flex: 1,
    marginLeft: SPACING.md
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reviewName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900]
  },
  reviewComment: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    marginTop: 4,
    lineHeight: 18
  },
  reviewDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[400],
    marginTop: 4
  },

  faqItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100]
  },
  faqQ: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900]
  },
  faqA: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    marginTop: 4,
    lineHeight: 18
  },

  deliveryCard: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary[50],
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    gap: SPACING.md
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  deliveryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900]
  },
  deliveryDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    marginTop: 2
  },

  relatedSection: { marginTop: SPACING.xl },
  relatedTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
    ...SHADOWS.large
  },
  wishAction: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.neutral[100],
    justifyContent: 'center',
    alignItems: 'center'
  },
});
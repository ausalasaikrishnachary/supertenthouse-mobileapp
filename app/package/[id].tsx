// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Check, Users, Star, Plus, Minus, ShoppingBag, Calendar, MapPin } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Package, AddOn } from '@/types';
// import { Button } from '@/components/ui/Button';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function PackageDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [addOns, setAddOns] = useState<AddOn[]>([]);
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const [pkgs, ads] = await Promise.all([mockApi.getPackages(), mockApi.getAddOns()]);
//       setPkg(pkgs.find((p) => p.id === id) || null);
//       setAddOns(ads);
//       setLoading(false);
//     })();
//   }, [id]);

//   const toggleAddOn = (addOnId: string) => {
//     setSelectedAddOns((prev) => prev.includes(addOnId) ? prev.filter(a => a !== addOnId) : [...prev, addOnId]);
//   };

//   const addOnTotal = useMemo(() => {
//     return addOns.filter(a => selectedAddOns.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
//   }, [addOns, selectedAddOns]);

//   const grandTotal = (pkg?.price || 0) + addOnTotal;

//   const handleAddToCart = () => {
//     if (!pkg) return;
//     addItem({
//       id: `${pkg.id}_${Date.now()}`,
//       productId: pkg.id,
//       packageId: pkg.id,
//       name: pkg.name,
//       image: pkg.image,
//       price: grandTotal,
//       quantity: 1,
//       type: 'package',
//     });
//     show('Package added to cart');
//   };

//   const handleBookNow = () => {
//     handleAddToCart();
//     router.push('/checkout');
//   };

//   if (loading || !pkg) {
//     return <View style={styles.container}><Text style={{ padding: 20 }}>Loading...</Text></View>;
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
//         <View style={styles.imageWrap}>
//           <Image source={{ uri: pkg.image }} style={styles.image} />
//           <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//               <ArrowLeft color={COLORS.neutral[800]} size={22} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.content}>
//           <View style={[styles.tierBadge, { backgroundColor: pkg.tier === 'Luxury' ? COLORS.neutral[900] : pkg.tier === 'Premium' ? COLORS.gold[400] : COLORS.primary[500] }]}>
//             <Text style={[styles.tierText, pkg.tier === 'Luxury' && { color: COLORS.gold[400] }]}>{pkg.tier.toUpperCase()}</Text>
//           </View>
//           <Text style={styles.name}>{pkg.name}</Text>
//           <View style={styles.metaRow}>
//             <RatingBadge rating={pkg.rating} />
//             <Text style={styles.reviewCount}>{pkg.reviewCount} reviews</Text>
//             <View style={styles.guestBadge}>
//               <Users color={COLORS.primary[600]} size={14} />
//               <Text style={styles.guestText}>Up to {pkg.guestCapacity} guests</Text>
//             </View>
//           </View>

//           <Text style={styles.description}>{pkg.description}</Text>

//           {/* Price */}
//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{pkg.price.toLocaleString('en-IN')}</Text>
//             {pkg.originalPrice > pkg.price && (
//               <>
//                 <Text style={styles.originalPrice}>₹{pkg.originalPrice.toLocaleString('en-IN')}</Text>
//                 <View style={styles.discountBadge}><Text style={styles.discountText}>{pkg.discount}% OFF</Text></View>
//               </>
//             )}
//           </View>

//           {/* What's Included */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>What's Included</Text>
//             <View style={styles.includesGrid}>
//               {pkg.includes.map((inc, i) => (
//                 <View key={i} style={styles.includeItem}>
//                   <View style={styles.includeCheck}><Check color={COLORS.success} size={14} /></View>
//                   <Text style={styles.includeText}>{inc}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>

//           {/* Customization */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Customize Your Package</Text>
//             <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
//             <View style={styles.addOnsList}>
//               {addOns.map((addon) => {
//                 const selected = selectedAddOns.includes(addon.id);
//                 return (
//                   <TouchableOpacity
//                     key={addon.id}
//                     style={[styles.addOnCard, selected && styles.addOnCardActive]}
//                     onPress={() => toggleAddOn(addon.id)}
//                   >
//                     <View style={styles.addOnCheck}>
//                       {selected ? <Check color={COLORS.white} size={16} /> : <Plus color={COLORS.neutral[400]} size={16} />}
//                     </View>
//                     <View style={styles.addOnBody}>
//                       <Text style={styles.addOnName}>{addon.name}</Text>
//                       <Text style={styles.addOnPrice}>+₹{addon.price.toLocaleString('en-IN')}</Text>
//                     </View>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </View>

//           {/* Price Summary */}
//           <View style={styles.priceSummary}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Package Price</Text>
//               <Text style={styles.summaryValue}>₹{pkg.price.toLocaleString('en-IN')}</Text>
//             </View>
//             {addOnTotal > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Add-ons ({selectedAddOns.length})</Text>
//                 <Text style={styles.summaryValue}>+₹{addOnTotal.toLocaleString('en-IN')}</Text>
//               </View>
//             )}
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryRow}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       <View style={styles.bottomBar}>
//         <Button onPress={handleAddToCart} variant="outline" size="lg" style={{ flex: 1 }}>
//           <ShoppingBag size={18} color={COLORS.primary[700]} /> Add to Cart
//         </Button>
//         <Button onPress={handleBookNow} variant="gold" size="lg" style={{ flex: 1, marginLeft: SPACING.sm }}>Book Now</Button>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   imageWrap: { position: 'relative' },
//   image: { width: '100%', height: 280, resizeMode: 'cover' },
//   floatingHeader: { position: 'absolute', left: SPACING.md, flexDirection: 'row' },
//   floatBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   content: { backgroundColor: COLORS.white, marginTop: -20, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg },
//   tierBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 8 },
//   tierText: { fontSize: 11, fontFamily: 'Inter-Bold', color: COLORS.white },
//   name: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], lineHeight: 30 },
//   metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.sm, flexWrap: 'wrap' },
//   reviewCount: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   guestBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary[50], paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
//   guestText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.primary[700] },
//   description: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: SPACING.md, lineHeight: 22 },
//   priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
//   price: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   originalPrice: { fontSize: 16, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textDecorationLine: 'line-through' },
//   discountBadge: { backgroundColor: COLORS.error + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
//   discountText: { fontSize: 12, fontFamily: 'Inter-Bold', color: COLORS.error },
//   section: { marginTop: SPACING.xl },
//   sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: 4 },
//   sectionSubtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginBottom: SPACING.md },
//   includesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//   includeItem: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '48%', backgroundColor: COLORS.neutral[50], paddingHorizontal: 12, paddingVertical: 10, borderRadius: RADIUS.md },
//   includeCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.success + '20', justifyContent: 'center', alignItems: 'center' },
//   includeText: { fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.neutral[800], flex: 1 },
//   addOnsList: { gap: SPACING.sm },
//   addOnCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 2, borderColor: COLORS.neutral[200], ...SHADOWS.small },
//   addOnCardActive: { borderColor: COLORS.primary[600], backgroundColor: COLORS.primary[50] },
//   addOnCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
//   addOnBody: { flex: 1, marginLeft: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   addOnName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   addOnPrice: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   priceSummary: { marginTop: SPACING.lg, backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.xl, padding: SPACING.md },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
//   summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
//   totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, paddingBottom: 30, borderTopWidth: 1, borderTopColor: COLORS.neutral[100], ...SHADOWS.large },
// });





// // app/package/[id].tsx
// import { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Check, Users, ShoppingBag, Star } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Package } from '@/types';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// export default function PackageDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);

//   useEffect(() => {
//     (async () => {
//       try {
//         const pkgData = await mockApi.getPackage(id);
//         setPkg(pkgData || null);
//       } catch (error) {
//         console.error('Error loading package:', error);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!pkg) return;
//     addItem({
//       id: `${pkg.id}_${Date.now()}`,
//       productId: pkg.id,
//       packageId: pkg.id,
//       name: pkg.name,
//       image: pkg.image,
//       price: pkg.price,
//       quantity: 1,
//       type: 'package',
//     });
//     show('Package added to cart');
//   };

//   const handleBookNow = () => {
//     handleAddToCart();
//     router.push('/checkout');
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.primary[600]} />
//         <Text style={{ marginTop: 10, color: COLORS.neutral[600] }}>Loading...</Text>
//       </View>
//     );
//   }

//   if (!pkg) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 16, color: COLORS.neutral[600] }}>Package not found</Text>
//         <TouchableOpacity 
//           onPress={() => router.back()} 
//           style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
//         >
//           <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const images = pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.image];

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
//         {/* Image Gallery */}
//         <View style={styles.imageWrap}>
//           <ScrollView
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
//             scrollEventThrottle={16}
//           >
//             {images.map((img, i) => {
//               const imageUri = typeof img === 'string' ? img : '';
//               return (
//                 <Image key={i} source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
//               );
//             })}
//           </ScrollView>
//           {images.length > 1 && (
//             <View style={styles.imageDots}>
//               {images.map((_, i) => {
//                 const isActive = i === activeImage;
//                 return (
//                   <View 
//                     key={i} 
//                     style={[
//                       styles.imageDot, 
//                       isActive && styles.imageDotActive
//                     ]} 
//                   />
//                 );
//               })}
//             </View>
//           )}
//           <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//               <ArrowLeft color={COLORS.neutral[800]} size={22} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.content}>
//           {/* Tier Badge */}
//           <View style={[styles.tierBadge, { 
//             backgroundColor: pkg.tier === 'Luxury' || pkg.tier === 'Platinum' 
//               ? '#1A1A1A' 
//               : pkg.tier === 'Premium' || pkg.tier === 'Gold' 
//                 ? '#D4A82E' 
//                 : COLORS.primary[500] 
//           }]}>
//             <Text style={[styles.tierText, (pkg.tier === 'Luxury' || pkg.tier === 'Platinum') && { color: '#D4A82E' }]}>
//               {String(pkg.tier).toUpperCase()}
//             </Text>
//           </View>
          
//           <Text style={styles.name}>{String(pkg.name)}</Text>
          
//           <View style={styles.metaRow}>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               {[1, 2, 3, 4, 5].map((star) => {
//                 const isFilled = star <= Math.round(pkg.rating || 0);
//                 return (
//                   <View key={star} style={{ marginRight: 2 }}>
//                     <Star 
//                       size={14} 
//                       color={isFilled ? '#D4A82E' : '#CCCCCC'} 
//                       fill={isFilled ? '#D4A82E' : 'transparent'} 
//                     />
//                   </View>
//                 );
//               })}
//               <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#333333', marginLeft: 4 }}>
//                 {String((pkg.rating || 0).toFixed(1))}
//               </Text>
//             </View>
//             <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
//             <View style={styles.guestBadge}>
//               <Users color={COLORS.primary[600]} size={14} />
//               <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
//             </View>
//           </View>

//           <Text style={styles.description}>{String(pkg.description || '')}</Text>

//           {/* Price */}
//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             {(pkg.originalPrice || 0) > (pkg.price || 0) && (
//               <>
//                 <Text style={styles.originalPrice}>₹{String((pkg.originalPrice || 0).toLocaleString('en-IN'))}</Text>
//                 <View style={styles.discountBadge}>
//                   <Text style={styles.discountText}>{String(pkg.discount || 0)}% OFF</Text>
//                 </View>
//               </>
//             )}
//           </View>

//           {/* What's Included */}
//           {(pkg.includes && pkg.includes.length > 0) && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>What's Included</Text>
//               <View style={styles.includesGrid}>
//                 {pkg.includes.map((inc, i) => {
//                   const includeText = typeof inc === 'string' ? inc : String(inc);
//                   return (
//                     <View key={i} style={styles.includeItem}>
//                       <View style={styles.includeCheck}>
//                         <Check color="#22C55E" size={14} />
//                       </View>
//                       <Text style={styles.includeText}>{includeText}</Text>
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Price Summary */}
//           <View style={styles.priceSummary}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Package Price</Text>
//               <Text style={styles.summaryValue}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             </View>
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryRow}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity 
//           onPress={handleAddToCart} 
//           style={[styles.actionBtn, styles.outlineBtn]}
//           activeOpacity={0.7}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[700]} />
//           <Text style={styles.outlineBtnText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           onPress={handleBookNow} 
//           style={[styles.actionBtn, styles.goldBtn]}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.goldBtnText}>Book Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#F5F5F5' 
//   },
//   imageWrap: { 
//     position: 'relative', 
//     width: '100%', 
//     height: 280 
//   },
//   image: { 
//     width: width, 
//     height: 280, 
//     resizeMode: 'cover' 
//   },
//   imageDots: {
//     position: 'absolute',
//     bottom: 16,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   imageDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     marginHorizontal: 3 
//   },
//   imageDotActive: { 
//     width: 20, 
//     backgroundColor: '#FFFFFF' 
//   },
//   floatingHeader: { 
//     position: 'absolute', 
//     left: 16, 
//     flexDirection: 'row' 
//   },
//   floatBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   content: {
//     backgroundColor: '#FFFFFF',
//     marginTop: -20,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//   },
//   tierBadge: { 
//     alignSelf: 'flex-start', 
//     paddingHorizontal: 12, 
//     paddingVertical: 4, 
//     borderRadius: 4, 
//     marginBottom: 8 
//   },
//   tierText: { 
//     fontSize: 11, 
//     fontWeight: 'bold', 
//     color: '#FFFFFF' 
//   },
//   name: { 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A', 
//     lineHeight: 30 
//   },
//   metaRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8, 
//     marginTop: 8, 
//     flexWrap: 'wrap' 
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     color: '#666666' 
//   },
//   guestBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: '#F0F4FF',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 4,
//   },
//   guestText: { 
//     fontSize: 11, 
//     fontWeight: '600', 
//     color: COLORS.primary[700] 
//   },
//   description: { 
//     fontSize: 14, 
//     color: '#666666', 
//     marginTop: 16, 
//     lineHeight: 22 
//   },
//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginTop: 16 
//   },
//   price: { 
//     fontSize: 28, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A' 
//   },
//   originalPrice: { 
//     fontSize: 16, 
//     color: '#999999', 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: '#FEE2E2', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: 4 
//   },
//   discountText: { 
//     fontSize: 12, 
//     fontWeight: 'bold', 
//     color: '#EF4444' 
//   },
//   section: { 
//     marginTop: 24 
//   },
//   sectionTitle: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A', 
//     marginBottom: 4 
//   },
//   includesGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: 8 
//   },
//   includeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     width: '48%',
//     backgroundColor: '#F8F8F8',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   includeCheck: { 
//     width: 20, 
//     height: 20, 
//     borderRadius: 10, 
//     backgroundColor: '#DCFCE7', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   includeText: { 
//     fontSize: 12, 
//     fontWeight: '500', 
//     color: '#333333', 
//     flex: 1 
//   },
//   priceSummary: { 
//     marginTop: 24, 
//     backgroundColor: '#F8F8F8', 
//     borderRadius: 12, 
//     padding: 16 
//   },
//   summaryRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     marginVertical: 4 
//   },
//   summaryLabel: { 
//     fontSize: 14, 
//     color: '#666666' 
//   },
//   summaryValue: { 
//     fontSize: 14, 
//     fontWeight: '600', 
//     color: '#1A1A1A' 
//   },
//   summaryDivider: { 
//     height: 1, 
//     backgroundColor: '#E5E5E5', 
//     marginVertical: 8 
//   },
//   totalLabel: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A' 
//   },
//   totalValue: { 
//     fontSize: 20, 
//     fontWeight: 'bold', 
//     color: COLORS.primary[700] 
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     paddingBottom: 30,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E5E5',
//     ...SHADOWS.large,
//     gap: 8,
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 8,
//     gap: 6,
//   },
//   outlineBtn: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: COLORS.primary[700],
//   },
//   outlineBtnText: {
//     color: COLORS.primary[700],
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   goldBtn: {
//     backgroundColor: '#D4A82E',
//   },
//   goldBtnText: {
//     color: '#1A1A1A',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
// });




// // app/package/[id].tsx
// import { useState, useEffect, useMemo } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Check, Users, ShoppingBag, Star, Plus } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Package, AddOn } from '@/types';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { width } = Dimensions.get('window');

// export default function PackageDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [addOns, setAddOns] = useState<AddOn[]>([]);
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [pkgData, addonsData] = await Promise.all([
//           mockApi.getPackage(id),
//           mockApi.getAddOns()
//         ]);
//         setPkg(pkgData || null);
//         setAddOns(addonsData || []);
//       } catch (error) {
//         console.error('Error loading package:', error);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const toggleAddOn = (addOnId: string) => {
//     setSelectedAddOns((prev) => 
//       prev.includes(addOnId) 
//         ? prev.filter(a => a !== addOnId) 
//         : [...prev, addOnId]
//     );
//   };

//   const addOnTotal = useMemo(() => {
//     return addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .reduce((sum, a) => sum + a.price, 0);
//   }, [addOns, selectedAddOns]);

//   const grandTotal = (pkg?.price || 0) + addOnTotal;

//   const handleAddToCart = () => {
//     if (!pkg) return;
//     addItem({
//       id: `${pkg.id}_${Date.now()}`,
//       productId: pkg.id,
//       packageId: pkg.id,
//       name: pkg.name,
//       image: pkg.image,
//       price: grandTotal,
//       quantity: 1,
//       type: 'package',
//     });
//     show('Package added to cart');
//   };

//   const handleBookNow = () => {
//     handleAddToCart();
//     router.push('/checkout');
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.primary[600]} />
//         <Text style={{ marginTop: 10, color: COLORS.neutral[600] }}>Loading...</Text>
//       </View>
//     );
//   }

//   if (!pkg) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 16, color: COLORS.neutral[600] }}>Package not found</Text>
//         <TouchableOpacity 
//           onPress={() => router.back()} 
//           style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
//         >
//           <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const images = pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.image];

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
//         {/* Image Gallery */}
//         <View style={styles.imageWrap}>
//           <ScrollView
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
//             scrollEventThrottle={16}
//           >
//             {images.map((img, i) => {
//               const imageUri = typeof img === 'string' ? img : '';
//               return (
//                 <Image key={i} source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
//               );
//             })}
//           </ScrollView>
//           {images.length > 1 && (
//             <View style={styles.imageDots}>
//               {images.map((_, i) => {
//                 const isActive = i === activeImage;
//                 return (
//                   <View 
//                     key={i} 
//                     style={[
//                       styles.imageDot, 
//                       isActive && styles.imageDotActive
//                     ]} 
//                   />
//                 );
//               })}
//             </View>
//           )}
//           <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//               <ArrowLeft color={COLORS.neutral[800]} size={22} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.content}>
//           {/* Tier Badge */}
//           <View style={[styles.tierBadge, { 
//             backgroundColor: pkg.tier === 'Luxury' || pkg.tier === 'Platinum' 
//               ? '#1A1A1A' 
//               : pkg.tier === 'Premium' || pkg.tier === 'Gold' 
//                 ? '#D4A82E' 
//                 : COLORS.primary[500] 
//           }]}>
//             <Text style={[styles.tierText, (pkg.tier === 'Luxury' || pkg.tier === 'Platinum') && { color: '#D4A82E' }]}>
//               {String(pkg.tier).toUpperCase()}
//             </Text>
//           </View>
          
//           <Text style={styles.name}>{String(pkg.name)}</Text>
          
//           <View style={styles.metaRow}>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               {[1, 2, 3, 4, 5].map((star) => {
//                 const isFilled = star <= Math.round(pkg.rating || 0);
//                 return (
//                   <View key={star} style={{ marginRight: 2 }}>
//                     <Star 
//                       size={14} 
//                       color={isFilled ? '#D4A82E' : '#CCCCCC'} 
//                       fill={isFilled ? '#D4A82E' : 'transparent'} 
//                     />
//                   </View>
//                 );
//               })}
//               <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#333333', marginLeft: 4 }}>
//                 {String((pkg.rating || 0).toFixed(1))}
//               </Text>
//             </View>
//             <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
//             <View style={styles.guestBadge}>
//               <Users color={COLORS.primary[600]} size={14} />
//               <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
//             </View>
//           </View>

//           <Text style={styles.description}>{String(pkg.description || '')}</Text>

//           {/* Price */}
//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             {(pkg.originalPrice || 0) > (pkg.price || 0) && (
//               <>
//                 <Text style={styles.originalPrice}>₹{String((pkg.originalPrice || 0).toLocaleString('en-IN'))}</Text>
//                 <View style={styles.discountBadge}>
//                   <Text style={styles.discountText}>{String(pkg.discount || 0)}% OFF</Text>
//                 </View>
//               </>
//             )}
//           </View>

//           {/* What's Included */}
//           {(pkg.includes && pkg.includes.length > 0) && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>What's Included</Text>
//               <View style={styles.includesGrid}>
//                 {pkg.includes.map((inc, i) => {
//                   const includeText = typeof inc === 'string' ? inc : String(inc);
//                   return (
//                     <View key={i} style={styles.includeItem}>
//                       <View style={styles.includeCheck}>
//                         <Check color="#22C55E" size={14} />
//                       </View>
//                       <Text style={styles.includeText}>{includeText}</Text>
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Add-ons Section */}
//           {addOns.length > 0 && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Customize Your Package</Text>
//               <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
//               <View style={styles.addOnsList}>
//                 {addOns.map((addon) => {
//                   const selected = selectedAddOns.includes(addon.id);
//                   return (
//                     <TouchableOpacity
//                       key={addon.id}
//                       style={[styles.addOnCard, selected && styles.addOnCardActive]}
//                       onPress={() => toggleAddOn(addon.id)}
//                       activeOpacity={0.7}
//                     >
//                       <View style={[styles.addOnCheck, selected && styles.addOnCheckActive]}>
//                         {selected ? (
//                           <Check color="#FFFFFF" size={16} />
//                         ) : (
//                           <Plus color="#999999" size={16} />
//                         )}
//                       </View>
//                       <View style={styles.addOnBody}>
//                         <View>
//                           <Text style={styles.addOnName}>{String(addon.name)}</Text>
//                           {addon.description && (
//                             <Text style={styles.addOnDescription}>{String(addon.description)}</Text>
//                           )}
//                         </View>
//                         <Text style={styles.addOnPrice}>+₹{String((addon.price || 0).toLocaleString('en-IN'))}</Text>
//                       </View>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Price Summary */}
//           <View style={styles.priceSummary}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Package Price</Text>
//               <Text style={styles.summaryValue}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             </View>
//             {addOnTotal > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Add-ons ({String(selectedAddOns.length)})</Text>
//                 <Text style={styles.summaryValue}>+₹{String(addOnTotal.toLocaleString('en-IN'))}</Text>
//               </View>
//             )}
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryRow}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={styles.bottomBar}>
//         <TouchableOpacity 
//           onPress={handleAddToCart} 
//           style={[styles.actionBtn, styles.outlineBtn]}
//           activeOpacity={0.7}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[700]} />
//           <Text style={styles.outlineBtnText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           onPress={handleBookNow} 
//           style={[styles.actionBtn, styles.goldBtn]}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.goldBtnText}>Book Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#F5F5F5' 
//   },
//   imageWrap: { 
//     position: 'relative', 
//     width: '100%', 
//     height: 280 
//   },
//   image: { 
//     width: width, 
//     height: 280, 
//     resizeMode: 'cover' 
//   },
//   imageDots: {
//     position: 'absolute',
//     bottom: 16,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   imageDot: { 
//     width: 6, 
//     height: 6, 
//     borderRadius: 3, 
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     marginHorizontal: 3 
//   },
//   imageDotActive: { 
//     width: 20, 
//     backgroundColor: '#FFFFFF' 
//   },
//   floatingHeader: { 
//     position: 'absolute', 
//     left: 16, 
//     flexDirection: 'row' 
//   },
//   floatBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   content: {
//     backgroundColor: '#FFFFFF',
//     marginTop: -20,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//   },
//   tierBadge: { 
//     alignSelf: 'flex-start', 
//     paddingHorizontal: 12, 
//     paddingVertical: 4, 
//     borderRadius: 4, 
//     marginBottom: 8 
//   },
//   tierText: { 
//     fontSize: 11, 
//     fontWeight: 'bold', 
//     color: '#FFFFFF' 
//   },
//   name: { 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A', 
//     lineHeight: 30 
//   },
//   metaRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8, 
//     marginTop: 8, 
//     flexWrap: 'wrap' 
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     color: '#666666' 
//   },
//   guestBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: '#F0F4FF',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 4,
//   },
//   guestText: { 
//     fontSize: 11, 
//     fontWeight: '600', 
//     color: COLORS.primary[700] 
//   },
//   description: { 
//     fontSize: 14, 
//     color: '#666666', 
//     marginTop: 16, 
//     lineHeight: 22 
//   },
//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginTop: 16 
//   },
//   price: { 
//     fontSize: 28, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A' 
//   },
//   originalPrice: { 
//     fontSize: 16, 
//     color: '#999999', 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: '#FEE2E2', 
//     paddingHorizontal: 8, 
//     paddingVertical: 3, 
//     borderRadius: 4 
//   },
//   discountText: { 
//     fontSize: 12, 
//     fontWeight: 'bold', 
//     color: '#EF4444' 
//   },
//   section: { 
//     marginTop: 24 
//   },
//   sectionTitle: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A', 
//     marginBottom: 4 
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: '#666666',
//     marginBottom: 12,
//   },
//   includesGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: 8 
//   },
//   includeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     width: '48%',
//     backgroundColor: '#F8F8F8',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   includeCheck: { 
//     width: 20, 
//     height: 20, 
//     borderRadius: 10, 
//     backgroundColor: '#DCFCE7', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   includeText: { 
//     fontSize: 12, 
//     fontWeight: '500', 
//     color: '#333333', 
//     flex: 1 
//   },
//   addOnsList: {
//     gap: 8,
//   },
//   addOnCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 2,
//     borderColor: '#E5E5E5',
//     ...SHADOWS.small,
//   },
//   addOnCardActive: {
//     borderColor: COLORS.primary[600],
//     backgroundColor: '#F0F4FF',
//   },
//   addOnCheck: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addOnCheckActive: {
//     backgroundColor: COLORS.primary[600],
//   },
//   addOnBody: {
//     flex: 1,
//     marginLeft: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   addOnName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1A1A1A',
//   },
//   addOnDescription: {
//     fontSize: 12,
//     color: '#666666',
//     marginTop: 2,
//   },
//   addOnPrice: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: COLORS.primary[700],
//   },
//   priceSummary: { 
//     marginTop: 24, 
//     backgroundColor: '#F8F8F8', 
//     borderRadius: 12, 
//     padding: 16 
//   },
//   summaryRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     marginVertical: 4 
//   },
//   summaryLabel: { 
//     fontSize: 14, 
//     color: '#666666' 
//   },
//   summaryValue: { 
//     fontSize: 14, 
//     fontWeight: '600', 
//     color: '#1A1A1A' 
//   },
//   summaryDivider: { 
//     height: 1, 
//     backgroundColor: '#E5E5E5', 
//     marginVertical: 8 
//   },
//   totalLabel: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A' 
//   },
//   totalValue: { 
//     fontSize: 20, 
//     fontWeight: 'bold', 
//     color: COLORS.primary[700] 
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     paddingBottom: 30,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E5E5',
//     ...SHADOWS.large,
//     gap: 8,
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 8,
//     gap: 6,
//   },
//   outlineBtn: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: COLORS.primary[700],
//   },
//   outlineBtnText: {
//     color: COLORS.primary[700],
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   goldBtn: {
//     backgroundColor: '#D4A82E',
//   },
//   goldBtnText: {
//     color: '#1A1A1A',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
// });



// // app/package/[id].tsx
// import { useState, useEffect, useMemo } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, FlatList } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Check, Users, ShoppingBag, Star, Plus, Minus, Crown, Sparkles, Music, Camera, Flower2, Mic, Palette, Utensils, PartyPopper } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Package, AddOn } from '@/types';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width } = Dimensions.get('window');

// const iconMap: Record<string, any> = {
//   '📸': Camera,
//   '🎵': Music,
//   '🌸': Flower2,
//   '💡': Sparkles,
//   '✈️': Camera,
//   '🎸': Mic,
//   '🍽️': Utensils,
//   '📷': Camera,
//   '🎨': Palette,
//   '🎪': PartyPopper,
//   '👑': Crown,
// };

// export default function PackageDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [addOns, setAddOns] = useState<AddOn[]>([]);
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [pkgData, addonsData] = await Promise.all([
//           mockApi.getPackage(id),
//           mockApi.getAddOns()
//         ]);
//         setPkg(pkgData || null);
//         setAddOns(addonsData || []);
//       } catch (error) {
//         console.error('Error loading package:', error);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const toggleAddOn = (addOnId: string) => {
//     setSelectedAddOns((prev) => 
//       prev.includes(addOnId) 
//         ? prev.filter(a => a !== addOnId) 
//         : [...prev, addOnId]
//     );
//   };

//   const addOnTotal = useMemo(() => {
//     return addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .reduce((sum, a) => sum + a.price, 0);
//   }, [addOns, selectedAddOns]);

//   const grandTotal = ((pkg?.price || 0) + addOnTotal) * quantity;

//   const handleAddToCart = () => {
//     if (!pkg) return;
//     addItem({
//       id: `${pkg.id}_${Date.now()}`,
//       productId: pkg.id,
//       packageId: pkg.id,
//       name: pkg.name,
//       image: pkg.image,
//       price: grandTotal,
//       quantity: quantity,
//       type: 'package',
//     });
//     show('Package added to cart 🎉');
//   };

//   const handleBookNow = () => {
//     handleAddToCart();
//     router.push('/checkout');
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.gold[400]} />
//         <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>Loading package...</Text>
//       </View>
//     );
//   }

//   if (!pkg) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 16, color: COLORS.neutral[600], fontFamily: 'Inter-Regular' }}>Package not found</Text>
//         <TouchableOpacity 
//           onPress={() => router.back()} 
//           style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: RADIUS.lg }}
//         >
//           <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-SemiBold', fontSize: 14 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const images = pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.image];

//   const getTierColors = () => {
//     switch(pkg.tier) {
//       case 'Platinum':
//         return { bg: ['#1a1a2e', '#16213e'] as const, text: '#FFD700', badge: '#FFD700' };
//       case 'Gold':
//         return { bg: ['#4a3728', '#2d1f14'] as const, text: '#D4A82E', badge: '#D4A82E' };
//       case 'Premium':
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#4FC3F7', badge: '#4FC3F7' };
//       case 'Luxury':
//         return { bg: ['#2d1b3d', '#1a0f2e'] as const, text: '#CE93D8', badge: '#CE93D8' };
//       default:
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#64B5F6', badge: '#64B5F6' };
//     }
//   };

//   const tierColors = getTierColors();

//   const renderStars = () => {
//     const stars = [];
//     const rating = pkg.rating || 0;
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[200]} />
//           </View>
//         );
//       }
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         contentContainerStyle={{ paddingBottom: 120 }}
//         bounces={true}
//       >
//         {/* Image Gallery */}
//         <View style={styles.imageWrap}>
//           <FlatList
//             data={images}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
//             scrollEventThrottle={16}
//             keyExtractor={(_, i) => i.toString()}
//             renderItem={({ item }) => (
//               <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
//             )}
//           />
//           <LinearGradient
//             colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
//             style={styles.imageGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 0, y: 1 }}
//           />
//           {images.length > 1 && (
//             <View style={styles.imageDots}>
//               {images.map((_, i) => (
//                 <View 
//                   key={i} 
//                   style={[
//                     styles.imageDot, 
//                     i === activeImage && styles.imageDotActive
//                   ]} 
//                 />
//               ))}
//             </View>
//           )}
//           <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//               <ArrowLeft color={COLORS.neutral[800]} size={22} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.floatBtn}>
//               <Star size={20} color={COLORS.neutral[800]} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Content */}
//         <View style={styles.content}>
//           {/* Tier Badge */}
//           <View style={[styles.tierBadgeContainer]}>
//             <LinearGradient
//               colors={tierColors.bg}
//               style={styles.tierBadge}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Crown size={14} color={tierColors.badge} />
//               <Text style={[styles.tierText, { color: tierColors.text }]}>
//                 {String(pkg.tier).toUpperCase()}
//               </Text>
//             </LinearGradient>
//           </View>
          
//           <Text style={styles.name}>{String(pkg.name)}</Text>
          
//           <View style={styles.metaRow}>
//             <View style={styles.ratingContainer}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
//                 {renderStars()}
//               </View>
//               <Text style={styles.ratingText}>
//                 {String((pkg.rating || 0).toFixed(1))}
//               </Text>
//             </View>
//             <View style={styles.dotSeparator} />
//             <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
//             <View style={styles.dotSeparator} />
//             <View style={styles.guestBadge}>
//               <Users color={COLORS.primary[500]} size={14} />
//               <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
//             </View>
//           </View>

//           <Text style={styles.description}>{String(pkg.description || '')}</Text>

//           {/* Price */}
//           <View style={styles.priceSection}>
//             <View style={styles.priceRow}>
//               <View>
//                 <Text style={styles.priceLabel}>Price</Text>
//                 <Text style={styles.price}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//               </View>
//               {(pkg.originalPrice || 0) > (pkg.price || 0) && (
//                 <View style={styles.discountContainer}>
//                   <Text style={styles.originalPrice}>₹{String((pkg.originalPrice || 0).toLocaleString('en-IN'))}</Text>
//                   <View style={styles.discountBadge}>
//                     <Text style={styles.discountText}>SAVE {String(pkg.discount || 0)}%</Text>
//                   </View>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* What's Included */}
//           {(pkg.includes && pkg.includes.length > 0) && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>✨ What's Included</Text>
//               <View style={styles.includesGrid}>
//                 {pkg.includes.map((inc, i) => {
//                   const includeText = typeof inc === 'string' ? inc : String(inc);
//                   return (
//                     <View key={i} style={styles.includeItem}>
//                       <View style={styles.includeCheck}>
//                         <Check color="#22C55E" size={14} />
//                       </View>
//                       <Text style={styles.includeText}>{includeText}</Text>
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Add-ons Section */}
//           {addOns.length > 0 && (
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>🎯 Customize Your Package</Text>
//                 <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
//               </View>
//               <View style={styles.addOnsList}>
//                 {addOns.map((addon) => {
//                   const selected = selectedAddOns.includes(addon.id);
//                   const IconComponent = iconMap[addon.icon] || Sparkles;
//                   return (
//                     <TouchableOpacity
//                       key={addon.id}
//                       style={[styles.addOnCard, selected && styles.addOnCardActive]}
//                       onPress={() => toggleAddOn(addon.id)}
//                       activeOpacity={0.8}
//                     >
//                       <View style={[styles.addOnIcon, selected && styles.addOnIconActive]}>
//                         <IconComponent 
//                           size={20} 
//                           color={selected ? '#FFFFFF' : COLORS.primary[600]} 
//                         />
//                       </View>
//                       <View style={styles.addOnBody}>
//                         <View>
//                           <Text style={[styles.addOnName, selected && styles.addOnNameActive]}>
//                             {String(addon.name)}
//                           </Text>
//                           {addon.description && (
//                             <Text style={styles.addOnDescription}>{String(addon.description)}</Text>
//                           )}
//                         </View>
//                         <View style={styles.addOnRight}>
//                           <Text style={[styles.addOnPrice, selected && styles.addOnPriceActive]}>
//                             +₹{String((addon.price || 0).toLocaleString('en-IN'))}
//                           </Text>
//                           <View style={[styles.addOnCheck, selected && styles.addOnCheckActive]}>
//                             {selected ? (
//                               <Check color="#FFFFFF" size={12} />
//                             ) : (
//                               <Plus color="#999999" size={12} />
//                             )}
//                           </View>
//                         </View>
//                       </View>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Quantity Selector */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>📦 Quantity</Text>
//             <View style={styles.quantityContainer}>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Minus color={COLORS.neutral[600]} size={20} />
//               </TouchableOpacity>
//               <Text style={styles.quantityText}>{quantity}</Text>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(quantity + 1)}
//               >
//                 <Plus color={COLORS.neutral[600]} size={20} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Price Summary */}
//           <View style={styles.priceSummary}>
//             <View style={styles.summaryHeader}>
//               <Text style={styles.summaryTitle}>Order Summary</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Package Price</Text>
//               <Text style={styles.summaryValue}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             </View>
//             {addOnTotal > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Add-ons ({String(selectedAddOns.length)})</Text>
//                 <Text style={styles.summaryValue}>+₹{String(addOnTotal.toLocaleString('en-IN'))}</Text>
//               </View>
//             )}
//             {quantity > 1 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Quantity</Text>
//                 <Text style={styles.summaryValue}>× {quantity}</Text>
//               </View>
//             )}
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryTotal}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
//         <View style={styles.bottomPrice}>
//           <Text style={styles.bottomPriceLabel}>Total</Text>
//           <Text style={styles.bottomPriceValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//         </View>
//         <TouchableOpacity 
//           onPress={handleAddToCart} 
//           style={[styles.actionBtn, styles.outlineBtn]}
//           activeOpacity={0.8}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[600]} />
//           <Text style={styles.outlineBtnText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           onPress={handleBookNow} 
//           style={[styles.actionBtn, styles.goldBtn]}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.goldBtnText}>Book Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#F8F9FA' 
//   },
//   imageWrap: { 
//     position: 'relative', 
//     width: '100%', 
//     height: 320 
//   },
//   image: { 
//     width: width, 
//     height: 320, 
//     resizeMode: 'cover' 
//   },
//   imageGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   imageDots: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   imageDot: { 
//     width: 8, 
//     height: 8, 
//     borderRadius: 4, 
//     backgroundColor: 'rgba(255,255,255,0.4)',
//   },
//   imageDotActive: { 
//     width: 24, 
//     backgroundColor: '#FFFFFF' 
//   },
//   floatingHeader: { 
//     position: 'absolute', 
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   floatBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   content: {
//     backgroundColor: '#F8F9FA',
//     marginTop: -20,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   tierBadgeContainer: {
//     marginBottom: 8,
//   },
//   tierBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     alignSelf: 'flex-start',
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     ...SHADOWS.small,
//   },
//   tierText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold',
//     letterSpacing: 0.5,
//   },
//   name: { 
//     fontSize: 24, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A', 
//     lineHeight: 30,
//     marginBottom: 8,
//   },
//   metaRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flexWrap: 'wrap',
//     marginBottom: 12,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ratingText: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//     marginLeft: 4,
//   },
//   dotSeparator: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#CCCCCC',
//     marginHorizontal: 8,
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   guestBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: '#F0F4FF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   guestText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium',
//     color: COLORS.primary[600] 
//   },
//   description: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#555555', 
//     lineHeight: 22,
//     marginBottom: 16,
//   },
//   priceSection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//     marginBottom: 8,
//   },
//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   priceLabel: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginBottom: 2,
//   },
//   price: { 
//     fontSize: 28, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   discountContainer: {
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   originalPrice: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#999999', 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: '#FEE2E2', 
//     paddingHorizontal: 10, 
//     paddingVertical: 4, 
//     borderRadius: 6,
//   },
//   discountText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold', 
//     color: '#EF4444' 
//   },
//   section: { 
//     marginTop: 20,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   sectionHeader: {
//     marginBottom: 12,
//   },
//   sectionTitle: { 
//     fontSize: 17, 
//     fontFamily: 'Inter-SemiBold', 
//     color: '#1A1A1A',
//     marginBottom: 2,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   includesGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: 8,
//     marginTop: 4,
//   },
//   includeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     width: '48%',
//     backgroundColor: '#F8F9FA',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   includeCheck: { 
//     width: 20, 
//     height: 20, 
//     borderRadius: 10, 
//     backgroundColor: '#DCFCE7', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   includeText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: '#333333', 
//     flex: 1 
//   },
//   addOnsList: {
//     gap: 10,
//   },
//   addOnCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1.5,
//     borderColor: '#EEEEEE',
//   },
//   addOnCardActive: {
//     borderColor: COLORS.primary[500],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8EDF5',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addOnIconActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   addOnBody: {
//     flex: 1,
//     marginLeft: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   addOnName: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   addOnNameActive: {
//     color: COLORS.primary[600],
//   },
//   addOnDescription: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginTop: 2,
//   },
//   addOnRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   addOnPrice: {
//     fontSize: 14,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   addOnPriceActive: {
//     color: COLORS.primary[600],
//   },
//   addOnCheck: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#EEEEEE',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addOnCheckActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     marginTop: 8,
//   },
//   quantityBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityText: {
//     fontSize: 18,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//     minWidth: 30,
//     textAlign: 'center',
//   },
//   priceSummary: { 
//     marginTop: 20,
//     marginBottom: 8,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   summaryHeader: {
//     marginBottom: 12,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   summaryRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: 6,
//   },
//   summaryLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   summaryValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Medium',
//     color: '#1A1A1A' 
//   },
//   summaryDivider: { 
//     height: 1, 
//     backgroundColor: '#EEEEEE', 
//     marginVertical: 8 
//   },
//   summaryTotal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 4,
//   },
//   totalLabel: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   totalValue: { 
//     fontSize: 20, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.primary[600] 
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#EEEEEE',
//     ...SHADOWS.large,
//     gap: 8,
//   },
//   bottomPrice: {
//     flexDirection: 'column',
//     marginRight: 8,
//   },
//   bottomPriceLabel: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   bottomPriceValue: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 6,
//   },
//   outlineBtn: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: COLORS.primary[500],
//   },
//   outlineBtnText: {
//     color: COLORS.primary[600],
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 14,
//   },
//   goldBtn: {
//     backgroundColor: COLORS.gold[400],
//     ...SHADOWS.small,
//   },
//   goldBtnText: {
//     color: '#1A1A1A',
//     fontFamily: 'Inter-Bold',
//     fontSize: 14,
//   },
// });





// // app/package/[id].tsx
// import { useState, useEffect, useMemo } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Check, Users, ShoppingBag, Star, Plus, Minus, Crown, Sparkles, Music, Camera, Flower2, Mic, Palette, Utensils, PartyPopper } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Package, AddOn } from '@/types';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width } = Dimensions.get('window');

// const iconMap: Record<string, any> = {
//   '📸': Camera,
//   '🎵': Music,
//   '🌸': Flower2,
//   '💡': Sparkles,
//   '✈️': Camera,
//   '🎸': Mic,
//   '🍽️': Utensils,
//   '📷': Camera,
//   '🎨': Palette,
//   '🎪': PartyPopper,
//   '👑': Crown,
// };

// export default function PackageDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [addOns, setAddOns] = useState<AddOn[]>([]);
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [pkgData, addonsData] = await Promise.all([
//           mockApi.getPackage(id),
//           mockApi.getAddOns()
//         ]);
//         setPkg(pkgData || null);
//         setAddOns(addonsData || []);
//       } catch (error) {
//         console.error('Error loading package:', error);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const toggleAddOn = (addOnId: string) => {
//     setSelectedAddOns((prev) => 
//       prev.includes(addOnId) 
//         ? prev.filter(a => a !== addOnId) 
//         : [...prev, addOnId]
//     );
//   };

//   const addOnTotal = useMemo(() => {
//     return addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .reduce((sum, a) => sum + a.price, 0);
//   }, [addOns, selectedAddOns]);

//   const grandTotal = ((pkg?.price || 0) + addOnTotal) * quantity;

//   const handleAddToCart = () => {
//     if (!pkg) return;
//     addItem({
//       id: `${pkg.id}_${Date.now()}`,
//       productId: pkg.id,
//       packageId: pkg.id,
//       name: pkg.name,
//       image: pkg.image,
//       price: grandTotal,
//       quantity: quantity,
//       type: 'package',
//     });
//     show('Package added to cart 🎉');
//   };

//   const handleBookNow = () => {
//     handleAddToCart();
//     router.push('/checkout');
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.primary[600]} />
//         <Text style={{ marginTop: 10, color: COLORS.neutral[600] }}>Loading...</Text>
//       </View>
//     );
//   }

//   if (!pkg) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 16, color: COLORS.neutral[600] }}>Package not found</Text>
//         <TouchableOpacity 
//           onPress={() => router.back()} 
//           style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
//         >
//           <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const images = pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.image];

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
//         {/* Image Gallery */}
//         <View style={styles.imageWrap}>
//           <ScrollView
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
//             scrollEventThrottle={16}
//           >
//             {images.map((img, i) => {
//               const imageUri = typeof img === 'string' ? img : '';
//               return (
//                 <Image key={i} source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
//               );
//             })}
//           </ScrollView>
//           {images.length > 1 && (
//             <View style={styles.imageDots}>
//               {images.map((_, i) => {
//                 const isActive = i === activeImage;
//                 return (
//                   <View 
//                     key={i} 
//                     style={[
//                       styles.imageDot, 
//                       isActive && styles.imageDotActive
//                     ]} 
//                   />
//                 );
//               })}
//             </View>
//           )}
//           <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//             <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
//               <ArrowLeft color={COLORS.neutral[800]} size={22} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.floatBtn}>
//               <Star size={20} color={COLORS.neutral[800]} />
//             </TouchableOpacity>
//           </View>
//           <LinearGradient
//             colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.5)']}
//             style={styles.imageGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 0, y: 1 }}
//           />
//         </View>

//         <View style={styles.content}>
//           {/* Tier Badge */}
//           <View style={[styles.tierBadge, { 
//             backgroundColor: pkg.tier === 'Luxury' || pkg.tier === 'Platinum' 
//               ? '#1A1A1A' 
//               : pkg.tier === 'Premium' || pkg.tier === 'Gold' 
//                 ? '#D4A82E' 
//                 : COLORS.primary[500] 
//           }]}>
//             <Crown size={12} color={pkg.tier === 'Luxury' || pkg.tier === 'Platinum' ? '#D4A82E' : '#FFFFFF'} />
//             <Text style={[styles.tierText, (pkg.tier === 'Luxury' || pkg.tier === 'Platinum') && { color: '#D4A82E' }]}>
//               {String(pkg.tier).toUpperCase()}
//             </Text>
//           </View>
          
//           <Text style={styles.name}>{String(pkg.name)}</Text>
          
//           <View style={styles.metaRow}>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               {[1, 2, 3, 4, 5].map((star) => {
//                 const isFilled = star <= Math.round(pkg.rating || 0);
//                 return (
//                   <View key={star} style={{ marginRight: 2 }}>
//                     <Star 
//                       size={14} 
//                       color={isFilled ? '#D4A82E' : '#CCCCCC'} 
//                       fill={isFilled ? '#D4A82E' : 'transparent'} 
//                     />
//                   </View>
//                 );
//               })}
//               <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#333333', marginLeft: 4 }}>
//                 {String((pkg.rating || 0).toFixed(1))}
//               </Text>
//             </View>
//             <View style={styles.dotSeparator} />
//             <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
//             <View style={styles.dotSeparator} />
//             <View style={styles.guestBadge}>
//               <Users color={COLORS.primary[600]} size={14} />
//               <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
//             </View>
//           </View>

//           <Text style={styles.description}>{String(pkg.description || '')}</Text>

//           {/* Price */}
//           <View style={styles.priceSection}>
//             <View style={styles.priceRow}>
//               <View>
//                 <Text style={styles.priceLabel}>Price</Text>
//                 <Text style={styles.price}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//               </View>
//               {(pkg.originalPrice || 0) > (pkg.price || 0) && (
//                 <View style={styles.discountContainer}>
//                   <Text style={styles.originalPrice}>₹{String((pkg.originalPrice || 0).toLocaleString('en-IN'))}</Text>
//                   <View style={styles.discountBadge}>
//                     <Text style={styles.discountText}>SAVE {String(pkg.discount || 0)}%</Text>
//                   </View>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* What's Included */}
//           {(pkg.includes && pkg.includes.length > 0) && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>✨ What's Included</Text>
//               <View style={styles.includesGrid}>
//                 {pkg.includes.map((inc, i) => {
//                   const includeText = typeof inc === 'string' ? inc : String(inc);
//                   return (
//                     <View key={i} style={styles.includeItem}>
//                       <View style={styles.includeCheck}>
//                         <Check color="#22C55E" size={14} />
//                       </View>
//                       <Text style={styles.includeText}>{includeText}</Text>
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Add-ons Section - Fixed Layout */}
//           {addOns.length > 0 && (
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>🎯 Customize Your Package</Text>
//                 <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
//               </View>
//               <View style={styles.addOnsList}>
//                 {addOns.map((addon) => {
//                   const selected = selectedAddOns.includes(addon.id);
//                   const IconComponent = iconMap[addon.icon] || Sparkles;
//                   const priceText = `+₹${String((addon.price || 0).toLocaleString('en-IN'))}`;
                  
//                   return (
//                     <TouchableOpacity
//                       key={addon.id}
//                       style={[styles.addOnCard, selected && styles.addOnCardActive]}
//                       onPress={() => toggleAddOn(addon.id)}
//                       activeOpacity={0.8}
//                     >
//                       <View style={[styles.addOnIcon, selected && styles.addOnIconActive]}>
//                         <IconComponent 
//                           size={18} 
//                           color={selected ? '#FFFFFF' : COLORS.primary[600]} 
//                         />
//                       </View>
//                       <View style={styles.addOnBody}>
//                         <View style={styles.addOnInfo}>
//                           <Text style={[styles.addOnName, selected && styles.addOnNameActive]} numberOfLines={1}>
//                             {String(addon.name)}
//                           </Text>
//                           {addon.description && (
//                             <Text style={styles.addOnDescription} numberOfLines={1}>
//                               {String(addon.description)}
//                             </Text>
//                           )}
//                         </View>
//                         <View style={styles.addOnRight}>
//                           <View style={[styles.addOnPriceContainer, selected && styles.addOnPriceContainerActive]}>
//                             <Text style={[styles.addOnPrice, selected && styles.addOnPriceActive]} numberOfLines={1}>
//                               {priceText}
//                             </Text>
//                           </View>
//                           <View style={[styles.addOnCheck, selected && styles.addOnCheckActive]}>
//                             {selected ? (
//                               <Check color="#FFFFFF" size={12} />
//                             ) : (
//                               <Plus color="#999999" size={12} />
//                             )}
//                           </View>
//                         </View>
//                       </View>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Quantity Selector */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>📦 Quantity</Text>
//             <View style={styles.quantityContainer}>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Minus color={COLORS.neutral[600]} size={20} />
//               </TouchableOpacity>
//               <Text style={styles.quantityText}>{quantity}</Text>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(quantity + 1)}
//               >
//                 <Plus color={COLORS.neutral[600]} size={20} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Price Summary */}
//           <View style={styles.priceSummary}>
//             <View style={styles.summaryHeader}>
//               <Text style={styles.summaryTitle}>Order Summary</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Package Price</Text>
//               <Text style={styles.summaryValue}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             </View>
//             {addOnTotal > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Add-ons ({String(selectedAddOns.length)})</Text>
//                 <Text style={styles.summaryValue}>+₹{String(addOnTotal.toLocaleString('en-IN'))}</Text>
//               </View>
//             )}
//             {quantity > 1 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Quantity</Text>
//                 <Text style={styles.summaryValue}>× {quantity}</Text>
//               </View>
//             )}
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryTotal}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
//         <View style={styles.bottomPrice}>
//           <Text style={styles.bottomPriceLabel}>Total</Text>
//           <Text style={styles.bottomPriceValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//         </View>
//         <TouchableOpacity 
//           onPress={handleAddToCart} 
//           style={[styles.actionBtn, styles.outlineBtn]}
//           activeOpacity={0.8}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[600]} />
//           <Text style={styles.outlineBtnText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           onPress={handleBookNow} 
//           style={[styles.actionBtn, styles.goldBtn]}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.goldBtnText}>Book Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#F5F5F5' 
//   },
//   imageWrap: { 
//     position: 'relative', 
//     width: '100%', 
//     height: 300 
//   },
//   image: { 
//     width: width, 
//     height: 300, 
//     resizeMode: 'cover' 
//   },
//   imageGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   imageDots: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   imageDot: { 
//     width: 8, 
//     height: 8, 
//     borderRadius: 4, 
//     backgroundColor: 'rgba(255,255,255,0.4)',
//   },
//   imageDotActive: { 
//     width: 24, 
//     backgroundColor: '#FFFFFF' 
//   },
//   floatingHeader: { 
//     position: 'absolute', 
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   floatBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   content: {
//     backgroundColor: '#FFFFFF',
//     marginTop: -20,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     padding: 20,
//   },
//   tierBadge: { 
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     alignSelf: 'flex-start', 
//     paddingHorizontal: 14, 
//     paddingVertical: 6, 
//     borderRadius: 20, 
//     marginBottom: 10,
//     ...SHADOWS.small,
//   },
//   tierText: { 
//     fontSize: 11, 
//     fontWeight: 'bold', 
//     color: '#FFFFFF',
//     letterSpacing: 0.5,
//   },
//   name: { 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A', 
//     lineHeight: 30,
//     marginBottom: 6,
//   },
//   metaRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flexWrap: 'wrap',
//     marginBottom: 12,
//   },
//   dotSeparator: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#CCCCCC',
//     marginHorizontal: 8,
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     color: '#666666' 
//   },
//   guestBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: '#F0F4FF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   guestText: { 
//     fontSize: 12, 
//     fontWeight: '600', 
//     color: COLORS.primary[700] 
//   },
//   description: { 
//     fontSize: 14, 
//     color: '#666666', 
//     marginTop: 8, 
//     lineHeight: 22 
//   },
//   priceSection: {
//     backgroundColor: '#F8F9FA',
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 16,
//     ...SHADOWS.small,
//   },
//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   priceLabel: {
//     fontSize: 12,
//     color: '#888888',
//     marginBottom: 2,
//   },
//   price: { 
//     fontSize: 28, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A' 
//   },
//   discountContainer: {
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   originalPrice: { 
//     fontSize: 14, 
//     color: '#999999', 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: '#FEE2E2', 
//     paddingHorizontal: 10, 
//     paddingVertical: 4, 
//     borderRadius: 6,
//   },
//   discountText: { 
//     fontSize: 11, 
//     fontWeight: 'bold', 
//     color: '#EF4444' 
//   },
//   section: { 
//     marginTop: 20,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   sectionHeader: {
//     marginBottom: 12,
//   },
//   sectionTitle: { 
//     fontSize: 17, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A',
//     marginBottom: 2,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: '#888888',
//   },
//   includesGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: 8,
//     marginTop: 4,
//   },
//   includeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     width: '48%',
//     backgroundColor: '#F8F9FA',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   includeCheck: { 
//     width: 20, 
//     height: 20, 
//     borderRadius: 10, 
//     backgroundColor: '#DCFCE7', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   includeText: { 
//     fontSize: 12, 
//     fontWeight: '500', 
//     color: '#333333', 
//     flex: 1 
//   },
//   addOnsList: {
//     gap: 10,
//   },
//   addOnCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 2,
//     borderColor: '#EEEEEE',
//     minHeight: 60,
//     width: '100%',
//   },
//   addOnCardActive: {
//     borderColor: COLORS.primary[500],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8EDF5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnIconActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   addOnBody: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginLeft: 12,
//     minWidth: 0,
//     flexWrap: 'nowrap',
//   },
//   addOnInfo: {
//     flex: 1,
//     marginRight: 8,
//     minWidth: 0,
//     maxWidth: '55%',
//   },
//   addOnName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1A1A1A',
//   },
//   addOnNameActive: {
//     color: COLORS.primary[600],
//   },
//   addOnDescription: {
//     fontSize: 12,
//     color: '#888888',
//     marginTop: 2,
//   },
//   addOnRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     flexShrink: 0,
//     marginLeft: 'auto',
//   },
//   addOnPriceContainer: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#E5E5E5',
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   addOnPriceContainerActive: {
//     borderColor: COLORS.primary[300],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnPrice: {
//     fontSize: 13,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//   },
//   addOnPriceActive: {
//     color: COLORS.primary[600],
//   },
//   addOnCheck: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#EEEEEE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnCheckActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     marginTop: 8,
//   },
//   quantityBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1A1A1A',
//     minWidth: 30,
//     textAlign: 'center',
//   },
//   priceSummary: { 
//     marginTop: 20,
//     marginBottom: 8,
//     backgroundColor: '#F8F9FA',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   summaryHeader: {
//     marginBottom: 12,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1A1A1A',
//   },
//   summaryRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: 6,
//   },
//   summaryLabel: { 
//     fontSize: 14, 
//     color: '#666666' 
//   },
//   summaryValue: { 
//     fontSize: 14, 
//     fontWeight: '500', 
//     color: '#1A1A1A' 
//   },
//   summaryDivider: { 
//     height: 1, 
//     backgroundColor: '#E5E5E5', 
//     marginVertical: 8 
//   },
//   summaryTotal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 4,
//   },
//   totalLabel: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#1A1A1A' 
//   },
//   totalValue: { 
//     fontSize: 20, 
//     fontWeight: 'bold', 
//     color: COLORS.primary[700] 
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E5E5',
//     ...SHADOWS.large,
//     gap: 8,
//   },
//   bottomPrice: {
//     flexDirection: 'column',
//     marginRight: 8,
//   },
//   bottomPriceLabel: {
//     fontSize: 11,
//     color: '#888888',
//   },
//   bottomPriceValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 6,
//   },
//   outlineBtn: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: COLORS.primary[500],
//   },
//   outlineBtnText: {
//     color: COLORS.primary[600],
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   goldBtn: {
//     backgroundColor: '#D4A82E',
//     ...SHADOWS.small,
//   },
//   goldBtnText: {
//     color: '#1A1A1A',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
// });

// app/package/[id].tsx
// // app/package/[id].tsx
// import { useState, useEffect, useMemo } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, FlatList } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Check, Users, ShoppingBag, Star, Plus, Minus, Crown, Sparkles, Music, Camera, Flower2, Mic, Palette, Utensils, PartyPopper, Heart } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Package, AddOn } from '@/types';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useWishlist } from '@/store/wishlist';

// const { width } = Dimensions.get('window');

// const iconMap: Record<string, any> = {
//   '📸': Camera,
//   '🎵': Music,
//   '🌸': Flower2,
//   '💡': Sparkles,
//   '✈️': Camera,
//   '🎸': Mic,
//   '🍽️': Utensils,
//   '📷': Camera,
//   '🎨': Palette,
//   '🎪': PartyPopper,
//   '👑': Crown,
// };

// export default function PackageDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const { state, toggle, has } = useWishlist();
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [addOns, setAddOns] = useState<AddOn[]>([]);
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [pkgData, addonsData] = await Promise.all([
//           mockApi.getPackage(id),
//           mockApi.getAddOns()
//         ]);
//         setPkg(pkgData || null);
//         setAddOns(addonsData || []);
//       } catch (error) {
//         console.error('Error loading package:', error);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const toggleAddOn = (addOnId: string) => {
//     setSelectedAddOns((prev) => 
//       prev.includes(addOnId) 
//         ? prev.filter(a => a !== addOnId) 
//         : [...prev, addOnId]
//     );
//   };

//   const addOnTotal = useMemo(() => {
//     return addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .reduce((sum, a) => sum + a.price, 0);
//   }, [addOns, selectedAddOns]);

//   const grandTotal = ((pkg?.price || 0) + addOnTotal) * quantity;

//   const handleAddToCart = () => {
//     if (!pkg) return;
//     addItem({
//       id: `${pkg.id}_${Date.now()}`,
//       productId: pkg.id,
//       packageId: pkg.id,
//       name: pkg.name,
//       image: pkg.image,
//       price: grandTotal,
//       quantity: quantity,
//       type: 'package',
//     });
//     show('Package added to cart 🎉');
//   };

//   const handleBookNow = () => {
//     handleAddToCart();
//     router.push('/checkout');
//   };

//   const handleWishlistToggle = () => {
//     if (!pkg) return;
//     const isWishlisted = has(pkg.id);
//     toggle(pkg.id);
//     show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
//   };

//   const handleGoBack = () => {
//     if (router.canGoBack()) {
//       router.back();
//     } else {
//       router.push('/(tabs)');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.gold[400]} />
//         <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>Loading package...</Text>
//       </View>
//     );
//   }

//   if (!pkg) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 16, color: COLORS.neutral[600], fontFamily: 'Inter-Regular' }}>Package not found</Text>
//         <TouchableOpacity 
//           onPress={handleGoBack} 
//           style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: RADIUS.lg }}
//         >
//           <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-SemiBold', fontSize: 14 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const images = pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.image];
//   const isWishlisted = has(pkg.id);

//   const getTierColors = () => {
//     switch(pkg.tier) {
//       case 'Platinum':
//         return { bg: ['#1a1a2e', '#16213e'] as const, text: '#FFD700', badge: '#FFD700' };
//       case 'Gold':
//         return { bg: ['#4a3728', '#2d1f14'] as const, text: '#D4A82E', badge: '#D4A82E' };
//       case 'Premium':
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#4FC3F7', badge: '#4FC3F7' };
//       case 'Luxury':
//         return { bg: ['#2d1b3d', '#1a0f2e'] as const, text: '#CE93D8', badge: '#CE93D8' };
//       default:
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#64B5F6', badge: '#64B5F6' };
//     }
//   };

//   const tierColors = getTierColors();

//   const renderStars = () => {
//     const stars = [];
//     const rating = pkg.rating || 0;
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[200]} />
//           </View>
//         );
//       }
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         contentContainerStyle={{ paddingBottom: 120 }}
//         bounces={true}
//       >
//         {/* Image Gallery */}
//         <View style={styles.imageWrap}>
//           <FlatList
//             data={images}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
//             scrollEventThrottle={16}
//             keyExtractor={(_, i) => i.toString()}
//             renderItem={({ item }) => (
//               <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
//             )}
//           />
//           <LinearGradient
//             colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
//             style={styles.imageGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 0, y: 1 }}
//           />
//           {images.length > 1 && (
//             <View style={styles.imageDots}>
//               {images.map((_, i) => (
//                 <View 
//                   key={i} 
//                   style={[
//                     styles.imageDot, 
//                     i === activeImage && styles.imageDotActive
//                   ]} 
//                 />
//               ))}
//             </View>
//           )}
//           <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//             <TouchableOpacity 
//               style={styles.floatBtn} 
//               onPress={handleGoBack}
//               activeOpacity={0.7}
//             >
//               <ArrowLeft color={COLORS.neutral[800]} size={22} />
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.floatBtn} 
//               onPress={handleWishlistToggle}
//               activeOpacity={0.7}
//             >
//               <Heart 
//                 color={isWishlisted ? COLORS.error : COLORS.neutral[800]} 
//                 size={22} 
//                 fill={isWishlisted ? COLORS.error : 'transparent'}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Content */}
//         <View style={styles.content}>
//           {/* Tier Badge */}
//           <View style={[styles.tierBadgeContainer]}>
//             <LinearGradient
//               colors={tierColors.bg}
//               style={styles.tierBadge}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Crown size={14} color={tierColors.badge} />
//               <Text style={[styles.tierText, { color: tierColors.text }]}>
//                 {String(pkg.tier).toUpperCase()}
//               </Text>
//             </LinearGradient>
//           </View>
          
//           <Text style={styles.name}>{String(pkg.name)}</Text>
          
//           <View style={styles.metaRow}>
//             <View style={styles.ratingContainer}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
//                 {renderStars()}
//               </View>
//               <Text style={styles.ratingText}>
//                 {String((pkg.rating || 0).toFixed(1))}
//               </Text>
//             </View>
//             <View style={styles.dotSeparator} />
//             <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
//             <View style={styles.dotSeparator} />
//             <View style={styles.guestBadge}>
//               <Users color={COLORS.primary[500]} size={14} />
//               <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
//             </View>
//           </View>

//           <Text style={styles.description}>{String(pkg.description || '')}</Text>

//           {/* Price */}
//           <View style={styles.priceSection}>
//             <View style={styles.priceRow}>
//               <View>
//                 <Text style={styles.priceLabel}>Price</Text>
//                 <Text style={styles.price}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//               </View>
//               {(pkg.originalPrice || 0) > (pkg.price || 0) && (
//                 <View style={styles.discountContainer}>
//                   <Text style={styles.originalPrice}>₹{String((pkg.originalPrice || 0).toLocaleString('en-IN'))}</Text>
//                   <View style={styles.discountBadge}>
//                     <Text style={styles.discountText}>SAVE {String(pkg.discount || 0)}%</Text>
//                   </View>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* What's Included */}
//           {(pkg.includes && pkg.includes.length > 0) && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>✨ What's Included</Text>
//               <View style={styles.includesGrid}>
//                 {pkg.includes.map((inc, i) => {
//                   const includeText = typeof inc === 'string' ? inc : String(inc);
//                   return (
//                     <View key={i} style={styles.includeItem}>
//                       <View style={styles.includeCheck}>
//                         <Check color="#22C55E" size={14} />
//                       </View>
//                       <Text style={styles.includeText}>{includeText}</Text>
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Add-ons Section - With Price Badge Inside Card */}
//           {addOns.length > 0 && (
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>🎯 Customize Your Package</Text>
//                 <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
//               </View>
//               <View style={styles.addOnsList}>
//                 {addOns.map((addon) => {
//                   const selected = selectedAddOns.includes(addon.id);
//                   const IconComponent = iconMap[addon.icon] || Sparkles;
//                   const priceText = `+₹${String((addon.price || 0).toLocaleString('en-IN'))}`;
                  
//                   return (
//                     <TouchableOpacity
//                       key={addon.id}
//                       style={[styles.addOnCard, selected && styles.addOnCardActive]}
//                       onPress={() => toggleAddOn(addon.id)}
//                       activeOpacity={0.8}
//                     >
//                       <View style={[styles.addOnIcon, selected && styles.addOnIconActive]}>
//                         <IconComponent 
//                           size={18} 
//                           color={selected ? '#FFFFFF' : COLORS.primary[600]} 
//                         />
//                       </View>
//                       <View style={styles.addOnBody}>
//                         <View style={styles.addOnInfo}>
//                           <Text style={[styles.addOnName, selected && styles.addOnNameActive]} numberOfLines={1}>
//                             {String(addon.name)}
//                           </Text>
//                           {addon.description && (
//                             <Text style={styles.addOnDescription} numberOfLines={1}>
//                               {String(addon.description)}
//                             </Text>
//                           )}
//                         </View>
//                         <View style={styles.addOnRight}>
//                           <View style={[styles.addOnPriceContainer, selected && styles.addOnPriceContainerActive]}>
//                             <Text style={[styles.addOnPrice, selected && styles.addOnPriceActive]} numberOfLines={1}>
//                               {priceText}
//                             </Text>
//                           </View>
//                           <View style={[styles.addOnCheck, selected && styles.addOnCheckActive]}>
//                             {selected ? (
//                               <Check color="#FFFFFF" size={12} />
//                             ) : (
//                               <Plus color="#999999" size={12} />
//                             )}
//                           </View>
//                         </View>
//                       </View>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Quantity Selector */}
//           {/* <View style={styles.section}>
//             <Text style={styles.sectionTitle}>📦 Quantity</Text>
//             <View style={styles.quantityContainer}>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Minus color={COLORS.neutral[600]} size={20} />
//               </TouchableOpacity>
//               <Text style={styles.quantityText}>{quantity}</Text>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(quantity + 1)}
//               >
//                 <Plus color={COLORS.neutral[600]} size={20} />
//               </TouchableOpacity>
//             </View>
//           </View> */}

//           {/* Price Summary */}
//           <View style={styles.priceSummary}>
//             <View style={styles.summaryHeader}>
//               <Text style={styles.summaryTitle}>Order Summary</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Package Price</Text>
//               <Text style={styles.summaryValue}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             </View>
//             {addOnTotal > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Add-ons ({String(selectedAddOns.length)})</Text>
//                 <Text style={styles.summaryValue}>+₹{String(addOnTotal.toLocaleString('en-IN'))}</Text>
//               </View>
//             )}
//             {quantity > 1 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Quantity</Text>
//                 <Text style={styles.summaryValue}>× {quantity}</Text>
//               </View>
//             )}
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryTotal}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
//         <View style={styles.bottomPrice}>
//           <Text style={styles.bottomPriceLabel}>Total</Text>
//           <Text style={styles.bottomPriceValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//         </View>
//         <TouchableOpacity 
//           onPress={handleAddToCart} 
//           style={[styles.actionBtn, styles.outlineBtn]}
//           activeOpacity={0.8}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[600]} />
//           <Text style={styles.outlineBtnText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           onPress={handleBookNow} 
//           style={[styles.actionBtn, styles.goldBtn]}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.goldBtnText}>Book Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#F8F9FA' 
//   },
//   imageWrap: { 
//     position: 'relative', 
//     width: '100%', 
//     height: 320 
//   },
//   image: { 
//     width: width, 
//     height: 320, 
//     resizeMode: 'cover' 
//   },
//   imageGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   imageDots: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   imageDot: { 
//     width: 8, 
//     height: 8, 
//     borderRadius: 4, 
//     backgroundColor: 'rgba(255,255,255,0.4)',
//   },
//   imageDotActive: { 
//     width: 24, 
//     backgroundColor: '#FFFFFF' 
//   },
//   floatingHeader: { 
//     position: 'absolute', 
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   floatBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   content: {
//     backgroundColor: '#F8F9FA',
//     marginTop: -20,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   tierBadgeContainer: {
//     marginBottom: 8,
//   },
//   tierBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     alignSelf: 'flex-start',
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     ...SHADOWS.small,
//   },
//   tierText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold',
//     letterSpacing: 0.5,
//   },
//   name: { 
//     fontSize: 24, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A', 
//     lineHeight: 30,
//     marginBottom: 8,
//   },
//   metaRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flexWrap: 'wrap',
//     marginBottom: 12,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ratingText: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//     marginLeft: 4,
//   },
//   dotSeparator: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#CCCCCC',
//     marginHorizontal: 8,
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   guestBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: '#F0F4FF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   guestText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium',
//     color: COLORS.primary[600] 
//   },
//   description: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#555555', 
//     lineHeight: 22,
//     marginBottom: 16,
//   },
//   priceSection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//     marginBottom: 8,
//   },
//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   priceLabel: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginBottom: 2,
//   },
//   price: { 
//     fontSize: 28, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   discountContainer: {
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   originalPrice: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#999999', 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: '#FEE2E2', 
//     paddingHorizontal: 10, 
//     paddingVertical: 4, 
//     borderRadius: 6,
//   },
//   discountText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold', 
//     color: '#EF4444' 
//   },
//   section: { 
//     marginTop: 20,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   sectionHeader: {
//     marginBottom: 12,
//   },
//   sectionTitle: { 
//     fontSize: 17, 
//     fontFamily: 'Inter-SemiBold', 
//     color: '#1A1A1A',
//     marginBottom: 2,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   includesGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: 8,
//     marginTop: 4,
//   },
//   includeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     width: '48%',
//     backgroundColor: '#F8F9FA',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   includeCheck: { 
//     width: 20, 
//     height: 20, 
//     borderRadius: 10, 
//     backgroundColor: '#DCFCE7', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   includeText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: '#333333', 
//     flex: 1 
//   },
//   addOnsList: {
//     gap: 10,
//   },
//   addOnCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 2,
//     borderColor: '#EEEEEE',
//     minHeight: 60,
//     width: '100%',
//   },
//   addOnCardActive: {
//     borderColor: COLORS.primary[500],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8EDF5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnIconActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   addOnBody: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginLeft: 12,
//     minWidth: 0,
//     flexWrap: 'nowrap',
//   },
//   addOnInfo: {
//     flex: 1,
//     marginRight: 8,
//     minWidth: 0,
//     maxWidth: '55%',
//   },
//   addOnName: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   addOnNameActive: {
//     color: COLORS.primary[600],
//   },
//   addOnDescription: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginTop: 2,
//   },
//   addOnRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     flexShrink: 0,
//     marginLeft: 'auto',
//   },
//   addOnPriceContainer: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#E5E5E5',
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   addOnPriceContainerActive: {
//     borderColor: COLORS.primary[300],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnPrice: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   addOnPriceActive: {
//     color: COLORS.primary[600],
//   },
//   addOnCheck: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#EEEEEE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnCheckActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     marginTop: 8,
//   },
//   quantityBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityText: {
//     fontSize: 18,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//     minWidth: 30,
//     textAlign: 'center',
//   },
//   priceSummary: { 
//     marginTop: 20,
//     marginBottom: 8,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   summaryHeader: {
//     marginBottom: 12,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   summaryRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: 6,
//   },
//   summaryLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   summaryValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Medium',
//     color: '#1A1A1A' 
//   },
//   summaryDivider: { 
//     height: 1, 
//     backgroundColor: '#EEEEEE', 
//     marginVertical: 8 
//   },
//   summaryTotal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 4,
//   },
//   totalLabel: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   totalValue: { 
//     fontSize: 20, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.primary[600] 
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#EEEEEE',
//     ...SHADOWS.large,
//     gap: 8,
//   },
//   bottomPrice: {
//     flexDirection: 'column',
//     marginRight: 8,
//   },
//   bottomPriceLabel: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   bottomPriceValue: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 6,
//   },
//   outlineBtn: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: COLORS.primary[500],
//   },
//   outlineBtnText: {
//     color: COLORS.primary[600],
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 14,
//   },
//   goldBtn: {
//     backgroundColor: COLORS.gold[400],
//     ...SHADOWS.small,
//   },
//   goldBtnText: {
//     color: '#1A1A1A',
//     fontFamily: 'Inter-Bold',
//     fontSize: 14,
//   },
// });




// app/package/[id].tsx
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, FlatList } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Check, Users, ShoppingBag, Star, Plus, Minus, Crown, Sparkles, Music, Camera, Flower2, Mic, Palette, Utensils, PartyPopper, Heart, ChevronRight } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Package, AddOn } from '@/types';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useWishlist } from '@/store/wishlist';

// const { width } = Dimensions.get('window');

// const iconMap: Record<string, any> = {
//   '📸': Camera,
//   '🎵': Music,
//   '🌸': Flower2,
//   '💡': Sparkles,
//   '✈️': Camera,
//   '🎸': Mic,
//   '🍽️': Utensils,
//   '📷': Camera,
//   '🎨': Palette,
//   '🎪': PartyPopper,
//   '👑': Crown,
//   '📦': ShoppingBag,
// };

// export default function PackageDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const { state, toggle, has } = useWishlist();
  
//   // ─── All Hooks must be called BEFORE any conditional returns ──────────────
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [addOns, setAddOns] = useState<AddOn[]>([]);
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [showAllAddons, setShowAllAddons] = useState(false);

//   // ─── Load Package and its specific Add-ons ──────────────────────────────────
//   const loadData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [pkgData, packageAddons] = await Promise.all([
//         mockApi.getPackage(id),
//         mockApi.getPackageAddons(id),
//       ]);
      
//       setPkg(pkgData || null);
      
//       if (packageAddons && packageAddons.length > 0) {
//         console.log(`📦 Found ${packageAddons.length} add-ons for package ${id}`);
//         setAddOns(packageAddons);
        
//         const defaultAddonIds = packageAddons
//           .filter((a: any) => a.is_default === 1 || a.is_default === true)
//           .map((a: any) => a.id.toString());
//         setSelectedAddOns(defaultAddonIds);
//         console.log(`✅ Auto-selected ${defaultAddonIds.length} default add-ons`);
//       } else {
//         console.log(`📦 No specific add-ons for package ${id}, fetching all add-ons`);
//         const allAddons = await mockApi.getAddOns();
//         setAddOns(allAddons || []);
//       }
//     } catch (error) {
//       console.error('Error loading package:', error);
//       show('Failed to load package details', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   // ─── Toggle Add-on ─────────────────────────────────────────────────────────
//   const toggleAddOn = useCallback((addOnId: string) => {
//     setSelectedAddOns((prev) => 
//       prev.includes(addOnId) 
//         ? prev.filter(a => a !== addOnId) 
//         : [...prev, addOnId]
//     );
//   }, []);

//   // ─── Calculate Totals ─────────────────────────────────────────────────────
//   const addOnTotal = useMemo(() => {
//     return addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .reduce((sum, a) => sum + (a.price || 0), 0);
//   }, [addOns, selectedAddOns]);

//   const grandTotal = ((pkg?.price || 0) + addOnTotal) * quantity;

//   // ─── Group Add-ons by Category ──────────────────────────────────────────
//   const groupedAddons = useMemo(() => {
//     const groups: Record<string, AddOn[]> = {};
//     addOns.forEach(addon => {
//       const category = addon.category || 'General';
//       if (!groups[category]) groups[category] = [];
//       groups[category].push(addon);
//     });
//     return groups;
//   }, [addOns]);

//   const categories = Object.keys(groupedAddons);
//   const visibleCategories = showAllAddons ? categories : categories.slice(0, 2);

//   // ─── Add to Cart ──────────────────────────────────────────────────────────
//   const handleAddToCart = useCallback(() => {
//     if (!pkg) return;
    
//     const selectedAddonDetails = addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .map(a => ({
//         id: a.id,
//         name: a.name,
//         price: a.price,
//         icon: a.icon,
//       }));

//     addItem({
//       id: `${pkg.id}_${Date.now()}`,
//       productId: pkg.id,
//       packageId: pkg.id,
//       name: pkg.name,
//       image: pkg.images?.[0] || pkg.image,
//       price: grandTotal,
//       quantity: quantity,
//       type: 'package',
//       addons: selectedAddonDetails,
//     });
//     show('Package added to cart 🎉');
//   }, [pkg, addOns, selectedAddOns, grandTotal, quantity, addItem, show]);

//   const handleBookNow = useCallback(() => {
//     handleAddToCart();
//     router.push('/checkout');
//   }, [handleAddToCart, router]);

//   const handleWishlistToggle = useCallback(() => {
//     if (!pkg) return;
//     const isWishlisted = has(pkg.id);
//     toggle(pkg.id);
//     show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
//   }, [pkg, has, toggle, show]);

//   const handleGoBack = useCallback(() => {
//     if (router.canGoBack()) {
//       router.back();
//     } else {
//       router.push('/(tabs)');
//     }
//   }, [router]);

//   // ─── Loading State ───────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.gold[400]} />
//         <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>Loading package...</Text>
//       </View>
//     );
//   }

//   if (!pkg) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 16, color: COLORS.neutral[600], fontFamily: 'Inter-Regular' }}>Package not found</Text>
//         <TouchableOpacity 
//           onPress={handleGoBack} 
//           style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: RADIUS.lg }}
//         >
//           <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-SemiBold', fontSize: 14 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const images = pkg.images && pkg.images.length > 0 ? pkg.images : [pkg.image];
//   const isWishlisted = has(pkg.id);

//   // ─── Tier Colors ─────────────────────────────────────────────────────────
//   const getTierColors = () => {
//     switch(pkg.tier) {
//       case 'Platinum':
//         return { bg: ['#1a1a2e', '#16213e'] as const, text: '#FFD700', badge: '#FFD700' };
//       case 'Gold':
//         return { bg: ['#4a3728', '#2d1f14'] as const, text: '#D4A82E', badge: '#D4A82E' };
//       case 'Premium':
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#4FC3F7', badge: '#4FC3F7' };
//       case 'Luxury':
//         return { bg: ['#2d1b3d', '#1a0f2e'] as const, text: '#CE93D8', badge: '#CE93D8' };
//       default:
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#64B5F6', badge: '#64B5F6' };
//     }
//   };

//   const tierColors = getTierColors();

//   // ─── Render Stars ────────────────────────────────────────────────────────
//   const renderStars = () => {
//     const stars = [];
//     const rating = pkg.rating || 0;
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[200]} />
//           </View>
//         );
//       }
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         contentContainerStyle={{ paddingBottom: 120 }}
//         bounces={true}
//       >
//         {/* ─── Image Gallery ────────────────────────────────────────────────── */}
//         <View style={styles.imageWrap}>
//           <FlatList
//             data={images}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
//             scrollEventThrottle={16}
//             keyExtractor={(_, i) => i.toString()}
//             renderItem={({ item }) => (
//               <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
//             )}
//           />
//           <LinearGradient
//             colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
//             style={styles.imageGradient}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 0, y: 1 }}
//           />
//           {images.length > 1 && (
//             <View style={styles.imageDots}>
//               {images.map((_, i) => (
//                 <View 
//                   key={i} 
//                   style={[
//                     styles.imageDot, 
//                     i === activeImage && styles.imageDotActive
//                   ]} 
//                 />
//               ))}
//             </View>
//           )}
//           <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//             <TouchableOpacity 
//               style={styles.floatBtn} 
//               onPress={handleGoBack}
//               activeOpacity={0.7}
//             >
//               <ArrowLeft color={COLORS.neutral[800]} size={22} />
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.floatBtn} 
//               onPress={handleWishlistToggle}
//               activeOpacity={0.7}
//             >
//               <Heart 
//                 color={isWishlisted ? COLORS.error : COLORS.neutral[800]} 
//                 size={22} 
//                 fill={isWishlisted ? COLORS.error : 'transparent'}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ─── Content ────────────────────────────────────────────────────── */}
//         <View style={styles.content}>
//           {/* Tier Badge */}
//           <View style={styles.tierBadgeContainer}>
//             <LinearGradient
//               colors={tierColors.bg}
//               style={styles.tierBadge}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Crown size={14} color={tierColors.badge} />
//               <Text style={[styles.tierText, { color: tierColors.text }]}>
//                 {String(pkg.tier).toUpperCase()}
//               </Text>
//             </LinearGradient>
//           </View>
          
//           <Text style={styles.name}>{String(pkg.name)}</Text>
          
//           <View style={styles.metaRow}>
//             <View style={styles.ratingContainer}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
//                 {renderStars()}
//               </View>
//               <Text style={styles.ratingText}>
//                 {String((pkg.rating || 0).toFixed(1))}
//               </Text>
//             </View>
//             <View style={styles.dotSeparator} />
//             <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
//             <View style={styles.dotSeparator} />
//             <View style={styles.guestBadge}>
//               <Users color={COLORS.primary[500]} size={14} />
//               <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
//             </View>
//           </View>

//           <Text style={styles.description}>{String(pkg.description || '')}</Text>

//           {/* ─── Price ──────────────────────────────────────────────────────── */}
//           <View style={styles.priceSection}>
//             <View style={styles.priceRow}>
//               <View>
//                 <Text style={styles.priceLabel}>Price</Text>
//                 <Text style={styles.price}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//               </View>
//               {(pkg.originalPrice || 0) > (pkg.price || 0) && (
//                 <View style={styles.discountContainer}>
//                   <Text style={styles.originalPrice}>₹{String((pkg.originalPrice || 0).toLocaleString('en-IN'))}</Text>
//                   <View style={styles.discountBadge}>
//                     <Text style={styles.discountText}>SAVE {String(pkg.discount || 0)}%</Text>
//                   </View>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* ─── What's Included ───────────────────────────────────────────── */}
//           {(pkg.includes && pkg.includes.length > 0) && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>✨ What's Included</Text>
//               <View style={styles.includesGrid}>
//                 {pkg.includes.map((inc, i) => {
//                   const includeText = typeof inc === 'string' ? inc : String(inc);
//                   return (
//                     <View key={i} style={styles.includeItem}>
//                       <View style={styles.includeCheck}>
//                         <Check color="#22C55E" size={14} />
//                       </View>
//                       <Text style={styles.includeText}>{includeText}</Text>
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* ─── Customize Your Package - Add-ons ─────────────────────────── */}
//           {addOns.length > 0 && (
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>🎯 Customize Your Package</Text>
//                 <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
//               </View>

//               {visibleCategories.map((category) => (
//                 <View key={category} style={styles.categoryGroup}>
//                   <Text style={styles.categoryLabel}>{category}</Text>
//                   {groupedAddons[category].map((addon) => {
//                     const selected = selectedAddOns.includes(addon.id);
//                     const IconComponent = iconMap[addon.icon] || Sparkles;
//                     const priceText = `+₹${String((addon.price || 0).toLocaleString('en-IN'))}`;
                    
//                     return (
//                       <TouchableOpacity
//                         key={addon.id}
//                         style={[styles.addOnCard, selected && styles.addOnCardActive]}
//                         onPress={() => toggleAddOn(addon.id)}
//                         activeOpacity={0.8}
//                       >
//                         <View style={[styles.addOnIcon, selected && styles.addOnIconActive]}>
//                           <IconComponent 
//                             size={18} 
//                             color={selected ? '#FFFFFF' : COLORS.primary[600]} 
//                           />
//                         </View>
//                         <View style={styles.addOnBody}>
//                           <View style={styles.addOnInfo}>
//                             <Text style={[styles.addOnName, selected && styles.addOnNameActive]} numberOfLines={1}>
//                               {String(addon.name)}
//                             </Text>
//                             {addon.description && (
//                               <Text style={styles.addOnDescription} numberOfLines={1}>
//                                 {String(addon.description)}
//                               </Text>
//                             )}
//                           </View>
//                           <View style={styles.addOnRight}>
//                             <View style={[styles.addOnPriceContainer, selected && styles.addOnPriceContainerActive]}>
//                               <Text style={[styles.addOnPrice, selected && styles.addOnPriceActive]} numberOfLines={1}>
//                                 {priceText}
//                               </Text>
//                             </View>
//                             <View style={[styles.addOnCheck, selected && styles.addOnCheckActive]}>
//                               {selected ? (
//                                 <Check color="#FFFFFF" size={12} />
//                               ) : (
//                                 <Plus color="#999999" size={12} />
//                               )}
//                             </View>
//                           </View>
//                         </View>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               ))}

//               {categories.length > 2 && (
//                 <TouchableOpacity
//                   style={styles.showMoreBtn}
//                   onPress={() => setShowAllAddons(!showAllAddons)}
//                 >
//                   <Text style={styles.showMoreText}>
//                     {showAllAddons ? 'Show Less' : `Show More (${categories.length - 2} more)`}
//                   </Text>
//                   <ChevronRight 
//                     size={16} 
//                     color={COLORS.primary[600]} 
//                     style={showAllAddons ? styles.chevronRotated : undefined}
//                   />
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {/* ─── Quantity ───────────────────────────────────────────────────── */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>📦 Quantity</Text>
//             <View style={styles.quantityContainer}>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//                 activeOpacity={0.7}
//               >
//                 <Minus color={COLORS.neutral[600]} size={20} />
//               </TouchableOpacity>
//               <Text style={styles.quantityText}>{quantity}</Text>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(quantity + 1)}
//                 activeOpacity={0.7}
//               >
//                 <Plus color={COLORS.neutral[600]} size={20} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* ─── Price Summary ────────────────────────────────────────────── */}
//           <View style={styles.priceSummary}>
//             <View style={styles.summaryHeader}>
//               <Text style={styles.summaryTitle}>Order Summary</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Package Price</Text>
//               <Text style={styles.summaryValue}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             </View>
//             {addOnTotal > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Add-ons ({String(selectedAddOns.length)})</Text>
//                 <Text style={styles.summaryValue}>+₹{String(addOnTotal.toLocaleString('en-IN'))}</Text>
//               </View>
//             )}
//             {quantity > 1 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Quantity</Text>
//                 <Text style={styles.summaryValue}>× {quantity}</Text>
//               </View>
//             )}
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryTotal}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* ─── Bottom Actions ────────────────────────────────────────────────── */}
//       <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
//         <View style={styles.bottomPrice}>
//           <Text style={styles.bottomPriceLabel}>Total</Text>
//           <Text style={styles.bottomPriceValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//         </View>
//         <TouchableOpacity 
//           onPress={handleAddToCart} 
//           style={[styles.actionBtn, styles.outlineBtn]}
//           activeOpacity={0.8}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[600]} />
//           <Text style={styles.outlineBtnText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           onPress={handleBookNow} 
//           style={[styles.actionBtn, styles.goldBtn]}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.goldBtnText}>Book Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // ─── Styles ──────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#F8F9FA' 
//   },
//   imageWrap: { 
//     position: 'relative', 
//     width: '100%', 
//     height: 320 
//   },
//   image: { 
//     width: width, 
//     height: 320, 
//     resizeMode: 'cover' 
//   },
//   imageGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   imageDots: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   imageDot: { 
//     width: 8, 
//     height: 8, 
//     borderRadius: 4, 
//     backgroundColor: 'rgba(255,255,255,0.4)',
//   },
//   imageDotActive: { 
//     width: 24, 
//     backgroundColor: '#FFFFFF' 
//   },
//   floatingHeader: { 
//     position: 'absolute', 
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   floatBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   content: {
//     backgroundColor: '#F8F9FA',
//     marginTop: -20,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   tierBadgeContainer: {
//     marginBottom: 8,
//   },
//   tierBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     alignSelf: 'flex-start',
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     ...SHADOWS.small,
//   },
//   tierText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold',
//     letterSpacing: 0.5,
//   },
//   name: { 
//     fontSize: 24, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A', 
//     lineHeight: 30,
//     marginBottom: 8,
//   },
//   metaRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flexWrap: 'wrap',
//     marginBottom: 12,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ratingText: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//     marginLeft: 4,
//   },
//   dotSeparator: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#CCCCCC',
//     marginHorizontal: 8,
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   guestBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: '#F0F4FF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   guestText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium',
//     color: COLORS.primary[600] 
//   },
//   description: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#555555', 
//     lineHeight: 22,
//     marginBottom: 16,
//   },
//   priceSection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//     marginBottom: 8,
//   },
//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   priceLabel: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginBottom: 2,
//   },
//   price: { 
//     fontSize: 28, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   discountContainer: {
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   originalPrice: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#999999', 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: '#FEE2E2', 
//     paddingHorizontal: 10, 
//     paddingVertical: 4, 
//     borderRadius: 6,
//   },
//   discountText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold', 
//     color: '#EF4444' 
//   },
//   section: { 
//     marginTop: 20,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   sectionHeader: {
//     marginBottom: 12,
//   },
//   sectionTitle: { 
//     fontSize: 17, 
//     fontFamily: 'Inter-SemiBold', 
//     color: '#1A1A1A',
//     marginBottom: 2,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   categoryGroup: {
//     marginBottom: 12,
//   },
//   categoryLabel: {
//     fontSize: 13,
//     fontFamily: 'Inter-Medium',
//     color: '#666666',
//     marginBottom: 8,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   includesGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: 8,
//     marginTop: 4,
//   },
//   includeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     width: '48%',
//     backgroundColor: '#F8F9FA',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   includeCheck: { 
//     width: 20, 
//     height: 20, 
//     borderRadius: 10, 
//     backgroundColor: '#DCFCE7', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   includeText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: '#333333', 
//     flex: 1 
//   },
//   addOnCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 2,
//     borderColor: '#EEEEEE',
//     minHeight: 60,
//     width: '100%',
//   },
//   addOnCardActive: {
//     borderColor: COLORS.primary[500],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8EDF5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnIconActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   addOnBody: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginLeft: 12,
//     minWidth: 0,
//     flexWrap: 'nowrap',
//   },
//   addOnInfo: {
//     flex: 1,
//     marginRight: 8,
//     minWidth: 0,
//     maxWidth: '55%',
//   },
//   addOnName: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   addOnNameActive: {
//     color: COLORS.primary[600],
//   },
//   addOnDescription: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginTop: 2,
//   },
//   addOnRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     flexShrink: 0,
//     marginLeft: 'auto',
//   },
//   addOnPriceContainer: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#E5E5E5',
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   addOnPriceContainerActive: {
//     borderColor: COLORS.primary[300],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnPrice: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   addOnPriceActive: {
//     color: COLORS.primary[600],
//   },
//   addOnCheck: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#EEEEEE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnCheckActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   showMoreBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 4,
//     paddingVertical: 12,
//     marginTop: 4,
//   },
//   showMoreText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.primary[600],
//   },
//   chevronRotated: {
//     transform: [{ rotate: '90deg' }],
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     marginTop: 8,
//   },
//   quantityBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityText: {
//     fontSize: 18,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//     minWidth: 30,
//     textAlign: 'center',
//   },
//   priceSummary: { 
//     marginTop: 20,
//     marginBottom: 8,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   summaryHeader: {
//     marginBottom: 12,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   summaryRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: 6,
//   },
//   summaryLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   summaryValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Medium',
//     color: '#1A1A1A' 
//   },
//   summaryDivider: { 
//     height: 1, 
//     backgroundColor: '#EEEEEE', 
//     marginVertical: 8 
//   },
//   summaryTotal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 4,
//   },
//   totalLabel: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   totalValue: { 
//     fontSize: 20, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.primary[600] 
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#EEEEEE',
//     ...SHADOWS.large,
//     gap: 8,
//   },
//   bottomPrice: {
//     flexDirection: 'column',
//     marginRight: 8,
//   },
//   bottomPriceLabel: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   bottomPriceValue: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 6,
//   },
//   outlineBtn: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: COLORS.primary[500],
//   },
//   outlineBtnText: {
//     color: COLORS.primary[600],
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 14,
//   },
//   goldBtn: {
//     backgroundColor: COLORS.gold[400],
//     ...SHADOWS.small,
//   },
//   goldBtnText: {
//     color: '#1A1A1A',
//     fontFamily: 'Inter-Bold',
//     fontSize: 14,
//   },
// });


// // app/package/[id].tsx - Complete with working multiple image carousel
// import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, FlatList } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Check, Users, ShoppingBag, Star, Plus, Minus, Crown, Sparkles, Music, Camera, Flower2, Mic, Palette, Utensils, PartyPopper, Heart, ChevronRight } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Package, AddOn } from '@/types';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useWishlist } from '@/store/wishlist';

// const { width } = Dimensions.get('window');

// const iconMap: Record<string, any> = {
//   '📸': Camera,
//   '🎵': Music,
//   '🌸': Flower2,
//   '💡': Sparkles,
//   '✈️': Camera,
//   '🎸': Mic,
//   '🍽️': Utensils,
//   '📷': Camera,
//   '🎨': Palette,
//   '🎪': PartyPopper,
//   '👑': Crown,
//   '📦': ShoppingBag,
// };

// export default function PackageDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const { state, toggle, has } = useWishlist();
  
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [addOns, setAddOns] = useState<AddOn[]>([]);
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [showAllAddons, setShowAllAddons] = useState(false);
  
//   const flatListRef = useRef<FlatList>(null);

//   const loadData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [pkgData, packageAddons] = await Promise.all([
//         mockApi.getPackage(id),
//         mockApi.getPackageAddons(id),
//       ]);
      
//       setPkg(pkgData || null);
      
//       // Log the images data for debugging
//       console.log('📦 Package images:', pkgData?.images);
//       console.log('📦 Package image:', pkgData?.image);
      
//       if (packageAddons && packageAddons.length > 0) {
//         setAddOns(packageAddons);
//         const defaultAddonIds = packageAddons
//           .filter((a: any) => a.is_default === 1 || a.is_default === true)
//           .map((a: any) => a.id.toString());
//         setSelectedAddOns(defaultAddonIds);
//       } else {
//         const allAddons = await mockApi.getAddOns();
//         setAddOns(allAddons || []);
//       }
//     } catch (error) {
//       console.error('Error loading package:', error);
//       show('Failed to load package details', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const toggleAddOn = useCallback((addOnId: string) => {
//     setSelectedAddOns((prev) => 
//       prev.includes(addOnId) 
//         ? prev.filter(a => a !== addOnId) 
//         : [...prev, addOnId]
//     );
//   }, []);

//   const addOnTotal = useMemo(() => {
//     return addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .reduce((sum, a) => sum + (a.price || 0), 0);
//   }, [addOns, selectedAddOns]);

//   const grandTotal = ((pkg?.price || 0) + addOnTotal) * quantity;

//   const groupedAddons = useMemo(() => {
//     const groups: Record<string, AddOn[]> = {};
//     addOns.forEach(addon => {
//       const category = addon.category || 'General';
//       if (!groups[category]) groups[category] = [];
//       groups[category].push(addon);
//     });
//     return groups;
//   }, [addOns]);

//   const categories = Object.keys(groupedAddons);
//   const visibleCategories = showAllAddons ? categories : categories.slice(0, 2);

//   const handleAddToCart = useCallback(() => {
//     if (!pkg) return;
    
//     const selectedAddonDetails = addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .map(a => ({
//         id: a.id,
//         name: a.name,
//         price: a.price,
//         icon: a.icon,
//       }));

//     addItem({
//       id: `${pkg.id}_${Date.now()}`,
//       productId: pkg.id,
//       packageId: pkg.id,
//       name: pkg.name,
//       image: pkg.images?.[0] || pkg.image,
//       price: grandTotal,
//       quantity: quantity,
//       type: 'package',
//       addons: selectedAddonDetails,
//     });
//     show('Package added to cart 🎉');
//   }, [pkg, addOns, selectedAddOns, grandTotal, quantity, addItem, show]);

//   const handleBookNow = useCallback(() => {
//     handleAddToCart();
//     router.push('/checkout');
//   }, [handleAddToCart, router]);

//   const handleWishlistToggle = useCallback(() => {
//     if (!pkg) return;
//     const isWishlisted = has(pkg.id);
//     toggle(pkg.id);
//     show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
//   }, [pkg, has, toggle, show]);

//   const handleGoBack = useCallback(() => {
//     if (router.canGoBack()) {
//       router.back();
//     } else {
//       router.push('/(tabs)');
//     }
//   }, [router]);

//   // ─── Handle scroll to update active image ────────────────────────────────────
//   const handleScroll = (event: any) => {
//     const offset = event.nativeEvent.contentOffset.x;
//     const index = Math.round(offset / width);
//     if (index !== activeImage && index >= 0 && index < (images?.length || 0)) {
//       setActiveImage(index);
//     }
//   };

//   // ─── Build images array ──────────────────────────────────────────────────────
//   const images = useMemo(() => {
//     if (pkg?.images && Array.isArray(pkg.images) && pkg.images.length > 0) {
//       return pkg.images;
//     }
//     if (pkg?.image) {
//       return [pkg.image];
//     }
//     return ['https://via.placeholder.com/300x300?text=No+Image'];
//   }, [pkg]);

//   console.log('📸 Images to display:', images);
//   console.log('📸 Active image index:', activeImage);

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.gold[400]} />
//         <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>Loading package...</Text>
//       </View>
//     );
//   }

//   if (!pkg) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 16, color: COLORS.neutral[600], fontFamily: 'Inter-Regular' }}>Package not found</Text>
//         <TouchableOpacity 
//           onPress={handleGoBack} 
//           style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: RADIUS.lg }}
//         >
//           <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-SemiBold', fontSize: 14 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const isWishlisted = has(pkg.id);

//   const getTierColors = () => {
//     switch(pkg.tier) {
//       case 'Platinum':
//         return { bg: ['#1a1a2e', '#16213e'] as const, text: '#FFD700', badge: '#FFD700' };
//       case 'Gold':
//         return { bg: ['#4a3728', '#2d1f14'] as const, text: '#D4A82E', badge: '#D4A82E' };
//       case 'Premium':
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#4FC3F7', badge: '#4FC3F7' };
//       case 'Luxury':
//         return { bg: ['#2d1b3d', '#1a0f2e'] as const, text: '#CE93D8', badge: '#CE93D8' };
//       default:
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#64B5F6', badge: '#64B5F6' };
//     }
//   };

//   const tierColors = getTierColors();

//   const renderStars = () => {
//     const stars = [];
//     const rating = pkg.rating || 0;
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[200]} />
//           </View>
//         );
//       }
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         contentContainerStyle={{ paddingBottom: 120 }}
//         bounces={true}
//       >
//         {/* ─── Image Gallery - Working Carousel ──────────────────────────────── */}
//         <View style={styles.imageWrap}>
//           {images.length > 0 ? (
//             <>
//               <FlatList
//                 ref={flatListRef}
//                 data={images}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 onScroll={handleScroll}
//                 scrollEventThrottle={16}
//                 keyExtractor={(item, index) => `img_${index}`}
//                 renderItem={({ item, index }) => (
//                   <View style={styles.imageSlide}>
//                     <Image 
//                       source={{ uri: item }} 
//                       style={styles.image} 
//                       resizeMode="cover"
//                       onError={(e) => {
//                         console.log(`Image ${index} load error:`, item);
//                       }}
//                     />
//                   </View>
//                 )}
//               />
//               <LinearGradient
//                 colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
//                 style={styles.imageGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 0, y: 1 }}
//               />
//               {images.length > 1 && (
//                 <View style={styles.imageDots}>
//                   {images.map((_, i) => (
//                     <TouchableOpacity 
//                       key={i} 
//                       onPress={() => {
//                         setActiveImage(i);
//                         flatListRef.current?.scrollToIndex({ index: i, animated: true });
//                       }}
//                     >
//                       <View 
//                         style={[
//                           styles.imageDot, 
//                           i === activeImage && styles.imageDotActive
//                         ]} 
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </>
//           ) : (
//             <View style={[styles.imageSlide, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.neutral[100] }]}>
//               <Text style={{ color: COLORS.neutral[500] }}>No images available</Text>
//             </View>
//           )}
          
//           {/* Floating Header */}
//           <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//             <TouchableOpacity 
//               style={styles.floatBtn} 
//               onPress={handleGoBack}
//               activeOpacity={0.7}
//             >
//               <ArrowLeft color={COLORS.neutral[800]} size={22} />
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.floatBtn} 
//               onPress={handleWishlistToggle}
//               activeOpacity={0.7}
//             >
//               <Heart 
//                 color={isWishlisted ? COLORS.error : COLORS.neutral[800]} 
//                 size={22} 
//                 fill={isWishlisted ? COLORS.error : 'transparent'}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ─── Content ────────────────────────────────────────────────────────── */}
//         <View style={styles.content}>
//           {/* Tier Badge */}
//           <View style={styles.tierBadgeContainer}>
//             <LinearGradient
//               colors={tierColors.bg}
//               style={styles.tierBadge}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Crown size={14} color={tierColors.badge} />
//               <Text style={[styles.tierText, { color: tierColors.text }]}>
//                 {String(pkg.tier).toUpperCase()}
//               </Text>
//             </LinearGradient>
//           </View>
          
//           <Text style={styles.name}>{String(pkg.name)}</Text>
          
//           <View style={styles.metaRow}>
//             <View style={styles.ratingContainer}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
//                 {renderStars()}
//               </View>
//               <Text style={styles.ratingText}>
//                 {String((pkg.rating || 0).toFixed(1))}
//               </Text>
//             </View>
//             <View style={styles.dotSeparator} />
//             <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
//             <View style={styles.dotSeparator} />
//             <View style={styles.guestBadge}>
//               <Users color={COLORS.primary[500]} size={14} />
//               <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
//             </View>
//           </View>

//           <Text style={styles.description}>{String(pkg.description || '')}</Text>

//           {/* Price */}
//           <View style={styles.priceSection}>
//             <View style={styles.priceRow}>
//               <View>
//                 <Text style={styles.priceLabel}>Price</Text>
//                 <Text style={styles.price}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//               </View>
//               {(pkg.originalPrice || 0) > (pkg.price || 0) && (
//                 <View style={styles.discountContainer}>
//                   <Text style={styles.originalPrice}>₹{String((pkg.originalPrice || 0).toLocaleString('en-IN'))}</Text>
//                   <View style={styles.discountBadge}>
//                     <Text style={styles.discountText}>SAVE {String(pkg.discount || 0)}%</Text>
//                   </View>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* What's Included */}
//           {(pkg.includes && pkg.includes.length > 0) && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>✨ What's Included</Text>
//               <View style={styles.includesGrid}>
//                 {pkg.includes.map((inc, i) => {
//                   const includeText = typeof inc === 'string' ? inc : String(inc);
//                   return (
//                     <View key={i} style={styles.includeItem}>
//                       <View style={styles.includeCheck}>
//                         <Check color="#22C55E" size={14} />
//                       </View>
//                       <Text style={styles.includeText}>{includeText}</Text>
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Add-ons Section */}
//           {addOns.length > 0 && (
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>🎯 Customize Your Package</Text>
//                 <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
//               </View>

//               {visibleCategories.map((category) => (
//                 <View key={category} style={styles.categoryGroup}>
//                   <Text style={styles.categoryLabel}>{category}</Text>
//                   {groupedAddons[category].map((addon) => {
//                     const selected = selectedAddOns.includes(addon.id);
//                     const IconComponent = iconMap[addon.icon] || Sparkles;
//                     const priceText = `+₹${String((addon.price || 0).toLocaleString('en-IN'))}`;
                    
//                     return (
//                       <TouchableOpacity
//                         key={addon.id}
//                         style={[styles.addOnCard, selected && styles.addOnCardActive]}
//                         onPress={() => toggleAddOn(addon.id)}
//                         activeOpacity={0.8}
//                       >
//                         <View style={[styles.addOnIcon, selected && styles.addOnIconActive]}>
//                           <IconComponent 
//                             size={18} 
//                             color={selected ? '#FFFFFF' : COLORS.primary[600]} 
//                           />
//                         </View>
//                         <View style={styles.addOnBody}>
//                           <View style={styles.addOnInfo}>
//                             <Text style={[styles.addOnName, selected && styles.addOnNameActive]} numberOfLines={1}>
//                               {String(addon.name)}
//                             </Text>
//                             {addon.description && (
//                               <Text style={styles.addOnDescription} numberOfLines={1}>
//                                 {String(addon.description)}
//                               </Text>
//                             )}
//                           </View>
//                           <View style={styles.addOnRight}>
//                             <View style={[styles.addOnPriceContainer, selected && styles.addOnPriceContainerActive]}>
//                               <Text style={[styles.addOnPrice, selected && styles.addOnPriceActive]} numberOfLines={1}>
//                                 {priceText}
//                               </Text>
//                             </View>
//                             <View style={[styles.addOnCheck, selected && styles.addOnCheckActive]}>
//                               {selected ? (
//                                 <Check color="#FFFFFF" size={12} />
//                               ) : (
//                                 <Plus color="#999999" size={12} />
//                               )}
//                             </View>
//                           </View>
//                         </View>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               ))}

//               {categories.length > 2 && (
//                 <TouchableOpacity
//                   style={styles.showMoreBtn}
//                   onPress={() => setShowAllAddons(!showAllAddons)}
//                 >
//                   <Text style={styles.showMoreText}>
//                     {showAllAddons ? 'Show Less' : `Show More (${categories.length - 2} more)`}
//                   </Text>
//                   <ChevronRight 
//                     size={16} 
//                     color={COLORS.primary[600]} 
//                     style={showAllAddons ? styles.chevronRotated : undefined}
//                   />
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

         
         

//           {/* Price Summary */}
//           {/* <View style={styles.priceSummary}>
//             <View style={styles.summaryHeader}>
//               <Text style={styles.summaryTitle}>Order Summary</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Package Price</Text>
//               <Text style={styles.summaryValue}>₹{String((pkg.price || 0).toLocaleString('en-IN'))}</Text>
//             </View>
//             {addOnTotal > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Add-ons ({String(selectedAddOns.length)})</Text>
//                 <Text style={styles.summaryValue}>+₹{String(addOnTotal.toLocaleString('en-IN'))}</Text>
//               </View>
//             )}
//             {quantity > 1 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Quantity</Text>
//                 <Text style={styles.summaryValue}>× {quantity}</Text>
//               </View>
//             )}
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryTotal}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//             </View>
//           </View> */}
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
//         <View style={styles.bottomPrice}>
//           <Text style={styles.bottomPriceLabel}>Total</Text>
//           <Text style={styles.bottomPriceValue}>₹{String(grandTotal.toLocaleString('en-IN'))}</Text>
//         </View>
//         <TouchableOpacity 
//           onPress={handleAddToCart} 
//           style={[styles.actionBtn, styles.outlineBtn]}
//           activeOpacity={0.8}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[600]} />
//           <Text style={styles.outlineBtnText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           onPress={handleBookNow} 
//           style={[styles.actionBtn, styles.goldBtn]}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.goldBtnText}>Book Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#F8F9FA' 
//   },
//   imageWrap: { 
//     position: 'relative', 
//     width: '100%', 
//     height: 320,
//     overflow: 'hidden',
//   },
//   imageSlide: { 
//     width: width, 
//     height: 320,
//   },
//   image: { 
//     width: width, 
//     height: 320, 
//     resizeMode: 'cover' 
//   },
//   imageGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     pointerEvents: 'none',
//   },
//   imageDots: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//     zIndex: 2,
//   },
//   imageDot: { 
//     width: 8, 
//     height: 8, 
//     borderRadius: 4, 
//     backgroundColor: 'rgba(255,255,255,0.4)',
//   },
//   imageDotActive: { 
//     width: 24, 
//     backgroundColor: '#FFFFFF' 
//   },
//   floatingHeader: { 
//     position: 'absolute', 
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   floatBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   content: {
//     backgroundColor: '#F8F9FA',
//     marginTop: -20,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   tierBadgeContainer: {
//     marginBottom: 8,
//   },
//   tierBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     alignSelf: 'flex-start',
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     ...SHADOWS.small,
//   },
//   tierText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold',
//     letterSpacing: 0.5,
//   },
//   name: { 
//     fontSize: 24, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A', 
//     lineHeight: 30,
//     marginBottom: 8,
//   },
//   metaRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flexWrap: 'wrap',
//     marginBottom: 12,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ratingText: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//     marginLeft: 4,
//   },
//   dotSeparator: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#CCCCCC',
//     marginHorizontal: 8,
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   guestBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: '#F0F4FF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   guestText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium',
//     color: COLORS.primary[600] 
//   },
//   description: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#555555', 
//     lineHeight: 22,
//     marginBottom: 16,
//   },
//   priceSection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//     marginBottom: 8,
//   },
//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   priceLabel: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginBottom: 2,
//   },
//   price: { 
//     fontSize: 28, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   discountContainer: {
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   originalPrice: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#999999', 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: '#FEE2E2', 
//     paddingHorizontal: 10, 
//     paddingVertical: 4, 
//     borderRadius: 6,
//   },
//   discountText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold', 
//     color: '#EF4444' 
//   },
//   section: { 
//     marginTop: 20,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   sectionHeader: {
//     marginBottom: 12,
//   },
//   sectionTitle: { 
//     fontSize: 17, 
//     fontFamily: 'Inter-SemiBold', 
//     color: '#1A1A1A',
//     marginBottom: 2,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   categoryGroup: {
//     marginBottom: 12,
//   },
//   categoryLabel: {
//     fontSize: 13,
//     fontFamily: 'Inter-Medium',
//     color: '#666666',
//     marginBottom: 8,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   includesGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: 8,
//     marginTop: 4,
//   },
//   includeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     width: '48%',
//     backgroundColor: '#F8F9FA',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   includeCheck: { 
//     width: 20, 
//     height: 20, 
//     borderRadius: 10, 
//     backgroundColor: '#DCFCE7', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   includeText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: '#333333', 
//     flex: 1 
//   },
//   addOnCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 2,
//     borderColor: '#EEEEEE',
//     minHeight: 60,
//     width: '100%',
//   },
//   addOnCardActive: {
//     borderColor: COLORS.primary[500],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8EDF5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnIconActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   addOnBody: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginLeft: 12,
//     minWidth: 0,
//     flexWrap: 'nowrap',
//   },
//   addOnInfo: {
//     flex: 1,
//     marginRight: 8,
//     minWidth: 0,
//     maxWidth: '55%',
//   },
//   addOnName: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   addOnNameActive: {
//     color: COLORS.primary[600],
//   },
//   addOnDescription: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginTop: 2,
//   },
//   addOnRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     flexShrink: 0,
//     marginLeft: 'auto',
//   },
//   addOnPriceContainer: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#E5E5E5',
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   addOnPriceContainerActive: {
//     borderColor: COLORS.primary[300],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnPrice: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   addOnPriceActive: {
//     color: COLORS.primary[600],
//   },
//   addOnCheck: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#EEEEEE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnCheckActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   showMoreBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 4,
//     paddingVertical: 12,
//     marginTop: 4,
//   },
//   showMoreText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.primary[600],
//   },
//   chevronRotated: {
//     transform: [{ rotate: '90deg' }],
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     marginTop: 8,
//   },
//   quantityBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityText: {
//     fontSize: 18,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//     minWidth: 30,
//     textAlign: 'center',
//   },
//   priceSummary: { 
//     marginTop: 20,
//     marginBottom: 8,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   summaryHeader: {
//     marginBottom: 12,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   summaryRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: 6,
//   },
//   summaryLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   summaryValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Medium',
//     color: '#1A1A1A' 
//   },
//   summaryDivider: { 
//     height: 1, 
//     backgroundColor: '#EEEEEE', 
//     marginVertical: 8 
//   },
//   summaryTotal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 4,
//   },
//   totalLabel: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   totalValue: { 
//     fontSize: 20, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.primary[600] 
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#EEEEEE',
//     ...SHADOWS.large,
//     gap: 8,
//   },
//   bottomPrice: {
//     flexDirection: 'column',
//     marginRight: 8,
//   },
//   bottomPriceLabel: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   bottomPriceValue: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 6,
//   },
//   outlineBtn: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: COLORS.primary[500],
//   },
//   outlineBtnText: {
//     color: COLORS.primary[600],
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 14,
//   },
//   goldBtn: {
//     backgroundColor: COLORS.gold[400],
//     ...SHADOWS.small,
//   },
//   goldBtnText: {
//     color: '#1A1A1A',
//     fontFamily: 'Inter-Bold',
//     fontSize: 14,
//   },
// });




////////////////////////////////////////////////////////////////////////////////////////////////







// // app/package/[id].tsx - Complete with working multiple image carousel and fixed pricing
// import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, FlatList } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Check, Users, ShoppingBag, Star, Plus, Minus, Crown, Sparkles, Music, Camera, Flower2, Mic, Palette, Utensils, PartyPopper, Heart, ChevronRight } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { Package, AddOn } from '@/types';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useWishlist } from '@/store/wishlist';

// const { width } = Dimensions.get('window');

// const iconMap: Record<string, any> = {
//   '📸': Camera,
//   '🎵': Music,
//   '🌸': Flower2,
//   '💡': Sparkles,
//   '✈️': Camera,
//   '🎸': Mic,
//   '🍽️': Utensils,
//   '📷': Camera,
//   '🎨': Palette,
//   '🎪': PartyPopper,
//   '👑': Crown,
//   '📦': ShoppingBag,
// };

// export default function PackageDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { addItem } = useCart();
//   const { show } = useToast();
//   const { state, toggle, has } = useWishlist();
  
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [addOns, setAddOns] = useState<AddOn[]>([]);
//   const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [showAllAddons, setShowAllAddons] = useState(false);
  
//   const flatListRef = useRef<FlatList>(null);

//   const loadData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [pkgData, packageAddons] = await Promise.all([
//         mockApi.getPackage(id),
//         mockApi.getPackageAddons(id),
//       ]);
      
//       setPkg(pkgData || null);
      
//       // Log the images data for debugging
//       console.log('📦 Package images:', pkgData?.images);
//       console.log('📦 Package image:', pkgData?.image);
      
//       if (packageAddons && packageAddons.length > 0) {
//         setAddOns(packageAddons);
//         const defaultAddonIds = packageAddons
//           .filter((a: any) => a.is_default === 1 || a.is_default === true)
//           .map((a: any) => a.id.toString());
//         setSelectedAddOns(defaultAddonIds);
//       } else {
//         const allAddons = await mockApi.getAddOns();
//         setAddOns(allAddons || []);
//       }
//     } catch (error) {
//       console.error('Error loading package:', error);
//       show('Failed to load package details', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const toggleAddOn = useCallback((addOnId: string) => {
//     setSelectedAddOns((prev) => 
//       prev.includes(addOnId) 
//         ? prev.filter(a => a !== addOnId) 
//         : [...prev, addOnId]
//     );
//   }, []);

//   // ─── Calculate totals ──────────────────────────────────────────────────────
//   const addOnTotal = useMemo(() => {
//     return addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .reduce((sum, a) => sum + (a.price || 0), 0);
//   }, [addOns, selectedAddOns]);

//   // Base package price
//   const basePrice = useMemo(() => {
//     return pkg?.price || 0;
//   }, [pkg]);

//   // Price per unit (package + add-ons)
//   const pricePerUnit = useMemo(() => {
//     return basePrice + addOnTotal;
//   }, [basePrice, addOnTotal]);

//   // Grand total (price per unit * quantity)
//   const grandTotal = useMemo(() => {
//     return pricePerUnit * quantity;
//   }, [pricePerUnit, quantity]);

//   // Format price for display
//   const formatPrice = (price: number) => {
//     return `₹${price.toLocaleString('en-IN')}`;
//   };

//   const groupedAddons = useMemo(() => {
//     const groups: Record<string, AddOn[]> = {};
//     addOns.forEach(addon => {
//       const category = addon.category || 'General';
//       if (!groups[category]) groups[category] = [];
//       groups[category].push(addon);
//     });
//     return groups;
//   }, [addOns]);

//   const categories = Object.keys(groupedAddons);
//   const visibleCategories = showAllAddons ? categories : categories.slice(0, 2);

//   const handleAddToCart = useCallback(() => {
//     if (!pkg) return;
    
//     const selectedAddonDetails = addOns
//       .filter(a => selectedAddOns.includes(a.id))
//       .map(a => ({
//         id: a.id,
//         name: a.name,
//         price: a.price,
//         icon: a.icon,
//       }));

//     addItem({
//       id: `${pkg.id}_${Date.now()}`,
//       productId: pkg.id,
//       packageId: pkg.id,
//       name: pkg.name,
//       image: pkg.images?.[0] || pkg.image,
//       price: grandTotal,
//       quantity: quantity,
//       type: 'package',
//       addons: selectedAddonDetails,
//     });
//     show('Package added to cart 🎉');
//   }, [pkg, addOns, selectedAddOns, grandTotal, quantity, addItem, show]);

//   const handleBookNow = useCallback(() => {
//     handleAddToCart();
//     router.push('/checkout');
//   }, [handleAddToCart, router]);

//   const handleWishlistToggle = useCallback(() => {
//     if (!pkg) return;
//     const isWishlisted = has(pkg.id);
//     toggle(pkg.id);
//     show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
//   }, [pkg, has, toggle, show]);

//   const handleGoBack = useCallback(() => {
//     if (router.canGoBack()) {
//       router.back();
//     } else {
//       router.push('/(tabs)');
//     }
//   }, [router]);

//   // ─── Handle scroll to update active image ────────────────────────────────────
//   const handleScroll = (event: any) => {
//     const offset = event.nativeEvent.contentOffset.x;
//     const index = Math.round(offset / width);
//     if (index !== activeImage && index >= 0 && index < (images?.length || 0)) {
//       setActiveImage(index);
//     }
//   };

//   // ─── Build images array ──────────────────────────────────────────────────────
//   const images = useMemo(() => {
//     if (pkg?.images && Array.isArray(pkg.images) && pkg.images.length > 0) {
//       return pkg.images;
//     }
//     if (pkg?.image) {
//       return [pkg.image];
//     }
//     return ['https://via.placeholder.com/300x300?text=No+Image'];
//   }, [pkg]);

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.gold[400]} />
//         <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>Loading package...</Text>
//       </View>
//     );
//   }

//   if (!pkg) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ fontSize: 16, color: COLORS.neutral[600], fontFamily: 'Inter-Regular' }}>Package not found</Text>
//         <TouchableOpacity 
//           onPress={handleGoBack} 
//           style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: RADIUS.lg }}
//         >
//           <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-SemiBold', fontSize: 14 }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const isWishlisted = has(pkg.id);

//   const getTierColors = () => {
//     switch(pkg.tier) {
//       case 'Platinum':
//         return { bg: ['#1a1a2e', '#16213e'] as const, text: '#FFD700', badge: '#FFD700' };
//       case 'Gold':
//         return { bg: ['#4a3728', '#2d1f14'] as const, text: '#D4A82E', badge: '#D4A82E' };
//       case 'Premium':
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#4FC3F7', badge: '#4FC3F7' };
//       case 'Luxury':
//         return { bg: ['#2d1b3d', '#1a0f2e'] as const, text: '#CE93D8', badge: '#CE93D8' };
//       default:
//         return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#64B5F6', badge: '#64B5F6' };
//     }
//   };

//   const tierColors = getTierColors();

//   const renderStars = () => {
//     const stars = [];
//     const rating = pkg.rating || 0;
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//           </View>
//         );
//       } else {
//         stars.push(
//           <View key={i}>
//             <Star size={16} color={COLORS.gold[200]} />
//           </View>
//         );
//       }
//     }
//     return stars;
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         contentContainerStyle={{ paddingBottom: 160 }}
//         bounces={true}
//       >
//         {/* ─── Image Gallery - Working Carousel ──────────────────────────────── */}
//         <View style={styles.imageWrap}>
//           {images.length > 0 ? (
//             <>
//               <FlatList
//                 ref={flatListRef}
//                 data={images}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 onScroll={handleScroll}
//                 scrollEventThrottle={16}
//                 keyExtractor={(item, index) => `img_${index}`}
//                 renderItem={({ item, index }) => (
//                   <View style={styles.imageSlide}>
//                     <Image 
//                       source={{ uri: item }} 
//                       style={styles.image} 
//                       resizeMode="cover"
//                       onError={(e) => {
//                         console.log(`Image ${index} load error:`, item);
//                       }}
//                     />
//                   </View>
//                 )}
//               />
//               <LinearGradient
//                 colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
//                 style={styles.imageGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 0, y: 1 }}
//               />
//               {images.length > 1 && (
//                 <View style={styles.imageDots}>
//                   {images.map((_, i) => (
//                     <TouchableOpacity 
//                       key={i} 
//                       onPress={() => {
//                         setActiveImage(i);
//                         flatListRef.current?.scrollToIndex({ index: i, animated: true });
//                       }}
//                     >
//                       <View 
//                         style={[
//                           styles.imageDot, 
//                           i === activeImage && styles.imageDotActive
//                         ]} 
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </>
//           ) : (
//             <View style={[styles.imageSlide, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.neutral[100] }]}>
//               <Text style={{ color: COLORS.neutral[500] }}>No images available</Text>
//             </View>
//           )}
          
//           {/* Floating Header */}
//           <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
//             <TouchableOpacity 
//               style={styles.floatBtn} 
//               onPress={handleGoBack}
//               activeOpacity={0.7}
//             >
//               <ArrowLeft color={COLORS.neutral[800]} size={22} />
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.floatBtn} 
//               onPress={handleWishlistToggle}
//               activeOpacity={0.7}
//             >
//               <Heart 
//                 color={isWishlisted ? COLORS.error : COLORS.neutral[800]} 
//                 size={22} 
//                 fill={isWishlisted ? COLORS.error : 'transparent'}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ─── Content ────────────────────────────────────────────────────────── */}
//         <View style={styles.content}>
//           {/* Tier Badge */}
//           <View style={styles.tierBadgeContainer}>
//             <LinearGradient
//               colors={tierColors.bg}
//               style={styles.tierBadge}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Crown size={14} color={tierColors.badge} />
//               <Text style={[styles.tierText, { color: tierColors.text }]}>
//                 {String(pkg.tier).toUpperCase()}
//               </Text>
//             </LinearGradient>
//           </View>
          
//           <Text style={styles.name}>{String(pkg.name)}</Text>
          
//           <View style={styles.metaRow}>
//             <View style={styles.ratingContainer}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
//                 {renderStars()}
//               </View>
//               <Text style={styles.ratingText}>
//                 {String((pkg.rating || 0).toFixed(1))}
//               </Text>
//             </View>
//             <View style={styles.dotSeparator} />
//             <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
//             <View style={styles.dotSeparator} />
//             <View style={styles.guestBadge}>
//               <Users color={COLORS.primary[500]} size={14} />
//               <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
//             </View>
//           </View>

//           <Text style={styles.description}>{String(pkg.description || '')}</Text>

//           {/* Price Section */}
//           <View style={styles.priceSection}>
//             <View style={styles.priceRow}>
//               <View>
//                 <Text style={styles.priceLabel}>Base Price</Text>
//                 <Text style={styles.price}>{formatPrice(basePrice)}</Text>
//               </View>
//               {(pkg.originalPrice || 0) > basePrice && (
//                 <View style={styles.discountContainer}>
//                   <Text style={styles.originalPrice}>{formatPrice(pkg.originalPrice || 0)}</Text>
//                   <View style={styles.discountBadge}>
//                     <Text style={styles.discountText}>SAVE {pkg.discount || 0}%</Text>
//                   </View>
//                 </View>
//               )}
//             </View>
            
//             {/* Show add-ons total if any selected */}
//             {addOnTotal > 0 && (
//               <View style={styles.addOnTotalRow}>
//                 <Text style={styles.addOnTotalLabel}>Add-ons Total</Text>
//                 <Text style={styles.addOnTotalValue}>+ {formatPrice(addOnTotal)}</Text>
//               </View>
//             )}
            
//             {/* Show price per unit */}
//             <View style={styles.pricePerUnitRow}>
//               <Text style={styles.pricePerUnitLabel}>Price per unit</Text>
//               <Text style={styles.pricePerUnitValue}>{formatPrice(pricePerUnit)}</Text>
//             </View>
//           </View>

//           {/* Quantity Selector */}
//           <View style={styles.quantitySection}>
//             <Text style={styles.quantityLabel}>Quantity</Text>
//             <View style={styles.quantityContainer}>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//                 activeOpacity={0.7}
//               >
//                 <Minus color={COLORS.neutral[700]} size={20} />
//               </TouchableOpacity>
//               <Text style={styles.quantityText}>{quantity}</Text>
//               <TouchableOpacity 
//                 style={styles.quantityBtn} 
//                 onPress={() => setQuantity(quantity + 1)}
//                 activeOpacity={0.7}
//               >
//                 <Plus color={COLORS.neutral[700]} size={20} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* What's Included */}
//           {(pkg.includes && pkg.includes.length > 0) && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>✨ What's Included</Text>
//               <View style={styles.includesGrid}>
//                 {pkg.includes.map((inc, i) => {
//                   const includeText = typeof inc === 'string' ? inc : String(inc);
//                   return (
//                     <View key={i} style={styles.includeItem}>
//                       <View style={styles.includeCheck}>
//                         <Check color="#22C55E" size={14} />
//                       </View>
//                       <Text style={styles.includeText}>{includeText}</Text>
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           )}

//           {/* Add-ons Section */}
//           {addOns.length > 0 && (
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>🎯 Customize Your Package</Text>
//                 <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
//               </View>

//               {visibleCategories.map((category) => (
//                 <View key={category} style={styles.categoryGroup}>
//                   <Text style={styles.categoryLabel}>{category}</Text>
//                   {groupedAddons[category].map((addon) => {
//                     const selected = selectedAddOns.includes(addon.id);
//                     const IconComponent = iconMap[addon.icon] || Sparkles;
//                     const priceText = `+${formatPrice(addon.price || 0)}`;
                    
//                     return (
//                       <TouchableOpacity
//                         key={addon.id}
//                         style={[styles.addOnCard, selected && styles.addOnCardActive]}
//                         onPress={() => toggleAddOn(addon.id)}
//                         activeOpacity={0.8}
//                       >
//                         <View style={[styles.addOnIcon, selected && styles.addOnIconActive]}>
//                           <IconComponent 
//                             size={18} 
//                             color={selected ? '#FFFFFF' : COLORS.primary[600]} 
//                           />
//                         </View>
//                         <View style={styles.addOnBody}>
//                           <View style={styles.addOnInfo}>
//                             <Text style={[styles.addOnName, selected && styles.addOnNameActive]} numberOfLines={1}>
//                               {String(addon.name)}
//                             </Text>
//                             {addon.description && (
//                               <Text style={styles.addOnDescription} numberOfLines={1}>
//                                 {String(addon.description)}
//                               </Text>
//                             )}
//                           </View>
//                           <View style={styles.addOnRight}>
//                             <View style={[styles.addOnPriceContainer, selected && styles.addOnPriceContainerActive]}>
//                               <Text style={[styles.addOnPrice, selected && styles.addOnPriceActive]} numberOfLines={1}>
//                                 {priceText}
//                               </Text>
//                             </View>
//                             <View style={[styles.addOnCheck, selected && styles.addOnCheckActive]}>
//                               {selected ? (
//                                 <Check color="#FFFFFF" size={12} />
//                               ) : (
//                                 <Plus color="#999999" size={12} />
//                               )}
//                             </View>
//                           </View>
//                         </View>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               ))}

//               {categories.length > 2 && (
//                 <TouchableOpacity
//                   style={styles.showMoreBtn}
//                   onPress={() => setShowAllAddons(!showAllAddons)}
//                 >
//                   <Text style={styles.showMoreText}>
//                     {showAllAddons ? 'Show Less' : `Show More (${categories.length - 2} more)`}
//                   </Text>
//                   <ChevronRight 
//                     size={16} 
//                     color={COLORS.primary[600]} 
//                     style={showAllAddons ? styles.chevronRotated : undefined}
//                   />
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {/* Order Summary */}
//           <View style={styles.priceSummary}>
//             <View style={styles.summaryHeader}>
//               <Text style={styles.summaryTitle}>📋 Order Summary</Text>
//             </View>
            
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Package Price</Text>
//               <Text style={styles.summaryValue}>{formatPrice(basePrice)}</Text>
//             </View>
            
//             {addOnTotal > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Add-ons ({selectedAddOns.length})</Text>
//                 <Text style={styles.summaryValue}>+ {formatPrice(addOnTotal)}</Text>
//               </View>
//             )}
            
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Quantity</Text>
//               <Text style={styles.summaryValue}>× {quantity}</Text>
//             </View>
            
//             <View style={styles.summaryDivider} />
            
//             <View style={styles.summaryTotal}>
//               <Text style={styles.totalLabel}>Grand Total</Text>
//               <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
//             </View>
            
//             {/* Show breakdown when quantity > 1 */}
//             {quantity > 1 && (
//               <Text style={styles.breakdownText}>
//                 ({formatPrice(pricePerUnit)} × {quantity} = {formatPrice(grandTotal)})
//               </Text>
//             )}
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Actions */}
//       <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
//         <View style={styles.bottomPrice}>
//           <Text style={styles.bottomPriceLabel}>Total</Text>
//           <Text style={styles.bottomPriceValue}>{formatPrice(grandTotal)}</Text>
//           {quantity > 1 && (
//             <Text style={styles.bottomPricePerUnit}>
//               ({formatPrice(pricePerUnit)} × {quantity})
//             </Text>
//           )}
//         </View>
        
//         <TouchableOpacity 
//           onPress={handleAddToCart} 
//           style={[styles.actionBtn, styles.outlineBtn]}
//           activeOpacity={0.8}
//         >
//           <ShoppingBag size={18} color={COLORS.primary[600]} />
//           <Text style={styles.outlineBtnText}>Add to Cart</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           onPress={handleBookNow} 
//           style={[styles.actionBtn, styles.goldBtn]}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.goldBtnText}>Book Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#F8F9FA' 
//   },
//   imageWrap: { 
//     position: 'relative', 
//     width: '100%', 
//     height: 320,
//     overflow: 'hidden',
//   },
//   imageSlide: { 
//     width: width, 
//     height: 320,
//   },
//   image: { 
//     width: width, 
//     height: 320, 
//     resizeMode: 'cover' 
//   },
//   imageGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     pointerEvents: 'none',
//   },
//   imageDots: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//     zIndex: 2,
//   },
//   imageDot: { 
//     width: 8, 
//     height: 8, 
//     borderRadius: 4, 
//     backgroundColor: 'rgba(255,255,255,0.4)',
//   },
//   imageDotActive: { 
//     width: 24, 
//     backgroundColor: '#FFFFFF' 
//   },
//   floatingHeader: { 
//     position: 'absolute', 
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   floatBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   content: {
//     backgroundColor: '#F8F9FA',
//     marginTop: -20,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 20,
//   },
//   tierBadgeContainer: {
//     marginBottom: 8,
//   },
//   tierBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     alignSelf: 'flex-start',
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     ...SHADOWS.small,
//   },
//   tierText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold',
//     letterSpacing: 0.5,
//   },
//   name: { 
//     fontSize: 24, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A', 
//     lineHeight: 30,
//     marginBottom: 8,
//   },
//   metaRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     flexWrap: 'wrap',
//     marginBottom: 12,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ratingText: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//     marginLeft: 4,
//   },
//   dotSeparator: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#CCCCCC',
//     marginHorizontal: 8,
//   },
//   reviewCount: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   guestBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: '#F0F4FF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   guestText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium',
//     color: COLORS.primary[600] 
//   },
//   description: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#555555', 
//     lineHeight: 22,
//     marginBottom: 16,
//   },
//   priceSection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//     marginBottom: 16,
//   },
//   priceRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   priceLabel: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginBottom: 2,
//   },
//   price: { 
//     fontSize: 28, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   discountContainer: {
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   originalPrice: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#999999', 
//     textDecorationLine: 'line-through' 
//   },
//   discountBadge: { 
//     backgroundColor: '#FEE2E2', 
//     paddingHorizontal: 10, 
//     paddingVertical: 4, 
//     borderRadius: 6,
//   },
//   discountText: { 
//     fontSize: 11, 
//     fontFamily: 'Inter-Bold', 
//     color: '#EF4444' 
//   },
//   addOnTotalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 10,
//     marginTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//   },
//   addOnTotalLabel: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#666666',
//   },
//   addOnTotalValue: {
//     fontSize: 15,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.primary[600],
//   },
//   pricePerUnitRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 8,
//     marginTop: 6,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//   },
//   pricePerUnitLabel: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   pricePerUnitValue: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   quantitySection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//     marginBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   quantityLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   quantityBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityText: {
//     fontSize: 18,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//     minWidth: 30,
//     textAlign: 'center',
//   },
//   section: { 
//     marginTop: 16,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   sectionHeader: {
//     marginBottom: 12,
//   },
//   sectionTitle: { 
//     fontSize: 17, 
//     fontFamily: 'Inter-SemiBold', 
//     color: '#1A1A1A',
//     marginBottom: 2,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   categoryGroup: {
//     marginBottom: 12,
//   },
//   categoryLabel: {
//     fontSize: 13,
//     fontFamily: 'Inter-Medium',
//     color: '#666666',
//     marginBottom: 8,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   includesGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: 8,
//     marginTop: 4,
//   },
//   includeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     width: '48%',
//     backgroundColor: '#F8F9FA',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   includeCheck: { 
//     width: 20, 
//     height: 20, 
//     borderRadius: 10, 
//     backgroundColor: '#DCFCE7', 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   includeText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Medium', 
//     color: '#333333', 
//     flex: 1 
//   },
//   addOnCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 2,
//     borderColor: '#EEEEEE',
//     minHeight: 60,
//     width: '100%',
//     marginBottom: 8,
//   },
//   addOnCardActive: {
//     borderColor: COLORS.primary[500],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8EDF5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnIconActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   addOnBody: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginLeft: 12,
//     minWidth: 0,
//     flexWrap: 'nowrap',
//   },
//   addOnInfo: {
//     flex: 1,
//     marginRight: 8,
//     minWidth: 0,
//     maxWidth: '55%',
//   },
//   addOnName: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   addOnNameActive: {
//     color: COLORS.primary[600],
//   },
//   addOnDescription: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     marginTop: 2,
//   },
//   addOnRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     flexShrink: 0,
//     marginLeft: 'auto',
//   },
//   addOnPriceContainer: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#E5E5E5',
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   addOnPriceContainerActive: {
//     borderColor: COLORS.primary[300],
//     backgroundColor: '#F0F7FF',
//   },
//   addOnPrice: {
//     fontSize: 13,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   addOnPriceActive: {
//     color: COLORS.primary[600],
//   },
//   addOnCheck: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#EEEEEE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexShrink: 0,
//   },
//   addOnCheckActive: {
//     backgroundColor: COLORS.primary[500],
//   },
//   showMoreBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 4,
//     paddingVertical: 12,
//     marginTop: 4,
//   },
//   showMoreText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.primary[600],
//   },
//   chevronRotated: {
//     transform: [{ rotate: '90deg' }],
//   },
//   priceSummary: { 
//     marginTop: 16,
//     marginBottom: 8,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     ...SHADOWS.small,
//   },
//   summaryHeader: {
//     marginBottom: 12,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1A1A1A',
//   },
//   summaryRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: 6,
//   },
//   summaryLabel: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular',
//     color: '#666666' 
//   },
//   summaryValue: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Medium',
//     color: '#1A1A1A' 
//   },
//   summaryDivider: { 
//     height: 1, 
//     backgroundColor: '#EEEEEE', 
//     marginVertical: 8 
//   },
//   summaryTotal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 4,
//   },
//   totalLabel: { 
//     fontSize: 18, 
//     fontFamily: 'Inter-Bold', 
//     color: '#1A1A1A' 
//   },
//   totalValue: { 
//     fontSize: 20, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.primary[600] 
//   },
//   breakdownText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//     textAlign: 'right',
//     marginTop: 4,
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#EEEEEE',
//     ...SHADOWS.large,
//     gap: 8,
//   },
//   bottomPrice: {
//     flexDirection: 'column',
//     marginRight: 8,
//     minWidth: 90,
//   },
//   bottomPriceLabel: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     color: '#888888',
//   },
//   bottomPriceValue: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: '#1A1A1A',
//   },
//   bottomPricePerUnit: {
//     fontSize: 10,
//     fontFamily: 'Inter-Regular',
//     color: '#999999',
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 6,
//   },
//   outlineBtn: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: COLORS.primary[500],
//   },
//   outlineBtnText: {
//     color: COLORS.primary[600],
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 14,
//   },
//   goldBtn: {
//     backgroundColor: COLORS.gold[400],
//     ...SHADOWS.small,
//   },
//   goldBtnText: {
//     color: '#1A1A1A',
//     fontFamily: 'Inter-Bold',
//     fontSize: 14,
//   },
// });






// app/package/[id].tsx - Complete with working multiple image carousel and fixed pricing
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Users, ShoppingBag, Star, Plus, Minus, Crown, Sparkles, Music, Camera, Flower2, Mic, Palette, Utensils, PartyPopper, Heart, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi } from '@/services/api';
import { Package, AddOn } from '@/types';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWishlist } from '@/store/wishlist';
import { useAuth } from '@/store/auth';

const { width } = Dimensions.get('window');

const iconMap: Record<string, any> = {
  '📸': Camera,
  '🎵': Music,
  '🌸': Flower2,
  '💡': Sparkles,
  '✈️': Camera,
  '🎸': Mic,
  '🍽️': Utensils,
  '📷': Camera,
  '🎨': Palette,
  '🎪': PartyPopper,
  '👑': Crown,
  '📦': ShoppingBag,
};

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { show } = useToast();
  const { state, toggle, has } = useWishlist();
  const { state: authState } = useAuth();
  
  const [pkg, setPkg] = useState<Package | null>(null);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAllAddons, setShowAllAddons] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [pkgData, packageAddons] = await Promise.all([
        mockApi.getPackage(id),
        mockApi.getPackageAddons(id),
      ]);
      
      setPkg(pkgData || null);
      
      console.log('📦 Package images:', pkgData?.images);
      console.log('📦 Package image:', pkgData?.image);
      
      if (packageAddons && packageAddons.length > 0) {
        setAddOns(packageAddons);
        const defaultAddonIds = packageAddons
          .filter((a: any) => a.is_default === 1 || a.is_default === true)
          .map((a: any) => a.id.toString());
        setSelectedAddOns(defaultAddonIds);
      } else {
        const allAddons = await mockApi.getAddOns();
        setAddOns(allAddons || []);
      }
    } catch (error) {
      console.error('Error loading package:', error);
      show('Failed to load package details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleAddOn = useCallback((addOnId: string) => {
    setSelectedAddOns((prev) => 
      prev.includes(addOnId) 
        ? prev.filter(a => a !== addOnId) 
        : [...prev, addOnId]
    );
  }, []);

  // ─── Calculate totals ──────────────────────────────────────────────────────
  const addOnTotal = useMemo(() => {
    return addOns
      .filter(a => selectedAddOns.includes(a.id))
      .reduce((sum, a) => sum + (a.price || 0), 0);
  }, [addOns, selectedAddOns]);

  const basePrice = useMemo(() => {
    return pkg?.price || 0;
  }, [pkg]);

  const pricePerUnit = useMemo(() => {
    return basePrice + addOnTotal;
  }, [basePrice, addOnTotal]);

  const grandTotal = useMemo(() => {
    return pricePerUnit * quantity;
  }, [pricePerUnit, quantity]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const groupedAddons = useMemo(() => {
    const groups: Record<string, AddOn[]> = {};
    addOns.forEach(addon => {
      const category = addon.category || 'General';
      if (!groups[category]) groups[category] = [];
      groups[category].push(addon);
    });
    return groups;
  }, [addOns]);

  const categories = Object.keys(groupedAddons);
  const visibleCategories = showAllAddons ? categories : categories.slice(0, 2);

  const handleAddToCart = useCallback(() => {
    if (!pkg) return;
    
    const selectedAddonDetails = addOns
      .filter(a => selectedAddOns.includes(a.id))
      .map(a => ({
        id: a.id,
        name: a.name,
        price: a.price,
        icon: a.icon,
      }));

    addItem({
      id: `${pkg.id}_${Date.now()}`,
      productId: pkg.id,
      packageId: pkg.id,
      name: pkg.name,
      image: pkg.images?.[0] || pkg.image,
      price: grandTotal,
      quantity: quantity,
      type: 'package',
      addons: selectedAddonDetails,
    });
    show('Package added to cart 🎉');
  }, [pkg, addOns, selectedAddOns, grandTotal, quantity, addItem, show]);

  const handleBookNow = useCallback(() => {
    handleAddToCart();
    router.push('/checkout');
  }, [handleAddToCart, router]);

  const handleWishlistToggle = useCallback(() => {
    if (!pkg) return;
    
    const isWishlisted = has(pkg.id);
    const customerId = authState?.user?.id;
    
    const productData = {
      name: pkg.name,
      price: pkg.price,
      image: pkg.images?.[0] || pkg.image || '',
    };
    
    toggle(pkg.id, customerId, productData);
    show(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  }, [pkg, has, toggle, show, authState]);

  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)');
    }
  }, [router]);

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width);
    if (index !== activeImage && index >= 0 && index < (images?.length || 0)) {
      setActiveImage(index);
    }
  };

  const images = useMemo(() => {
    if (pkg?.images && Array.isArray(pkg.images) && pkg.images.length > 0) {
      return pkg.images;
    }
    if (pkg?.image) {
      return [pkg.image];
    }
    return ['https://via.placeholder.com/300x300?text=No+Image'];
  }, [pkg]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.gold[400]} />
        <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>Loading package...</Text>
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: COLORS.neutral[600], fontFamily: 'Inter-Regular' }}>Package not found</Text>
        <TouchableOpacity 
          onPress={handleGoBack} 
          style={{ marginTop: 20, backgroundColor: COLORS.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: RADIUS.lg }}
        >
          <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-SemiBold', fontSize: 14 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isWishlisted = has(pkg.id);

  const getTierColors = () => {
    switch(pkg.tier) {
      case 'Platinum':
        return { bg: ['#1a1a2e', '#16213e'] as const, text: '#FFD700', badge: '#FFD700' };
      case 'Gold':
        return { bg: ['#4a3728', '#2d1f14'] as const, text: '#D4A82E', badge: '#D4A82E' };
      case 'Premium':
        return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#4FC3F7', badge: '#4FC3F7' };
      case 'Luxury':
        return { bg: ['#2d1b3d', '#1a0f2e'] as const, text: '#CE93D8', badge: '#CE93D8' };
      default:
        return { bg: ['#1a3a5c', '#0d2137'] as const, text: '#64B5F6', badge: '#64B5F6' };
    }
  };

  const tierColors = getTierColors();

  const renderStars = () => {
    const stars = [];
    const rating = pkg.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <View key={i}>
            <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
          </View>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <View key={i}>
            <Star size={16} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
          </View>
        );
      } else {
        stars.push(
          <View key={i}>
            <Star size={16} color={COLORS.gold[200]} />
          </View>
        );
      }
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 160 }}
        bounces={true}
      >
        {/* ─── Image Gallery - Working Carousel ──────────────────────────────── */}
        <View style={styles.imageWrap}>
          {images.length > 0 ? (
            <>
              <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(item, index) => `img_${index}`}
                renderItem={({ item, index }) => (
                  <View style={styles.imageSlide}>
                    <Image 
                      source={{ uri: item }} 
                      style={styles.image} 
                      resizeMode="cover"
                      onError={(e) => {
                        console.log(`Image ${index} load error:`, item);
                      }}
                    />
                  </View>
                )}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
                style={styles.imageGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
              {images.length > 1 && (
                <View style={styles.imageDots}>
                  {images.map((_, i) => (
                    <TouchableOpacity 
                      key={i} 
                      onPress={() => {
                        setActiveImage(i);
                        flatListRef.current?.scrollToIndex({ index: i, animated: true });
                      }}
                    >
                      <View 
                        style={[
                          styles.imageDot, 
                          i === activeImage && styles.imageDotActive
                        ]} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={[styles.imageSlide, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.neutral[100] }]}>
              <Text style={{ color: COLORS.neutral[500] }}>No images available</Text>
            </View>
          )}
          
          {/* Floating Header */}
          <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
            <TouchableOpacity 
              style={styles.floatBtn} 
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <ArrowLeft color={COLORS.neutral[800]} size={22} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.floatBtn} 
              onPress={handleWishlistToggle}
              activeOpacity={0.7}
            >
              <Heart 
                color={isWishlisted ? COLORS.error : COLORS.neutral[800]} 
                size={22} 
                fill={isWishlisted ? COLORS.error : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Content ────────────────────────────────────────────────────────── */}
        <View style={styles.content}>
          {/* Tier Badge */}
          <View style={styles.tierBadgeContainer}>
            <LinearGradient
              colors={tierColors.bg}
              style={styles.tierBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Crown size={14} color={tierColors.badge} />
              <Text style={[styles.tierText, { color: tierColors.text }]}>
                {String(pkg.tier).toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.name}>{String(pkg.name)}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                {renderStars()}
              </View>
              <Text style={styles.ratingText}>
                {String((pkg.rating || 0).toFixed(1))}
              </Text>
            </View>
            <View style={styles.dotSeparator} />
            <Text style={styles.reviewCount}>{String(pkg.reviewCount || 0)} reviews</Text>
            <View style={styles.dotSeparator} />
            <View style={styles.guestBadge}>
              <Users color={COLORS.primary[500]} size={14} />
              <Text style={styles.guestText}>Up to {String(pkg.guestCapacity || 0)} guests</Text>
            </View>
          </View>

          <Text style={styles.description}>{String(pkg.description || '')}</Text>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Base Price</Text>
                <Text style={styles.price}>{formatPrice(basePrice)}</Text>
              </View>
              {(pkg.originalPrice || 0) > basePrice && (
                <View style={styles.discountContainer}>
                  <Text style={styles.originalPrice}>{formatPrice(pkg.originalPrice || 0)}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>SAVE {pkg.discount || 0}%</Text>
                  </View>
                </View>
              )}
            </View>
            
            {addOnTotal > 0 && (
              <View style={styles.addOnTotalRow}>
                <Text style={styles.addOnTotalLabel}>Add-ons Total</Text>
                <Text style={styles.addOnTotalValue}>+ {formatPrice(addOnTotal)}</Text>
              </View>
            )}
            
            <View style={styles.pricePerUnitRow}>
              <Text style={styles.pricePerUnitLabel}>Price per unit</Text>
              <Text style={styles.pricePerUnitValue}>{formatPrice(pricePerUnit)}</Text>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityBtn} 
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                activeOpacity={0.7}
              >
                <Minus color={COLORS.neutral[700]} size={20} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityBtn} 
                onPress={() => setQuantity(quantity + 1)}
                activeOpacity={0.7}
              >
                <Plus color={COLORS.neutral[700]} size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* What's Included */}
          {(pkg.includes && pkg.includes.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✨ What's Included</Text>
              <View style={styles.includesGrid}>
                {pkg.includes.map((inc, i) => {
                  const includeText = typeof inc === 'string' ? inc : String(inc);
                  return (
                    <View key={i} style={styles.includeItem}>
                      <View style={styles.includeCheck}>
                        <Check color="#22C55E" size={14} />
                      </View>
                      <Text style={styles.includeText}>{includeText}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Add-ons Section */}
          {addOns.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎯 Customize Your Package</Text>
                <Text style={styles.sectionSubtitle}>Add extra services to make your event perfect</Text>
              </View>

              {visibleCategories.map((category) => (
                <View key={category} style={styles.categoryGroup}>
                  <Text style={styles.categoryLabel}>{category}</Text>
                  {groupedAddons[category].map((addon) => {
                    const selected = selectedAddOns.includes(addon.id);
                    const IconComponent = iconMap[addon.icon] || Sparkles;
                    const priceText = `+${formatPrice(addon.price || 0)}`;
                    
                    return (
                      <TouchableOpacity
                        key={addon.id}
                        style={[styles.addOnCard, selected && styles.addOnCardActive]}
                        onPress={() => toggleAddOn(addon.id)}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.addOnIcon, selected && styles.addOnIconActive]}>
                          <IconComponent 
                            size={18} 
                            color={selected ? '#FFFFFF' : COLORS.primary[600]} 
                          />
                        </View>
                        <View style={styles.addOnBody}>
                          <View style={styles.addOnInfo}>
                            <Text style={[styles.addOnName, selected && styles.addOnNameActive]} numberOfLines={1}>
                              {String(addon.name)}
                            </Text>
                            {addon.description && (
                              <Text style={styles.addOnDescription} numberOfLines={1}>
                                {String(addon.description)}
                              </Text>
                            )}
                          </View>
                          <View style={styles.addOnRight}>
                            <View style={[styles.addOnPriceContainer, selected && styles.addOnPriceContainerActive]}>
                              <Text style={[styles.addOnPrice, selected && styles.addOnPriceActive]} numberOfLines={1}>
                                {priceText}
                              </Text>
                            </View>
                            <View style={[styles.addOnCheck, selected && styles.addOnCheckActive]}>
                              {selected ? (
                                <Check color="#FFFFFF" size={12} />
                              ) : (
                                <Plus color="#999999" size={12} />
                              )}
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}

              {categories.length > 2 && (
                <TouchableOpacity
                  style={styles.showMoreBtn}
                  onPress={() => setShowAllAddons(!showAllAddons)}
                >
                  <Text style={styles.showMoreText}>
                    {showAllAddons ? 'Show Less' : `Show More (${categories.length - 2} more)`}
                  </Text>
                  <ChevronRight 
                    size={16} 
                    color={COLORS.primary[600]} 
                    style={showAllAddons ? styles.chevronRotated : undefined}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Order Summary */}
          <View style={styles.priceSummary}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>📋 Order Summary</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Package Price</Text>
              <Text style={styles.summaryValue}>{formatPrice(basePrice)}</Text>
            </View>
            
            {addOnTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Add-ons ({selectedAddOns.length})</Text>
                <Text style={styles.summaryValue}>+ {formatPrice(addOnTotal)}</Text>
              </View>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantity</Text>
              <Text style={styles.summaryValue}>× {quantity}</Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryTotal}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
            </View>
            
            {quantity > 1 && (
              <Text style={styles.breakdownText}>
                ({formatPrice(pricePerUnit)} × {quantity} = {formatPrice(grandTotal)})
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>Total</Text>
          <Text style={styles.bottomPriceValue}>{formatPrice(grandTotal)}</Text>
          {quantity > 1 && (
            <Text style={styles.bottomPricePerUnit}>
              ({formatPrice(pricePerUnit)} × {quantity})
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={handleAddToCart} 
          style={[styles.actionBtn, styles.outlineBtn]}
          activeOpacity={0.8}
        >
          <ShoppingBag size={18} color={COLORS.primary[600]} />
          <Text style={styles.outlineBtnText}>Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleBookNow} 
          style={[styles.actionBtn, styles.goldBtn]}
          activeOpacity={0.8}
        >
          <Text style={styles.goldBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  imageWrap: { 
    position: 'relative', 
    width: '100%', 
    height: 320,
    overflow: 'hidden',
  },
  imageSlide: { 
    width: width, 
    height: 320,
  },
  image: { 
    width: width, 
    height: 320, 
    resizeMode: 'cover' 
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  imageDots: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 2,
  },
  imageDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  imageDotActive: { 
    width: 24, 
    backgroundColor: '#FFFFFF' 
  },
  floatingHeader: { 
    position: 'absolute', 
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  floatBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  content: {
    backgroundColor: '#F8F9FA',
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tierBadgeContainer: {
    marginBottom: 8,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  tierText: { 
    fontSize: 11, 
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  name: { 
    fontSize: 24, 
    fontFamily: 'Inter-Bold', 
    color: '#1A1A1A', 
    lineHeight: 30,
    marginBottom: 8,
  },
  metaRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 8,
  },
  reviewCount: { 
    fontSize: 13, 
    fontFamily: 'Inter-Regular',
    color: '#666666' 
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestText: { 
    fontSize: 12, 
    fontFamily: 'Inter-Medium',
    color: COLORS.primary[600] 
  },
  description: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular',
    color: '#555555', 
    lineHeight: 22,
    marginBottom: 16,
  },
  priceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
    marginBottom: 16,
  },
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#888888',
    marginBottom: 2,
  },
  price: { 
    fontSize: 28, 
    fontFamily: 'Inter-Bold', 
    color: '#1A1A1A' 
  },
  discountContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  originalPrice: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular',
    color: '#999999', 
    textDecorationLine: 'line-through' 
  },
  discountBadge: { 
    backgroundColor: '#FEE2E2', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 6,
  },
  discountText: { 
    fontSize: 11, 
    fontFamily: 'Inter-Bold', 
    color: '#EF4444' 
  },
  addOnTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  addOnTotalLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  addOnTotalValue: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary[600],
  },
  pricePerUnitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  pricePerUnitLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#888888',
  },
  pricePerUnitValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
  },
  quantitySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    minWidth: 30,
    textAlign: 'center',
  },
  section: { 
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: { 
    fontSize: 17, 
    fontFamily: 'Inter-SemiBold', 
    color: '#1A1A1A',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#888888',
  },
  categoryGroup: {
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  includesGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8,
    marginTop: 4,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  includeCheck: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: '#DCFCE7', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  includeText: { 
    fontSize: 12, 
    fontFamily: 'Inter-Medium', 
    color: '#333333', 
    flex: 1 
  },
  addOnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    minHeight: 60,
    width: '100%',
    marginBottom: 8,
  },
  addOnCardActive: {
    borderColor: COLORS.primary[500],
    backgroundColor: '#F0F7FF',
  },
  addOnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EDF5',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  addOnIconActive: {
    backgroundColor: COLORS.primary[500],
  },
  addOnBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
    minWidth: 0,
    flexWrap: 'nowrap',
  },
  addOnInfo: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
    maxWidth: '55%',
  },
  addOnName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
  },
  addOnNameActive: {
    color: COLORS.primary[600],
  },
  addOnDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#888888',
    marginTop: 2,
  },
  addOnRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    marginLeft: 'auto',
  },
  addOnPriceContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 70,
    alignItems: 'center',
  },
  addOnPriceContainerActive: {
    borderColor: COLORS.primary[300],
    backgroundColor: '#F0F7FF',
  },
  addOnPrice: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
  },
  addOnPriceActive: {
    color: COLORS.primary[600],
  },
  addOnCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  addOnCheckActive: {
    backgroundColor: COLORS.primary[500],
  },
  showMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    marginTop: 4,
  },
  showMoreText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary[600],
  },
  chevronRotated: {
    transform: [{ rotate: '90deg' }],
  },
  priceSummary: { 
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  summaryHeader: {
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 6,
  },
  summaryLabel: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular',
    color: '#666666' 
  },
  summaryValue: { 
    fontSize: 14, 
    fontFamily: 'Inter-Medium',
    color: '#1A1A1A' 
  },
  summaryDivider: { 
    height: 1, 
    backgroundColor: '#EEEEEE', 
    marginVertical: 8 
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: { 
    fontSize: 18, 
    fontFamily: 'Inter-Bold', 
    color: '#1A1A1A' 
  },
  totalValue: { 
    fontSize: 20, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.primary[600] 
  },
  breakdownText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#888888',
    textAlign: 'right',
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    ...SHADOWS.large,
    gap: 8,
  },
  bottomPrice: {
    flexDirection: 'column',
    marginRight: 8,
    minWidth: 90,
  },
  bottomPriceLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#888888',
  },
  bottomPriceValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
  },
  bottomPricePerUnit: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary[500],
  },
  outlineBtnText: {
    color: COLORS.primary[600],
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  goldBtn: {
    backgroundColor: COLORS.gold[400],
    ...SHADOWS.small,
  },
  goldBtnText: {
    color: '#1A1A1A',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});
// import { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useCart } from '@/store/cart';
// import { useWishlist } from '@/store/wishlist';
// import { useToast } from '@/store/toast';
// import { Button } from '@/components/ui/Button';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { coupons } from '@/mock/data';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function CartScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { state, removeItem, updateQty, saveForLater, applyCoupon, removeCoupon, subtotal, deliveryCharge, gst, grandTotal, totalItems } = useCart();
//   const { toggle } = useWishlist();
//   const { show } = useToast();
//   const [couponInput, setCouponInput] = useState('');
//   const [showCoupons, setShowCoupons] = useState(false);

//   const handleApplyCoupon = (code: string, discount: number, minOrder: number) => {
//     if (subtotal < minOrder) {
//       show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
//       return;
//     }
//     applyCoupon(code, discount);
//     setShowCoupons(false);
//     show('Coupon applied!');
//   };

//   const handleMoveToWishlist = (id: string, productId: string) => {
//     toggle(productId);
//     removeItem(id);
//     show('Moved to wishlist');
//   };

//   if (state.items.length === 0) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//           <Text style={styles.title}>Shopping Cart</Text>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <EmptyState
//             icon={<ShoppingBag color={COLORS.neutral[400]} size={36} />}
//             title="Your cart is empty"
//             message="Browse our premium collections and add items to your cart"
//           />
//           <View style={{ paddingHorizontal: SPACING.xl }}>
//             <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//         <Text style={styles.title}>Shopping Cart</Text>
//         <Text style={styles.subtitle}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</Text>
//       </View>

//       <FlatList
//         data={state.items}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 200 }}
//         renderItem={({ item }) => (
//           <View style={styles.cartItem}>
//             <Image source={{ uri: item.image }} style={styles.itemImage} />
//             <View style={styles.itemBody}>
//               <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
//               <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
//               <View style={styles.itemActions}>
//                 <View style={styles.qtyRow}>
//                   <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.quantity - 1)}>
//                     <Minus color={COLORS.neutral[700]} size={16} />
//                   </TouchableOpacity>
//                   <Text style={styles.qtyText}>{item.quantity}</Text>
//                   <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.quantity + 1)}>
//                     <Plus color={COLORS.neutral[700]} size={16} />
//                   </TouchableOpacity>
//                 </View>
//                 <View style={styles.itemActionBtns}>
//                   <TouchableOpacity style={styles.iconAction} onPress={() => saveForLater(item.id)}>
//                     <Heart color={COLORS.neutral[500]} size={16} />
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.iconAction} onPress={() => removeItem(item.id)}>
//                     <Trash2 color={COLORS.error} size={16} />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </View>
//         )}
//         keyExtractor={(item) => item.id}
//         ListFooterComponent={
//           <View style={styles.couponSection}>
//             {state.appliedCoupon ? (
//               <View style={styles.appliedCoupon}>
//                 <View style={styles.couponInfo}>
//                   <Tag color={COLORS.success} size={18} />
//                   <View>
//                     <Text style={styles.couponCode}>{state.appliedCoupon}</Text>
//                     <Text style={styles.couponSaved}>You saved ₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//                   </View>
//                 </View>
//                 <TouchableOpacity onPress={removeCoupon}>
//                   <X color={COLORS.neutral[500]} size={20} />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity style={styles.couponInput} onPress={() => setShowCoupons(true)}>
//                 <Tag color={COLORS.gold[500]} size={20} />
//                 <Text style={styles.couponPlaceholder}>Apply coupon code</Text>
//                 <ChevronRight color={COLORS.neutral[400]} size={20} />
//               </TouchableOpacity>
//             )}
//           </View>
//         }
//       />

//       {/* Summary */}
//       <View style={styles.summary}>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Subtotal</Text>
//           <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
//         </View>
//         {state.couponDiscount > 0 && (
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Discount</Text>
//             <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//           </View>
//         )}
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Delivery</Text>
//           <Text style={styles.summaryValue}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>GST (18%)</Text>
//           <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
//         </View>
//         <View style={styles.summaryDivider} />
//         <View style={styles.summaryRow}>
//           <Text style={styles.totalLabel}>Grand Total</Text>
//           <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
//         </View>
//         <Button onPress={() => router.push('/checkout')} fullWidth size="lg" style={{ marginTop: SPACING.md }}>
//           Proceed to Checkout
//         </Button>
//       </View>

//       {/* Coupon Sheet */}
//       {showCoupons && (
//         <View style={styles.sheetOverlay}>
//           <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCoupons(false)} />
//           <View style={styles.sheet}>
//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>Available Coupons</Text>
//               <TouchableOpacity onPress={() => setShowCoupons(false)}>
//                 <X color={COLORS.neutral[600]} size={24} />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={coupons}
//               keyExtractor={(c) => c.code}
//               renderItem={({ item }) => (
//                 <TouchableOpacity style={styles.couponCard} onPress={() => handleApplyCoupon(item.code, item.type === 'percentage' ? Math.round(subtotal * item.discount / 100) : item.discount, item.minOrder)}>
//                   <View style={styles.couponCardLeft}>
//                     <Text style={styles.couponCardCode}>{item.code}</Text>
//                     <Text style={styles.couponCardDesc}>{item.description}</Text>
//                     <Text style={styles.couponCardMin}>Min order: ₹{item.minOrder.toLocaleString('en-IN')}</Text>
//                   </View>
//                   <View style={styles.couponCardRight}>
//                     <Text style={styles.couponCardDiscount}>{item.type === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}</Text>
//                     <Text style={styles.couponCardOff}>OFF</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
//   title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
//   itemImage: { width: 90, height: 90, borderRadius: RADIUS.lg, resizeMode: 'cover' },
//   itemBody: { flex: 1, marginLeft: SPACING.md },
//   itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], lineHeight: 18 },
//   itemPrice: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
//   itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
//   qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.md, paddingHorizontal: 4 },
//   qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
//   qtyText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   itemActionBtns: { flexDirection: 'row', gap: SPACING.sm },
//   iconAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
//   couponSection: { marginTop: SPACING.md },
//   couponInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponPlaceholder: { flex: 1, fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
//   appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
//   couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
//   couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg, paddingBottom: 40, ...SHADOWS.large },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
//   summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
//   totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   sheetOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
//   sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '70%', paddingBottom: 40 },
//   sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   sheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   couponCard: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.gold[200], overflow: 'hidden' },
//   couponCardLeft: { flex: 1, padding: SPACING.md, borderRightWidth: 2, borderRightColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponCardCode: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   couponCardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4 },
//   couponCardMin: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
//   couponCardRight: { width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gold[50] },
//   couponCardDiscount: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
//   couponCardOff: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.gold[600] },
// });




// // app/(tabs)/cart.tsx
// import { useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useCart } from '@/store/cart';
// import { useAuth } from '@/store/auth';
// import { useWishlist } from '@/store/wishlist';
// import { useToast } from '@/store/toast';
// import { Button } from '@/components/ui/Button';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { coupons } from '@/mock/data';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';

// export default function CartScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { state, removeItem, updateQty, saveForLater, applyCoupon, removeCoupon, subtotal, deliveryCharge, gst, grandTotal, totalItems, clearCart, fetchCart } = useCart();
//   const { state: authState } = useAuth();
//   const { toggle } = useWishlist();
//   const { show } = useToast();
//   const [showCoupons, setShowCoupons] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [syncing, setSyncing] = useState(false);
//   const [localItems, setLocalItems] = useState<any[]>([]);

//   const customerId = authState.user?.id;

//   // ─── Load cart on mount ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (customerId) {
//       fetchCart(customerId);
//     }
//   }, [customerId]);

//   // ─── Update local items when state changes ──────────────────────────────────
//   useEffect(() => {
//     setLocalItems(state.items);
//   }, [state.items]);

//   // ─── Update Quantity ─────────────────────────────────────────────────────────
//   // ─── Update Quantity ─────────────────────────────────────────────────────────
// // In app/(tabs)/cart.tsx, update the handleUpdateQty function

// const handleUpdateQty = useCallback(async (item: any, newQuantity: number) => {
//   if (!customerId) return;
//   try {
//     setSyncing(true);
//     console.log('📦 Updating quantity:', { item, newQuantity, customerId });
    
//     if (newQuantity <= 0) {
//       // Remove item (will sync with backend)
//       await removeItem(item.id, customerId);
//       show('Item removed from cart');
//       setSyncing(false);
//       return;
//     }
    
//     // Update quantity (will sync with backend)
//     await updateQty(item.id, newQuantity, item.productId, customerId);
    
//     console.log('✅ Quantity updated successfully');
//   } catch (error) {
//     console.error('Failed to update quantity:', error);
//     show('Failed to update quantity', 'error');
//     // Revert by fetching cart again
//     await fetchCart(customerId);
//   } finally {
//     setSyncing(false);
//   }
// }, [customerId, removeItem, updateQty, show, fetchCart]);

//   // ─── Remove Item ─────────────────────────────────────────────────────────────
//   const handleRemoveItem = useCallback(async (item: any) => {
//     if (!customerId) return;
//     Alert.alert(
//       'Remove Item',
//       'Are you sure you want to remove this item?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setSyncing(true);
//               await axios.delete(`${API_BASE_URL}/cart/item`, {
//                 data: { customerId, productId: item.productId },
//               });
//               removeItem(item.id);
//               show('Item removed from cart');
//             } catch (error) {
//               console.error('Failed to remove item:', error);
//               show('Failed to remove item', 'error');
//             } finally {
//               setSyncing(false);
//             }
//           },
//         },
//       ]
//     );
//   }, [customerId, removeItem, show]);

//   // ─── Clear Cart ──────────────────────────────────────────────────────────────
//   const handleClearCart = useCallback(async () => {
//     if (!customerId) return;
//     Alert.alert(
//       'Clear Cart',
//       'Are you sure you want to clear your cart?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setSyncing(true);
//               await axios.delete(`${API_BASE_URL}/cart/${customerId}`);
//               clearCart();
//               show('Cart cleared');
//             } catch (error) {
//               console.error('Failed to clear cart:', error);
//               show('Failed to clear cart', 'error');
//             } finally {
//               setSyncing(false);
//             }
//           },
//         },
//       ]
//     );
//   }, [customerId, clearCart, show]);

//   // ─── Apply Coupon ────────────────────────────────────────────────────────────
//   const handleApplyCoupon = useCallback((code: string, discount: number, minOrder: number) => {
//     if (subtotal < minOrder) {
//       show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
//       return;
//     }
//     applyCoupon(code, discount);
//     setShowCoupons(false);
//     show('Coupon applied!');
//   }, [subtotal, applyCoupon, show]);

//   // ─── Move to Wishlist ──────────────────────────────────────────────────────
//   const handleMoveToWishlist = useCallback(async (item: any) => {
//     if (!customerId) return;
//     try {
//       setSyncing(true);
//       toggle(item.productId);
//       await axios.delete(`${API_BASE_URL}/cart/item`, {
//         data: { customerId, productId: item.productId },
//       });
//       removeItem(item.id);
//       show('Moved to wishlist');
//     } catch (error) {
//       console.error('Failed to move to wishlist:', error);
//       show('Failed to move to wishlist', 'error');
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, toggle, removeItem, show]);

//   // ─── Render item ─────────────────────────────────────────────────────────────
//   const renderItem = ({ item }: { item: any }) => (
//     <View style={styles.cartItem}>
//       <Image source={{ uri: item.image }} style={styles.itemImage} />
//       <View style={styles.itemBody}>
//         <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
//         <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
//         <View style={styles.itemActions}>
//           <View style={styles.qtyRow}>
//             <TouchableOpacity 
//               style={styles.qtyBtn} 
//               onPress={() => handleUpdateQty(item, Math.max(0, item.quantity - 1))}
//               disabled={syncing}
//             >
//               <Minus color={COLORS.neutral[700]} size={16} />
//             </TouchableOpacity>
//             <Text style={styles.qtyText}>{item.quantity}</Text>
//             <TouchableOpacity 
//               style={styles.qtyBtn} 
//               onPress={() => handleUpdateQty(item, item.quantity + 1)}
//               disabled={syncing}
//             >
//               <Plus color={COLORS.neutral[700]} size={16} />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.itemActionBtns}>
//             <TouchableOpacity 
//               style={styles.iconAction} 
//               onPress={() => handleMoveToWishlist(item)}
//               disabled={syncing}
//             >
//               <Heart color={COLORS.neutral[500]} size={16} />
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.iconAction} 
//               onPress={() => handleRemoveItem(item)}
//               disabled={syncing}
//             >
//               <Trash2 color={COLORS.error} size={16} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   if (state.items.length === 0 && !syncing) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//           <Text style={styles.title}>Shopping Cart</Text>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <EmptyState
//             icon={<ShoppingBag color={COLORS.neutral[400]} size={36} />}
//             title="Your cart is empty"
//             message="Browse our premium collections and add items to your cart"
//           />
//           <View style={{ paddingHorizontal: SPACING.xl }}>
//             <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//         <View style={styles.headerRow}>
//           <Text style={styles.title}>Shopping Cart</Text>
//           {state.items.length > 0 && (
//             <TouchableOpacity onPress={handleClearCart}>
//               <Text style={styles.clearText}>Clear All</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <Text style={styles.subtitle}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</Text>
//       </View>

//       {syncing && (
//         <View style={styles.syncingContainer}>
//           <ActivityIndicator size="small" color={COLORS.primary[600]} />
//           <Text style={styles.syncingText}>Updating cart...</Text>
//         </View>
//       )}

//       <FlatList
//         data={state.items}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 200 }}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListFooterComponent={
//           <View style={styles.couponSection}>
//             {state.appliedCoupon ? (
//               <View style={styles.appliedCoupon}>
//                 <View style={styles.couponInfo}>
//                   <Tag color={COLORS.success} size={18} />
//                   <View>
//                     <Text style={styles.couponCode}>{state.appliedCoupon}</Text>
//                     <Text style={styles.couponSaved}>You saved ₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//                   </View>
//                 </View>
//                 <TouchableOpacity onPress={removeCoupon}>
//                   <X color={COLORS.neutral[500]} size={20} />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity style={styles.couponInput} onPress={() => setShowCoupons(true)}>
//                 <Tag color={COLORS.gold[500]} size={20} />
//                 <Text style={styles.couponPlaceholder}>Apply coupon code</Text>
//                 <ChevronRight color={COLORS.neutral[400]} size={20} />
//               </TouchableOpacity>
//             )}
//           </View>
//         }
//       />

//       {/* Summary */}
//       <View style={styles.summary}>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Subtotal</Text>
//           <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
//         </View>
//         {state.couponDiscount > 0 && (
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Discount</Text>
//             <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//           </View>
//         )}
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Delivery</Text>
//           <Text style={styles.summaryValue}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>GST (18%)</Text>
//           <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
//         </View>
//         <View style={styles.summaryDivider} />
//         <View style={styles.summaryRow}>
//           <Text style={styles.totalLabel}>Grand Total</Text>
//           <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
//         </View>
//         <Button 
//           onPress={() => router.push('/checkout')} 
//           fullWidth 
//           size="lg" 
//           style={{ marginTop: SPACING.md }}
//           disabled={state.items.length === 0 || syncing}
//         >
//           Proceed to Checkout
//         </Button>
//       </View>

//       {/* Coupon Sheet */}
//       {showCoupons && (
//         <View style={styles.sheetOverlay}>
//           <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCoupons(false)} />
//           <View style={styles.sheet}>
//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>Available Coupons</Text>
//               <TouchableOpacity onPress={() => setShowCoupons(false)}>
//                 <X color={COLORS.neutral[600]} size={24} />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={coupons}
//               keyExtractor={(c) => c.code}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                   style={styles.couponCard} 
//                   onPress={() => handleApplyCoupon(
//                     item.code, 
//                     item.type === 'percentage' ? Math.round(subtotal * item.discount / 100) : item.discount, 
//                     item.minOrder
//                   )}
//                 >
//                   <View style={styles.couponCardLeft}>
//                     <Text style={styles.couponCardCode}>{item.code}</Text>
//                     <Text style={styles.couponCardDesc}>{item.description}</Text>
//                     <Text style={styles.couponCardMin}>Min order: ₹{item.minOrder.toLocaleString('en-IN')}</Text>
//                   </View>
//                   <View style={styles.couponCardRight}>
//                     <Text style={styles.couponCardDiscount}>{item.type === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}</Text>
//                     <Text style={styles.couponCardOff}>OFF</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
//   headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   clearText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.error },
//   syncingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 8 },
//   syncingText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
//   itemImage: { width: 90, height: 90, borderRadius: RADIUS.lg, resizeMode: 'cover' },
//   itemBody: { flex: 1, marginLeft: SPACING.md },
//   itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], lineHeight: 18 },
//   itemPrice: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
//   itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
//   qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.md, paddingHorizontal: 4 },
//   qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
//   qtyText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   itemActionBtns: { flexDirection: 'row', gap: SPACING.sm },
//   iconAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
//   couponSection: { marginTop: SPACING.md },
//   couponInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponPlaceholder: { flex: 1, fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
//   appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
//   couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
//   couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg, paddingBottom: 40, ...SHADOWS.large },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
//   summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
//   totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   sheetOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
//   sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '70%', paddingBottom: 40 },
//   sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   sheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   couponCard: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.gold[200], overflow: 'hidden' },
//   couponCardLeft: { flex: 1, padding: SPACING.md, borderRightWidth: 2, borderRightColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponCardCode: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   couponCardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4 },
//   couponCardMin: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
//   couponCardRight: { width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gold[50] },
//   couponCardDiscount: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
//   couponCardOff: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.gold[600] },
// });

// app/(tabs)/cart.tsx - Complete updated cart screen

// import { useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useCart } from '@/store/cart';
// import { useAuth } from '@/store/auth';
// import { useWishlist } from '@/store/wishlist';
// import { useToast } from '@/store/toast';
// import { Button } from '@/components/ui/Button';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { coupons } from '@/mock/data';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';

// export default function CartScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { state, removeItem, updateQty, saveForLater, applyCoupon, removeCoupon, subtotal, deliveryCharge, gst, grandTotal, totalItems, clearCart, fetchCart } = useCart();
//   const { state: authState } = useAuth();
//   const { toggle } = useWishlist();
//   const { show } = useToast();
//   const [showCoupons, setShowCoupons] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [syncing, setSyncing] = useState(false);
//   const [localItems, setLocalItems] = useState<any[]>([]);

//   const customerId = authState.user?.id;

//   // ─── Load cart on mount ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (customerId) {
//       fetchCart(customerId);
//     }
//   }, [customerId]);

//   // ─── Update local items when state changes ──────────────────────────────────
//   useEffect(() => {
//     setLocalItems(state.items);
//   }, [state.items]);

//   // ─── Update Quantity ─────────────────────────────────────────────────────────
//   const handleUpdateQty = useCallback(async (item: any, newQuantity: number) => {
//     if (!customerId) {
//       show('Please login to update cart', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       console.log('📦 Updating quantity:', { item, newQuantity, customerId });
      
//       if (newQuantity <= 0) {
//         // Remove item (will sync with backend)
//         await removeItem(item.id, customerId);
//         show('Item removed from cart');
//         setSyncing(false);
//         return;
//       }
      
//       // Update quantity (will sync with backend)
//       await updateQty(item.id, newQuantity, item.productId, customerId);
      
//       console.log('✅ Quantity updated successfully');
//     } catch (error) {
//       console.error('Failed to update quantity:', error);
//       show('Failed to update quantity', 'error');
//       // Revert by fetching cart again
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, removeItem, updateQty, show, fetchCart]);

//   // ─── Remove Item ─────────────────────────────────────────────────────────────
//   const handleRemoveItem = useCallback(async (item: any) => {
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     Alert.alert(
//       'Remove Item',
//       `Are you sure you want to remove "${item.name}" from your cart?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setSyncing(true);
//               console.log('📦 Removing item:', { itemId: item.id, productId: item.productId, customerId });
              
//               // Call removeItem with id and customerId
//               await removeItem(item.id, customerId);
              
//               show('Item removed from cart');
//             } catch (error) {
//               console.error('Failed to remove item:', error);
//               show('Failed to remove item', 'error');
//               // Refresh cart to ensure consistency
//               if (customerId) {
//                 await fetchCart(customerId);
//               }
//             } finally {
//               setSyncing(false);
//             }
//           },
//         },
//       ]
//     );
//   }, [customerId, removeItem, show, fetchCart]);

//   // ─── Clear Cart ──────────────────────────────────────────────────────────────
//   const handleClearCart = useCallback(async () => {
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     if (state.items.length === 0) {
//       show('Your cart is already empty', 'info');
//       return;
//     }
    
//     Alert.alert(
//       'Clear Cart',
//       'Are you sure you want to remove all items from your cart?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear All',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setSyncing(true);
//               console.log('📦 Clearing cart for customer:', customerId);
              
//               // Call clearCart with customerId
//               await clearCart(customerId);
              
//               show('Cart cleared successfully');
//             } catch (error) {
//               console.error('Failed to clear cart:', error);
//               show('Failed to clear cart', 'error');
//               // Refresh cart to ensure consistency
//               if (customerId) {
//                 await fetchCart(customerId);
//               }
//             } finally {
//               setSyncing(false);
//             }
//           },
//         },
//       ]
//     );
//   }, [customerId, clearCart, show, state.items.length, fetchCart]);

//   // ─── Apply Coupon ────────────────────────────────────────────────────────────
//   const handleApplyCoupon = useCallback((code: string, discount: number, minOrder: number) => {
//     if (subtotal < minOrder) {
//       show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
//       return;
//     }
//     applyCoupon(code, discount);
//     setShowCoupons(false);
//     show('Coupon applied!');
//   }, [subtotal, applyCoupon, show]);

//   // ─── Move to Wishlist ──────────────────────────────────────────────────────
//   const handleMoveToWishlist = useCallback(async (item: any) => {
//     if (!customerId) {
//       show('Please login to manage wishlist', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       toggle(item.productId);
//       await removeItem(item.id, customerId);
//       show('Moved to wishlist');
//     } catch (error) {
//       console.error('Failed to move to wishlist:', error);
//       show('Failed to move to wishlist', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, toggle, removeItem, show, fetchCart]);

//   // ─── Render item ─────────────────────────────────────────────────────────────
//   const renderItem = ({ item }: { item: any }) => (
//     <View style={styles.cartItem}>
//       <Image source={{ uri: item.image }} style={styles.itemImage} />
//       <View style={styles.itemBody}>
//         <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
//         <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
//         <View style={styles.itemActions}>
//           <View style={styles.qtyRow}>
//             <TouchableOpacity 
//               style={styles.qtyBtn} 
//               onPress={() => handleUpdateQty(item, Math.max(0, item.quantity - 1))}
//               disabled={syncing}
//             >
//               <Minus color={COLORS.neutral[700]} size={16} />
//             </TouchableOpacity>
//             <Text style={styles.qtyText}>{item.quantity}</Text>
//             <TouchableOpacity 
//               style={styles.qtyBtn} 
//               onPress={() => handleUpdateQty(item, item.quantity + 1)}
//               disabled={syncing}
//             >
//               <Plus color={COLORS.neutral[700]} size={16} />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.itemActionBtns}>
//             <TouchableOpacity 
//               style={styles.iconAction} 
//               onPress={() => handleMoveToWishlist(item)}
//               disabled={syncing}
//             >
//               <Heart color={COLORS.neutral[500]} size={16} />
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={styles.iconAction} 
//               onPress={() => handleRemoveItem(item)}
//               disabled={syncing}
//             >
//               <Trash2 color={COLORS.error} size={16} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   if (state.items.length === 0 && !syncing) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//           <Text style={styles.title}>Shopping Cart</Text>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <EmptyState
//             icon={<ShoppingBag color={COLORS.neutral[400]} size={36} />}
//             title="Your cart is empty"
//             message="Browse our premium collections and add items to your cart"
//           />
//           <View style={{ paddingHorizontal: SPACING.xl }}>
//             <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//         <View style={styles.headerRow}>
//           <Text style={styles.title}>Shopping Cart</Text>
//           {state.items.length > 0 && (
//             <TouchableOpacity onPress={handleClearCart} disabled={syncing}>
//               <Text style={styles.clearText}>Clear All</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <Text style={styles.subtitle}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</Text>
//       </View>

//       {syncing && (
//         <View style={styles.syncingContainer}>
//           <ActivityIndicator size="small" color={COLORS.primary[600]} />
//           <Text style={styles.syncingText}>Updating cart...</Text>
//         </View>
//       )}

//       <FlatList
//         data={state.items}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 200 }}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListFooterComponent={
//           <View style={styles.couponSection}>
//             {state.appliedCoupon ? (
//               <View style={styles.appliedCoupon}>
//                 <View style={styles.couponInfo}>
//                   <Tag color={COLORS.success} size={18} />
//                   <View>
//                     <Text style={styles.couponCode}>{state.appliedCoupon}</Text>
//                     <Text style={styles.couponSaved}>You saved ₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//                   </View>
//                 </View>
//                 <TouchableOpacity onPress={removeCoupon}>
//                   <X color={COLORS.neutral[500]} size={20} />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity style={styles.couponInput} onPress={() => setShowCoupons(true)}>
//                 <Tag color={COLORS.gold[500]} size={20} />
//                 <Text style={styles.couponPlaceholder}>Apply coupon code</Text>
//                 <ChevronRight color={COLORS.neutral[400]} size={20} />
//               </TouchableOpacity>
//             )}
//           </View>
//         }
//       />

//       {/* Summary */}
//       <View style={styles.summary}>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Subtotal</Text>
//           <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
//         </View>
//         {state.couponDiscount > 0 && (
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Discount</Text>
//             <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//           </View>
//         )}
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Delivery</Text>
//           <Text style={styles.summaryValue}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>GST (18%)</Text>
//           <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
//         </View>
//         <View style={styles.summaryDivider} />
//         <View style={styles.summaryRow}>
//           <Text style={styles.totalLabel}>Grand Total</Text>
//           <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
//         </View>
//         <Button 
//           onPress={() => router.push('/checkout')} 
//           fullWidth 
//           size="lg" 
//           style={{ marginTop: SPACING.md }}
//           disabled={state.items.length === 0 || syncing}
//         >
//           Proceed to Checkout
//         </Button>
//       </View>

//       {/* Coupon Sheet */}
//       {showCoupons && (
//         <View style={styles.sheetOverlay}>
//           <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCoupons(false)} />
//           <View style={styles.sheet}>
//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>Available Coupons</Text>
//               <TouchableOpacity onPress={() => setShowCoupons(false)}>
//                 <X color={COLORS.neutral[600]} size={24} />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={coupons}
//               keyExtractor={(c) => c.code}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                   style={styles.couponCard} 
//                   onPress={() => handleApplyCoupon(
//                     item.code, 
//                     item.type === 'percentage' ? Math.round(subtotal * item.discount / 100) : item.discount, 
//                     item.minOrder
//                   )}
//                 >
//                   <View style={styles.couponCardLeft}>
//                     <Text style={styles.couponCardCode}>{item.code}</Text>
//                     <Text style={styles.couponCardDesc}>{item.description}</Text>
//                     <Text style={styles.couponCardMin}>Min order: ₹{item.minOrder.toLocaleString('en-IN')}</Text>
//                   </View>
//                   <View style={styles.couponCardRight}>
//                     <Text style={styles.couponCardDiscount}>{item.type === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}</Text>
//                     <Text style={styles.couponCardOff}>OFF</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
//   headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   clearText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.error },
//   syncingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 8 },
//   syncingText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
//   itemImage: { width: 90, height: 90, borderRadius: RADIUS.lg, resizeMode: 'cover' },
//   itemBody: { flex: 1, marginLeft: SPACING.md },
//   itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], lineHeight: 18 },
//   itemPrice: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
//   itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
//   qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.md, paddingHorizontal: 4 },
//   qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
//   qtyText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   itemActionBtns: { flexDirection: 'row', gap: SPACING.sm },
//   iconAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
//   couponSection: { marginTop: SPACING.md },
//   couponInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponPlaceholder: { flex: 1, fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
//   appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
//   couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
//   couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg, paddingBottom: 40, ...SHADOWS.large },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
//   summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
//   totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   sheetOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
//   sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '70%', paddingBottom: 40 },
//   sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   sheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   couponCard: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.gold[200], overflow: 'hidden' },
//   couponCardLeft: { flex: 1, padding: SPACING.md, borderRightWidth: 2, borderRightColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponCardCode: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   couponCardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4 },
//   couponCardMin: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
//   couponCardRight: { width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gold[50] },
//   couponCardDiscount: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
//   couponCardOff: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.gold[600] },
// });




// // app/(tabs)/cart.tsx - Complete updated with test button
// import { useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useCart } from '@/store/cart';
// import { useAuth } from '@/store/auth';
// import { useWishlist } from '@/store/wishlist';
// import { useToast } from '@/store/toast';
// import { Button } from '@/components/ui/Button';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { coupons } from '@/mock/data';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';

// export default function CartScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { 
//     state, 
//     removeItem, 
//     updateQty, 
//     applyCoupon, 
//     removeCoupon, 
//     subtotal, 
//     deliveryCharge, 
//     gst, 
//     grandTotal, 
//     totalItems, 
//     clearCart, 
//     fetchCart 
//   } = useCart();
//   const { state: authState } = useAuth();
//   const { toggle } = useWishlist();
//   const { show } = useToast();
//   const [showCoupons, setShowCoupons] = useState(false);
//   const [syncing, setSyncing] = useState(false);

//   const customerId = authState.user?.id;

//   // ─── Load cart on mount ──────────────────────────────────────────────────────
//   useEffect(() => {
//     console.log('📦 CartScreen mounted, customerId:', customerId);
//     if (customerId) {
//       fetchCart(customerId);
//     }
//   }, [customerId]);

//   // ─── Test Direct Delete ──────────────────────────────────────────────────────
//   const testDirectDelete = useCallback(async () => {
//     if (!customerId) {
//       show('Please login first', 'error');
//       return;
//     }
    
//     console.log('🧪 TEST: Direct delete with customerId:', customerId);
//     console.log('🧪 TEST: Items in cart:', state.items);
    
//     const firstItem = state.items[0];
//     if (!firstItem) {
//       show('No items in cart', 'error');
//       return;
//     }
    
//     console.log('🧪 TEST: Deleting item:', firstItem);
    
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
//         data: { 
//           customerId: customerId, 
//           productId: firstItem.productId 
//         },
//       });
//       console.log('🧪 TEST: Delete response:', response.data);
//       show('Test delete successful!');
//       await fetchCart(customerId);
//     } catch (error: any) {
//       console.error('🧪 TEST: Delete failed:', error);
//       console.error('🧪 TEST: Error details:', error.response?.data);
//       show('Test delete failed: ' + (error.response?.data?.message || error.message), 'error');
//     }
//   }, [customerId, state.items, fetchCart, show]);

//   // ─── Update Quantity ─────────────────────────────────────────────────────────
//   const handleUpdateQty = useCallback(async (item: any, newQuantity: number) => {
//     console.log('📦 handleUpdateQty called:', { item, newQuantity, customerId });
    
//     if (!customerId) {
//       show('Please login to update cart', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
      
//       if (newQuantity <= 0) {
//         console.log('📦 Quantity is 0, removing item');
//         await removeItem(item.id, customerId);
//         show('Item removed from cart');
//         setSyncing(false);
//         return;
//       }
      
//       await updateQty(item.id, newQuantity, item.productId, customerId);
//       console.log('✅ Quantity updated successfully');
//     } catch (error) {
//       console.error('Failed to update quantity:', error);
//       show('Failed to update quantity', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, removeItem, updateQty, show, fetchCart]);

//   // ─── Remove Item ─────────────────────────────────────────────────────────────
//   const handleRemoveItem = useCallback(async (item: any) => {
//     console.log('📦 handleRemoveItem called:', { item, customerId });
    
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     Alert.alert(
//       'Remove Item',
//       `Are you sure you want to remove "${item.name}" from your cart?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setSyncing(true);
//               console.log('📦 Removing item via removeItem function:', { 
//                 itemId: item.id, 
//                 productId: item.productId, 
//                 customerId,
//                 fullItem: item 
//               });
              
//               await removeItem(item.id, customerId);
//               show('Item removed from cart');
//             } catch (error) {
//               console.error('Failed to remove item:', error);
//               show('Failed to remove item', 'error');
//               if (customerId) {
//                 await fetchCart(customerId);
//               }
//             } finally {
//               setSyncing(false);
//             }
//           },
//         },
//       ]
//     );
//   }, [customerId, removeItem, show, fetchCart]);

//   // ─── Clear Cart ──────────────────────────────────────────────────────────────
//   const handleClearCart = useCallback(async () => {
//     console.log('📦 handleClearCart called:', { customerId, itemsCount: state.items.length });
    
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     if (state.items.length === 0) {
//       show('Your cart is already empty', 'info');
//       return;
//     }
    
//     Alert.alert(
//       'Clear Cart',
//       'Are you sure you want to remove all items from your cart?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear All',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setSyncing(true);
//               console.log('📦 Clearing cart for customer:', customerId);
//               await clearCart(customerId);
//               show('Cart cleared successfully');
//             } catch (error) {
//               console.error('Failed to clear cart:', error);
//               show('Failed to clear cart', 'error');
//               if (customerId) {
//                 await fetchCart(customerId);
//               }
//             } finally {
//               setSyncing(false);
//             }
//           },
//         },
//       ]
//     );
//   }, [customerId, clearCart, show, state.items.length, fetchCart]);

//   // ─── Apply Coupon ────────────────────────────────────────────────────────────
//   const handleApplyCoupon = useCallback((code: string, discount: number, minOrder: number) => {
//     if (subtotal < minOrder) {
//       show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
//       return;
//     }
//     applyCoupon(code, discount);
//     setShowCoupons(false);
//     show('Coupon applied!');
//   }, [subtotal, applyCoupon, show]);

//   // ─── Move to Wishlist ──────────────────────────────────────────────────────
//   const handleMoveToWishlist = useCallback(async (item: any) => {
//     if (!customerId) {
//       show('Please login to manage wishlist', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       toggle(item.productId);
//       await removeItem(item.id, customerId);
//       show('Moved to wishlist');
//     } catch (error) {
//       console.error('Failed to move to wishlist:', error);
//       show('Failed to move to wishlist', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, toggle, removeItem, show, fetchCart]);

//   // ─── Render item ─────────────────────────────────────────────────────────────
//   const renderItem = ({ item }: { item: any }) => {
//     console.log('🎨 Rendering item:', item);
//     return (
//       <View style={styles.cartItem}>
//         <Image 
//           source={{ uri: item.image }} 
//           style={styles.itemImage}
//           resizeMode="cover"
//         />
//         <View style={styles.itemBody}>
//           <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
//           <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
//           <View style={styles.itemActions}>
//             <View style={styles.qtyRow}>
//               <TouchableOpacity 
//                 style={styles.qtyBtn} 
//                 onPress={() => handleUpdateQty(item, Math.max(0, item.quantity - 1))}
//                 disabled={syncing}
//               >
//                 <Minus color={COLORS.neutral[700]} size={16} />
//               </TouchableOpacity>
//               <Text style={styles.qtyText}>{item.quantity}</Text>
//               <TouchableOpacity 
//                 style={styles.qtyBtn} 
//                 onPress={() => handleUpdateQty(item, item.quantity + 1)}
//                 disabled={syncing}
//               >
//                 <Plus color={COLORS.neutral[700]} size={16} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.itemActionBtns}>
//               <TouchableOpacity 
//                 style={styles.iconAction} 
//                 onPress={() => handleMoveToWishlist(item)}
//                 disabled={syncing}
//               >
//                 <Heart color={COLORS.neutral[500]} size={16} />
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.iconAction} 
//                 onPress={() => handleRemoveItem(item)}
//                 disabled={syncing}
//               >
//                 <Trash2 color={COLORS.error} size={16} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   if (state.items.length === 0 && !syncing) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//           <Text style={styles.title}>Shopping Cart</Text>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <EmptyState
//             icon={<ShoppingBag color={COLORS.neutral[400]} size={36} />}
//             title="Your cart is empty"
//             message="Browse our premium collections and add items to your cart"
//           />
//           <View style={{ paddingHorizontal: SPACING.xl }}>
//             <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//         <View style={styles.headerRow}>
//           <Text style={styles.title}>Shopping Cart</Text>
//           <View style={{ flexDirection: 'row', gap: 10 }}>
//             <TouchableOpacity onPress={testDirectDelete}>
//               <Text style={[styles.clearText, { color: COLORS.primary[600] }]}>Test Delete</Text>
//             </TouchableOpacity>
//             {state.items.length > 0 && (
//               <TouchableOpacity onPress={handleClearCart} disabled={syncing}>
//                 <Text style={styles.clearText}>Clear All</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//         <Text style={styles.subtitle}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</Text>
//       </View>

//       {syncing && (
//         <View style={styles.syncingContainer}>
//           <ActivityIndicator size="small" color={COLORS.primary[600]} />
//           <Text style={styles.syncingText}>Updating cart...</Text>
//         </View>
//       )}

//       <FlatList
//         data={state.items}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 200 }}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListFooterComponent={
//           <View style={styles.couponSection}>
//             {state.appliedCoupon ? (
//               <View style={styles.appliedCoupon}>
//                 <View style={styles.couponInfo}>
//                   <Tag color={COLORS.success} size={18} />
//                   <View>
//                     <Text style={styles.couponCode}>{state.appliedCoupon}</Text>
//                     <Text style={styles.couponSaved}>You saved ₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//                   </View>
//                 </View>
//                 <TouchableOpacity onPress={removeCoupon}>
//                   <X color={COLORS.neutral[500]} size={20} />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity style={styles.couponInput} onPress={() => setShowCoupons(true)}>
//                 <Tag color={COLORS.gold[500]} size={20} />
//                 <Text style={styles.couponPlaceholder}>Apply coupon code</Text>
//                 <ChevronRight color={COLORS.neutral[400]} size={20} />
//               </TouchableOpacity>
//             )}
//           </View>
//         }
//       />

//       {/* Summary */}
//       <View style={styles.summary}>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Subtotal</Text>
//           <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
//         </View>
//         {state.couponDiscount > 0 && (
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Discount</Text>
//             <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//           </View>
//         )}
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Delivery</Text>
//           <Text style={styles.summaryValue}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>GST (18%)</Text>
//           <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
//         </View>
//         <View style={styles.summaryDivider} />
//         <View style={styles.summaryRow}>
//           <Text style={styles.totalLabel}>Grand Total</Text>
//           <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
//         </View>
//         <Button 
//           onPress={() => router.push('/checkout')} 
//           fullWidth 
//           size="lg" 
//           style={{ marginTop: SPACING.md }}
//           disabled={state.items.length === 0 || syncing}
//         >
//           Proceed to Checkout
//         </Button>
//       </View>

//       {/* Coupon Sheet */}
//       {showCoupons && (
//         <View style={styles.sheetOverlay}>
//           <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCoupons(false)} />
//           <View style={styles.sheet}>
//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>Available Coupons</Text>
//               <TouchableOpacity onPress={() => setShowCoupons(false)}>
//                 <X color={COLORS.neutral[600]} size={24} />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={coupons}
//               keyExtractor={(c) => c.code}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                   style={styles.couponCard} 
//                   onPress={() => handleApplyCoupon(
//                     item.code, 
//                     item.type === 'percentage' ? Math.round(subtotal * item.discount / 100) : item.discount, 
//                     item.minOrder
//                   )}
//                 >
//                   <View style={styles.couponCardLeft}>
//                     <Text style={styles.couponCardCode}>{item.code}</Text>
//                     <Text style={styles.couponCardDesc}>{item.description}</Text>
//                     <Text style={styles.couponCardMin}>Min order: ₹{item.minOrder.toLocaleString('en-IN')}</Text>
//                   </View>
//                   <View style={styles.couponCardRight}>
//                     <Text style={styles.couponCardDiscount}>{item.type === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}</Text>
//                     <Text style={styles.couponCardOff}>OFF</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
//   headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   clearText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.error },
//   syncingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 8 },
//   syncingText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
//   itemImage: { width: 90, height: 90, borderRadius: RADIUS.lg },
//   itemBody: { flex: 1, marginLeft: SPACING.md },
//   itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], lineHeight: 18 },
//   itemPrice: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
//   itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
//   qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.md, paddingHorizontal: 4 },
//   qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
//   qtyText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   itemActionBtns: { flexDirection: 'row', gap: SPACING.sm },
//   iconAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
//   couponSection: { marginTop: SPACING.md },
//   couponInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponPlaceholder: { flex: 1, fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
//   appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
//   couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
//   couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg, paddingBottom: 40, ...SHADOWS.large },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
//   summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
//   totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   sheetOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
//   sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '70%', paddingBottom: 40 },
//   sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   sheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   couponCard: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.gold[200], overflow: 'hidden' },
//   couponCardLeft: { flex: 1, padding: SPACING.md, borderRightWidth: 2, borderRightColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponCardCode: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   couponCardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4 },
//   couponCardMin: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
//   couponCardRight: { width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gold[50] },
//   couponCardDiscount: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
//   couponCardOff: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.gold[600] },
// });



// // app/(tabs)/cart.tsx
// import { useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useCart } from '@/store/cart';
// import { useAuth } from '@/store/auth';
// import { useWishlist } from '@/store/wishlist';
// import { useToast } from '@/store/toast';
// import { Button } from '@/components/ui/Button';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { coupons } from '@/mock/data';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';

// export default function CartScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { 
//     state, 
//     removeItem, 
//     updateQty, 
//     applyCoupon, 
//     removeCoupon, 
//     subtotal, 
//     deliveryCharge, 
//     gst, 
//     grandTotal, 
//     totalItems, 
//     clearCart, 
//     fetchCart 
//   } = useCart();
//   const { state: authState } = useAuth();
//   const { toggle } = useWishlist();
//   const { show } = useToast();
//   const [showCoupons, setShowCoupons] = useState(false);
//   const [syncing, setSyncing] = useState(false);

//   const customerId = authState.user?.id;

//   // ─── Load cart on mount ──────────────────────────────────────────────────────
//   useEffect(() => {
//     console.log('📦 CartScreen mounted, customerId:', customerId);
//     if (customerId) {
//       fetchCart(customerId);
//     }
//   }, [customerId]);

//   // ─── Test Direct Delete ──────────────────────────────────────────────────────
//   const testDirectDelete = useCallback(async () => {
//     if (!customerId) {
//       show('Please login first', 'error');
//       return;
//     }
    
//     console.log('🧪 TEST: Direct delete with customerId:', customerId);
//     console.log('🧪 TEST: Items in cart:', state.items);
    
//     const firstItem = state.items[0];
//     if (!firstItem) {
//       show('No items in cart', 'error');
//       return;
//     }
    
//     console.log('🧪 TEST: Deleting item:', firstItem);
    
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
//         data: { 
//           customerId: customerId, 
//           productId: firstItem.productId 
//         },
//       });
//       console.log('🧪 TEST: Delete response:', response.data);
//       show('Test delete successful!');
//       await fetchCart(customerId);
//     } catch (error: any) {
//       console.error('🧪 TEST: Delete failed:', error);
//       console.error('🧪 TEST: Error details:', error.response?.data);
//       show('Test delete failed: ' + (error.response?.data?.message || error.message), 'error');
//     }
//   }, [customerId, state.items, fetchCart, show]);

//   // ─── FIXED: Direct Delete Function (No alert for testing) ────────────────────
//   const directDeleteItem = useCallback(async (item: any) => {
//     console.log('🗑️ Direct delete called for item:', item);
    
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       console.log('🗑️ Direct deleting:', { 
//         customerId: customerId, 
//         productId: item.productId,
//         url: `${API_BASE_URL}/cart/item`
//       });
      
//       // Direct API call - same as test delete
//       const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
//         data: { 
//           customerId: customerId, 
//           productId: item.productId 
//         },
//       });
      
//       console.log('🗑️ Delete response status:', response.status);
//       console.log('🗑️ Delete response data:', response.data);
      
//       if (response.data.success) {
//         // Also update local state
//         removeItem(item.id);
//         await fetchCart(customerId);
//         show('Item removed from cart');
//         console.log('✅ Item deleted successfully');
//       } else {
//         console.log('❌ Delete failed:', response.data);
//         show('Failed to remove item', 'error');
//       }
//     } catch (error: any) {
//       console.error('❌ Failed to delete item:', error);
//       console.error('❌ Error details:', error.response?.data || error.message);
//       console.error('❌ Error status:', error.response?.status);
//       show('Failed to remove item', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, removeItem, fetchCart, show]);

//   // ─── Update Quantity ─────────────────────────────────────────────────────────
//   const handleUpdateQty = useCallback(async (item: any, newQuantity: number) => {
//     console.log('📦 handleUpdateQty called:', { item, newQuantity, customerId });
    
//     if (!customerId) {
//       show('Please login to update cart', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
      
//       if (newQuantity <= 0) {
//         console.log('📦 Quantity is 0, removing item');
//         await directDeleteItem(item);
//         setSyncing(false);
//         return;
//       }
      
//       await updateQty(item.id, newQuantity, item.productId, customerId);
//       console.log('✅ Quantity updated successfully');
//     } catch (error) {
//       console.error('Failed to update quantity:', error);
//       show('Failed to update quantity', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, updateQty, show, fetchCart, directDeleteItem]);

//   // ─── Clear Cart ──────────────────────────────────────────────────────────────
//   const handleClearCart = useCallback(async () => {
//     console.log('📦 handleClearCart called:', { customerId, itemsCount: state.items.length });
    
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     if (state.items.length === 0) {
//       show('Your cart is already empty', 'info');
//       return;
//     }
    
//     Alert.alert(
//       'Clear Cart',
//       'Are you sure you want to remove all items from your cart?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear All',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setSyncing(true);
//               console.log('📦 Clearing cart for customer:', customerId);
//               await clearCart(customerId);
//               show('Cart cleared successfully');
//             } catch (error) {
//               console.error('Failed to clear cart:', error);
//               show('Failed to clear cart', 'error');
//               if (customerId) {
//                 await fetchCart(customerId);
//               }
//             } finally {
//               setSyncing(false);
//             }
//           },
//         },
//       ]
//     );
//   }, [customerId, clearCart, show, state.items.length, fetchCart]);

//   // ─── Apply Coupon ────────────────────────────────────────────────────────────
//   const handleApplyCoupon = useCallback((code: string, discount: number, minOrder: number) => {
//     if (subtotal < minOrder) {
//       show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
//       return;
//     }
//     applyCoupon(code, discount);
//     setShowCoupons(false);
//     show('Coupon applied!');
//   }, [subtotal, applyCoupon, show]);

//   // ─── Move to Wishlist ──────────────────────────────────────────────────────
//   const handleMoveToWishlist = useCallback(async (item: any) => {
//     if (!customerId) {
//       show('Please login to manage wishlist', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       toggle(item.productId);
//       await directDeleteItem(item);
//       show('Moved to wishlist');
//     } catch (error) {
//       console.error('Failed to move to wishlist:', error);
//       show('Failed to move to wishlist', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, toggle, directDeleteItem, show, fetchCart]);

//   // ─── Render item ─────────────────────────────────────────────────────────────
//   const renderItem = ({ item }: { item: any }) => {
//     console.log('🎨 Rendering item:', { id: item.id, productId: item.productId, name: item.name });
//     return (
//       <View style={styles.cartItem}>
//         <Image 
//           source={{ uri: item.image }} 
//           style={styles.itemImage}
//           resizeMode="cover"
//         />
//         <View style={styles.itemBody}>
//           <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
//           <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
//           <View style={styles.itemActions}>
//             <View style={styles.qtyRow}>
//               <TouchableOpacity 
//                 style={styles.qtyBtn} 
//                 onPress={() => handleUpdateQty(item, Math.max(0, item.quantity - 1))}
//                 disabled={syncing}
//               >
//                 <Minus color={COLORS.neutral[700]} size={16} />
//               </TouchableOpacity>
//               <Text style={styles.qtyText}>{item.quantity}</Text>
//               <TouchableOpacity 
//                 style={styles.qtyBtn} 
//                 onPress={() => handleUpdateQty(item, item.quantity + 1)}
//                 disabled={syncing}
//               >
//                 <Plus color={COLORS.neutral[700]} size={16} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.itemActionBtns}>
//               <TouchableOpacity 
//                 style={styles.iconAction} 
//                 onPress={() => handleMoveToWishlist(item)}
//                 disabled={syncing}
//               >
//                 <Heart color={COLORS.neutral[500]} size={16} />
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.iconAction} 
//                 onPress={() => {
//                   console.log('🗑️ Trash icon pressed for item:', item);
//                   directDeleteItem(item);
//                 }}
//                 disabled={syncing}
//               >
//                 <Trash2 color={COLORS.error} size={16} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   if (state.items.length === 0 && !syncing) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//           <Text style={styles.title}>Shopping Cart</Text>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <EmptyState
//             icon={<ShoppingBag color={COLORS.neutral[400]} size={36} />}
//             title="Your cart is empty"
//             message="Browse our premium collections and add items to your cart"
//           />
//           <View style={{ paddingHorizontal: SPACING.xl }}>
//             <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//         <View style={styles.headerRow}>
//           <Text style={styles.title}>Shopping Cart</Text>
//           <View style={{ flexDirection: 'row', gap: 10 }}>
//             {/* <TouchableOpacity onPress={testDirectDelete}>
//               <Text style={[styles.clearText, { color: COLORS.primary[600] }]}>Test Delete</Text>
//             </TouchableOpacity> */}
//             {state.items.length > 0 && (
//               <TouchableOpacity onPress={handleClearCart} disabled={syncing}>
//                 <Text style={styles.clearText}>Clear All</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//         <Text style={styles.subtitle}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</Text>
//       </View>

//       {syncing && (
//         <View style={styles.syncingContainer}>
//           <ActivityIndicator size="small" color={COLORS.primary[600]} />
//           <Text style={styles.syncingText}>Updating cart...</Text>
//         </View>
//       )}

//       <FlatList
//         data={state.items}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 200 }}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListFooterComponent={
//           <View style={styles.couponSection}>
//             {state.appliedCoupon ? (
//               <View style={styles.appliedCoupon}>
//                 <View style={styles.couponInfo}>
//                   <Tag color={COLORS.success} size={18} />
//                   <View>
//                     <Text style={styles.couponCode}>{state.appliedCoupon}</Text>
//                     <Text style={styles.couponSaved}>You saved ₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//                   </View>
//                 </View>
//                 <TouchableOpacity onPress={removeCoupon}>
//                   <X color={COLORS.neutral[500]} size={20} />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity style={styles.couponInput} onPress={() => setShowCoupons(true)}>
//                 <Tag color={COLORS.gold[500]} size={20} />
//                 <Text style={styles.couponPlaceholder}>Apply coupon code</Text>
//                 <ChevronRight color={COLORS.neutral[400]} size={20} />
//               </TouchableOpacity>
//             )}
//           </View>
//         }
//       />

//       {/* Summary */}
//       <View style={styles.summary}>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Subtotal</Text>
//           <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
//         </View>
//         {state.couponDiscount > 0 && (
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Discount</Text>
//             <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//           </View>
//         )}
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Delivery</Text>
//           <Text style={styles.summaryValue}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>GST (18%)</Text>
//           <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
//         </View>
//         <View style={styles.summaryDivider} />
//         <View style={styles.summaryRow}>
//           <Text style={styles.totalLabel}>Grand Total</Text>
//           <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
//         </View>
//         <Button 
//           onPress={() => router.push('/checkout')} 
//           fullWidth 
//           size="lg" 
//           style={{ marginTop: SPACING.md }}
//           disabled={state.items.length === 0 || syncing}
//         >
//           Proceed to Checkout
//         </Button>
//       </View>

//       {/* Coupon Sheet */}
//       {showCoupons && (
//         <View style={styles.sheetOverlay}>
//           <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCoupons(false)} />
//           <View style={styles.sheet}>
//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>Available Coupons</Text>
//               <TouchableOpacity onPress={() => setShowCoupons(false)}>
//                 <X color={COLORS.neutral[600]} size={24} />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={coupons}
//               keyExtractor={(c) => c.code}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                   style={styles.couponCard} 
//                   onPress={() => handleApplyCoupon(
//                     item.code, 
//                     item.type === 'percentage' ? Math.round(subtotal * item.discount / 100) : item.discount, 
//                     item.minOrder
//                   )}
//                 >
//                   <View style={styles.couponCardLeft}>
//                     <Text style={styles.couponCardCode}>{item.code}</Text>
//                     <Text style={styles.couponCardDesc}>{item.description}</Text>
//                     <Text style={styles.couponCardMin}>Min order: ₹{item.minOrder.toLocaleString('en-IN')}</Text>
//                   </View>
//                   <View style={styles.couponCardRight}>
//                     <Text style={styles.couponCardDiscount}>{item.type === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}</Text>
//                     <Text style={styles.couponCardOff}>OFF</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
//   headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   clearText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.error },
//   syncingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 8 },
//   syncingText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
//   itemImage: { width: 90, height: 90, borderRadius: RADIUS.lg },
//   itemBody: { flex: 1, marginLeft: SPACING.md },
//   itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], lineHeight: 18 },
//   itemPrice: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
//   itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
//   qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.md, paddingHorizontal: 4 },
//   qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
//   qtyText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   itemActionBtns: { flexDirection: 'row', gap: SPACING.sm },
//   iconAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
//   couponSection: { marginTop: SPACING.md },
//   couponInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponPlaceholder: { flex: 1, fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
//   appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
//   couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
//   couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg, paddingBottom: 40, ...SHADOWS.large },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
//   summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
//   totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   sheetOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
//   sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '70%', paddingBottom: 40 },
//   sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   sheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   couponCard: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.gold[200], overflow: 'hidden' },
//   couponCardLeft: { flex: 1, padding: SPACING.md, borderRightWidth: 2, borderRightColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponCardCode: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   couponCardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4 },
//   couponCardMin: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
//   couponCardRight: { width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gold[50] },
//   couponCardDiscount: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
//   couponCardOff: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.gold[600] },
// });





// // app/(tabs)/cart.tsx
// import { useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useCart } from '@/store/cart';
// import { useAuth } from '@/store/auth';
// import { useWishlist } from '@/store/wishlist';
// import { useToast } from '@/store/toast';
// import { Button } from '@/components/ui/Button';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { coupons } from '@/mock/data';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';

// export default function CartScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { 
//     state, 
//     removeItem, 
//     updateQty, 
//     applyCoupon, 
//     removeCoupon, 
//     subtotal, 
//     deliveryCharge, 
//     gst, 
//     grandTotal, 
//     totalItems, 
//     clearCart, 
//     fetchCart 
//   } = useCart();
//   const { state: authState } = useAuth();
//   const { toggle } = useWishlist();
//   const { show } = useToast();
//   const [showCoupons, setShowCoupons] = useState(false);
//   const [syncing, setSyncing] = useState(false);

//   const customerId = authState.user?.id;

//   // ─── Load cart on mount ──────────────────────────────────────────────────────
//   useEffect(() => {
//     console.log('📦 CartScreen mounted, customerId:', customerId);
//     if (customerId) {
//       fetchCart(customerId);
//     }
//   }, [customerId]);

//   // ─── Test Direct Delete ──────────────────────────────────────────────────────
//   const testDirectDelete = useCallback(async () => {
//     if (!customerId) {
//       show('Please login first', 'error');
//       return;
//     }
    
//     console.log('🧪 TEST: Direct delete with customerId:', customerId);
//     console.log('🧪 TEST: Items in cart:', state.items);
    
//     const firstItem = state.items[0];
//     if (!firstItem) {
//       show('No items in cart', 'error');
//       return;
//     }
    
//     console.log('🧪 TEST: Deleting item:', firstItem);
    
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
//         data: { 
//           customerId: customerId, 
//           productId: firstItem.productId 
//         },
//       });
//       console.log('🧪 TEST: Delete response:', response.data);
//       show('Test delete successful!');
//       await fetchCart(customerId);
//     } catch (error: any) {
//       console.error('🧪 TEST: Delete failed:', error);
//       console.error('🧪 TEST: Error details:', error.response?.data);
//       show('Test delete failed: ' + (error.response?.data?.message || error.message), 'error');
//     }
//   }, [customerId, state.items, fetchCart, show]);

//   // ─── Direct Delete Function ──────────────────────────────────────────────────
//   const directDeleteItem = useCallback(async (item: any) => {
//     console.log('🗑️ Direct delete called for item:', item);
    
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       console.log('🗑️ Direct deleting:', { 
//         customerId: customerId, 
//         productId: item.productId,
//         url: `${API_BASE_URL}/cart/item`
//       });
      
//       const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
//         data: { 
//           customerId: customerId, 
//           productId: item.productId 
//         },
//       });
      
//       console.log('🗑️ Delete response:', response.data);
      
//       if (response.data.success) {
//         removeItem(item.id);
//         await fetchCart(customerId);
//         show('Item removed from cart');
//       } else {
//         show('Failed to remove item', 'error');
//       }
//     } catch (error: any) {
//       console.error('❌ Failed to delete item:', error);
//       show('Failed to remove item', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, removeItem, fetchCart, show]);

//   // ─── Direct Clear Cart Function ─────────────────────────────────────────────
//   const directClearCart = useCallback(async () => {
//     console.log('🗑️ Direct clear cart called');
    
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     if (state.items.length === 0) {
//       show('Your cart is already empty', 'info');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       console.log('🗑️ Direct clearing cart:', { 
//         customerId: customerId,
//         url: `${API_BASE_URL}/cart/${customerId}`
//       });
      
//       const response = await axios.delete(`${API_BASE_URL}/cart/${customerId}`);
      
//       console.log('🗑️ Clear cart response status:', response.status);
//       console.log('🗑️ Clear cart response data:', response.data);
      
//       if (response.data.success) {
//         // Clear local state
//         clearCart();
//         await fetchCart(customerId);
//         show('Cart cleared successfully');
//         console.log('✅ Cart cleared successfully');
//       } else {
//         console.log('❌ Clear cart failed:', response.data);
//         show('Failed to clear cart', 'error');
//         // Refresh cart to ensure consistency
//         await fetchCart(customerId);
//       }
//     } catch (error: any) {
//       console.error('❌ Failed to clear cart:', error);
//       console.error('❌ Error details:', error.response?.data || error.message);
//       console.error('❌ Error status:', error.response?.status);
//       show('Failed to clear cart', 'error');
//       // Refresh cart to ensure consistency
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, state.items.length, clearCart, fetchCart, show]);

//   // ─── Update Quantity ─────────────────────────────────────────────────────────
//   const handleUpdateQty = useCallback(async (item: any, newQuantity: number) => {
//     console.log('📦 handleUpdateQty called:', { item, newQuantity, customerId });
    
//     if (!customerId) {
//       show('Please login to update cart', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
      
//       if (newQuantity <= 0) {
//         console.log('📦 Quantity is 0, removing item');
//         await directDeleteItem(item);
//         setSyncing(false);
//         return;
//       }
      
//       await updateQty(item.id, newQuantity, item.productId, customerId);
//       console.log('✅ Quantity updated successfully');
//     } catch (error) {
//       console.error('Failed to update quantity:', error);
//       show('Failed to update quantity', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, updateQty, show, fetchCart, directDeleteItem]);

//   // ─── Clear Cart - FIXED (Direct clear for testing) ──────────────────────────
//   const handleClearCart = useCallback(async () => {
//     console.log('📦 handleClearCart called:', { customerId, itemsCount: state.items.length });
    
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     if (state.items.length === 0) {
//       show('Your cart is already empty', 'info');
//       return;
//     }
    
//     // Direct clear without alert for testing
//     console.log('🗑️ Calling directClearCart...');
//     await directClearCart();
//   }, [customerId, state.items.length, directClearCart, show]);

//   // ─── Apply Coupon ────────────────────────────────────────────────────────────
//   const handleApplyCoupon = useCallback((code: string, discount: number, minOrder: number) => {
//     if (subtotal < minOrder) {
//       show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
//       return;
//     }
//     applyCoupon(code, discount);
//     setShowCoupons(false);
//     show('Coupon applied!');
//   }, [subtotal, applyCoupon, show]);

//   // ─── Move to Wishlist ──────────────────────────────────────────────────────
//   const handleMoveToWishlist = useCallback(async (item: any) => {
//     if (!customerId) {
//       show('Please login to manage wishlist', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       toggle(item.productId);
//       await directDeleteItem(item);
//       show('Moved to wishlist');
//     } catch (error) {
//       console.error('Failed to move to wishlist:', error);
//       show('Failed to move to wishlist', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, toggle, directDeleteItem, show, fetchCart]);

//   // ─── Render item ─────────────────────────────────────────────────────────────
//   const renderItem = ({ item }: { item: any }) => {
//     console.log('🎨 Rendering item:', { id: item.id, productId: item.productId, name: item.name });
//     return (
//       <View style={styles.cartItem}>
//         <Image 
//           source={{ uri: item.image }} 
//           style={styles.itemImage}
//           resizeMode="cover"
//         />
//         <View style={styles.itemBody}>
//           <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
//           <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
//           <View style={styles.itemActions}>
//             <View style={styles.qtyRow}>
//               <TouchableOpacity 
//                 style={styles.qtyBtn} 
//                 onPress={() => handleUpdateQty(item, Math.max(0, item.quantity - 1))}
//                 disabled={syncing}
//               >
//                 <Minus color={COLORS.neutral[700]} size={16} />
//               </TouchableOpacity>
//               <Text style={styles.qtyText}>{item.quantity}</Text>
//               <TouchableOpacity 
//                 style={styles.qtyBtn} 
//                 onPress={() => handleUpdateQty(item, item.quantity + 1)}
//                 disabled={syncing}
//               >
//                 <Plus color={COLORS.neutral[700]} size={16} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.itemActionBtns}>
//               <TouchableOpacity 
//                 style={styles.iconAction} 
//                 onPress={() => handleMoveToWishlist(item)}
//                 disabled={syncing}
//               >
//                 <Heart color={COLORS.neutral[500]} size={16} />
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.iconAction} 
//                 onPress={() => {
//                   console.log('🗑️ Trash icon pressed for item:', item);
//                   directDeleteItem(item);
//                 }}
//                 disabled={syncing}
//               >
//                 <Trash2 color={COLORS.error} size={16} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   if (state.items.length === 0 && !syncing) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//           <Text style={styles.title}>Shopping Cart</Text>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <EmptyState
//             icon={<ShoppingBag color={COLORS.neutral[400]} size={36} />}
//             title="Your cart is empty"
//             message="Browse our premium collections and add items to your cart"
//           />
//           <View style={{ paddingHorizontal: SPACING.xl }}>
//             <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
//         <View style={styles.headerRow}>
//           <Text style={styles.title}>Shopping Cart</Text>
//           <View style={{ flexDirection: 'row', gap: 10 }}>
//             {/* <TouchableOpacity onPress={testDirectDelete}>
//               <Text style={[styles.clearText, { color: COLORS.primary[600] }]}>Test Delete</Text>
//             </TouchableOpacity> */}
//             {state.items.length > 0 && (
//               <TouchableOpacity onPress={handleClearCart} disabled={syncing}>
//                 <Text style={styles.clearText}>Clear All</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//         <Text style={styles.subtitle}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</Text>
//       </View>

//       {syncing && (
//         <View style={styles.syncingContainer}>
//           <ActivityIndicator size="small" color={COLORS.primary[600]} />
//           <Text style={styles.syncingText}>Updating cart...</Text>
//         </View>
//       )}

//       <FlatList
//         data={state.items}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 200 }}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListFooterComponent={
//           <View style={styles.couponSection}>
//             {state.appliedCoupon ? (
//               <View style={styles.appliedCoupon}>
//                 <View style={styles.couponInfo}>
//                   <Tag color={COLORS.success} size={18} />
//                   <View>
//                     <Text style={styles.couponCode}>{state.appliedCoupon}</Text>
//                     <Text style={styles.couponSaved}>You saved ₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//                   </View>
//                 </View>
//                 <TouchableOpacity onPress={removeCoupon}>
//                   <X color={COLORS.neutral[500]} size={20} />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity style={styles.couponInput} onPress={() => setShowCoupons(true)}>
//                 <Tag color={COLORS.gold[500]} size={20} />
//                 <Text style={styles.couponPlaceholder}>Apply coupon code</Text>
//                 <ChevronRight color={COLORS.neutral[400]} size={20} />
//               </TouchableOpacity>
//             )}
//           </View>
//         }
//       />

//       {/* Summary */}
//       <View style={styles.summary}>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Subtotal</Text>
//           <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
//         </View>
//         {state.couponDiscount > 0 && (
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Discount</Text>
//             <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//           </View>
//         )}
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>Delivery</Text>
//           <Text style={styles.summaryValue}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</Text>
//         </View>
//         <View style={styles.summaryRow}>
//           <Text style={styles.summaryLabel}>GST (18%)</Text>
//           <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
//         </View>
//         <View style={styles.summaryDivider} />
//         <View style={styles.summaryRow}>
//           <Text style={styles.totalLabel}>Grand Total</Text>
//           <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
//         </View>
//         <Button 
//           onPress={() => router.push('/checkout')} 
//           fullWidth 
//           size="lg" 
//           style={{ marginTop: SPACING.md }}
//           disabled={state.items.length === 0 || syncing}
//         >
//           Proceed to Checkout
//         </Button>
//       </View>

//       {/* Coupon Sheet */}
//       {showCoupons && (
//         <View style={styles.sheetOverlay}>
//           <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCoupons(false)} />
//           <View style={styles.sheet}>
//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>Available Coupons</Text>
//               <TouchableOpacity onPress={() => setShowCoupons(false)}>
//                 <X color={COLORS.neutral[600]} size={24} />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={coupons}
//               keyExtractor={(c) => c.code}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                   style={styles.couponCard} 
//                   onPress={() => handleApplyCoupon(
//                     item.code, 
//                     item.type === 'percentage' ? Math.round(subtotal * item.discount / 100) : item.discount, 
//                     item.minOrder
//                   )}
//                 >
//                   <View style={styles.couponCardLeft}>
//                     <Text style={styles.couponCardCode}>{item.code}</Text>
//                     <Text style={styles.couponCardDesc}>{item.description}</Text>
//                     <Text style={styles.couponCardMin}>Min order: ₹{item.minOrder.toLocaleString('en-IN')}</Text>
//                   </View>
//                   <View style={styles.couponCardRight}>
//                     <Text style={styles.couponCardDiscount}>{item.type === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}</Text>
//                     <Text style={styles.couponCardOff}>OFF</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
//   headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   clearText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.error },
//   syncingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 8 },
//   syncingText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
//   itemImage: { width: 90, height: 90, borderRadius: RADIUS.lg },
//   itemBody: { flex: 1, marginLeft: SPACING.md },
//   itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], lineHeight: 18 },
//   itemPrice: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
//   itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
//   qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.md, paddingHorizontal: 4 },
//   qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
//   qtyText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   itemActionBtns: { flexDirection: 'row', gap: SPACING.sm },
//   iconAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
//   couponSection: { marginTop: SPACING.md },
//   couponInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponPlaceholder: { flex: 1, fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
//   appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
//   couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
//   couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg, paddingBottom: 40, ...SHADOWS.large },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
//   summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
//   totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   sheetOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
//   sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '70%', paddingBottom: 40 },
//   sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   sheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   couponCard: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.gold[200], overflow: 'hidden' },
//   couponCardLeft: { flex: 1, padding: SPACING.md, borderRightWidth: 2, borderRightColor: COLORS.gold[200], borderStyle: 'dashed' },
//   couponCardCode: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   couponCardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4 },
//   couponCardMin: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
//   couponCardRight: { width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gold[50] },
//   couponCardDiscount: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
//   couponCardOff: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.gold[600] },
// });




// app/(tabs)/cart.tsx
import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { useWishlist } from '@/store/wishlist';
import { useToast } from '@/store/toast';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';

// ─── Types ──────────────────────────────────────────────────────────────────────
interface Coupon {
  id: number;
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { 
    state, 
    removeItem, 
    updateQty, 
    applyCoupon, 
    removeCoupon, 
    subtotal, 
    deliveryCharge, 
    gst, 
    grandTotal, 
    totalItems, 
    clearCart, 
    fetchCart 
  } = useCart();
  const { state: authState } = useAuth();
  const { toggle } = useWishlist();
  const { show } = useToast();
  const [showCoupons, setShowCoupons] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  const customerId = authState.user?.id;

  // ─── Load cart and coupons on mount ─────────────────────────────────────────
  useEffect(() => {
    console.log('📦 CartScreen mounted, customerId:', customerId);
    if (customerId) {
      fetchCart(customerId);
      fetchAvailableCoupons();
    }
  }, [customerId]);

  // ─── Fetch available coupons from API ──────────────────────────────────────
 // ─── Fetch available coupons from API ──────────────────────────────────────
const fetchAvailableCoupons = useCallback(async () => {
  try {
    setLoadingCoupons(true);
    console.log('📦 Fetching available coupons from:', `${API_BASE_URL}/coupons/active`);
    // Remove /api from URL - API_BASE_URL already includes it
    const response = await axios.get(`${API_BASE_URL}/coupons/active`);
    console.log('📦 Coupons response:', response.data);
    
    if (response.data.success) {
      setAvailableCoupons(response.data.data);
      console.log('✅ Coupons loaded:', response.data.data.length);
    } else {
      console.log('❌ Failed to load coupons:', response.data.message);
    }
  } catch (error: any) {
    console.error('❌ Failed to fetch coupons:', error);
    // Don't show error to user, just use fallback
  } finally {
    setLoadingCoupons(false);
  }
}, []);

// ─── Validate and apply coupon ─────────────────────────────────────────────
const handleApplyCoupon = useCallback(async (code: string, discount: number, minOrder: number) => {
  if (subtotal < minOrder) {
    show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
    return;
  }

  try {
    setSyncing(true);
    
    // Validate coupon with backend - remove /api from URL
    const validateResponse = await axios.post(`${API_BASE_URL}/coupons/validate`, {
      code: code,
      subtotal: subtotal,
      customerId: customerId
    });

    if (!validateResponse.data.success) {
      show(validateResponse.data.message || 'Invalid coupon', 'error');
      return;
    }

    // Apply coupon on backend - remove /api from URL
    await axios.post(`${API_BASE_URL}/coupons/apply`, {
      code: code,
      customerId: customerId
    });

    // Apply coupon locally
    applyCoupon(code, discount);
    setShowCoupons(false);
    show(`Coupon ${code} applied successfully! 🎉`);
    
    // Refresh cart to get updated totals
    if (customerId) {
      await fetchCart(customerId);
    }
  } catch (error: any) {
    console.error('❌ Failed to apply coupon:', error);
    show(error.response?.data?.message || 'Failed to apply coupon', 'error');
  } finally {
    setSyncing(false);
  }
}, [subtotal, customerId, applyCoupon, show, fetchCart]);

  // ─── Remove coupon ──────────────────────────────────────────────────────────
  const handleRemoveCoupon = useCallback(() => {
    removeCoupon();
    show('Coupon removed');
  }, [removeCoupon, show]);

  // ─── Test Direct Delete ──────────────────────────────────────────────────────
  const testDirectDelete = useCallback(async () => {
    if (!customerId) {
      show('Please login first', 'error');
      return;
    }
    
    console.log('🧪 TEST: Direct delete with customerId:', customerId);
    console.log('🧪 TEST: Items in cart:', state.items);
    
    const firstItem = state.items[0];
    if (!firstItem) {
      show('No items in cart', 'error');
      return;
    }
    
    console.log('🧪 TEST: Deleting item:', firstItem);
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
        data: { 
          customerId: customerId, 
          productId: firstItem.productId 
        },
      });
      console.log('🧪 TEST: Delete response:', response.data);
      show('Test delete successful!');
      await fetchCart(customerId);
    } catch (error: any) {
      console.error('🧪 TEST: Delete failed:', error);
      console.error('🧪 TEST: Error details:', error.response?.data);
      show('Test delete failed: ' + (error.response?.data?.message || error.message), 'error');
    }
  }, [customerId, state.items, fetchCart, show]);

  // ─── Direct Delete Function ──────────────────────────────────────────────────
  const directDeleteItem = useCallback(async (item: any) => {
    console.log('🗑️ Direct delete called for item:', item);
    
    if (!customerId) {
      show('Please login to manage cart', 'error');
      return;
    }
    
    try {
      setSyncing(true);
      console.log('🗑️ Direct deleting:', { 
        customerId: customerId, 
        productId: item.productId,
        url: `${API_BASE_URL}/cart/item`
      });
      
      const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
        data: { 
          customerId: customerId, 
          productId: item.productId 
        },
      });
      
      console.log('🗑️ Delete response:', response.data);
      
      if (response.data.success) {
        removeItem(item.id);
        await fetchCart(customerId);
        show('Item removed from cart');
      } else {
        show('Failed to remove item', 'error');
      }
    } catch (error: any) {
      console.error('❌ Failed to delete item:', error);
      show('Failed to remove item', 'error');
      if (customerId) {
        await fetchCart(customerId);
      }
    } finally {
      setSyncing(false);
    }
  }, [customerId, removeItem, fetchCart, show]);

  // ─── Direct Clear Cart Function ─────────────────────────────────────────────
  const directClearCart = useCallback(async () => {
    console.log('🗑️ Direct clear cart called');
    
    if (!customerId) {
      show('Please login to manage cart', 'error');
      return;
    }
    
    if (state.items.length === 0) {
      show('Your cart is already empty', 'info');
      return;
    }
    
    try {
      setSyncing(true);
      console.log('🗑️ Direct clearing cart:', { 
        customerId: customerId,
        url: `${API_BASE_URL}/cart/${customerId}`
      });
      
      const response = await axios.delete(`${API_BASE_URL}/cart/${customerId}`);
      
      console.log('🗑️ Clear cart response status:', response.status);
      console.log('🗑️ Clear cart response data:', response.data);
      
      if (response.data.success) {
        clearCart();
        await fetchCart(customerId);
        show('Cart cleared successfully');
        console.log('✅ Cart cleared successfully');
      } else {
        console.log('❌ Clear cart failed:', response.data);
        show('Failed to clear cart', 'error');
        await fetchCart(customerId);
      }
    } catch (error: any) {
      console.error('❌ Failed to clear cart:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      console.error('❌ Error status:', error.response?.status);
      show('Failed to clear cart', 'error');
      if (customerId) {
        await fetchCart(customerId);
      }
    } finally {
      setSyncing(false);
    }
  }, [customerId, state.items.length, clearCart, fetchCart, show]);

  // ─── Update Quantity ─────────────────────────────────────────────────────────
  const handleUpdateQty = useCallback(async (item: any, newQuantity: number) => {
    console.log('📦 handleUpdateQty called:', { item, newQuantity, customerId });
    
    if (!customerId) {
      show('Please login to update cart', 'error');
      return;
    }
    
    try {
      setSyncing(true);
      
      if (newQuantity <= 0) {
        console.log('📦 Quantity is 0, removing item');
        await directDeleteItem(item);
        setSyncing(false);
        return;
      }
      
      await updateQty(item.id, newQuantity, item.productId, customerId);
      console.log('✅ Quantity updated successfully');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      show('Failed to update quantity', 'error');
      if (customerId) {
        await fetchCart(customerId);
      }
    } finally {
      setSyncing(false);
    }
  }, [customerId, updateQty, show, fetchCart, directDeleteItem]);

  // ─── Clear Cart ──────────────────────────────────────────────────────────────
  const handleClearCart = useCallback(async () => {
    console.log('📦 handleClearCart called:', { customerId, itemsCount: state.items.length });
    
    if (!customerId) {
      show('Please login to manage cart', 'error');
      return;
    }
    
    if (state.items.length === 0) {
      show('Your cart is already empty', 'info');
      return;
    }
    
    console.log('🗑️ Calling directClearCart...');
    await directClearCart();
  }, [customerId, state.items.length, directClearCart, show]);

  // ─── Move to Wishlist ──────────────────────────────────────────────────────
  const handleMoveToWishlist = useCallback(async (item: any) => {
    if (!customerId) {
      show('Please login to manage wishlist', 'error');
      return;
    }
    
    try {
      setSyncing(true);
      toggle(item.productId);
      await directDeleteItem(item);
      show('Moved to wishlist');
    } catch (error) {
      console.error('Failed to move to wishlist:', error);
      show('Failed to move to wishlist', 'error');
      if (customerId) {
        await fetchCart(customerId);
      }
    } finally {
      setSyncing(false);
    }
  }, [customerId, toggle, directDeleteItem, show, fetchCart]);

  // ─── Render item ─────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: any }) => {
    console.log('🎨 Rendering item:', { id: item.id, productId: item.productId, name: item.name });
    return (
      <View style={styles.cartItem}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemBody}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
          <View style={styles.itemActions}>
            <View style={styles.qtyRow}>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleUpdateQty(item, Math.max(0, item.quantity - 1))}
                disabled={syncing}
              >
                <Minus color={COLORS.neutral[700]} size={16} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleUpdateQty(item, item.quantity + 1)}
                disabled={syncing}
              >
                <Plus color={COLORS.neutral[700]} size={16} />
              </TouchableOpacity>
            </View>
            <View style={styles.itemActionBtns}>
              <TouchableOpacity 
                style={styles.iconAction} 
                onPress={() => handleMoveToWishlist(item)}
                disabled={syncing}
              >
                <Heart color={COLORS.neutral[500]} size={16} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconAction} 
                onPress={() => {
                  console.log('🗑️ Trash icon pressed for item:', item);
                  directDeleteItem(item);
                }}
                disabled={syncing}
              >
                <Trash2 color={COLORS.error} size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (state.items.length === 0 && !syncing) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.title}>Shopping Cart</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            icon={<ShoppingBag color={COLORS.neutral[400]} size={36} />}
            title="Your cart is empty"
            message="Browse our premium collections and add items to your cart"
          />
          <View style={{ paddingHorizontal: SPACING.xl }}>
            <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Shopping Cart</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* <TouchableOpacity onPress={testDirectDelete}>
              <Text style={[styles.clearText, { color: COLORS.primary[600] }]}>Test Delete</Text>
            </TouchableOpacity> */}
            {state.items.length > 0 && (
              <TouchableOpacity onPress={handleClearCart} disabled={syncing}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.subtitle}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</Text>
      </View>

      {syncing && (
        <View style={styles.syncingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary[600]} />
          <Text style={styles.syncingText}>Updating cart...</Text>
        </View>
      )}

      <FlatList
        data={state.items}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 200 }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={styles.couponSection}>
            {state.appliedCoupon ? (
              <View style={styles.appliedCoupon}>
                <View style={styles.couponInfo}>
                  <Tag color={COLORS.success} size={18} />
                  <View>
                    <Text style={styles.couponCode}>{state.appliedCoupon}</Text>
                    <Text style={styles.couponSaved}>You saved ₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleRemoveCoupon}>
                  <X color={COLORS.neutral[500]} size={20} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.couponInput} onPress={() => setShowCoupons(true)}>
                <Tag color={COLORS.gold[500]} size={20} />
                <Text style={styles.couponPlaceholder}>Apply coupon code</Text>
                <ChevronRight color={COLORS.neutral[400]} size={20} />
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
        </View>
        {state.couponDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>GST (18%)</Text>
          <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
        </View>
        <Button 
          onPress={() => router.push('/checkout')} 
          fullWidth 
          size="lg" 
          style={{ marginTop: SPACING.md }}
          disabled={state.items.length === 0 || syncing}
        >
          Proceed to Checkout
        </Button>
      </View>

      {/* Coupon Sheet */}
      {showCoupons && (
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCoupons(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Available Coupons</Text>
              <TouchableOpacity onPress={() => setShowCoupons(false)}>
                <X color={COLORS.neutral[600]} size={24} />
              </TouchableOpacity>
            </View>
            {loadingCoupons ? (
              <View style={styles.loadingCoupons}>
                <ActivityIndicator size="large" color={COLORS.primary[600]} />
                <Text style={styles.loadingText}>Loading coupons...</Text>
              </View>
            ) : availableCoupons.length === 0 ? (
              <View style={styles.noCoupons}>
                <Tag color={COLORS.neutral[400]} size={48} />
                <Text style={styles.noCouponsText}>No coupons available</Text>
                <Text style={styles.noCouponsSubtext}>Check back later for offers</Text>
              </View>
            ) : (
              <FlatList
                data={availableCoupons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const discountAmount = item.type === 'percentage' 
                    ? Math.min(
                        Math.round(subtotal * item.discount / 100),
                        item.maxDiscount || Infinity
                      )
                    : item.discount;
                  
                  return (
                    <TouchableOpacity 
                      style={styles.couponCard} 
                      onPress={() => handleApplyCoupon(
                        item.code,
                        discountAmount,
                        item.minOrder
                      )}
                      disabled={syncing}
                    >
                      <View style={styles.couponCardLeft}>
                        <Text style={styles.couponCardCode}>{item.code}</Text>
                        <Text style={styles.couponCardDesc}>{item.description}</Text>
                        <Text style={styles.couponCardMin}>
                          Min order: ₹{item.minOrder.toLocaleString('en-IN')}
                        </Text>
                        {item.maxDiscount && (
                          <Text style={styles.couponCardMax}>
                            Max discount: ₹{item.maxDiscount.toLocaleString('en-IN')}
                          </Text>
                        )}
                      </View>
                      <View style={styles.couponCardRight}>
                        <Text style={styles.couponCardDiscount}>
                          {item.type === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}
                        </Text>
                        <Text style={styles.couponCardOff}>OFF</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  clearText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.error },
  syncingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 8 },
  syncingText: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  itemImage: { width: 90, height: 90, borderRadius: RADIUS.lg },
  itemBody: { flex: 1, marginLeft: SPACING.md },
  itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], lineHeight: 18 },
  itemPrice: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
  itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.md, paddingHorizontal: 4 },
  qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  itemActionBtns: { flexDirection: 'row', gap: SPACING.sm },
  iconAction: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
  couponSection: { marginTop: SPACING.md },
  couponInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.gold[200], borderStyle: 'dashed' },
  couponPlaceholder: { flex: 1, fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[600] },
  appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
  couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
  summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg, paddingBottom: 40, ...SHADOWS.large },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
  summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  summaryDivider: { height: 1, backgroundColor: COLORS.neutral[200], marginVertical: SPACING.sm },
  totalLabel: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  totalValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  sheetOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
  sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '70%', paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
  sheetTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  couponCard: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.gold[200], overflow: 'hidden' },
  couponCardLeft: { flex: 1, padding: SPACING.md, borderRightWidth: 2, borderRightColor: COLORS.gold[200], borderStyle: 'dashed' },
  couponCardCode: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  couponCardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4 },
  couponCardMin: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
  couponCardMax: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 2 },
  couponCardRight: { width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gold[50] },
  couponCardDiscount: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
  couponCardOff: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.gold[600] },
  loadingCoupons: { padding: SPACING.xl, alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  noCoupons: { padding: SPACING.xl, alignItems: 'center' },
  noCouponsText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[600], marginTop: 12 },
  noCouponsSubtext: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
});
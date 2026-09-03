// // app/wishlist.tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, ActivityIndicator, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, Heart, ShoppingBag, Trash2, Star } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi, API_BASE_URL } from '@/services/api';
// import { Product } from '@/types';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { RatingBadge } from '@/components/ui/RatingBadge';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuth } from '@/store/auth';
// import axios from 'axios';

// export default function WishlistScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { state, toggle, remove, fetchWishlist } = useWishlist();
//   const { addItem, fetchCart } = useCart();
//   const { state: authState } = useAuth();
//   const { show } = useToast();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [movingToCart, setMovingToCart] = useState<string | null>(null);
  
//   // Use ref to prevent multiple calls
//   const isMounted = useRef(true);
//   const isLoadingRef = useRef(false);

//   const customerId = authState.user?.id;

//   // ─── Load wishlist products ──────────────────────────────────────────────────
//   const load = useCallback(async () => {
//     // Prevent multiple simultaneous loads
//     if (isLoadingRef.current) return;
//     isLoadingRef.current = true;
    
//     try {
//       console.log('📦 Loading wishlist...');
      
//       // If user is logged in, fetch from backend
//       if (customerId) {
//         await fetchWishlist(customerId);
//       }
      
//       // Get products from wishlist
//       if (state.productIds.length > 0) {
//         const all = await mockApi.getProducts();
//         const filtered = all.filter((p) => state.productIds.includes(p.id));
//         setProducts(filtered);
//         console.log('📦 Wishlist products loaded:', filtered.length);
//       } else {
//         setProducts([]);
//         console.log('📦 Wishlist is empty');
//       }
//     } catch (error) {
//       console.error('❌ Failed to load wishlist:', error);
//       show('Failed to load wishlist', 'error');
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//         setRefreshing(false);
//       }
//       isLoadingRef.current = false;
//     }
//   }, [customerId, fetchWishlist, state.productIds, show]);

//   // ─── Load on mount - only once ──────────────────────────────────────────────
//   useEffect(() => {
//     isMounted.current = true;
//     load();
    
//     // Cleanup
//     return () => {
//       isMounted.current = false;
//     };
//   }, []); // Empty dependency array - only run once on mount

//   // ─── Reload when customerId changes (login/logout) ──────────────────────────
//   useEffect(() => {
//     if (customerId) {
//       load();
//     }
//   }, [customerId]); // Only when customerId changes

//   // ─── Reload when wishlist state changes (but prevent infinite loop) ──────────
//   // Use a ref to track if the update came from this component
//   const updateFromComponent = useRef(false);
  
//   useEffect(() => {
//     // Only reload if the update came from outside this component
//     if (!updateFromComponent.current && !isLoadingRef.current) {
//       load();
//     }
//     // Reset the flag
//     updateFromComponent.current = false;
//   }, [state.productIds]); // This will run when wishlist changes

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await load();
//   }, [load]);

//   // ─── Move to Cart ─────────────────────────────────────────────────────────────
//   const handleMoveToCart = useCallback(async (product: Product) => {
//     console.log('🛒 Moving to cart:', { product, customerId });
    
//     if (!customerId) {
//       show('Please login to add items to cart', 'error');
//       router.push('/(auth)/login');
//       return;
//     }

//     setMovingToCart(product.id);
    
//     try {
//       const cartItem = {
//         id: `${product.id}_${Date.now()}`,
//         productId: product.id,
//         name: product.name,
//         image: product.images?.[0] || 'https://via.placeholder.com/300x300',
//         price: product.price,
//         quantity: 1,
//         type: 'product' as const,
//       };

//       await addItem(cartItem, customerId);
//       await fetchCart(customerId);
      
//       // Set flag to prevent reload loop
//       updateFromComponent.current = true;
//       toggle(product.id);
      
//       setProducts(prev => prev.filter(p => p.id !== product.id));
//       show(`${product.name} moved to cart 🛒`);
//       console.log('✅ Item moved to cart successfully');
//     } catch (error: any) {
//       console.error('❌ Failed to move to cart:', error);
//       show('Failed to move to cart', 'error');
//     } finally {
//       setMovingToCart(null);
//     }
//   }, [customerId, addItem, fetchCart, toggle, show, router]);

//   // ─── Remove from Wishlist ────────────────────────────────────────────────────
//  // app/wishlist.tsx - Update the handleRemove function

// // ─── Remove from Wishlist ────────────────────────────────────────────────────
// const handleRemove = useCallback(async (productId: string, productName: string) => {
//   Alert.alert(
//     'Remove from Wishlist',
//     `Are you sure you want to remove "${productName}" from your wishlist?`,
//     [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Remove',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             console.log('🗑️ Removing from wishlist:', { productId, customerId });
            
//             if (!customerId) {
//               // If not logged in, just remove from local state
//               toggle(productId);
//               setProducts(prev => prev.filter(p => p.id !== productId));
//               show('Removed from wishlist', 'info');
//               return;
//             }
            
//             // Set flag to prevent reload loop
//             updateFromComponent.current = true;
            
//             // Toggle with customerId - this will remove from backend
//             await toggle(productId, customerId);
            
//             // Update local state
//             setProducts(prev => prev.filter(p => p.id !== productId));
//             show('Removed from wishlist', 'info');
//             console.log('✅ Item removed from wishlist');
//           } catch (error) {
//             console.error('Failed to remove from wishlist:', error);
//             show('Failed to remove from wishlist', 'error');
//             // Reload to ensure consistency
//             load();
//           }
//         },
//       },
//     ]
//   );
// }, [customerId, toggle, setProducts, show, load]);

//   // ─── Clear All Wishlist ──────────────────────────────────────────────────────
//  // ─── Clear All Wishlist ──────────────────────────────────────────────────────
// const handleClearAll = useCallback(async () => {
//   Alert.alert(
//     'Clear Wishlist',
//     'Are you sure you want to remove all items from your wishlist?',
//     [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Clear All',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             console.log('🗑️ Clearing all wishlist items');
            
//             if (!customerId) {
//               // If not logged in, just clear local
//               for (const product of products) {
//                 toggle(product.id);
//               }
//               setProducts([]);
//               show('Wishlist cleared', 'info');
//               return;
//             }
            
//             // Set flag to prevent reload loop
//             updateFromComponent.current = true;
            
//             // Remove all items one by one from backend
//             for (const product of products) {
//               await toggle(product.id, customerId);
//             }
            
//             setProducts([]);
//             show('Wishlist cleared', 'info');
//             console.log('✅ Wishlist cleared');
//           } catch (error) {
//             console.error('Failed to clear wishlist:', error);
//             show('Failed to clear wishlist', 'error');
//             load();
//           }
//         },
//       },
//     ]
//   );
// }, [customerId, products, toggle, show, load]);

//   // ─── Render Star Rating ──────────────────────────────────────────────────────
//   const renderStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(
//           <Star key={i} size={12} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//         );
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(
//           <Star key={i} size={12} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//         );
//       } else {
//         stars.push(
//           <Star key={i} size={12} color={COLORS.gold[200]} />
//         );
//       }
//     }
//     return stars;
//   };

//   // ─── Render Item ─────────────────────────────────────────────────────────────
//   const renderItem = ({ item }: { item: Product }) => (
//     <View style={styles.card}>
//       <TouchableOpacity 
//         onPress={() => router.push(`/product/${item.id}`)}
//         activeOpacity={0.8}
//       >
//         <View style={styles.cardImageWrap}>
//           <Image 
//             source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x300' }} 
//             style={styles.cardImage}
//             resizeMode="cover"
//           />
//         </View>
//       </TouchableOpacity>
      
//       <View style={styles.cardBody}>
//         <TouchableOpacity 
//           onPress={() => router.push(`/product/${item.id}`)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
//         </TouchableOpacity>
        
//         <View style={styles.cardRating}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//             {renderStars(item.rating)}
//             <Text style={styles.ratingText}>({item.reviewCount || 0})</Text>
//           </View>
//         </View>
        
//         <Text style={styles.cardPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
        
//         <View style={styles.cardActions}>
//           <TouchableOpacity 
//             style={styles.cartBtn} 
//             onPress={() => handleMoveToCart(item)}
//             disabled={movingToCart === item.id}
//             activeOpacity={0.8}
//           >
//             {movingToCart === item.id ? (
//               <ActivityIndicator size="small" color={COLORS.white} />
//             ) : (
//               <>
//                 <ShoppingBag color={COLORS.white} size={16} />
//                 <Text style={styles.cartBtnText}>Move to Cart</Text>
//               </>
//             )}
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.removeBtn} 
//             onPress={() => handleRemove(item.id, item.name)}
//             activeOpacity={0.7}
//           >
//             <Trash2 color={COLORS.error} size={18} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   // ─── Empty State ─────────────────────────────────────────────────────────────
//   if (products.length === 0 && !loading) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={24} />
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.title}>My Wishlist</Text>
//             <Text style={styles.subtitle}>0 saved items</Text>
//           </View>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <EmptyState
//             icon={<Heart color={COLORS.neutral[400]} size={36} />}
//             title="Your wishlist is empty"
//             message="Save items you love to find them quickly later"
//           />
//           <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.md }}>
//             <TouchableOpacity 
//               style={styles.browseBtn}
//               onPress={() => router.push('/(tabs)/categories')}
//             >
//               <Text style={styles.browseBtnText}>Start Shopping</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   // ─── Loading State ───────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={24} />
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.title}>My Wishlist</Text>
//             <Text style={styles.subtitle}>Loading...</Text>
//           </View>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <ActivityIndicator size="large" color={COLORS.primary[600]} />
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <ArrowLeft color={COLORS.neutral[800]} size={24} />
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.title}>My Wishlist</Text>
//           <Text style={styles.subtitle}>{products.length} saved items</Text>
//         </View>
//         {products.length > 0 && (
//           <TouchableOpacity 
//             style={styles.clearAllBtn}
//             onPress={handleClearAll}
//           >
//             <Trash2 color={COLORS.error} size={18} />
//           </TouchableOpacity>
//         )}
//       </View>

//       <FlatList
//         data={products}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={onRefresh} 
//             tintColor={COLORS.primary[600]} 
//             colors={[COLORS.primary[600]]}
//           />
//         }
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListFooterComponent={
//           products.length > 0 ? (
//             <View style={styles.footer}>
//               <Text style={styles.footerText}>
//                 {products.length} item{products.length > 1 ? 's' : ''} in wishlist
//               </Text>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: COLORS.offWhite 
//   },
//   header: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     paddingHorizontal: SPACING.md, 
//     paddingBottom: SPACING.md, 
//     gap: SPACING.sm,
//     backgroundColor: COLORS.offWhite,
//   },
//   backBtn: { 
//     width: 44, 
//     height: 44, 
//     borderRadius: 22, 
//     backgroundColor: COLORS.white, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     ...SHADOWS.small 
//   },
//   title: { 
//     fontSize: 22, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   subtitle: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 2 
//   },
//   clearAllBtn: {
//     marginLeft: 'auto',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: COLORS.error + '15',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   card: { 
//     flexDirection: 'row', 
//     backgroundColor: COLORS.white, 
//     borderRadius: RADIUS.xl, 
//     padding: SPACING.md, 
//     marginBottom: SPACING.md, 
//     ...SHADOWS.small 
//   },
//   cardImageWrap: { 
//     width: 100, 
//     height: 100, 
//     borderRadius: RADIUS.lg, 
//     overflow: 'hidden',
//     backgroundColor: COLORS.neutral[100],
//   },
//   cardImage: { 
//     width: '100%', 
//     height: '100%', 
//     resizeMode: 'cover' 
//   },
//   cardBody: { 
//     flex: 1, 
//     marginLeft: SPACING.md,
//     justifyContent: 'space-between',
//   },
//   cardName: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900], 
//     lineHeight: 18,
//     marginBottom: 4,
//   },
//   cardRating: { 
//     marginVertical: 4,
//   },
//   ratingText: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//     marginLeft: 2,
//   },
//   cardPrice: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.primary[700],
//     marginVertical: 4,
//   },
//   cardActions: { 
//     flexDirection: 'row', 
//     gap: 8, 
//     marginTop: 4,
//   },
//   cartBtn: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     gap: 6, 
//     backgroundColor: COLORS.primary[700], 
//     paddingVertical: 10, 
//     borderRadius: RADIUS.lg,
//     minHeight: 40,
//   },
//   cartBtnText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.white 
//   },
//   removeBtn: { 
//     width: 40, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     backgroundColor: COLORS.error + '15', 
//     borderRadius: RADIUS.lg,
//     minHeight: 40,
//   },
//   browseBtn: {
//     backgroundColor: COLORS.primary[700],
//     paddingVertical: 16,
//     borderRadius: RADIUS.lg,
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   browseBtnText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//   },
//   footer: {
//     paddingVertical: SPACING.lg,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//   },
// });



// // app/wishlist.tsx - Updated with direct delete without alert
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, ActivityIndicator, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, Heart, ShoppingBag, Trash2, Star } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi, API_BASE_URL } from '@/services/api';
// import { Product } from '@/types';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { useWishlist } from '@/store/wishlist';
// import { useCart } from '@/store/cart';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuth } from '@/store/auth';
// import axios from 'axios';

// export default function WishlistScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { state, remove, fetchWishlist } = useWishlist();
//   const { addItem, fetchCart } = useCart();
//   const { state: authState } = useAuth();
//   const { show } = useToast();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [movingToCart, setMovingToCart] = useState<string | null>(null);
//   const [syncing, setSyncing] = useState(false);
  
//   const isMounted = useRef(true);
//   const isLoadingRef = useRef(false);
//   const updateFromComponent = useRef(false);

//   const customerId = authState.user?.id;

//   // ─── Load wishlist products ──────────────────────────────────────────────────
//   const load = useCallback(async () => {
//     if (isLoadingRef.current) return;
//     isLoadingRef.current = true;
    
//     try {
//       console.log('📦 Loading wishlist...');
      
//       if (customerId) {
//         await fetchWishlist(customerId);
//       }
      
//       if (state.productIds.length > 0) {
//         const all = await mockApi.getProducts();
//         const filtered = all.filter((p) => state.productIds.includes(p.id));
//         setProducts(filtered);
//         console.log('📦 Wishlist products loaded:', filtered.length);
//       } else {
//         setProducts([]);
//         console.log('📦 Wishlist is empty');
//       }
//     } catch (error) {
//       console.error('❌ Failed to load wishlist:', error);
//       show('Failed to load wishlist', 'error');
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//         setRefreshing(false);
//       }
//       isLoadingRef.current = false;
//     }
//   }, [customerId, fetchWishlist, state.productIds, show]);

//   // ─── Load on mount ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     isMounted.current = true;
//     load();
    
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   // ─── Reload when customerId changes ──────────────────────────────────────────
//   useEffect(() => {
//     if (customerId) {
//       load();
//     }
//   }, [customerId]);

//   // ─── Reload when wishlist state changes ──────────────────────────────────────
//   useEffect(() => {
//     if (!updateFromComponent.current && !isLoadingRef.current) {
//       load();
//     }
//     updateFromComponent.current = false;
//   }, [state.productIds]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await load();
//   }, [load]);

//   // ─── Move to Cart ─────────────────────────────────────────────────────────────
//   const handleMoveToCart = useCallback(async (product: Product) => {
//     console.log('🛒 Moving to cart:', { product, customerId });
    
//     if (!customerId) {
//       show('Please login to add items to cart', 'error');
//       router.push('/(auth)/login');
//       return;
//     }

//     setMovingToCart(product.id);
    
//     try {
//       const cartItem = {
//         id: `${product.id}_${Date.now()}`,
//         productId: product.id,
//         name: product.name,
//         image: product.images?.[0] || 'https://via.placeholder.com/300x300',
//         price: product.price,
//         quantity: 1,
//         type: 'product' as const,
//       };

//       await addItem(cartItem, customerId);
//       await fetchCart(customerId);
      
//       updateFromComponent.current = true;
      
//       // Direct API call to remove from wishlist
//       const response = await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
//         params: { customerId, productId: product.id }
//       });
      
//       console.log('🗑️ Move to cart - Delete response:', response.data);
      
//       if (response.data.success) {
//         // Update local state
//         remove(product.id);
//         setProducts(prev => prev.filter(p => p.id !== product.id));
//         show(`${product.name} moved to cart 🛒`);
//         console.log('✅ Item moved to cart successfully');
//       }
//     } catch (error: any) {
//       console.error('❌ Failed to move to cart:', error);
//       console.error('Error details:', error.response?.data || error.message);
//       show('Failed to move to cart', 'error');
//     } finally {
//       setMovingToCart(null);
//     }
//   }, [customerId, addItem, fetchCart, remove, show, router]);

//   // ─── Direct Delete from Wishlist - NO ALERT (Direct Delete) ──────────────────
//   const directDeleteFromWishlist = useCallback(async (productId: string, productName: string) => {
//     console.log('🗑️ Direct delete called for item:', { productId, productName, customerId });
    
//     if (!customerId) {
//       show('Please login to manage wishlist', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       console.log('🗑️ Sending DELETE request:', { 
//         customerId: customerId, 
//         productId: productId,
//         url: `${API_BASE_URL}/wishlist/remove`
//       });
      
//       const response = await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
//         params: { customerId, productId }
//       });
      
//       console.log('🗑️ Delete response status:', response.status);
//       console.log('🗑️ Delete response data:', response.data);
      
//       if (response.data.success) {
//         // Update local state
//         updateFromComponent.current = true;
//         remove(productId);
//         setProducts(prev => prev.filter(p => p.id !== productId));
//         show(`${productName} removed from wishlist`, 'info');
//         console.log('✅ Item removed from wishlist successfully');
//       } else {
//         console.log('❌ Delete failed:', response.data);
//         show('Failed to remove from wishlist', 'error');
//       }
//     } catch (error: any) {
//       console.error('❌ Failed to delete item:', error);
//       console.error('Error status:', error.response?.status);
//       console.error('Error data:', error.response?.data);
//       console.error('Error message:', error.message);
//       show('Failed to remove from wishlist', 'error');
//       // Reload to ensure consistency
//       load();
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, remove, show, load]);

//   // ─── Clear All Wishlist ──────────────────────────────────────────────────────
//   const directClearWishlist = useCallback(async () => {
//     console.log('🗑️ Direct clear wishlist called');
    
//     if (!customerId) {
//       show('Please login to manage wishlist', 'error');
//       return;
//     }
    
//     if (products.length === 0) {
//       show('Your wishlist is already empty', 'info');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       console.log('🗑️ Direct clearing wishlist:', { 
//         customerId: customerId,
//         itemsCount: products.length
//       });
      
//       // Remove all items one by one
//       for (const product of products) {
//         const response = await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
//           params: { customerId, productId: product.id }
//         });
//         console.log(`🗑️ Removed ${product.name}:`, response.data);
//       }
      
//       // Clear local state
//       updateFromComponent.current = true;
//       for (const product of products) {
//         remove(product.id);
//       }
//       setProducts([]);
      
//       show('Wishlist cleared successfully');
//       console.log('✅ Wishlist cleared successfully');
//     } catch (error: any) {
//       console.error('❌ Failed to clear wishlist:', error);
//       console.error('Error details:', error.response?.data || error.message);
//       show('Failed to clear wishlist', 'error');
//       // Refresh to ensure consistency
//       load();
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, products, remove, show, load]);

//   // ─── Clear All - With Alert ──────────────────────────────────────────────────
//   const handleClearAll = useCallback(async () => {
//     console.log('📦 handleClearAll called:', { customerId, itemsCount: products.length });
    
//     if (!customerId) {
//       show('Please login to manage wishlist', 'error');
//       return;
//     }
    
//     if (products.length === 0) {
//       show('Your wishlist is already empty', 'info');
//       return;
//     }
    
//     Alert.alert(
//       'Clear Wishlist',
//       'Are you sure you want to remove all items from your wishlist?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear All',
//           style: 'destructive',
//           onPress: async () => {
//             console.log('🗑️ User confirmed clear wishlist');
//             await directClearWishlist();
//           },
//         },
//       ]
//     );
//   }, [customerId, products.length, directClearWishlist, show]);

//   // ─── Render Star Rating ──────────────────────────────────────────────────────
//   const renderStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(
//           <Star key={i} size={12} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//         );
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(
//           <Star key={i} size={12} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
//         );
//       } else {
//         stars.push(
//           <Star key={i} size={12} color={COLORS.gold[200]} />
//         );
//       }
//     }
//     return stars;
//   };

//   // ─── Render Item ─────────────────────────────────────────────────────────────
//   // app/wishlist.tsx - Update the renderItem and delete functions

// // ─── Render Item ─────────────────────────────────────────────────────────────
// const renderItem = ({ item }: { item: Product }) => {
//   console.log('🎨 Rendering item:', { id: item.id, name: item.name });
//   return (
//     <View style={styles.card}>
//       <TouchableOpacity 
//         onPress={() => router.push(`/product/${item.id}`)}
//         activeOpacity={0.8}
//       >
//         <View style={styles.cardImageWrap}>
//           <Image 
//             source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x300' }} 
//             style={styles.cardImage}
//             resizeMode="cover"
//           />
//         </View>
//       </TouchableOpacity>
      
//       <View style={styles.cardBody}>
//         <TouchableOpacity 
//           onPress={() => router.push(`/product/${item.id}`)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
//         </TouchableOpacity>
        
//         <View style={styles.cardRating}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//             {renderStars(item.rating)}
//             <Text style={styles.ratingText}>({item.reviewCount || 0})</Text>
//           </View>
//         </View>
        
//         <Text style={styles.cardPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
        
//         <View style={styles.cardActions}>
//           <TouchableOpacity 
//             style={styles.cartBtn} 
//             onPress={() => handleMoveToCart(item)}
//             disabled={movingToCart === item.id || syncing}
//             activeOpacity={0.8}
//           >
//             {movingToCart === item.id ? (
//               <ActivityIndicator size="small" color={COLORS.white} />
//             ) : (
//               <>
//                 <ShoppingBag color={COLORS.white} size={16} />
//                 <Text style={styles.cartBtnText}>Move to Cart</Text>
//               </>
//             )}
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.removeBtn} 
//             onPress={() => {
//               console.log('🗑️ Trash icon pressed for item:', item);
//               directDeleteFromWishlist(item.id, item.name);
//             }}
//             disabled={syncing}
//             activeOpacity={0.7}
//           >
//             <Trash2 color={COLORS.error} size={18} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

//   // ─── Empty State ─────────────────────────────────────────────────────────────
//   if (products.length === 0 && !loading) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={24} />
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.title}>My Wishlist</Text>
//             <Text style={styles.subtitle}>0 saved items</Text>
//           </View>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <EmptyState
//             icon={<Heart color={COLORS.neutral[400]} size={36} />}
//             title="Your wishlist is empty"
//             message="Save items you love to find them quickly later"
//           />
//           <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.md }}>
//             <TouchableOpacity 
//               style={styles.browseBtn}
//               onPress={() => router.push('/(tabs)/categories')}
//             >
//               <Text style={styles.browseBtnText}>Start Shopping</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   // ─── Loading State ───────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//           <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//             <ArrowLeft color={COLORS.neutral[800]} size={24} />
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.title}>My Wishlist</Text>
//             <Text style={styles.subtitle}>Loading...</Text>
//           </View>
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <ActivityIndicator size="large" color={COLORS.primary[600]} />
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <ArrowLeft color={COLORS.neutral[800]} size={24} />
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.title}>My Wishlist</Text>
//           <Text style={styles.subtitle}>{products.length} saved items</Text>
//         </View>
//         {products.length > 0 && (
//           <TouchableOpacity 
//             style={styles.clearAllBtn}
//             onPress={handleClearAll}
//             disabled={syncing}
//           >
//             <Trash2 color={COLORS.error} size={18} />
//           </TouchableOpacity>
//         )}
//       </View>

//       {syncing && (
//         <View style={styles.syncingContainer}>
//           <ActivityIndicator size="small" color={COLORS.primary[600]} />
//           <Text style={styles.syncingText}>Updating wishlist...</Text>
//         </View>
//       )}

//       <FlatList
//         data={products}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={onRefresh} 
//             tintColor={COLORS.primary[600]} 
//             colors={[COLORS.primary[600]]}
//           />
//         }
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListFooterComponent={
//           products.length > 0 ? (
//             <View style={styles.footer}>
//               <Text style={styles.footerText}>
//                 {products.length} item{products.length > 1 ? 's' : ''} in wishlist
//               </Text>
//             </View>
//           ) : null
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: COLORS.offWhite 
//   },
//   header: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     paddingHorizontal: SPACING.md, 
//     paddingBottom: SPACING.md, 
//     gap: SPACING.sm,
//     backgroundColor: COLORS.offWhite,
//   },
//   backBtn: { 
//     width: 44, 
//     height: 44, 
//     borderRadius: 22, 
//     backgroundColor: COLORS.white, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     ...SHADOWS.small 
//   },
//   title: { 
//     fontSize: 22, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.neutral[900] 
//   },
//   subtitle: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     marginTop: 2 
//   },
//   clearAllBtn: {
//     marginLeft: 'auto',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: COLORS.error + '15',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   syncingContainer: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingVertical: 8, 
//     gap: 8 
//   },
//   syncingText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500] 
//   },
//   card: { 
//     flexDirection: 'row', 
//     backgroundColor: COLORS.white, 
//     borderRadius: RADIUS.xl, 
//     padding: SPACING.md, 
//     marginBottom: SPACING.md, 
//     ...SHADOWS.small 
//   },
//   cardImageWrap: { 
//     width: 100, 
//     height: 100, 
//     borderRadius: RADIUS.lg, 
//     overflow: 'hidden',
//     backgroundColor: COLORS.neutral[100],
//   },
//   cardImage: { 
//     width: '100%', 
//     height: '100%', 
//     resizeMode: 'cover' 
//   },
//   cardBody: { 
//     flex: 1, 
//     marginLeft: SPACING.md,
//     justifyContent: 'space-between',
//   },
//   cardName: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.neutral[900], 
//     lineHeight: 18,
//     marginBottom: 4,
//   },
//   cardRating: { 
//     marginVertical: 4,
//   },
//   ratingText: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//     marginLeft: 2,
//   },
//   cardPrice: { 
//     fontSize: 16, 
//     fontFamily: 'Inter-Bold', 
//     color: COLORS.primary[700],
//     marginVertical: 4,
//   },
//   cardActions: { 
//     flexDirection: 'row', 
//     gap: 8, 
//     marginTop: 4,
//   },
//   cartBtn: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     gap: 6, 
//     backgroundColor: COLORS.primary[700], 
//     paddingVertical: 10, 
//     borderRadius: RADIUS.lg,
//     minHeight: 40,
//   },
//   cartBtnText: { 
//     fontSize: 12, 
//     fontFamily: 'Inter-SemiBold', 
//     color: COLORS.white 
//   },
//   removeBtn: { 
//     width: 40, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     backgroundColor: COLORS.error + '15', 
//     borderRadius: RADIUS.lg,
//     minHeight: 40,
//   },
//   browseBtn: {
//     backgroundColor: COLORS.primary[700],
//     paddingVertical: 16,
//     borderRadius: RADIUS.lg,
//     alignItems: 'center',
//     ...SHADOWS.small,
//   },
//   browseBtnText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//   },
//   footer: {
//     paddingVertical: SPACING.lg,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//   },
// });



// app/wishlist.tsx
// app/wishlist.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, ShoppingBag, Trash2, Star } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { mockApi, API_BASE_URL } from '@/services/api';
import { Product } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { useWishlist } from '@/store/wishlist';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/auth';
import axios from 'axios';

export default function WishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, remove, fetchWishlist } = useWishlist();
  const { addItem, fetchCart } = useCart();
  const { state: authState } = useAuth();
  const { show } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [movingToCart, setMovingToCart] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  
  const isMounted = useRef(true);
  const isLoadingRef = useRef(false);
  const initialLoadDone = useRef(false);

  const customerId = authState.user?.id;

  // ─── Load wishlist products ──────────────────────────────────────────────────
  const load = useCallback(async (showLoading = true) => {
    // Prevent multiple simultaneous loads
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    
    try {
      if (showLoading) {
        console.log('📦 Loading wishlist...');
      }
      
      if (customerId) {
        await fetchWishlist(customerId);
      }
      
      if (state.productIds.length > 0) {
        const all = await mockApi.getProducts();
        const filtered = all.filter((p) => state.productIds.includes(p.id));
        setProducts(filtered);
        console.log('📦 Wishlist products loaded:', filtered.length);
      } else {
        setProducts([]);
        console.log('📦 Wishlist is empty');
      }
    } catch (error) {
      console.error('❌ Failed to load wishlist:', error);
      show('Failed to load wishlist', 'error');
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
      isLoadingRef.current = false;
    }
  }, [customerId, fetchWishlist, state.productIds, show]);

  // ─── Initial load - only once ──────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true;
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      load(true);
    }
    
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array - runs only once

  // ─── Reload when customerId changes (login/logout) ──────────────────────────
  useEffect(() => {
    if (customerId && initialLoadDone.current) {
      load(false);
    }
  }, [customerId]); // Only when customerId changes

  // ─── Reload when wishlist state changes from OUTSIDE ────────────────────────
  // This effect is removed to prevent infinite loops
  // Instead, we manually call load() after delete operations

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load(false);
  }, [load]);

  // ─── Move to Cart ─────────────────────────────────────────────────────────────
  const handleMoveToCart = useCallback(async (product: Product) => {
    console.log('🛒 Moving to cart:', { product, customerId });
    
    if (!customerId) {
      show('Please login to add items to cart', 'error');
      router.push('/(auth)/login');
      return;
    }

    setMovingToCart(product.id);
    
    try {
      const cartItem = {
        id: `${product.id}_${Date.now()}`,
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || 'https://via.placeholder.com/300x300',
        price: product.price,
        quantity: 1,
        type: 'product' as const,
      };

      await addItem(cartItem, customerId);
      await fetchCart(customerId);
      
      const response = await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
        params: { customerId, productId: product.id }
      });
      
      console.log('🗑️ Move to cart - Delete response:', response.data);
      
      if (response.data.success) {
        remove(product.id);
        setProducts(prev => prev.filter(p => p.id !== product.id));
        show(`${product.name} moved to cart 🛒`);
        console.log('✅ Item moved to cart successfully');
      }
    } catch (error: any) {
      console.error('❌ Failed to move to cart:', error);
      console.error('Error details:', error.response?.data || error.message);
      show('Failed to move to cart', 'error');
    } finally {
      setMovingToCart(null);
    }
  }, [customerId, addItem, fetchCart, remove, show, router]);

  // ─── DELETE SINGLE ITEM ──────────────────────────────────────────────────────
  const deleteSingleItem = useCallback(async (productId: string, productName: string) => {
    console.log('🗑️ Deleting single item:', { productId, productName, customerId });
    
    if (!customerId) {
      show('Please login to manage wishlist', 'error');
      return;
    }
    
    try {
      setSyncing(true);
      
      const response = await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
        params: { customerId, productId }
      });
      
      console.log('🗑️ Delete response:', response.data);
      
      if (response.data.success) {
        remove(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        show(`${productName} removed from wishlist`, 'info');
        console.log('✅ Item removed successfully');
      } else {
        show('Failed to remove from wishlist', 'error');
      }
    } catch (error: any) {
      console.error('❌ Failed to delete item:', error);
      show('Failed to remove from wishlist', 'error');
      load(false);
    } finally {
      setSyncing(false);
    }
  }, [customerId, remove, show, load]);

  // ─── CLEAR ALL ITEMS ─────────────────────────────────────────────────────────
  const clearAllItems = useCallback(async () => {
    console.log('🗑️ Clearing all items...');
    console.log('📦 Items to remove:', products.map(p => ({ id: p.id, name: p.name })));
    
    if (!customerId) {
      show('Please login to manage wishlist', 'error');
      return;
    }
    
    if (products.length === 0) {
      show('Your wishlist is already empty', 'info');
      return;
    }
    
    try {
      setSyncing(true);
      
      let successCount = 0;
      
      for (const product of products) {
        try {
          const response = await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
            params: { customerId, productId: product.id }
          });
          
          if (response.data.success) {
            successCount++;
            console.log(`✅ Removed ${product.name}`);
          }
        } catch (err) {
          console.error(`❌ Error removing ${product.name}:`, err);
        }
      }
      
      console.log(`📊 Successfully removed: ${successCount} items`);
      
      for (const product of products) {
        remove(product.id);
      }
      setProducts([]);
      
      show(`Cleared ${successCount} items from wishlist`, 'info');
      console.log('✅ Clear all completed');
      
      // Refresh the wishlist to ensure consistency
      await load(false);
    } catch (error: any) {
      console.error('❌ Failed to clear wishlist:', error);
      show('Failed to clear wishlist', 'error');
      load(false);
    } finally {
      setSyncing(false);
    }
  }, [customerId, products, remove, show, load]);

  // ─── Handle Delete Single Item ──────────────────────────────────────────────
  const handleDeleteSingle = useCallback((productId: string, productName: string) => {
    deleteSingleItem(productId, productName);
  }, [deleteSingleItem]);

  // ─── Handle Clear All ────────────────────────────────────────────────────────
  const handleClearAll = useCallback(async () => {
    console.log('📦 handleClearAll called:', { customerId, itemsCount: products.length });
    
    if (!customerId) {
      show('Please login to manage wishlist', 'error');
      return;
    }
    
    if (products.length === 0) {
      show('Your wishlist is already empty', 'info');
      return;
    }
    
    await clearAllItems();
  }, [customerId, products.length, clearAllItems]);

  // ─── Render Star Rating ──────────────────────────────────────────────────────
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={12} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} size={12} color={COLORS.gold[400]} fill={COLORS.gold[400]} />
        );
      } else {
        stars.push(
          <Star key={i} size={12} color={COLORS.gold[200]} />
        );
      }
    }
    return stars;
  };

  // ─── Render Item ─────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: Product }) => {
    console.log('🎨 Rendering item:', { id: item.id, name: item.name });
    return (
      <View style={styles.card}>
        <TouchableOpacity 
          onPress={() => router.push(`/product/${item.id}`)}
          activeOpacity={0.8}
        >
          <View style={styles.cardImageWrap}>
            <Image 
              source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x300' }} 
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
        
        <View style={styles.cardBody}>
          <TouchableOpacity 
            onPress={() => router.push(`/product/${item.id}`)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          </TouchableOpacity>
          
          <View style={styles.cardRating}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {renderStars(item.rating)}
              <Text style={styles.ratingText}>({item.reviewCount || 0})</Text>
            </View>
          </View>
          
          <Text style={styles.cardPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
          
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.cartBtn} 
              onPress={() => handleMoveToCart(item)}
              disabled={movingToCart === item.id || syncing}
              activeOpacity={0.8}
            >
              {movingToCart === item.id ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <ShoppingBag color={COLORS.white} size={16} />
                  <Text style={styles.cartBtnText}>Move to Cart</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.removeBtn} 
              onPress={() => {
                console.log('🗑️ Trash icon pressed for item:', item);
                handleDeleteSingle(item.id, item.name);
              }}
              disabled={syncing}
              activeOpacity={0.7}
            >
              <Trash2 color={COLORS.error} size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // ─── Empty State ─────────────────────────────────────────────────────────────
  if (products.length === 0 && !loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.neutral[800]} size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>My Wishlist</Text>
            <Text style={styles.subtitle}>0 saved items</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            icon={<Heart color={COLORS.neutral[400]} size={36} />}
            title="Your wishlist is empty"
            message="Save items you love to find them quickly later"
          />
          <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.md }}>
            <TouchableOpacity 
              style={styles.browseBtn}
              onPress={() => router.push('/(tabs)/categories')}
            >
              <Text style={styles.browseBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ─── Loading State ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.neutral[800]} size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>My Wishlist</Text>
            <Text style={styles.subtitle}>Loading...</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>My Wishlist</Text>
          <Text style={styles.subtitle}>{products.length} saved items</Text>
        </View>
        {products.length > 0 && (
          <TouchableOpacity 
            style={styles.clearAllBtn}
            onPress={handleClearAll}
            disabled={syncing}
          >
            <Trash2 color={COLORS.error} size={18} />
          </TouchableOpacity>
        )}
      </View>

      {syncing && (
        <View style={styles.syncingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary[600]} />
          <Text style={styles.syncingText}>Updating wishlist...</Text>
        </View>
      )}

      <FlatList
        data={products}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary[600]} 
            colors={[COLORS.primary[600]]}
          />
        }
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          products.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {products.length} item{products.length > 1 ? 's' : ''} in wishlist
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.offWhite 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.md, 
    paddingBottom: SPACING.md, 
    gap: SPACING.sm,
    backgroundColor: COLORS.offWhite,
  },
  backBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: COLORS.white, 
    justifyContent: 'center', 
    alignItems: 'center', 
    ...SHADOWS.small 
  },
  title: { 
    fontSize: 22, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.neutral[900] 
  },
  subtitle: { 
    fontSize: 13, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[500], 
    marginTop: 2 
  },
  clearAllBtn: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 8, 
    gap: 8 
  },
  syncingText: { 
    fontSize: 12, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[500] 
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: RADIUS.xl, 
    padding: SPACING.md, 
    marginBottom: SPACING.md, 
    ...SHADOWS.small 
  },
  cardImageWrap: { 
    width: 100, 
    height: 100, 
    borderRadius: RADIUS.lg, 
    overflow: 'hidden',
    backgroundColor: COLORS.neutral[100],
  },
  cardImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  cardBody: { 
    flex: 1, 
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  cardName: { 
    fontSize: 14, 
    fontFamily: 'Inter-SemiBold', 
    color: COLORS.neutral[900], 
    lineHeight: 18,
    marginBottom: 4,
  },
  cardRating: { 
    marginVertical: 4,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    marginLeft: 2,
  },
  cardPrice: { 
    fontSize: 16, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.primary[700],
    marginVertical: 4,
  },
  cardActions: { 
    flexDirection: 'row', 
    gap: 8, 
    marginTop: 4,
  },
  cartBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 6, 
    backgroundColor: COLORS.primary[700], 
    paddingVertical: 10, 
    borderRadius: RADIUS.lg,
    minHeight: 40,
  },
  cartBtnText: { 
    fontSize: 12, 
    fontFamily: 'Inter-SemiBold', 
    color: COLORS.white 
  },
  removeBtn: { 
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.error + '15', 
    borderRadius: RADIUS.lg,
    minHeight: 40,
  },
  browseBtn: {
    backgroundColor: COLORS.primary[700],
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  browseBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
  },
});
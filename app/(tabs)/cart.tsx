// app/(tabs)/cart.tsx
import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X, Star } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { useWishlist } from '@/store/wishlist';
import { useToast } from '@/store/toast';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL, mockApi } from '@/services/api';
import { Product, Package } from '@/types';

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

type WishlistDisplayItem = {
  id: string;
  itemType: 'product' | 'package';
  name: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
};

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
    // ❌ deliveryCharge removed
    // ❌ gst removed
    grandTotal, 
    totalItems, 
    clearCart, 
    fetchCart,
    addItem,
    isHydrated,
    cartError,
  } = useCart();
  const { state: authState } = useAuth();
  const { state: wishlistState, toggle, remove: removeFromWishlist, fetchWishlist } = useWishlist();
  const { show } = useToast();
  const [showCoupons, setShowCoupons] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  
  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState<WishlistDisplayItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const customerId = authState.user?.id;

  // ✅ Local total = subtotal − coupon discount (no delivery, no GST)
  const finalTotal = Math.max(0, subtotal - (state.couponDiscount || 0));

  // ─── Load wishlist products (for "From Your Wishlist" section) ──────────────
  const loadWishlist = useCallback(async () => {
    if (!customerId) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoadingWishlist(true);
      const entries = await fetchWishlist(customerId);
      
      if (!entries || entries.length === 0) {
        setWishlistItems([]);
        return;
      }

      const [allProducts, allPackages] = await Promise.all([
        mockApi.getProducts(),
        mockApi.getPackages(),
      ]);
      const productMap = new Map(allProducts.map((item: Product) => [String(item.id), item]));
      const packageMap = new Map(allPackages.map((item: Package) => [String(item.id), item]));

      const resolved = entries.map(entry => {
        if (entry.type === 'package') {
          const item = packageMap.get(entry.id);
          return item ? {
            id: String(item.id),
            itemType: 'package' as const,
            name: item.name,
            price: item.price,
            images: item.images?.length ? item.images : [item.image].filter(Boolean),
            rating: item.rating || 0,
            reviewCount: item.reviewCount || 0,
          } : null;
        }
        const item = productMap.get(entry.id);
        return item ? {
          id: String(item.id),
          itemType: 'product' as const,
          name: item.name,
          price: item.price,
          images: item.images || [],
          rating: item.rating || 0,
          reviewCount: item.reviewCount || 0,
        } : null;
      }).filter((item): item is WishlistDisplayItem => Boolean(item));

      setWishlistItems(resolved);
      console.log('📦 Wishlist items loaded for cart screen:', resolved.length);
    } catch (error) {
      console.error('❌ Failed to load wishlist on cart screen:', error);
    } finally {
      setLoadingWishlist(false);
    }
  }, [customerId, fetchWishlist]);

  // ─── Fetch available coupons from API ──────────────────────────────────────
  const fetchAvailableCoupons = useCallback(async () => {
    try {
      setLoadingCoupons(true);
      console.log('📦 Fetching available coupons from:', `${API_BASE_URL}/coupons/active`);
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
    } finally {
      setLoadingCoupons(false);
    }
  }, []);

  // ─── Initial mount: load cart, coupons, wishlist ────────────────────────────
  useEffect(() => {
    console.log('📦 CartScreen mounted, customerId:', customerId);
    if (customerId) {
      fetchCart(customerId);
      fetchAvailableCoupons();
      loadWishlist();
    }
  }, [customerId]);

  // ─── ✅ Refresh cart + wishlist every time screen regains focus ─────────────
  useFocusEffect(
    useCallback(() => {
      if (!customerId) return;
      console.log('🔁 CartScreen focused — refreshing cart & wishlist');
      fetchCart(customerId);
      loadWishlist();
    }, [customerId, fetchCart, loadWishlist])
  );

  // ─── Validate and apply coupon ─────────────────────────────────────────────
  const handleApplyCoupon = useCallback(async (code: string, discount: number, minOrder: number) => {
    if (subtotal < minOrder) {
      show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
      return;
    }

    try {
      setSyncing(true);
      
      const validateResponse = await axios.post(`${API_BASE_URL}/coupons/validate`, {
        code: code,
        subtotal: subtotal,
        customerId: customerId
      });

      if (!validateResponse.data.success) {
        show(validateResponse.data.message || 'Invalid coupon', 'error');
        return;
      }

      await axios.post(`${API_BASE_URL}/coupons/apply`, {
        code: code,
        customerId: customerId
      });

      applyCoupon(code, discount);
      setShowCoupons(false);
      show(`Coupon ${code} applied successfully! 🎉`);
      
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

  // ─── Direct Delete Function ──────────────────────────────────────────────────
  const directDeleteItem = useCallback(async (item: any) => {
    console.log('🗑️ Direct delete called for item:', item);
    
    if (!customerId) {
      show('Please login to manage cart', 'error');
      return;
    }
    
    try {
      setSyncing(true);
      const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
        data: { 
          customerId: customerId, 
          productId: item.productId 
        },
      });
      
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
      const response = await axios.delete(`${API_BASE_URL}/cart/${customerId}`);
      if (response.data.success) {
        clearCart();
        await fetchCart(customerId);
        show('Cart cleared successfully');
      } else {
        show('Failed to clear cart', 'error');
        await fetchCart(customerId);
      }
    } catch (error: any) {
      console.error('❌ Failed to clear cart:', error);
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
    if (!customerId) {
      show('Please login to update cart', 'error');
      return;
    }
    try {
      setSyncing(true);
      if (newQuantity <= 0) {
        await directDeleteItem(item);
        setSyncing(false);
        return;
      }
      await updateQty(item.id, newQuantity, item.productId, customerId);
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
    if (!customerId) {
      show('Please login to manage cart', 'error');
      return;
    }
    if (state.items.length === 0) {
      show('Your cart is already empty', 'info');
      return;
    }
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
      await toggle(item.productId, customerId, {
        name: item.name,
        price: item.price,
        image: item.image,
      }, item.type === 'package' ? 'package' : 'product');
      await directDeleteItem(item);
      show('Moved to wishlist');
      await loadWishlist();
    } catch (error) {
      console.error('Failed to move to wishlist:', error);
      show('Failed to move to wishlist', 'error');
      if (customerId) {
        await fetchCart(customerId);
      }
    } finally {
      setSyncing(false);
    }
  }, [customerId, toggle, directDeleteItem, show, fetchCart, loadWishlist]);

  // ─── Add Wishlist Item to Cart (from cart screen) ───────────────────────────
  const handleAddWishlistItemToCart = useCallback(async (item: WishlistDisplayItem) => {
    if (!customerId) {
      show('Please login to add items to cart', 'error');
      return;
    }

    const itemKey = `${item.itemType}:${item.id}`;
    setAddingToCart(itemKey);

    try {
      const cartItem = {
        id: `${item.id}_${Date.now()}`,
        productId: item.id,
        name: item.name,
        image: item.images?.[0] || 'https://via.placeholder.com/300x300',
        price: item.price,
        quantity: 1,
        type: item.itemType,
        ...(item.itemType === 'package' ? { packageId: item.id } : {}),
      };

      await addItem(cartItem, customerId);
      await fetchCart(customerId);

      try {
        await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
          params: { customerId, productId: item.id, itemType: item.itemType }
        });
      } catch (err) {
        console.warn('⚠️ Backend wishlist removal failed, continuing:', err);
      }
      removeFromWishlist(item.id, item.itemType);

      setWishlistItems(prev => prev.filter(p => !(p.id === item.id && p.itemType === item.itemType)));

      show(`${item.name} added to cart 🛒`);
    } catch (error: any) {
      console.error('❌ Failed to add wishlist item to cart:', error);
      show('Failed to add to cart', 'error');
      if (customerId) {
        await fetchCart(customerId);
      }
    } finally {
      setAddingToCart(null);
    }
  }, [customerId, addItem, fetchCart, removeFromWishlist, show]);

  // ─── Render cart item ─────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: any }) => {
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
                onPress={() => directDeleteItem(item)}
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

  // ─── Render wishlist item (horizontal card) ─────────────────────────────────
  const renderWishlistItem = (item: WishlistDisplayItem) => {
    const itemKey = `${item.itemType}:${item.id}`;
    const isAdding = addingToCart === itemKey;

    return (
      <View key={itemKey} style={styles.wishlistCard}>
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x300' }}
          style={styles.wishlistImage}
          resizeMode="cover"
        />
        <View style={styles.wishlistBody}>
          <Text style={styles.wishlistName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.wishlistPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
          <TouchableOpacity
            style={[styles.wishlistAddBtn, isAdding && { opacity: 0.6 }]}
            onPress={() => handleAddWishlistItemToCart(item)}
            disabled={isAdding || syncing}
            activeOpacity={0.8}
          >
            {isAdding ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Plus color={COLORS.white} size={14} />
                <Text style={styles.wishlistAddText}>Add to Cart</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!isHydrated) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.syncingText}>Loading cart...</Text>
      </View>
    );
  }

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
            message={cartError || "Browse our premium collections and add items to your cart"}
          />
          <View style={{ paddingHorizontal: SPACING.xl }}>
            {cartError ? (
              <Button onPress={() => customerId && fetchCart(customerId)} fullWidth size="lg">Retry</Button>
            ) : (
              <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
            )}
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
        contentContainerStyle={{ 
          paddingHorizontal: SPACING.md, 
          paddingBottom: insets.bottom + SPACING.lg 
        }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View>
            {/* Coupon Section */}
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
              ) : null}
            </View>

            {/* ─── From Your Wishlist Section ─────────────────────────────── */}
            {wishlistItems.length > 0 && (
              <View style={styles.wishlistSection}>
                <View style={styles.wishlistSectionHeader}>
                  <View style={styles.wishlistSectionTitleRow}>
                    <Heart color={COLORS.error} size={18} fill={COLORS.error} />
                    <Text style={styles.wishlistSectionTitle}>From Your Wishlist</Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push('/wishlist')}>
                    <Text style={styles.wishlistSeeAll}>See All</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.wishlistSectionSubtitle}>
                  You might want to add these too
                </Text>
                <FlatList
                  data={wishlistItems}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => `${item.itemType}:${item.id}`}
                  renderItem={({ item }) => renderWishlistItem(item)}
                  contentContainerStyle={{ paddingVertical: SPACING.sm }}
                />
              </View>
            )}

            {/* Summary Section — Delivery & GST removed */}
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
              {/* ❌ Delivery row removed */}
              {/* ❌ GST (18%) row removed */}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>₹{finalTotal.toLocaleString('en-IN')}</Text>
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
          </View>
        }
      />

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
  appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
  couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },

  // ─── Wishlist section styles ──────────────────────────────────────────────
  wishlistSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  wishlistSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wishlistSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wishlistSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
  },
  wishlistSeeAll: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary[600],
  },
  wishlistSectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  wishlistCard: {
    width: 150,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
    padding: SPACING.sm,
    ...SHADOWS.small,
  },
  wishlistImage: {
    width: '100%',
    height: 100,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.neutral[100],
  },
  wishlistBody: {
    marginTop: SPACING.sm,
  },
  wishlistName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900],
    lineHeight: 16,
    minHeight: 32,
  },
  wishlistPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: COLORS.primary[700],
    marginTop: 4,
  },
  wishlistAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: COLORS.primary[700],
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  wishlistAddText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.white,
  },

  summary: { 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: RADIUS.xxl, 
    borderTopRightRadius: RADIUS.xxl, 
    padding: SPACING.lg, 
    paddingBottom: 40, 
    marginTop: SPACING.lg,
    ...SHADOWS.large 
  },
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





// // app/(tabs)/cart.tsx
// import { useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Minus, Plus, Trash2, Heart, Tag, ShoppingBag, ChevronRight, X, Star } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useCart } from '@/store/cart';
// import { useAuth } from '@/store/auth';
// import { useWishlist } from '@/store/wishlist';
// import { useToast } from '@/store/toast';
// import { Button } from '@/components/ui/Button';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { API_BASE_URL, mockApi } from '@/services/api';
// import { Product, Package } from '@/types';

// // ─── Types ──────────────────────────────────────────────────────────────────────
// interface Coupon {
//   id: number;
//   code: string;
//   description: string;
//   discount: number;
//   type: 'percentage' | 'fixed';
//   minOrder: number;
//   maxDiscount?: number;
//   usageLimit?: number;
//   perUserLimit?: number;
//   usedCount: number;
//   startDate: string;
//   endDate: string;
//   active: boolean;
// }

// type WishlistDisplayItem = {
//   id: string;
//   itemType: 'product' | 'package';
//   name: string;
//   price: number;
//   images: string[];
//   rating: number;
//   reviewCount: number;
// };

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
//     fetchCart,
//     addItem,
//     isHydrated,
//     cartError,
//   } = useCart();
//   const { state: authState } = useAuth();
//   const { state: wishlistState, toggle, remove: removeFromWishlist, fetchWishlist } = useWishlist();
//   const { show } = useToast();
//   const [showCoupons, setShowCoupons] = useState(false);
//   const [syncing, setSyncing] = useState(false);
//   const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
//   const [loadingCoupons, setLoadingCoupons] = useState(false);
  
//   // Wishlist state
//   const [wishlistItems, setWishlistItems] = useState<WishlistDisplayItem[]>([]);
//   const [loadingWishlist, setLoadingWishlist] = useState(false);
//   const [addingToCart, setAddingToCart] = useState<string | null>(null);

//   const customerId = authState.user?.id;

//   // ─── Load cart and coupons on mount ─────────────────────────────────────────
//   useEffect(() => {
//     console.log('📦 CartScreen mounted, customerId:', customerId);
//     if (customerId) {
//       fetchCart(customerId);
//       fetchAvailableCoupons();
//       loadWishlist();
//     }
//   }, [customerId]);

//   // ─── Load wishlist products (for "From Your Wishlist" section) ──────────────
//   const loadWishlist = useCallback(async () => {
//     if (!customerId) {
//       setWishlistItems([]);
//       return;
//     }
//     try {
//       setLoadingWishlist(true);
//       const entries = await fetchWishlist(customerId);
      
//       if (!entries || entries.length === 0) {
//         setWishlistItems([]);
//         return;
//       }

//       const [allProducts, allPackages] = await Promise.all([
//         mockApi.getProducts(),
//         mockApi.getPackages(),
//       ]);
//       const productMap = new Map(allProducts.map((item: Product) => [String(item.id), item]));
//       const packageMap = new Map(allPackages.map((item: Package) => [String(item.id), item]));

//       const resolved = entries.map(entry => {
//         if (entry.type === 'package') {
//           const item = packageMap.get(entry.id);
//           return item ? {
//             id: String(item.id),
//             itemType: 'package' as const,
//             name: item.name,
//             price: item.price,
//             images: item.images?.length ? item.images : [item.image].filter(Boolean),
//             rating: item.rating || 0,
//             reviewCount: item.reviewCount || 0,
//           } : null;
//         }
//         const item = productMap.get(entry.id);
//         return item ? {
//           id: String(item.id),
//           itemType: 'product' as const,
//           name: item.name,
//           price: item.price,
//           images: item.images || [],
//           rating: item.rating || 0,
//           reviewCount: item.reviewCount || 0,
//         } : null;
//       }).filter((item): item is WishlistDisplayItem => Boolean(item));

//       setWishlistItems(resolved);
//       console.log('📦 Wishlist items loaded for cart screen:', resolved.length);
//     } catch (error) {
//       console.error('❌ Failed to load wishlist on cart screen:', error);
//     } finally {
//       setLoadingWishlist(false);
//     }
//   }, [customerId, fetchWishlist]);

//   // ─── Fetch available coupons from API ──────────────────────────────────────
//   const fetchAvailableCoupons = useCallback(async () => {
//     try {
//       setLoadingCoupons(true);
//       console.log('📦 Fetching available coupons from:', `${API_BASE_URL}/coupons/active`);
//       const response = await axios.get(`${API_BASE_URL}/coupons/active`);
//       console.log('📦 Coupons response:', response.data);
      
//       if (response.data.success) {
//         setAvailableCoupons(response.data.data);
//         console.log('✅ Coupons loaded:', response.data.data.length);
//       } else {
//         console.log('❌ Failed to load coupons:', response.data.message);
//       }
//     } catch (error: any) {
//       console.error('❌ Failed to fetch coupons:', error);
//     } finally {
//       setLoadingCoupons(false);
//     }
//   }, []);

//   // ─── Validate and apply coupon ─────────────────────────────────────────────
//   const handleApplyCoupon = useCallback(async (code: string, discount: number, minOrder: number) => {
//     if (subtotal < minOrder) {
//       show(`Minimum order ₹${minOrder.toLocaleString('en-IN')} required`, 'error');
//       return;
//     }

//     try {
//       setSyncing(true);
      
//       const validateResponse = await axios.post(`${API_BASE_URL}/coupons/validate`, {
//         code: code,
//         subtotal: subtotal,
//         customerId: customerId
//       });

//       if (!validateResponse.data.success) {
//         show(validateResponse.data.message || 'Invalid coupon', 'error');
//         return;
//       }

//       await axios.post(`${API_BASE_URL}/coupons/apply`, {
//         code: code,
//         customerId: customerId
//       });

//       applyCoupon(code, discount);
//       setShowCoupons(false);
//       show(`Coupon ${code} applied successfully! 🎉`);
      
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } catch (error: any) {
//       console.error('❌ Failed to apply coupon:', error);
//       show(error.response?.data?.message || 'Failed to apply coupon', 'error');
//     } finally {
//       setSyncing(false);
//     }
//   }, [subtotal, customerId, applyCoupon, show, fetchCart]);

//   // ─── Remove coupon ──────────────────────────────────────────────────────────
//   const handleRemoveCoupon = useCallback(() => {
//     removeCoupon();
//     show('Coupon removed');
//   }, [removeCoupon, show]);

//   // ─── Direct Delete Function ──────────────────────────────────────────────────
//   const directDeleteItem = useCallback(async (item: any) => {
//     console.log('🗑️ Direct delete called for item:', item);
    
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
    
//     try {
//       setSyncing(true);
//       const response = await axios.delete(`${API_BASE_URL}/cart/item`, {
//         data: { 
//           customerId: customerId, 
//           productId: item.productId 
//         },
//       });
      
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
//       const response = await axios.delete(`${API_BASE_URL}/cart/${customerId}`);
//       if (response.data.success) {
//         clearCart();
//         await fetchCart(customerId);
//         show('Cart cleared successfully');
//       } else {
//         show('Failed to clear cart', 'error');
//         await fetchCart(customerId);
//       }
//     } catch (error: any) {
//       console.error('❌ Failed to clear cart:', error);
//       show('Failed to clear cart', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, state.items.length, clearCart, fetchCart, show]);

//   // ─── Update Quantity ─────────────────────────────────────────────────────────
//   const handleUpdateQty = useCallback(async (item: any, newQuantity: number) => {
//     if (!customerId) {
//       show('Please login to update cart', 'error');
//       return;
//     }
//     try {
//       setSyncing(true);
//       if (newQuantity <= 0) {
//         await directDeleteItem(item);
//         setSyncing(false);
//         return;
//       }
//       await updateQty(item.id, newQuantity, item.productId, customerId);
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
//     if (!customerId) {
//       show('Please login to manage cart', 'error');
//       return;
//     }
//     if (state.items.length === 0) {
//       show('Your cart is already empty', 'info');
//       return;
//     }
//     await directClearCart();
//   }, [customerId, state.items.length, directClearCart, show]);

//   // ─── Move to Wishlist ──────────────────────────────────────────────────────
//   const handleMoveToWishlist = useCallback(async (item: any) => {
//     if (!customerId) {
//       show('Please login to manage wishlist', 'error');
//       return;
//     }
//     try {
//       setSyncing(true);
//       await toggle(item.productId, customerId, {
//         name: item.name,
//         price: item.price,
//         image: item.image,
//       }, item.type === 'package' ? 'package' : 'product');
//       await directDeleteItem(item);
//       show('Moved to wishlist');
//       // Refresh wishlist items section
//       await loadWishlist();
//     } catch (error) {
//       console.error('Failed to move to wishlist:', error);
//       show('Failed to move to wishlist', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setSyncing(false);
//     }
//   }, [customerId, toggle, directDeleteItem, show, fetchCart, loadWishlist]);

//   // ─── Add Wishlist Item to Cart (from cart screen) ───────────────────────────
//   const handleAddWishlistItemToCart = useCallback(async (item: WishlistDisplayItem) => {
//     if (!customerId) {
//       show('Please login to add items to cart', 'error');
//       return;
//     }

//     const itemKey = `${item.itemType}:${item.id}`;
//     setAddingToCart(itemKey);

//     try {
//       // 1. Add to cart
//       const cartItem = {
//         id: `${item.id}_${Date.now()}`,
//         productId: item.id,
//         name: item.name,
//         image: item.images?.[0] || 'https://via.placeholder.com/300x300',
//         price: item.price,
//         quantity: 1,
//         type: item.itemType,
//         ...(item.itemType === 'package' ? { packageId: item.id } : {}),
//       };

//       await addItem(cartItem, customerId);
//       await fetchCart(customerId);

//       // 2. Remove from wishlist (both backend and local state)
//       try {
//         await axios.delete(`${API_BASE_URL}/wishlist/remove`, {
//           params: { customerId, productId: item.id, itemType: item.itemType }
//         });
//       } catch (err) {
//         console.warn('⚠️ Backend wishlist removal failed, continuing:', err);
//       }
//       removeFromWishlist(item.id, item.itemType);

//       // 3. Update local wishlist display
//       setWishlistItems(prev => prev.filter(p => !(p.id === item.id && p.itemType === item.itemType)));

//       show(`${item.name} added to cart 🛒`);
//     } catch (error: any) {
//       console.error('❌ Failed to add wishlist item to cart:', error);
//       show('Failed to add to cart', 'error');
//       if (customerId) {
//         await fetchCart(customerId);
//       }
//     } finally {
//       setAddingToCart(null);
//     }
//   }, [customerId, addItem, fetchCart, removeFromWishlist, show]);

//   // ─── Render cart item ─────────────────────────────────────────────────────
//   const renderItem = ({ item }: { item: any }) => {
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
//                 onPress={() => directDeleteItem(item)}
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

//   // ─── Render wishlist item (horizontal card) ─────────────────────────────────
//   const renderWishlistItem = (item: WishlistDisplayItem) => {
//     const itemKey = `${item.itemType}:${item.id}`;
//     const isAdding = addingToCart === itemKey;

//     return (
//       <View key={itemKey} style={styles.wishlistCard}>
//         <Image
//           source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x300' }}
//           style={styles.wishlistImage}
//           resizeMode="cover"
//         />
//         <View style={styles.wishlistBody}>
//           <Text style={styles.wishlistName} numberOfLines={2}>{item.name}</Text>
//           <Text style={styles.wishlistPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
//           <TouchableOpacity
//             style={[styles.wishlistAddBtn, isAdding && { opacity: 0.6 }]}
//             onPress={() => handleAddWishlistItemToCart(item)}
//             disabled={isAdding || syncing}
//             activeOpacity={0.8}
//           >
//             {isAdding ? (
//               <ActivityIndicator size="small" color={COLORS.white} />
//             ) : (
//               <>
//                 <Plus color={COLORS.white} size={14} />
//                 <Text style={styles.wishlistAddText}>Add to Cart</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   if (!isHydrated) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.primary[600]} />
//         <Text style={styles.syncingText}>Loading cart...</Text>
//       </View>
//     );
//   }

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
//             message={cartError || "Browse our premium collections and add items to your cart"}
//           />
//           <View style={{ paddingHorizontal: SPACING.xl }}>
//             {cartError ? (
//               <Button onPress={() => customerId && fetchCart(customerId)} fullWidth size="lg">Retry</Button>
//             ) : (
//               <Button onPress={() => router.push('/(tabs)/categories')} fullWidth size="lg">Start Shopping</Button>
//             )}
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
//         contentContainerStyle={{ 
//           paddingHorizontal: SPACING.md, 
//           paddingBottom: insets.bottom + SPACING.lg 
//         }}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListFooterComponent={
//           <View>
//             {/* Coupon Section */}
//             <View style={styles.couponSection}>
//               {state.appliedCoupon ? (
//                 <View style={styles.appliedCoupon}>
//                   <View style={styles.couponInfo}>
//                     <Tag color={COLORS.success} size={18} />
//                     <View>
//                       <Text style={styles.couponCode}>{state.appliedCoupon}</Text>
//                       <Text style={styles.couponSaved}>You saved ₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//                     </View>
//                   </View>
//                   <TouchableOpacity onPress={handleRemoveCoupon}>
//                     <X color={COLORS.neutral[500]} size={20} />
//                   </TouchableOpacity>
//                 </View>
//               ) : null}
//             </View>

//             {/* ─── From Your Wishlist Section ─────────────────────────────── */}
//             {wishlistItems.length > 0 && (
//               <View style={styles.wishlistSection}>
//                 <View style={styles.wishlistSectionHeader}>
//                   <View style={styles.wishlistSectionTitleRow}>
//                     <Heart color={COLORS.error} size={18} fill={COLORS.error} />
//                     <Text style={styles.wishlistSectionTitle}>From Your Wishlist</Text>
//                   </View>
//                   <TouchableOpacity onPress={() => router.push('/wishlist')}>
//                     <Text style={styles.wishlistSeeAll}>See All</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <Text style={styles.wishlistSectionSubtitle}>
//                   You might want to add these too
//                 </Text>
//                 <FlatList
//                   data={wishlistItems}
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                   keyExtractor={(item) => `${item.itemType}:${item.id}`}
//                   renderItem={({ item }) => renderWishlistItem(item)}
//                   contentContainerStyle={{ paddingVertical: SPACING.sm }}
//                 />
//               </View>
//             )}

//             {/* Summary Section */}
//             <View style={styles.summary}>
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Subtotal</Text>
//                 <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
//               </View>
//               {state.couponDiscount > 0 && (
//                 <View style={styles.summaryRow}>
//                   <Text style={styles.summaryLabel}>Discount</Text>
//                   <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{state.couponDiscount.toLocaleString('en-IN')}</Text>
//                 </View>
//               )}
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Delivery</Text>
//                 <Text style={styles.summaryValue}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}</Text>
//               </View>
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>GST (18%)</Text>
//                 <Text style={styles.summaryValue}>₹{gst.toLocaleString('en-IN')}</Text>
//               </View>
//               <View style={styles.summaryDivider} />
//               <View style={styles.summaryRow}>
//                 <Text style={styles.totalLabel}>Grand Total</Text>
//                 <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
//               </View>
//               <Button 
//                 onPress={() => router.push('/checkout')} 
//                 fullWidth 
//                 size="lg" 
//                 style={{ marginTop: SPACING.md }}
//                 disabled={state.items.length === 0 || syncing}
//               >
//                 Proceed to Checkout
//               </Button>
//             </View>
//           </View>
//         }
//       />

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
//             {loadingCoupons ? (
//               <View style={styles.loadingCoupons}>
//                 <ActivityIndicator size="large" color={COLORS.primary[600]} />
//                 <Text style={styles.loadingText}>Loading coupons...</Text>
//               </View>
//             ) : availableCoupons.length === 0 ? (
//               <View style={styles.noCoupons}>
//                 <Tag color={COLORS.neutral[400]} size={48} />
//                 <Text style={styles.noCouponsText}>No coupons available</Text>
//                 <Text style={styles.noCouponsSubtext}>Check back later for offers</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={availableCoupons}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={({ item }) => {
//                   const discountAmount = item.type === 'percentage' 
//                     ? Math.min(
//                         Math.round(subtotal * item.discount / 100),
//                         item.maxDiscount || Infinity
//                       )
//                     : item.discount;
                  
//                   return (
//                     <TouchableOpacity 
//                       style={styles.couponCard} 
//                       onPress={() => handleApplyCoupon(
//                         item.code,
//                         discountAmount,
//                         item.minOrder
//                       )}
//                       disabled={syncing}
//                     >
//                       <View style={styles.couponCardLeft}>
//                         <Text style={styles.couponCardCode}>{item.code}</Text>
//                         <Text style={styles.couponCardDesc}>{item.description}</Text>
//                         <Text style={styles.couponCardMin}>
//                           Min order: ₹{item.minOrder.toLocaleString('en-IN')}
//                         </Text>
//                         {item.maxDiscount && (
//                           <Text style={styles.couponCardMax}>
//                             Max discount: ₹{item.maxDiscount.toLocaleString('en-IN')}
//                           </Text>
//                         )}
//                       </View>
//                       <View style={styles.couponCardRight}>
//                         <Text style={styles.couponCardDiscount}>
//                           {item.type === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}
//                         </Text>
//                         <Text style={styles.couponCardOff}>OFF</Text>
//                       </View>
//                     </TouchableOpacity>
//                   );
//                 }}
//                 contentContainerStyle={{ paddingBottom: 20 }}
//               />
//             )}
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
//   appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
//   couponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   couponCode: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
//   couponSaved: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },

//   // ─── Wishlist section styles ──────────────────────────────────────────────
//   wishlistSection: {
//     marginTop: SPACING.lg,
//     paddingTop: SPACING.md,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.neutral[200],
//   },
//   wishlistSectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   wishlistSectionTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   wishlistSectionTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: COLORS.neutral[900],
//   },
//   wishlistSeeAll: {
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.primary[600],
//   },
//   wishlistSectionSubtitle: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: COLORS.neutral[500],
//     marginTop: 2,
//   },
//   wishlistCard: {
//     width: 150,
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.lg,
//     marginRight: SPACING.md,
//     padding: SPACING.sm,
//     ...SHADOWS.small,
//   },
//   wishlistImage: {
//     width: '100%',
//     height: 100,
//     borderRadius: RADIUS.md,
//     backgroundColor: COLORS.neutral[100],
//   },
//   wishlistBody: {
//     marginTop: SPACING.sm,
//   },
//   wishlistName: {
//     fontSize: 12,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.neutral[900],
//     lineHeight: 16,
//     minHeight: 32,
//   },
//   wishlistPrice: {
//     fontSize: 14,
//     fontFamily: 'Inter-Bold',
//     color: COLORS.primary[700],
//     marginTop: 4,
//   },
//   wishlistAddBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 4,
//     backgroundColor: COLORS.primary[700],
//     paddingVertical: 8,
//     borderRadius: RADIUS.md,
//     marginTop: SPACING.sm,
//   },
//   wishlistAddText: {
//     fontSize: 11,
//     fontFamily: 'Inter-SemiBold',
//     color: COLORS.white,
//   },

//   summary: { 
//     backgroundColor: COLORS.white, 
//     borderTopLeftRadius: RADIUS.xxl, 
//     borderTopRightRadius: RADIUS.xxl, 
//     padding: SPACING.lg, 
//     paddingBottom: 40, 
//     marginTop: SPACING.lg,
//     ...SHADOWS.large 
//   },
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
//   couponCardMax: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 2 },
//   couponCardRight: { width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gold[50] },
//   couponCardDiscount: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
//   couponCardOff: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.gold[600] },
//   loadingCoupons: { padding: SPACING.xl, alignItems: 'center' },
//   loadingText: { marginTop: 12, fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   noCoupons: { padding: SPACING.xl, alignItems: 'center' },
//   noCouponsText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[600], marginTop: 12 },
//   noCouponsSubtext: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
// });

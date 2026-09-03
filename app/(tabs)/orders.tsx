// app/(tabs)/orders.tsx
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useToast } from '@/store/toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_id: number;
  address_label: string;
  address_full_name: string;
  address_phone: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  address_state: string;
  address_pincode: string;
  address_country: string;
  event_date: string;
  event_time: string;
  event_type: string;
  venue: string;
  guest_count: number;
  special_instructions: string;
  items: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  gst: number;
  coupon_discount: number;
  coupon_code: string;
  grand_total: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

const tabs = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state: authState } = useAuth();
  const { show } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const customerId = authState.user?.id;

  const handleBack = () => {
    router.replace('/profile');
  };

  // ─── Fetch orders from API ──────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    if (!customerId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/customer-orders/customer/${customerId}`);
      console.log('📦 Orders response:', response.data);
      
      let ordersData = [];
      if (response.data?.success && response.data?.data) {
        ordersData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      }
      
      const parsedOrders = ordersData.map((order: any) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : [],
        status: order.status || 'pending',
        grand_total: parseFloat(order.grand_total) || 0,
        order_number: order.order_number || order.id || 'N/A',
        created_at: order.created_at || new Date().toISOString(),
        event_date: order.event_date || '',
        event_type: order.event_type || 'N/A',
      }));
      
      setOrders(parsedOrders);
      console.log('✅ Orders loaded:', parsedOrders.length);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      show('Failed to load orders', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [customerId, show]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ─── Refresh ──────────────────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  // ─── Filter orders by tab ──────────────────────────────────────────────────
  const getFilteredOrders = () => {
    if (activeTab === 'upcoming') {
      return orders.filter(o => o.status === 'pending' || o.status === 'approved' || o.status === 'processing');
    } else if (activeTab === 'completed') {
      return orders.filter(o => o.status === 'completed');
    } else {
      return orders.filter(o => o.status === 'rejected' || o.status === 'cancelled');
    }
  };

  const filteredOrders = getFilteredOrders();

  // ─── Status configuration ──────────────────────────────────────────────────
  const statusConfig: Record<string, { color: string; bg: string; label: string; icon: any }> = {
    pending: { color: COLORS.warning, bg: COLORS.warning + '20', label: 'Pending', icon: Clock },
    approved: { color: COLORS.primary?.[600] || '#4F46E5', bg: COLORS.primary?.[100] || '#EEF2FF', label: 'Approved', icon: CheckCircle },
    rejected: { color: COLORS.error, bg: COLORS.error + '20', label: 'Rejected', icon: XCircle },
    processing: { color: COLORS.gold?.[600] || '#D97706', bg: COLORS.gold?.[50] || '#FFFBEB', label: 'Processing', icon: Package },
    completed: { color: COLORS.success, bg: COLORS.success + '20', label: 'Completed', icon: CheckCircle },
    cancelled: { color: COLORS.error, bg: COLORS.error + '20', label: 'Cancelled', icon: XCircle },
  };

  // ─── Format date ────────────────────────────────────────────────────────────
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  // ─── Get status config ─────────────────────────────────────────────────────
  const getStatusConfig = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  // ─── Render loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary?.[600] || '#4F46E5'} />
        <Text style={{ marginTop: 16, color: COLORS.neutral?.[500] || '#6B7280', fontFamily: 'Inter-Regular' }}>
          Loading your orders...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>My Orders</Text>

        <Text style={styles.subtitle}>
          Track and manage your bookings
        </Text>

        {orders.length > 0 && (
          <Text style={styles.orderCount}>
            Total: {orders.length} order{orders.length > 1 ? 's' : ''}
          </Text>
        )}
      </View>

      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const count = orders.filter((o) => {
            if (tab.key === 'upcoming') {
              return o.status === 'pending' || o.status === 'approved' || o.status === 'processing';
            }
            if (tab.key === 'completed') {
              return o.status === 'completed';
            }
            return o.status === 'rejected' || o.status === 'cancelled';
          }).length;
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, activeTab === tab.key && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, activeTab === tab.key && styles.tabBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredOrders}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: SPACING.md, 
          paddingBottom: SPACING.xl,
          flexGrow: filteredOrders.length === 0 ? 1 : undefined,
        }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary?.[600] || '#4F46E5'} 
          />
        }
        renderItem={({ item }) => {
          const cfg = getStatusConfig(item.status);
          const StatusIcon = cfg.icon;
          const itemCount = item.items?.length || 0;
          
          return (
            <TouchableOpacity 
              style={styles.orderCard} 
              onPress={() => router.push(`/order-details/${item.id}`)} 
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>#{item.order_number || item.id}</Text>
                  <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <StatusIcon color={cfg.color} size={14} />
                  <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
              
              <View style={styles.orderItems}>
                {item.items && item.items.length > 0 ? (
                  item.items.slice(0, 2).map((it: any, i: number) => (
                    <Text key={i} style={styles.orderItem} numberOfLines={1}>
                      • {it.name || it.product_name || 'Item'} × {it.quantity || 0}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.orderItem}>No items</Text>
                )}
                {itemCount > 2 && (
                  <Text style={styles.orderItem}>+{itemCount - 2} more</Text>
                )}
              </View>
              
              <View style={styles.orderFooter}>
                
                <View style={styles.orderTotalWrap}>
                  <Text style={styles.orderTotalLabel}>Total</Text>
                  <Text style={styles.orderTotalValue}>
                    ₹{(item.grand_total || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.orderActionRow}>
                <ChevronRight color={COLORS.neutral?.[400] || '#9CA3AF'} size={20} />
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => (item.id ? `order-${item.id}` : `order-${index}`)}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', paddingTop: 60 }}>
            <EmptyState
              icon={<Package color={COLORS.neutral?.[400] || '#9CA3AF'} size={36} />}
              title="No orders yet"
              message={`No ${activeTab} orders to show`}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite || '#F9FAFB' },
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  title: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral?.[900] || '#111827' },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral?.[500] || '#6B7280', marginTop: 2 },
  orderCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral?.[400] || '#9CA3AF', marginTop: 4 },
  tabsRow: { 
    flexDirection: 'row', 
    paddingHorizontal: SPACING.md, 
    marginBottom: SPACING.md, 
    gap: SPACING.sm || 8 
  },
  tab: { 
    flex: 1, 
    paddingVertical: 10, 
    borderRadius: RADIUS.lg || 12, 
    alignItems: 'center', 
    backgroundColor: COLORS.white || '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabActive: { backgroundColor: COLORS.primary?.[700] || '#4338CA' },
  tabText: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral?.[600] || '#4B5563' },
  tabTextActive: { color: COLORS.white || '#FFFFFF', fontFamily: 'Inter-SemiBold' },
  tabBadge: {
    backgroundColor: COLORS.primary?.[100] || '#EEF2FF',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary?.[600] || '#4F46E5',
  },
  tabBadgeTextActive: {
    color: COLORS.white || '#FFFFFF',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary?.[700] || '#4338CA',
  },
  orderCard: { 
    backgroundColor: COLORS.white || '#FFFFFF', 
    borderRadius: RADIUS.xxl || 20, 
    padding: SPACING.md, 
    marginBottom: SPACING.md,
    ...(SHADOWS?.small || { 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.05, 
      shadowRadius: 4,
      elevation: 2 
    })
  },
  orderHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  orderNumber: { 
    fontSize: 15, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.neutral?.[900] || '#111827' 
  },
  orderDate: { 
    fontSize: 12, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral?.[500] || '#6B7280', 
    marginTop: 2 
  },
  statusBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: RADIUS.sm || 4 
  },
  statusText: { 
    fontSize: 11, 
    fontFamily: 'Inter-SemiBold' 
  },
  orderItems: { 
    marginTop: SPACING.md, 
    paddingLeft: 4 
  },
  orderItem: { 
    fontSize: 13, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral?.[600] || '#4B5563', 
    marginBottom: 2 
  },
  orderFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: SPACING.md, 
    paddingTop: SPACING.md, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.neutral?.[100] || '#F3F4F6' 
  },
  orderEventLabel: { 
    fontSize: 11, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral?.[500] || '#6B7280' 
  },
  orderEventValue: { 
    fontSize: 13, 
    fontFamily: 'Inter-SemiBold', 
    color: COLORS.neutral?.[900] || '#111827', 
    marginTop: 2 
  },
  orderTotalWrap: { 
    alignItems: 'flex-end' 
  },
  orderTotalLabel: { 
    fontSize: 11, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral?.[500] || '#6B7280' 
  },
  orderTotalValue: { 
    fontSize: 16, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.primary?.[700] || '#4338CA', 
    marginTop: 2 
  },
  orderActionRow: { 
    position: 'absolute', 
    right: 16, 
    bottom: 16 
  },
});
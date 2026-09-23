
import { useState, useEffect, useCallback, useRef } from 'react';
import { formatOrderAddress, resolveOrderImage } from '@/utils/orderMedia';
import { normalizeOrderStatus, orderTimeline } from '@/utils/orderTimeline';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  XCircle, 
  Calendar, 
  MapPin, 
  Users, 
  Share2,
  FileText
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';
import { useAuth } from '@/store/auth';
import { downloadInvoice, InvoiceData } from '@/services/invoice';

// ─── Types ──────────────────────────────────────────────────────────────────────
interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  selected_size?: string;
  selected_color?: string;
}

interface Order {
  orderSource: 'customer' | 'admin' | 'salesman';
  invoice_number?: string;
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

// ─── Status Configuration ──────────────────────────────────────────────────────
const statusConfig: Record<string, { color: string; bg: string; label: string; icon: any }> = {
  pending: { color: COLORS.warning, bg: COLORS.warning + '20', label: 'Pending', icon: Clock },
  approved: { color: COLORS.primary[600], bg: COLORS.primary[100], label: 'Approved', icon: CheckCircle },
  rejected: { color: COLORS.error, bg: COLORS.error + '20', label: 'Rejected', icon: XCircle },
  processing: { color: COLORS.gold[600], bg: COLORS.gold[50], label: 'Processing', icon: Package },
  completed: { color: COLORS.success, bg: COLORS.success + '20', label: 'Completed', icon: CheckCircle },
  cancelled: { color: COLORS.error, bg: COLORS.error + '20', label: 'Cancelled', icon: XCircle },
};

export default function OrderDetailsScreen() {
  const { id, source = 'customer' } = useLocalSearchParams<{ id: string; source?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const { state: authState } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const requestVersion = useRef(0);
  const invoiceBusy = useRef(false);

  // ─── Fetch order details from API ──────────────────────────────────────────
  const fetchOrderDetails = useCallback(async () => {
    const version = ++requestVersion.current;
    if (authState.isLoading) return;
    if (!authState.token) { setOrder(null); setError('Please sign in to view your order'); setLoading(false); return; }
    if (!id || !['customer', 'admin', 'salesman'].includes(source)) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setOrder(null);
      
      console.log('📦 Fetching order details for ID:', id);
      const response = await axios.get(`${API_BASE_URL}/customer-orders/${id}`, {
        params: { source }, headers: { Authorization: `Bearer ${authState.token}` },
      });
      
      if (version !== requestVersion.current) return;
      if (response.data.success && response.data.data) { 
        const orderData = response.data.data;
        const parsedOrder = {
          ...orderData,
          items: Array.isArray(orderData.items) ? orderData.items : [],
          status: normalizeOrderStatus(orderData.status) as Order['status'],
          grand_total: parseFloat(orderData.grand_total) || 0,
          subtotal: parseFloat(orderData.subtotal) || 0,
          delivery_charge: parseFloat(orderData.delivery_charge) || 0,
          gst: parseFloat(orderData.gst ?? orderData.tax) || 0,
          coupon_discount: parseFloat(orderData.coupon_discount) || 0,
        };
        setOrder(parsedOrder);
        console.log('✅ Order details loaded');
      } else {
        setError('Order not found');
      }
    } catch (error: any) {
      if (version !== requestVersion.current) return;
      console.error('Failed to fetch order details:', error);
      setError(error.response?.data?.message || 'Failed to load order details');
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [id, source, authState.token, authState.isLoading]);

  useFocusEffect(useCallback(() => {
    fetchOrderDetails();
    const timer = setInterval(fetchOrderDetails, 30000);
    if (Platform.OS === 'web') window.addEventListener('focus', fetchOrderDetails);
    return () => {
      requestVersion.current++;
      clearInterval(timer);
      if (Platform.OS === 'web') window.removeEventListener('focus', fetchOrderDetails);
    };
  }, [fetchOrderDetails]));

  // ─── Format date ────────────────────────────────────────────────────────────
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const isInvoiceAvailable = Boolean(order?.invoice_number?.trim()) && String(order?.status || '').trim().toLowerCase() === 'completed';

  // ─── Download Invoice ──────────────────────────────────────────────────────
  const handleDownloadInvoice = useCallback(async () => {
    if (invoiceBusy.current) return;
    if (!order) {
      show('Order not found', 'error');
      return;
    }

    if (!order.invoice_number?.trim()) {
      show('Invoice has not been generated yet', 'info');
      return;
    }

    if (String(order.status || '').trim().toLowerCase() !== 'completed') {
      show('Invoice is available only after the order is completed', 'info');
      return;
    }

    try {
      setDownloading(true);
      show('Generating PDF invoice...', 'info');

      // Log the order data to debug
      console.log('📄 Order data for invoice:', {
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        eventType: order.event_type,
        eventDate: order.event_date,
        eventTime: order.event_time,
        venue: order.venue,
        guestCount: order.guest_count,
        specialInstructions: order.special_instructions,
        address: {
          fullName: order.address_full_name,
          line1: order.address_line1,
          line2: order.address_line2,
          city: order.address_city,
          state: order.address_state,
          pincode: order.address_pincode,
          country: order.address_country,
        },
        items: order.items,
        subtotal: order.subtotal,
        deliveryCharge: order.delivery_charge,
        gst: order.gst,
        couponDiscount: order.coupon_discount,
        couponCode: order.coupon_code,
        grandTotal: order.grand_total,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
      });

      const invoiceData: InvoiceData = {
        orderId: order.id,
        orderSource: order.orderSource,
        orderNumber: order.order_number || String(order.id),
        customerName: order.customer_name || 'N/A',
        customerEmail: order.customer_email || 'N/A',
        customerPhone: order.customer_phone || 'N/A',
        orderDate: order.created_at,
        eventDate: order.event_date || '',
        eventTime: order.event_time || '',
        eventType: order.event_type || 'N/A',
        venue: order.venue || 'N/A',
        guestCount: order.guest_count || 0,
        specialInstructions: order.special_instructions || '',
        items: (order.items || []).map(item => ({
          name: item.name || 'Item',
          quantity: item.quantity || 0,
          price: item.price || 0,
          total: (item.price || 0) * (item.quantity || 0),
          size: item.selectedSize || item.selected_size,
          color: item.selectedColor || item.selected_color,
        })),
        subtotal: order.subtotal || 0,
        deliveryCharge: order.delivery_charge || 0,
        gst: order.gst || 0,
        couponDiscount: order.coupon_discount || 0,
        couponCode: order.coupon_code || undefined,
        grandTotal: order.grand_total || 0,
        paymentMethod: order.payment_method || 'N/A',
        paymentStatus: order.payment_status || 'pending',
        address: {
          fullName: order.address_full_name || 'N/A',
          line1: order.address_line1 || '',
          line2: order.address_line2 || '',
          city: order.address_city || '',
          state: order.address_state || '',
          pincode: order.address_pincode || '',
          country: order.address_country || 'India',
        },
      };

      invoiceBusy.current = true;
      await downloadInvoice({ ...invoiceData, invoiceNumber: order.invoice_number }, authState.token);
      show('PDF Invoice downloaded successfully! ✅');
    } catch (error: any) {
      console.error('Error downloading invoice:', error);
      Alert.alert(
        'Download Failed',
        'Failed to download PDF invoice. Please try again or contact support.',
        [{ text: 'OK' }]
      );
      show('Failed to download invoice: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      invoiceBusy.current = false;
      setDownloading(false);
    }
  }, [order, show, authState.token]);

  // ─── Share Invoice ──────────────────────────────────────────────────────────
  const handleShareInvoice = useCallback(async () => {
    if (!order) {
      show('Order not found', 'error');
      return;
    }

    if (!order.invoice_number?.trim()) {
      show('Invoice has not been generated yet', 'info');
      return;
    }

    if (String(order.status || '').trim().toLowerCase() !== 'completed') {
      show('Invoice is available only after the order is completed', 'info');
      return;
    }

    try {
      setDownloading(true);
      show('Generating invoice for sharing...', 'info');

      const invoiceData: InvoiceData = {
        orderId: order.id,
        orderSource: order.orderSource,
        orderNumber: order.order_number || String(order.id),
        customerName: order.customer_name || 'N/A',
        customerEmail: order.customer_email || 'N/A',
        customerPhone: order.customer_phone || 'N/A',
        orderDate: order.created_at,
        eventDate: order.event_date || '',
        eventTime: order.event_time || '',
        eventType: order.event_type || 'N/A',
        venue: order.venue || 'N/A',
        guestCount: order.guest_count || 0,
        specialInstructions: order.special_instructions || '',
        items: (order.items || []).map(item => ({
          name: item.name || 'Item',
          quantity: item.quantity || 0,
          price: item.price || 0,
          total: (item.price || 0) * (item.quantity || 0),
          size: item.selectedSize || item.selected_size,
          color: item.selectedColor || item.selected_color,
        })),
        subtotal: order.subtotal || 0,
        deliveryCharge: order.delivery_charge || 0,
        gst: order.gst || 0,
        couponDiscount: order.coupon_discount || 0,
        couponCode: order.coupon_code || undefined,
        grandTotal: order.grand_total || 0,
        paymentMethod: order.payment_method || 'N/A',
        paymentStatus: order.payment_status || 'pending',
        address: {
          fullName: order.address_full_name || 'N/A',
          line1: order.address_line1 || '',
          line2: order.address_line2 || '',
          city: order.address_city || '',
          state: order.address_state || '',
          pincode: order.address_pincode || '',
          country: order.address_country || 'India',
        },
      };

      // For mobile, use the share functionality
      if (Platform.OS !== 'web') {
        await downloadInvoice({ ...invoiceData, invoiceNumber: order.invoice_number }, authState.token);
        show('Invoice shared successfully! ✅');
      } else {
        // Web: Use Web Share API
        const { generateInvoiceHTML } = require('@/services/invoice');
        const htmlContent = generateInvoiceHTML(invoiceData);
        const fileName = `Invoice_${invoiceData.orderNumber}_${Date.now()}.html`;
        
        if (navigator.share) {
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const file = new File([blob], fileName, { type: 'text/html' });
          await navigator.share({
            title: `Invoice #${invoiceData.orderNumber}`,
            files: [file],
          });
          show('Invoice shared successfully! ✅');
        } else {
          // Fallback: Download
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          show('Invoice downloaded successfully! ✅');
        }
      }
    } catch (error: any) {
      console.error('Error sharing invoice:', error);
      show('Failed to share invoice: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setDownloading(false);
    }
  }, [order, show, authState.token]);

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>
          Loading order details...
        </Text>
      </View>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: SPACING.xl }]}>
        <Package color={COLORS.neutral[400]} size={48} />
        <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[700], marginTop: 16 }}>
          Order Not Found
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8, textAlign: 'center' }}>
          {error || 'The order you\'re looking for doesn\'t exist'}
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: COLORS.primary[600], borderRadius: RADIUS.lg }}
          onPress={() => router.back()}
        >
          <Text style={{ color: COLORS.white, fontFamily: 'Inter-SemiBold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cfg = getStatusConfig(order.status);
  const StatusIcon = cfg.icon;

  // ─── Main Render ────────────────────────────────────────────────────────────
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Order Details</Text>
          <Text style={styles.orderNum}>#{order.order_number || order.id}</Text>
          {order.invoice_number ? (
            <Text style={{ fontSize: 12, fontFamily: 'Inter-Medium', color: COLORS.primary[600], marginTop: 2 }}>
              Invoice Number: {order.invoice_number}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Status Banner */}
      {/* <View style={[styles.statusBanner, { backgroundColor: cfg.color + '20' }]}>
        <View style={[styles.statusIconWrap, { backgroundColor: cfg.color }]}>
          <StatusIcon color={COLORS.white} size={28} />
        </View>
        <View>
          <Text style={[styles.statusTitle, { color: cfg.color }]}>{cfg.label}</Text>

        </View>
      </View> */}

      {/* Order Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Timeline</Text>
        <View style={styles.timeline}>
          {orderTimeline(order.status, order.created_at, order.updated_at).map((step, i, steps) => {
            const stepCfg = getStatusConfig(step.status);
            const StepIcon = stepCfg.icon;
            const { isDone, isCurrent } = step;
            
            return (
              <View key={i} style={styles.timelineItem}>
                <View style={[styles.timelineIcon, isDone && styles.timelineIconDone, isCurrent && { borderColor: cfg.color, borderWidth: 2 }]}>
                  <StepIcon color={isDone ? COLORS.white : COLORS.neutral[400]} size={16} />
                </View>
                {i < steps.length - 1 && <View style={[styles.timelineLine, isDone && steps[i + 1].isDone && styles.timelineLineDone]} />}
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, isDone && styles.timelineLabelDone]}>
                    {step.label}
                    {isCurrent && <Text style={{ color: cfg.color, fontSize: 10, fontFamily: 'Inter-Medium' }}> • Current</Text>}
                  </Text>
                  {step.date ? (
                    <Text style={styles.timelineDate}>{formatDate(step.date)}</Text>
                  ) : (
                    <Text style={styles.timelinePending}>{isCurrent ? 'Current status' : isDone ? 'Reached' : 'Not reached'}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>


      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.detailCard}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressName}>{order.address_full_name || 'N/A'}</Text>
            {formatOrderAddress(order as unknown as Record<string, unknown>).map((line, index) => <Text key={index} style={styles.addressText}>{line}</Text>)}
            <Text style={styles.addressPhone}>📞 {order.address_phone || order.customer_phone || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items ({order.items?.length || 0})</Text>
        {order.items && order.items.length > 0 ? (
          order.items.map((item, i) => (
            <View key={i} style={styles.itemCard}>
              <Image 
                source={resolveOrderImage(item.image) ? { uri: resolveOrderImage(item.image) } : require('@/assets/images/icon.png')}
                style={styles.itemImage} 
                resizeMode="cover" 
              />
              <View style={styles.itemBody}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name || 'Item'}</Text>
                {(item.selectedSize || item.selected_size) ? <Text style={styles.itemQty}>Size: {item.selectedSize || item.selected_size}</Text> : null}
                {(item.selectedColor || item.selected_color) ? <Text style={styles.itemQty}>Colour: {item.selectedColor || item.selected_color}</Text> : null}
                <Text style={styles.itemQty}>Qty: {item.quantity || 0}</Text>
                <Text style={styles.itemPrice}>₹{((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN')}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noItemsText}>No items in this order</Text>
        )}
      </View>

      {/* Payment Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{order.subtotal?.toLocaleString('en-IN') || '0'}</Text>
          </View>
          {order.coupon_discount > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{order.coupon_discount.toLocaleString('en-IN')}</Text>
            </View>
          )}
          {/* <View style={styles.detailRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge?.toLocaleString('en-IN') || '0'}`}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.summaryLabel}>GST (18%)</Text>
            <Text style={styles.summaryValue}>₹{order.gst?.toLocaleString('en-IN') || '0'}</Text>
          </View> */}
          
          <View style={styles.detailRow}>
            <Text style={styles.summaryLabel}>Payment Status</Text>
            <Text style={[styles.summaryValue, { 
              color: order.payment_status === 'paid' ? COLORS.success : 
                     order.payment_status === 'failed' ? COLORS.error : COLORS.warning 
            }]}>
              {order.payment_status?.toUpperCase() || 'PENDING'}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{order.subtotal?.toLocaleString('en-IN') || order.grand_total?.toLocaleString('en-IN') || '0'}</Text>
          </View>
        </View>
      </View>

      {/* Invoice actions become available only after the order is completed. */}
      {isInvoiceAvailable && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, downloading && styles.actionBtnDisabled]}
            onPress={handleDownloadInvoice}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color={COLORS.primary[600]} />
            ) : (
              <>
                <FileText color={COLORS.primary[600]} size={20} />
                <Text style={styles.actionText}>Download Invoice</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, downloading && styles.actionBtnDisabled]}
            onPress={handleShareInvoice}
            disabled={downloading}
          >
            <Share2 color={COLORS.primary[600]} size={20} />
            <Text style={styles.actionText}>Share Invoice</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionBtnFull} 
          onPress={() => router.push('/support')}
        >
          <Phone color={COLORS.primary[600]} size={20} />
          <Text style={styles.actionText}>Contact Support</Text>
        </TouchableOpacity>
      </View> */}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.md, 
    paddingBottom: SPACING.md, 
    gap: SPACING.sm 
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
  title: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  orderNum: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  statusBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    marginHorizontal: SPACING.md, 
    borderRadius: RADIUS.xxl, 
    padding: SPACING.lg, 
    ...SHADOWS.medium 
  },
  statusIconWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  statusTitle: { fontSize: 18, fontFamily: 'Inter-Bold' },
  statusDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 2 },
  section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: SPACING.md },
  timeline: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOWS.small },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 60 },
  timelineIcon: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: COLORS.neutral[100], 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 2 
  },
  timelineIconDone: { backgroundColor: COLORS.success },
  timelineLine: { 
    position: 'absolute', 
    left: 15, 
    top: 32, 
    width: 2, 
    height: '100%', 
    backgroundColor: COLORS.neutral[200] 
  },
  timelineLineDone: { backgroundColor: COLORS.success },
  timelineContent: { flex: 1, marginLeft: 12, paddingBottom: SPACING.lg },
  timelineLabel: { fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[400] },
  timelineLabelDone: { color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold' },
  timelineDate: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  timelinePending: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 2, fontStyle: 'italic' },
  detailCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
  detailRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.neutral[100] 
  },
  detailIconWrap: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: COLORS.primary[50], 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  detailTextWrap: { flex: 1 },
  detailLabel: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
  detailValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  addressBlock: { paddingVertical: 4 },
  addressName: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: 4 },
  addressText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], lineHeight: 20 },
  addressPhone: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600], marginTop: 4 },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], flex: 1 },
  summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  totalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingTop: SPACING.md, 
    marginTop: 4, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.neutral[200] 
  },
  totalLabel: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  totalValue: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  itemCard: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: RADIUS.xl, 
    padding: SPACING.md, 
    marginBottom: SPACING.sm, 
    ...SHADOWS.small 
  },
  itemImage: { width: 70, height: 70, borderRadius: RADIUS.md },
  itemBody: { flex: 1, marginLeft: SPACING.md },
  itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  itemQty: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
  itemPrice: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
  noItemsText: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[500], 
    textAlign: 'center', 
    paddingVertical: 20 
  },
  actions: { 
    flexDirection: 'row', 
    gap: SPACING.md, 
    paddingHorizontal: SPACING.md, 
    marginTop: SPACING.lg 
  },
  actionRow: { 
    paddingHorizontal: SPACING.md, 
    marginTop: SPACING.sm 
  },
  actionBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    backgroundColor: COLORS.white, 
    paddingVertical: SPACING.md, 
    borderRadius: RADIUS.lg, 
    ...SHADOWS.small 
  },
  actionBtnFull: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    backgroundColor: COLORS.white, 
    paddingVertical: SPACING.md, 
    borderRadius: RADIUS.lg, 
    ...SHADOWS.small 
  },
  actionBtnDisabled: { opacity: 0.6 },
  actionText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[700] },
});

// // app/order-details/[id].tsx
// import { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { ArrowLeft, Phone, MessageCircle, Download, Clock, CheckCircle, Package, Truck, XCircle, Calendar, MapPin, Users, CreditCard } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';
// import { useAuth } from '@/store/auth';

// interface OrderItem {
//   id: string;
//   productId: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface Order {
//   id: number;
//   order_number: string;
//   customer_id: string;
//   customer_name: string;
//   customer_email: string;
//   customer_phone: string;
//   address_id: number;
//   address_label: string;
//   address_full_name: string;
//   address_phone: string;
//   address_line1: string;
//   address_line2: string;
//   address_city: string;
//   address_state: string;
//   address_pincode: string;
//   address_country: string;
//   event_date: string;
//   event_time: string;
//   event_type: string;
//   venue: string;
//   guest_count: number;
//   special_instructions: string;
//   items: OrderItem[];
//   subtotal: number;
//   delivery_charge: number;
//   gst: number;
//   coupon_discount: number;
//   coupon_code: string;
//   grand_total: number;
//   payment_method: string;
//   payment_status: 'pending' | 'paid' | 'failed';
//   status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
//   notes: string;
//   created_at: string;
//   updated_at: string;
// }

// const statusConfig: Record<string, { color: string; bg: string; label: string; icon: any }> = {
//   pending: { color: COLORS.warning, bg: COLORS.warning + '20', label: 'Pending', icon: Clock },
//   approved: { color: COLORS.primary[600], bg: COLORS.primary[100], label: 'Approved', icon: CheckCircle },
//   rejected: { color: COLORS.error, bg: COLORS.error + '20', label: 'Rejected', icon: XCircle },
//   processing: { color: COLORS.gold[600], bg: COLORS.gold[50], label: 'Processing', icon: Package },
//   completed: { color: COLORS.success, bg: COLORS.success + '20', label: 'Completed', icon: CheckCircle },
//   cancelled: { color: COLORS.error, bg: COLORS.error + '20', label: 'Cancelled', icon: XCircle },
// };

// export default function OrderDetailsScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { show } = useToast();
//   const { state: authState } = useAuth();
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const customerId = authState.user?.id;

//  // app/order-details/[id].tsx - Update the fetchOrderDetails function

// const fetchOrderDetails = useCallback(async () => {
//   if (!id) {
//     setError('Invalid order ID');
//     setLoading(false);
//     return;
//   }

//   try {
//     setLoading(true);
//     setError(null);
    
//     // ─── FIX: Remove /api from URL ─────────────────────────────────────────
//     const response = await axios.get(`${API_BASE_URL}/customer-orders/${id}`);
    
//     if (response.data.success && response.data.data) {
//       const orderData = response.data.data;
//       const parsedOrder = {
//         ...orderData,
//         items: Array.isArray(orderData.items) ? orderData.items : [],
//         status: orderData.status || 'pending',
//         grand_total: parseFloat(orderData.grand_total) || 0,
//       };
//       setOrder(parsedOrder);
//     } else {
//       setError('Order not found');
//     }
//   } catch (error: any) {
//     console.error('Failed to fetch order details:', error);
//     setError(error.response?.data?.message || 'Failed to load order details');
//   } finally {
//     setLoading(false);
//   }
// }, [id]);

//   useEffect(() => {
//     fetchOrderDetails();
//   }, [fetchOrderDetails]);

//   const formatDate = (dateString: string) => {
//     try {
//       if (!dateString) return 'N/A';
//       return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
//     } catch {
//       return dateString;
//     }
//   };

//   const formatTime = (timeString: string) => {
//     if (!timeString) return 'N/A';
//     return timeString;
//   };

//   const getStatusConfig = (status: string) => {
//     return statusConfig[status] || statusConfig.pending;
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.primary[600]} />
//         <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>Loading order details...</Text>
//       </View>
//     );
//   }

//   if (error || !order) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: SPACING.xl }]}>
//         <Package color={COLORS.neutral[400]} size={48} />
//         <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[700], marginTop: 16 }}>Order Not Found</Text>
//         <Text style={{ fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8, textAlign: 'center' }}>
//           {error || 'The order you\'re looking for doesn\'t exist'}
//         </Text>
//         <TouchableOpacity 
//           style={{ marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: COLORS.primary[600], borderRadius: RADIUS.lg }}
//           onPress={() => router.back()}
//         >
//           <Text style={{ color: COLORS.white, fontFamily: 'Inter-SemiBold' }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const cfg = getStatusConfig(order.status);
//   const StatusIcon = cfg.icon;

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <ArrowLeft color={COLORS.neutral[800]} size={24} />
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.title}>Order Details</Text>
//           <Text style={styles.orderNum}>#{order.order_number || order.id}</Text>
//         </View>
//       </View>

//       {/* Status Banner */}
//       <View style={[styles.statusBanner, { backgroundColor: cfg.color + '20' }]}>
//         <View style={[styles.statusIconWrap, { backgroundColor: cfg.color }]}>
//           <StatusIcon color={COLORS.white} size={28} />
//         </View>
//         <View>
//           <Text style={[styles.statusTitle, { color: cfg.color }]}>{cfg.label}</Text>
//           <Text style={styles.statusDesc}>
//             {order.event_date ? `Event on ${formatDate(order.event_date)}` : 'Awaiting event date'}
//           </Text>
//         </View>
//       </View>

//       {/* Order Timeline */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Order Timeline</Text>
//         <View style={styles.timeline}>
//           {[
//             { status: 'pending', label: 'Order Placed', date: order.created_at },
//             { status: 'approved', label: 'Order Approved', date: order.status === 'approved' || order.status === 'processing' || order.status === 'completed' ? order.updated_at : null },
//             { status: 'processing', label: 'Processing', date: order.status === 'processing' || order.status === 'completed' ? order.updated_at : null },
//             { status: 'completed', label: 'Completed', date: order.status === 'completed' ? order.updated_at : null },
//           ].map((step, i) => {
//             const stepCfg = getStatusConfig(step.status);
//             const StepIcon = stepCfg.icon;
//             const isDone = step.date !== null && order.status !== 'rejected' && order.status !== 'cancelled';
//             const isCurrent = order.status === step.status;
            
//             return (
//               <View key={i} style={styles.timelineItem}>
//                 <View style={[styles.timelineIcon, isDone && styles.timelineIconDone, isCurrent && { borderColor: cfg.color, borderWidth: 2 }]}>
//                   <StepIcon color={isDone ? COLORS.white : COLORS.neutral[400]} size={16} />
//                 </View>
//                 {i < 3 && <View style={[styles.timelineLine, isDone && styles.timelineLineDone]} />}
//                 <View style={styles.timelineContent}>
//                   <Text style={[styles.timelineLabel, isDone && styles.timelineLabelDone]}>
//                     {step.label}
//                     {isCurrent && <Text style={{ color: cfg.color, fontSize: 10, fontFamily: 'Inter-Medium' }}> • Current</Text>}
//                   </Text>
//                   {step.date ? (
//                     <Text style={styles.timelineDate}>{formatDate(step.date)}</Text>
//                   ) : (
//                     <Text style={styles.timelinePending}>Pending</Text>
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </View>

//       {/* Event Details */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Event Details</Text>
//         <View style={styles.detailCard}>
//           <View style={styles.detailRow}>
//             <View style={styles.detailIconWrap}><Calendar color={COLORS.primary[600]} size={18} /></View>
//             <View style={styles.detailTextWrap}>
//               <Text style={styles.detailLabel}>Event Type</Text>
//               <Text style={styles.detailValue}>{order.event_type || 'N/A'}</Text>
//             </View>
//           </View>
//           <View style={styles.detailRow}>
//             <View style={styles.detailIconWrap}><Clock color={COLORS.primary[600]} size={18} /></View>
//             <View style={styles.detailTextWrap}>
//               <Text style={styles.detailLabel}>Date & Time</Text>
//               <Text style={styles.detailValue}>{order.event_date ? formatDate(order.event_date) : 'N/A'} • {formatTime(order.event_time)}</Text>
//             </View>
//           </View>
//           <View style={styles.detailRow}>
//             <View style={styles.detailIconWrap}><MapPin color={COLORS.primary[600]} size={18} /></View>
//             <View style={styles.detailTextWrap}>
//               <Text style={styles.detailLabel}>Venue</Text>
//               <Text style={styles.detailValue}>{order.venue || 'N/A'}</Text>
//             </View>
//           </View>
//           <View style={styles.detailRow}>
//             <View style={styles.detailIconWrap}><Users color={COLORS.primary[600]} size={18} /></View>
//             <View style={styles.detailTextWrap}>
//               <Text style={styles.detailLabel}>Guests</Text>
//               <Text style={styles.detailValue}>{order.guest_count || 0}</Text>
//             </View>
//           </View>
//           {order.special_instructions && (
//             <View style={styles.detailRow}>
//               <View style={styles.detailIconWrap}><MessageCircle color={COLORS.primary[600]} size={18} /></View>
//               <View style={styles.detailTextWrap}>
//                 <Text style={styles.detailLabel}>Special Instructions</Text>
//                 <Text style={styles.detailValue}>{order.special_instructions}</Text>
//               </View>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Delivery Address */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Delivery Address</Text>
//         <View style={styles.detailCard}>
//           <View style={styles.addressBlock}>
//             <Text style={styles.addressName}>{order.address_full_name || 'N/A'}</Text>
//             <Text style={styles.addressText}>{order.address_line1 || ''}</Text>
//             {order.address_line2 && <Text style={styles.addressText}>{order.address_line2}</Text>}
//             <Text style={styles.addressText}>{order.address_city || ''}, {order.address_state || ''} - {order.address_pincode || ''}</Text>
//             <Text style={styles.addressText}>{order.address_country || 'India'}</Text>
//             <Text style={styles.addressPhone}>📞 {order.address_phone || order.customer_phone || 'N/A'}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Items */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Items ({order.items?.length || 0})</Text>
//         {order.items && order.items.length > 0 ? (
//           order.items.map((item, i) => (
//             <View key={i} style={styles.itemCard}>
//               <Image source={{ uri: item.image || 'https://via.placeholder.com/80x80?text=No+Image' }} style={styles.itemImage} resizeMode="cover" />
//               <View style={styles.itemBody}>
//                 <Text style={styles.itemName} numberOfLines={2}>{item.name || 'Item'}</Text>
//                 <Text style={styles.itemQty}>Qty: {item.quantity || 0}</Text>
//                 <Text style={styles.itemPrice}>₹{((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN')}</Text>
//               </View>
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noItemsText}>No items in this order</Text>
//         )}
//       </View>

//       {/* Payment Summary */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Payment Summary</Text>
//         <View style={styles.detailCard}>
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>Subtotal</Text>
//             <Text style={styles.summaryValue}>₹{order.subtotal?.toLocaleString('en-IN') || '0'}</Text>
//           </View>
//           {order.coupon_discount > 0 && (
//             <View style={styles.detailRow}>
//               <Text style={styles.summaryLabel}>Discount</Text>
//               <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{order.coupon_discount.toLocaleString('en-IN')}</Text>
//             </View>
//           )}
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>Delivery</Text>
//             <Text style={styles.summaryValue}>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge?.toLocaleString('en-IN') || '0'}`}</Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>GST (18%)</Text>
//             <Text style={styles.summaryValue}>₹{order.gst?.toLocaleString('en-IN') || '0'}</Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>Payment Method</Text>
//             <Text style={styles.summaryValue}>{order.payment_method?.toUpperCase() || 'N/A'}</Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>Payment Status</Text>
//             <Text style={[styles.summaryValue, { color: order.payment_status === 'paid' ? COLORS.success : order.payment_status === 'failed' ? COLORS.error : COLORS.warning }]}>
//               {order.payment_status?.toUpperCase() || 'PENDING'}
//             </Text>
//           </View>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Grand Total</Text>
//             <Text style={styles.totalValue}>₹{order.grand_total?.toLocaleString('en-IN') || '0'}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Actions */}
//       <View style={styles.actions}>
//         <TouchableOpacity style={styles.actionBtn} onPress={() => show('Invoice downloaded')}>
//           <Download color={COLORS.primary[600]} size={20} />
//           <Text style={styles.actionText}>Download Invoice</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/support')}>
//           <Phone color={COLORS.primary[600]} size={20} />
//           <Text style={styles.actionText}>Contact Support</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ height: 40 }} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
//   backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   title: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   orderNum: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   statusBanner: { flexDirection: 'row', alignItems: 'center', gap: 16, marginHorizontal: SPACING.md, borderRadius: RADIUS.xxl, padding: SPACING.lg, ...SHADOWS.medium },
//   statusIconWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
//   statusTitle: { fontSize: 18, fontFamily: 'Inter-Bold' },
//   statusDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 2 },
//   section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
//   sectionTitle: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: SPACING.md },
//   timeline: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOWS.small },
//   timelineItem: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 60 },
//   timelineIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center', zIndex: 2 },
//   timelineIconDone: { backgroundColor: COLORS.success },
//   timelineLine: { position: 'absolute', left: 15, top: 32, width: 2, height: '100%', backgroundColor: COLORS.neutral[200] },
//   timelineLineDone: { backgroundColor: COLORS.success },
//   timelineContent: { flex: 1, marginLeft: 12, paddingBottom: SPACING.lg },
//   timelineLabel: { fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[400] },
//   timelineLabelDone: { color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold' },
//   timelineDate: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   timelinePending: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 2, fontStyle: 'italic' },
//   detailCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
//   detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   detailIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary[50], justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   detailTextWrap: { flex: 1 },
//   detailLabel: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   detailValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   addressBlock: { paddingVertical: 4 },
//   addressName: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: 4 },
//   addressText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], lineHeight: 20 },
//   addressPhone: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600], marginTop: 4 },
//   summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], flex: 1 },
//   summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: SPACING.md, marginTop: 4, borderTopWidth: 1, borderTopColor: COLORS.neutral[200] },
//   totalLabel: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   totalValue: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   itemCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
//   itemImage: { width: 70, height: 70, borderRadius: RADIUS.md },
//   itemBody: { flex: 1, marginLeft: SPACING.md },
//   itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   itemQty: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
//   itemPrice: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
//   noItemsText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], textAlign: 'center', paddingVertical: 20 },
//   actions: { flexDirection: 'row', gap: SPACING.md, paddingHorizontal: SPACING.md, marginTop: SPACING.lg },
//   actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.white, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, ...SHADOWS.small },
//   actionText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[700] },
// });






// app/order-details/[id].tsx
// import { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { 
//   ArrowLeft, 
//   Phone, 
//   MessageCircle, 
//   Download, 
//   Clock, 
//   CheckCircle, 
//   Package, 
//   Truck, 
//   XCircle, 
//   Calendar, 
//   MapPin, 
//   Users, 
//   CreditCard,
//   FileText,
//   Share2
// } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';
// import { useAuth } from '@/store/auth';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

// // ─── Types ──────────────────────────────────────────────────────────────────────
// interface OrderItem {
//   id: string;
//   productId: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface Order {
//   id: number;
//   order_number: string;
//   customer_id: string;
//   customer_name: string;
//   customer_email: string;
//   customer_phone: string;
//   address_id: number;
//   address_label: string;
//   address_full_name: string;
//   address_phone: string;
//   address_line1: string;
//   address_line2: string;
//   address_city: string;
//   address_state: string;
//   address_pincode: string;
//   address_country: string;
//   event_date: string;
//   event_time: string;
//   event_type: string;
//   venue: string;
//   guest_count: number;
//   special_instructions: string;
//   items: OrderItem[];
//   subtotal: number;
//   delivery_charge: number;
//   gst: number;
//   coupon_discount: number;
//   coupon_code: string;
//   grand_total: number;
//   payment_method: string;
//   payment_status: 'pending' | 'paid' | 'failed';
//   status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
//   notes: string;
//   created_at: string;
//   updated_at: string;
// }

// interface InvoiceData {
//   orderId: number;
//   orderNumber: string;
//   customerName: string;
//   customerEmail: string;
//   customerPhone: string;
//   orderDate: string;
//   eventDate: string;
//   eventType: string;
//   venue: string;
//   guestCount: number;
//   items: Array<{
//     name: string;
//     quantity: number;
//     price: number;
//     total: number;
//   }>;
//   subtotal: number;
//   deliveryCharge: number;
//   gst: number;
//   couponDiscount: number;
//   couponCode?: string;
//   grandTotal: number;
//   paymentMethod: string;
//   paymentStatus: string;
//   address: {
//     fullName: string;
//     line1: string;
//     line2?: string;
//     city: string;
//     state: string;
//     pincode: string;
//     country: string;
//   };
// }

// // ─── Status Configuration ──────────────────────────────────────────────────────
// const statusConfig: Record<string, { color: string; bg: string; label: string; icon: any }> = {
//   pending: { color: COLORS.warning, bg: COLORS.warning + '20', label: 'Pending', icon: Clock },
//   approved: { color: COLORS.primary[600], bg: COLORS.primary[100], label: 'Approved', icon: CheckCircle },
//   rejected: { color: COLORS.error, bg: COLORS.error + '20', label: 'Rejected', icon: XCircle },
//   processing: { color: COLORS.gold[600], bg: COLORS.gold[50], label: 'Processing', icon: Package },
//   completed: { color: COLORS.success, bg: COLORS.success + '20', label: 'Completed', icon: CheckCircle },
//   cancelled: { color: COLORS.error, bg: COLORS.error + '20', label: 'Cancelled', icon: XCircle },
// };

// // ─── Invoice HTML Generator ──────────────────────────────────────────────────
// const generateInvoiceHTML = (data: InvoiceData): string => {
//   const now = new Date();
//   const invoiceDate = now.toLocaleDateString('en-IN', { 
//     day: 'numeric', 
//     month: 'long', 
//     year: 'numeric' 
//   });
//   const invoiceTime = now.toLocaleTimeString('en-IN', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Invoice #${data.orderNumber}</title>
//       <style>
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body {
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//           background: #f8f9fa;
//           padding: 40px 20px;
//           color: #1a1a2e;
//         }
//         .invoice-container {
//           max-width: 900px;
//           margin: 0 auto;
//           background: #ffffff;
//           border-radius: 16px;
//           box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 10px 30px rgba(0,0,0,0.05);
//           overflow: hidden;
//         }
//         .invoice-header {
//           background: linear-gradient(135deg, #0c2d67 0%, #1a4a8a 100%);
//           padding: 40px 50px;
//           color: white;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//         .invoice-header h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
//         .invoice-header .subtitle { font-size: 14px; opacity: 0.8; margin-top: 4px; }
//         .invoice-number { text-align: right; }
//         .invoice-number .number { font-size: 22px; font-weight: 700; letter-spacing: 1px; }
//         .invoice-number .date { font-size: 13px; opacity: 0.8; margin-top: 4px; }
//         .invoice-body { padding: 40px 50px; }
//         .company-info {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 30px;
//           padding-bottom: 20px;
//           border-bottom: 2px solid #f0f0f0;
//         }
//         .company-info .company-name { font-size: 18px; font-weight: 700; color: #0c2d67; }
//         .company-info .company-details { font-size: 13px; color: #666; line-height: 1.6; margin-top: 4px; }
//         .customer-info {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 30px;
//           padding: 20px;
//           background: #f8f9fa;
//           border-radius: 12px;
//         }
//         .customer-info .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 4px; }
//         .customer-info .value { font-size: 15px; font-weight: 500; color: #1a1a2e; }
//         .event-details {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 16px;
//           margin-bottom: 30px;
//           padding: 16px 20px;
//           background: #f8f9fa;
//           border-radius: 12px;
//         }
//         .event-details .item .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 2px; }
//         .event-details .item .value { font-size: 14px; font-weight: 500; color: #1a1a2e; }
//         .items-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 20px 0 25px;
//         }
//         .items-table th {
//           background: #f8f9fa;
//           text-align: left;
//           padding: 12px 16px;
//           font-size: 12px;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           color: #666;
//           border-bottom: 2px solid #e9ecef;
//         }
//         .items-table td {
//           padding: 14px 16px;
//           border-bottom: 1px solid #f0f0f0;
//           font-size: 14px;
//         }
//         .items-table .item-name { font-weight: 500; }
//         .items-table .item-total { font-weight: 600; color: #0c2d67; }
//         .summary {
//           margin-top: 25px;
//           padding-top: 20px;
//           border-top: 2px solid #f0f0f0;
//         }
//         .summary-row {
//           display: flex;
//           justify-content: space-between;
//           padding: 6px 0;
//           font-size: 14px;
//         }
//         .summary-row .label { color: #666; }
//         .summary-row .value { font-weight: 500; color: #1a1a2e; }
//         .summary-row.total {
//           margin-top: 10px;
//           padding-top: 12px;
//           border-top: 2px solid #0c2d67;
//           font-size: 18px;
//         }
//         .summary-row.total .label { font-weight: 700; color: #0c2d67; }
//         .summary-row.total .value { font-weight: 700; color: #0c2d67; }
//         .coupon-info {
//           margin-top: 12px;
//           padding: 10px 16px;
//           background: #e8f5e9;
//           border-radius: 8px;
//           font-size: 13px;
//           color: #2e7d32;
//         }
//         .payment-info {
//           display: flex;
//           justify-content: space-between;
//           margin-top: 25px;
//           padding: 16px 20px;
//           background: #f8f9fa;
//           border-radius: 12px;
//           font-size: 13px;
//         }
//         .payment-info .label { color: #666; }
//         .payment-info .value { font-weight: 600; }
//         .payment-info .status-paid { color: #2e7d32; }
//         .payment-info .status-pending { color: #f57c00; }
//         .payment-info .status-failed { color: #c62828; }
//         .footer {
//           margin-top: 30px;
//           padding-top: 20px;
//           border-top: 1px solid #f0f0f0;
//           text-align: center;
//           font-size: 12px;
//           color: #999;
//         }
//         .footer .thankyou {
//           font-size: 16px;
//           font-weight: 600;
//           color: #0c2d67;
//           margin-bottom: 4px;
//         }
//         @media print {
//           body { background: white; padding: 0; }
//           .invoice-container { box-shadow: none; border-radius: 0; }
//           .invoice-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//           .items-table th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//         }
//         @media (max-width: 600px) {
//           .invoice-header { flex-direction: column; text-align: center; padding: 30px 20px; }
//           .invoice-number { text-align: center; margin-top: 12px; }
//           .invoice-body { padding: 20px; }
//           .company-info { flex-direction: column; text-align: center; }
//           .customer-info { flex-direction: column; gap: 12px; }
//           .event-details { grid-template-columns: 1fr; }
//           .items-table { font-size: 12px; }
//           .payment-info { flex-direction: column; gap: 8px; }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="invoice-container">
//         <div class="invoice-header">
//           <div>
//             <h1>INVOICE</h1>
//             <div class="subtitle">Event Management Services</div>
//           </div>
//           <div class="invoice-number">
//             <div class="number">#${data.orderNumber}</div>
//             <div class="date">${invoiceDate} • ${invoiceTime}</div>
//           </div>
//         </div>
//         <div class="invoice-body">
//           <div class="company-info">
//             <div>
//               <div class="company-name">IIIQBETS EVENTS</div>
//               <div class="company-details">
//                 Hyderabad, Telangana, India<br>
//                 Email: info@iiqbets.com<br>
//                 Phone: +91 93468 43156
//               </div>
//             </div>
//             <div style="text-align: right;">
//               <div style="font-size: 12px; color: #666;">Invoice Date</div>
//               <div style="font-size: 14px; font-weight: 500;">${invoiceDate}</div>
//             </div>
//           </div>

//           <div class="customer-info">
//             <div>
//               <div class="label">Customer</div>
//               <div class="value">${data.customerName || 'N/A'}</div>
//               <div style="font-size: 13px; color: #666; margin-top: 2px;">${data.customerEmail || 'N/A'}</div>
//               <div style="font-size: 13px; color: #666;">${data.customerPhone || 'N/A'}</div>
//             </div>
//             <div>
//               <div class="label">Delivery Address</div>
//               <div class="value">${data.address.fullName}</div>
//               <div style="font-size: 13px; color: #666; margin-top: 2px;">${data.address.line1}</div>
//               ${data.address.line2 ? `<div style="font-size: 13px; color: #666;">${data.address.line2}</div>` : ''}
//               <div style="font-size: 13px; color: #666;">${data.address.city}, ${data.address.state} - ${data.address.pincode}</div>
//               <div style="font-size: 13px; color: #666;">${data.address.country}</div>
//             </div>
//           </div>

//           <div class="event-details">
//             <div class="item">
//               <div class="label">Event Type</div>
//               <div class="value">${data.eventType || 'N/A'}</div>
//             </div>
//             <div class="item">
//               <div class="label">Event Date</div>
//               <div class="value">${data.eventDate ? new Date(data.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</div>
//             </div>
//             <div class="item">
//               <div class="label">Guest Count</div>
//               <div class="value">${data.guestCount || 0}</div>
//             </div>
//             <div class="item" style="grid-column: span 3;">
//               <div class="label">Venue</div>
//               <div class="value">${data.venue || 'N/A'}</div>
//             </div>
//           </div>

//           <table class="items-table">
//             <thead>
//               <tr>
//                 <th style="width: 50%;">Item</th>
//                 <th style="width: 15%; text-align: center;">Qty</th>
//                 <th style="width: 20%; text-align: right;">Price</th>
//                 <th style="width: 15%; text-align: right;">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${data.items.map(item => `
//                 <tr>
//                   <td class="item-name">${item.name}</td>
//                   <td style="text-align: center;">${item.quantity}</td>
//                   <td style="text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
//                   <td style="text-align: right; font-weight: 600;">₹${item.total.toLocaleString('en-IN')}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <div class="summary">
//             <div class="summary-row">
//               <span class="label">Subtotal</span>
//               <span class="value">₹${data.subtotal.toLocaleString('en-IN')}</span>
//             </div>
//             ${data.couponDiscount > 0 ? `
//               <div class="summary-row">
//                 <span class="label">Discount (${data.couponCode || 'Coupon'})</span>
//                 <span class="value" style="color: #2e7d32;">-₹${data.couponDiscount.toLocaleString('en-IN')}</span>
//               </div>
//             ` : ''}
//             <div class="summary-row">
//               <span class="label">Delivery Charge</span>
//               <span class="value">${data.deliveryCharge === 0 ? 'FREE' : `₹${data.deliveryCharge.toLocaleString('en-IN')}`}</span>
//             </div>
//             <div class="summary-row">
//               <span class="label">GST (18%)</span>
//               <span class="value">₹${data.gst.toLocaleString('en-IN')}</span>
//             </div>
//             <div class="summary-row total">
//               <span class="label">Grand Total</span>
//               <span class="value">₹${data.grandTotal.toLocaleString('en-IN')}</span>
//             </div>
//           </div>

//           <div class="payment-info">
//             <div>
//               <span class="label">Payment Method: </span>
//               <span class="value">${data.paymentMethod?.toUpperCase() || 'N/A'}</span>
//             </div>
//             <div>
//               <span class="label">Payment Status: </span>
//               <span class="value status-${data.paymentStatus || 'pending'}">${(data.paymentStatus || 'PENDING').toUpperCase()}</span>
//             </div>
//           </div>

//           <div class="footer">
//             <div class="thankyou">Thank You for Your Order!</div>
//             <div>This is a system-generated invoice. For any queries, please contact our support team.</div>
//             <div style="margin-top: 8px; font-size: 11px; color: #bbb;">www.iiqbets.com</div>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// };

// // ─── Main Component ──────────────────────────────────────────────────────────
// export default function OrderDetailsScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { show } = useToast();
//   const { state: authState } = useAuth();
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [downloading, setDownloading] = useState(false);

//   // ─── Fetch order details from API ──────────────────────────────────────────
//   const fetchOrderDetails = useCallback(async () => {
//     if (!id) {
//       setError('Invalid order ID');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('📦 Fetching order details for ID:', id);
//       const response = await axios.get(`${API_BASE_URL}/customer-orders/${id}`);
      
//       if (response.data.success && response.data.data) {
//         const orderData = response.data.data;
//         const parsedOrder = {
//           ...orderData,
//           items: Array.isArray(orderData.items) ? orderData.items : [],
//           status: orderData.status || 'pending',
//           grand_total: parseFloat(orderData.grand_total) || 0,
//           subtotal: parseFloat(orderData.subtotal) || 0,
//           delivery_charge: parseFloat(orderData.delivery_charge) || 0,
//           gst: parseFloat(orderData.gst) || 0,
//           coupon_discount: parseFloat(orderData.coupon_discount) || 0,
//         };
//         setOrder(parsedOrder);
//         console.log('✅ Order details loaded');
//       } else {
//         setError('Order not found');
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch order details:', error);
//       setError(error.response?.data?.message || 'Failed to load order details');
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchOrderDetails();
//   }, [fetchOrderDetails]);

//   // ─── Format date ────────────────────────────────────────────────────────────
//   const formatDate = (dateString: string) => {
//     try {
//       if (!dateString) return 'N/A';
//       return new Date(dateString).toLocaleDateString('en-IN', { 
//         day: 'numeric', 
//         month: 'long', 
//         year: 'numeric' 
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const formatTime = (timeString: string) => {
//     if (!timeString) return 'N/A';
//     return timeString;
//   };

//   const getStatusConfig = (status: string) => {
//     return statusConfig[status] || statusConfig.pending;
//   };

//   // ─── Download Invoice ──────────────────────────────────────────────────────
//   const handleDownloadInvoice = useCallback(async () => {
//     if (!order) {
//       show('Order not found', 'error');
//       return;
//     }

//     try {
//       setDownloading(true);
//       show('Generating invoice...', 'info');

//       const invoiceData: InvoiceData = {
//         orderId: order.id,
//         orderNumber: order.order_number || String(order.id),
//         customerName: order.customer_name || 'N/A',
//         customerEmail: order.customer_email || 'N/A',
//         customerPhone: order.customer_phone || 'N/A',
//         orderDate: order.created_at,
//         eventDate: order.event_date || '',
//         eventType: order.event_type || 'N/A',
//         venue: order.venue || 'N/A',
//         guestCount: order.guest_count || 0,
//         items: (order.items || []).map(item => ({
//           name: item.name || 'Item',
//           quantity: item.quantity || 0,
//           price: item.price || 0,
//           total: (item.price || 0) * (item.quantity || 0),
//         })),
//         subtotal: order.subtotal || 0,
//         deliveryCharge: order.delivery_charge || 0,
//         gst: order.gst || 0,
//         couponDiscount: order.coupon_discount || 0,
//         couponCode: order.coupon_code || undefined,
//         grandTotal: order.grand_total || 0,
//         paymentMethod: order.payment_method || 'N/A',
//         paymentStatus: order.payment_status || 'pending',
//         address: {
//           fullName: order.address_full_name || 'N/A',
//           line1: order.address_line1 || '',
//           line2: order.address_line2 || '',
//           city: order.address_city || '',
//           state: order.address_state || '',
//           pincode: order.address_pincode || '',
//           country: order.address_country || 'India',
//         },
//       };

//       // Generate HTML
//       const htmlContent = generateInvoiceHTML(invoiceData);
//       const fileName = `Invoice_${invoiceData.orderNumber}_${Date.now()}.html`;

//       if (Platform.OS === 'web') {
//         // Web: Download directly
//         const blob = new Blob([htmlContent], { type: 'text/html' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = fileName;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//         show('Invoice downloaded successfully! ✅');
//       } else {
//         // Mobile: Save and share
//         const fileUri = FileSystem.documentDirectory + fileName;
//         await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
//           encoding: FileSystem.EncodingType.UTF8,
//         });

//         if (await Sharing.isAvailableAsync()) {
//           await Sharing.shareAsync(fileUri, {
//             mimeType: 'text/html',
//             dialogTitle: 'Download Invoice',
//           });
//           show('Invoice saved successfully! ✅');
//         } else {
//           // Fallback: Show the content in an alert
//           Alert.alert(
//             'Invoice Generated',
//             'Sharing is not available. You can copy the invoice data or try again.',
//             [{ text: 'OK' }]
//           );
//         }
//       }
//     } catch (error: any) {
//       console.error('Error downloading invoice:', error);
//       show('Failed to download invoice: ' + (error.message || 'Unknown error'), 'error');
//     } finally {
//       setDownloading(false);
//     }
//   }, [order, show]);

//   // ─── Share Invoice ──────────────────────────────────────────────────────────
//   const handleShareInvoice = useCallback(async () => {
//     if (!order) {
//       show('Order not found', 'error');
//       return;
//     }

//     try {
//       setDownloading(true);
//       show('Generating invoice for sharing...', 'info');

//       const invoiceData: InvoiceData = {
//         orderId: order.id,
//         orderNumber: order.order_number || String(order.id),
//         customerName: order.customer_name || 'N/A',
//         customerEmail: order.customer_email || 'N/A',
//         customerPhone: order.customer_phone || 'N/A',
//         orderDate: order.created_at,
//         eventDate: order.event_date || '',
//         eventType: order.event_type || 'N/A',
//         venue: order.venue || 'N/A',
//         guestCount: order.guest_count || 0,
//         items: (order.items || []).map(item => ({
//           name: item.name || 'Item',
//           quantity: item.quantity || 0,
//           price: item.price || 0,
//           total: (item.price || 0) * (item.quantity || 0),
//         })),
//         subtotal: order.subtotal || 0,
//         deliveryCharge: order.delivery_charge || 0,
//         gst: order.gst || 0,
//         couponDiscount: order.coupon_discount || 0,
//         couponCode: order.coupon_code || undefined,
//         grandTotal: order.grand_total || 0,
//         paymentMethod: order.payment_method || 'N/A',
//         paymentStatus: order.payment_status || 'pending',
//         address: {
//           fullName: order.address_full_name || 'N/A',
//           line1: order.address_line1 || '',
//           line2: order.address_line2 || '',
//           city: order.address_city || '',
//           state: order.address_state || '',
//           pincode: order.address_pincode || '',
//           country: order.address_country || 'India',
//         },
//       };

//       // Generate HTML
//       const htmlContent = generateInvoiceHTML(invoiceData);
//       const fileName = `Invoice_${invoiceData.orderNumber}_${Date.now()}.html`;

//       if (Platform.OS === 'web') {
//         // Web: Use Web Share API if available
//         if (navigator.share) {
//           const blob = new Blob([htmlContent], { type: 'text/html' });
//           const file = new File([blob], fileName, { type: 'text/html' });
//           await navigator.share({
//             title: `Invoice #${invoiceData.orderNumber}`,
//             files: [file],
//           });
//           show('Invoice shared successfully! ✅');
//         } else {
//           // Fallback: Download
//           const blob = new Blob([htmlContent], { type: 'text/html' });
//           const url = URL.createObjectURL(blob);
//           const link = document.createElement('a');
//           link.href = url;
//           link.download = fileName;
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//           URL.revokeObjectURL(url);
//           show('Invoice downloaded successfully! ✅');
//         }
//       } else {
//         // Mobile: Share using expo-sharing
//         const fileUri = FileSystem.documentDirectory + fileName;
//         await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
//           encoding: FileSystem.EncodingType.UTF8,
//         });

//         if (await Sharing.isAvailableAsync()) {
//           await Sharing.shareAsync(fileUri, {
//             mimeType: 'text/html',
//             dialogTitle: 'Share Invoice',
//           });
//           show('Invoice shared successfully! ✅');
//         } else {
//           show('Sharing is not available on this device', 'error');
//         }
//       }
//     } catch (error: any) {
//       console.error('Error sharing invoice:', error);
//       show('Failed to share invoice: ' + (error.message || 'Unknown error'), 'error');
//     } finally {
//       setDownloading(false);
//     }
//   }, [order, show]);

//   // ─── Loading State ──────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.primary[600]} />
//         <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>
//           Loading order details...
//         </Text>
//       </View>
//     );
//   }

//   // ─── Error State ────────────────────────────────────────────────────────────
//   if (error || !order) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: SPACING.xl }]}>
//         <Package color={COLORS.neutral[400]} size={48} />
//         <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[700], marginTop: 16 }}>
//           Order Not Found
//         </Text>
//         <Text style={{ fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8, textAlign: 'center' }}>
//           {error || 'The order you\'re looking for doesn\'t exist'}
//         </Text>
//         <TouchableOpacity 
//           style={{ marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: COLORS.primary[600], borderRadius: RADIUS.lg }}
//           onPress={() => router.back()}
//         >
//           <Text style={{ color: COLORS.white, fontFamily: 'Inter-SemiBold' }}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const cfg = getStatusConfig(order.status);
//   const StatusIcon = cfg.icon;

//   // ─── Main Render ────────────────────────────────────────────────────────────
//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <ArrowLeft color={COLORS.neutral[800]} size={24} />
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.title}>Order Details</Text>
//           <Text style={styles.orderNum}>#{order.order_number || order.id}</Text>
//         </View>
//       </View>

//       {/* Status Banner */}
//       <View style={[styles.statusBanner, { backgroundColor: cfg.color + '20' }]}>
//         <View style={[styles.statusIconWrap, { backgroundColor: cfg.color }]}>
//           <StatusIcon color={COLORS.white} size={28} />
//         </View>
//         <View>
//           <Text style={[styles.statusTitle, { color: cfg.color }]}>{cfg.label}</Text>
//           <Text style={styles.statusDesc}>
//             {order.event_date ? `Event on ${formatDate(order.event_date)}` : 'Awaiting event date'}
//           </Text>
//         </View>
//       </View>

//       {/* Order Timeline */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Order Timeline</Text>
//         <View style={styles.timeline}>
//           {[
//             { status: 'pending', label: 'Order Placed', date: order.created_at },
//             { status: 'approved', label: 'Order Approved', date: order.status === 'approved' || order.status === 'processing' || order.status === 'completed' ? order.updated_at : null },
//             { status: 'processing', label: 'Processing', date: order.status === 'processing' || order.status === 'completed' ? order.updated_at : null },
//             { status: 'completed', label: 'Completed', date: order.status === 'completed' ? order.updated_at : null },
//           ].map((step, i) => {
//             const stepCfg = getStatusConfig(step.status);
//             const StepIcon = stepCfg.icon;
//             const isDone = step.date !== null && order.status !== 'rejected' && order.status !== 'cancelled';
//             const isCurrent = order.status === step.status;
            
//             return (
//               <View key={i} style={styles.timelineItem}>
//                 <View style={[styles.timelineIcon, isDone && styles.timelineIconDone, isCurrent && { borderColor: cfg.color, borderWidth: 2 }]}>
//                   <StepIcon color={isDone ? COLORS.white : COLORS.neutral[400]} size={16} />
//                 </View>
//                 {i < 3 && <View style={[styles.timelineLine, isDone && styles.timelineLineDone]} />}
//                 <View style={styles.timelineContent}>
//                   <Text style={[styles.timelineLabel, isDone && styles.timelineLabelDone]}>
//                     {step.label}
//                     {isCurrent && <Text style={{ color: cfg.color, fontSize: 10, fontFamily: 'Inter-Medium' }}> • Current</Text>}
//                   </Text>
//                   {step.date ? (
//                     <Text style={styles.timelineDate}>{formatDate(step.date)}</Text>
//                   ) : (
//                     <Text style={styles.timelinePending}>Pending</Text>
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </View>

//       {/* Event Details */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Event Details</Text>
//         <View style={styles.detailCard}>
//           <View style={styles.detailRow}>
//             <View style={styles.detailIconWrap}><Calendar color={COLORS.primary[600]} size={18} /></View>
//             <View style={styles.detailTextWrap}>
//               <Text style={styles.detailLabel}>Event Type</Text>
//               <Text style={styles.detailValue}>{order.event_type || 'N/A'}</Text>
//             </View>
//           </View>
//           <View style={styles.detailRow}>
//             <View style={styles.detailIconWrap}><Clock color={COLORS.primary[600]} size={18} /></View>
//             <View style={styles.detailTextWrap}>
//               <Text style={styles.detailLabel}>Date & Time</Text>
//               <Text style={styles.detailValue}>{order.event_date ? formatDate(order.event_date) : 'N/A'} • {formatTime(order.event_time)}</Text>
//             </View>
//           </View>
//           <View style={styles.detailRow}>
//             <View style={styles.detailIconWrap}><MapPin color={COLORS.primary[600]} size={18} /></View>
//             <View style={styles.detailTextWrap}>
//               <Text style={styles.detailLabel}>Venue</Text>
//               <Text style={styles.detailValue}>{order.venue || 'N/A'}</Text>
//             </View>
//           </View>
//           <View style={styles.detailRow}>
//             <View style={styles.detailIconWrap}><Users color={COLORS.primary[600]} size={18} /></View>
//             <View style={styles.detailTextWrap}>
//               <Text style={styles.detailLabel}>Guests</Text>
//               <Text style={styles.detailValue}>{order.guest_count || 0}</Text>
//             </View>
//           </View>
//           {order.special_instructions && (
//             <View style={styles.detailRow}>
//               <View style={styles.detailIconWrap}><MessageCircle color={COLORS.primary[600]} size={18} /></View>
//               <View style={styles.detailTextWrap}>
//                 <Text style={styles.detailLabel}>Special Instructions</Text>
//                 <Text style={styles.detailValue}>{order.special_instructions}</Text>
//               </View>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Delivery Address */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Delivery Address</Text>
//         <View style={styles.detailCard}>
//           <View style={styles.addressBlock}>
//             <Text style={styles.addressName}>{order.address_full_name || 'N/A'}</Text>
//             <Text style={styles.addressText}>{order.address_line1 || ''}</Text>
//             {order.address_line2 && <Text style={styles.addressText}>{order.address_line2}</Text>}
//             <Text style={styles.addressText}>{order.address_city || ''}, {order.address_state || ''} - {order.address_pincode || ''}</Text>
//             <Text style={styles.addressText}>{order.address_country || 'India'}</Text>
//             <Text style={styles.addressPhone}>📞 {order.address_phone || order.customer_phone || 'N/A'}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Items */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Items ({order.items?.length || 0})</Text>
//         {order.items && order.items.length > 0 ? (
//           order.items.map((item, i) => (
//             <View key={i} style={styles.itemCard}>
//               <Image 
//                 source={{ uri: item.image || 'https://via.placeholder.com/80x80?text=No+Image' }} 
//                 style={styles.itemImage} 
//                 resizeMode="cover" 
//               />
//               <View style={styles.itemBody}>
//                 <Text style={styles.itemName} numberOfLines={2}>{item.name || 'Item'}</Text>
//                 <Text style={styles.itemQty}>Qty: {item.quantity || 0}</Text>
//                 <Text style={styles.itemPrice}>₹{((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN')}</Text>
//               </View>
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noItemsText}>No items in this order</Text>
//         )}
//       </View>

//       {/* Payment Summary */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Payment Summary</Text>
//         <View style={styles.detailCard}>
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>Subtotal</Text>
//             <Text style={styles.summaryValue}>₹{order.subtotal?.toLocaleString('en-IN') || '0'}</Text>
//           </View>
//           {order.coupon_discount > 0 && (
//             <View style={styles.detailRow}>
//               <Text style={styles.summaryLabel}>Discount</Text>
//               <Text style={[styles.summaryValue, { color: COLORS.success }]}>-₹{order.coupon_discount.toLocaleString('en-IN')}</Text>
//             </View>
//           )}
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>Delivery</Text>
//             <Text style={styles.summaryValue}>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge?.toLocaleString('en-IN') || '0'}`}</Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>GST (18%)</Text>
//             <Text style={styles.summaryValue}>₹{order.gst?.toLocaleString('en-IN') || '0'}</Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>Payment Method</Text>
//             <Text style={styles.summaryValue}>{order.payment_method?.toUpperCase() || 'N/A'}</Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={styles.summaryLabel}>Payment Status</Text>
//             <Text style={[styles.summaryValue, { 
//               color: order.payment_status === 'paid' ? COLORS.success : 
//                      order.payment_status === 'failed' ? COLORS.error : COLORS.warning 
//             }]}>
//               {order.payment_status?.toUpperCase() || 'PENDING'}
//             </Text>
//           </View>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Grand Total</Text>
//             <Text style={styles.totalValue}>₹{order.grand_total?.toLocaleString('en-IN') || '0'}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Actions */}
//       <View style={styles.actions}>
//         <TouchableOpacity 
//           style={[styles.actionBtn, downloading && styles.actionBtnDisabled]} 
//           onPress={handleDownloadInvoice}
//           disabled={downloading}
//         >
//           {downloading ? (
//             <ActivityIndicator size="small" color={COLORS.primary[600]} />
//           ) : (
//             <>
//               <Download color={COLORS.primary[600]} size={20} />
//               <Text style={styles.actionText}>Download Invoice</Text>
//             </>
//           )}
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.actionBtn, downloading && styles.actionBtnDisabled]} 
//           onPress={handleShareInvoice}
//           disabled={downloading}
//         >
//           <Share2 color={COLORS.primary[600]} size={20} />
//           <Text style={styles.actionText}>Share Invoice</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.actionRow}>
//         <TouchableOpacity 
//           style={styles.actionBtnFull} 
//           onPress={() => router.push('/support')}
//         >
//           <Phone color={COLORS.primary[600]} size={20} />
//           <Text style={styles.actionText}>Contact Support</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ height: 40 }} />
//     </ScrollView>
//   );
// }

// // ─── Styles ──────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     paddingHorizontal: SPACING.md, 
//     paddingBottom: SPACING.md, 
//     gap: SPACING.sm 
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
//   title: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   orderNum: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   statusBanner: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 16, 
//     marginHorizontal: SPACING.md, 
//     borderRadius: RADIUS.xxl, 
//     padding: SPACING.lg, 
//     ...SHADOWS.medium 
//   },
//   statusIconWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
//   statusTitle: { fontSize: 18, fontFamily: 'Inter-Bold' },
//   statusDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 2 },
//   section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
//   sectionTitle: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: SPACING.md },
//   timeline: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOWS.small },
//   timelineItem: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 60 },
//   timelineIcon: { 
//     width: 32, 
//     height: 32, 
//     borderRadius: 16, 
//     backgroundColor: COLORS.neutral[100], 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     zIndex: 2 
//   },
//   timelineIconDone: { backgroundColor: COLORS.success },
//   timelineLine: { 
//     position: 'absolute', 
//     left: 15, 
//     top: 32, 
//     width: 2, 
//     height: '100%', 
//     backgroundColor: COLORS.neutral[200] 
//   },
//   timelineLineDone: { backgroundColor: COLORS.success },
//   timelineContent: { flex: 1, marginLeft: 12, paddingBottom: SPACING.lg },
//   timelineLabel: { fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[400] },
//   timelineLabelDone: { color: COLORS.neutral[900], fontFamily: 'Inter-SemiBold' },
//   timelineDate: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   timelinePending: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 2, fontStyle: 'italic' },
//   detailCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
//   detailRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     paddingVertical: 10, 
//     borderBottomWidth: 1, 
//     borderBottomColor: COLORS.neutral[100] 
//   },
//   detailIconWrap: { 
//     width: 32, 
//     height: 32, 
//     borderRadius: 16, 
//     backgroundColor: COLORS.primary[50], 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     marginRight: 12 
//   },
//   detailTextWrap: { flex: 1 },
//   detailLabel: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   detailValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   addressBlock: { paddingVertical: 4 },
//   addressName: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: 4 },
//   addressText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], lineHeight: 20 },
//   addressPhone: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600], marginTop: 4 },
//   summaryLabel: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], flex: 1 },
//   summaryValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   totalRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingTop: SPACING.md, 
//     marginTop: 4, 
//     borderTopWidth: 1, 
//     borderTopColor: COLORS.neutral[200] 
//   },
//   totalLabel: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   totalValue: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
//   itemCard: { 
//     flexDirection: 'row', 
//     backgroundColor: COLORS.white, 
//     borderRadius: RADIUS.xl, 
//     padding: SPACING.md, 
//     marginBottom: SPACING.sm, 
//     ...SHADOWS.small 
//   },
//   itemImage: { width: 70, height: 70, borderRadius: RADIUS.md },
//   itemBody: { flex: 1, marginLeft: SPACING.md },
//   itemName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   itemQty: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
//   itemPrice: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.primary[700], marginTop: 4 },
//   noItemsText: { 
//     fontSize: 14, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[500], 
//     textAlign: 'center', 
//     paddingVertical: 20 
//   },
//   actions: { 
//     flexDirection: 'row', 
//     gap: SPACING.md, 
//     paddingHorizontal: SPACING.md, 
//     marginTop: SPACING.lg 
//   },
//   actionRow: { 
//     paddingHorizontal: SPACING.md, 
//     marginTop: SPACING.sm 
//   },
//   actionBtn: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     gap: 8, 
//     backgroundColor: COLORS.white, 
//     paddingVertical: SPACING.md, 
//     borderRadius: RADIUS.lg, 
//     ...SHADOWS.small 
//   },
//   actionBtnFull: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     gap: 8, 
//     backgroundColor: COLORS.white, 
//     paddingVertical: SPACING.md, 
//     borderRadius: RADIUS.lg, 
//     ...SHADOWS.small 
//   },
//   actionBtnDisabled: { opacity: 0.6 },
//   actionText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[700] },
// });



// app/order-details/[id].tsx
// app/order-details/[id].tsx
// app/order-details/[id].tsx
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const { state: authState } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // ─── Fetch order details from API ──────────────────────────────────────────
  const fetchOrderDetails = useCallback(async () => {
    if (!id) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('📦 Fetching order details for ID:', id);
      const response = await axios.get(`${API_BASE_URL}/customer-orders/${id}`);
      
      if (response.data.success && response.data.data) { 
        const orderData = response.data.data;
        const parsedOrder = {
          ...orderData,
          items: Array.isArray(orderData.items) ? orderData.items : [],
          status: orderData.status || 'pending',
          grand_total: parseFloat(orderData.grand_total) || 0,
          subtotal: parseFloat(orderData.subtotal) || 0,
          delivery_charge: parseFloat(orderData.delivery_charge) || 0,
          gst: parseFloat(orderData.gst) || 0,
          coupon_discount: parseFloat(orderData.coupon_discount) || 0,
        };
        setOrder(parsedOrder);
        console.log('✅ Order details loaded');
      } else {
        setError('Order not found');
      }
    } catch (error: any) {
      console.error('Failed to fetch order details:', error);
      setError(error.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

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

  const isInvoiceAvailable = order?.status?.toLowerCase() === 'completed';

  // ─── Download Invoice ──────────────────────────────────────────────────────
  const handleDownloadInvoice = useCallback(async () => {
    if (!order) {
      show('Order not found', 'error');
      return;
    }

    if (order.status?.toLowerCase() !== 'completed') {
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
        orderSource: 'customer',
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

      await downloadInvoice(invoiceData);
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
      setDownloading(false);
    }
  }, [order, show]);

  // ─── Share Invoice ──────────────────────────────────────────────────────────
  const handleShareInvoice = useCallback(async () => {
    if (!order) {
      show('Order not found', 'error');
      return;
    }

    if (order.status?.toLowerCase() !== 'completed') {
      show('Invoice is available only after the order is completed', 'info');
      return;
    }

    try {
      setDownloading(true);
      show('Generating invoice for sharing...', 'info');

      const invoiceData: InvoiceData = {
        orderId: order.id,
        orderSource: 'customer',
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
        await downloadInvoice(invoiceData);
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
  }, [order, show]);

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
        <View>
          <Text style={styles.title}>Order Details</Text>
          <Text style={styles.orderNum}>#{order.order_number || order.id}</Text>
        </View>
      </View>

      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: cfg.color + '20' }]}>
        <View style={[styles.statusIconWrap, { backgroundColor: cfg.color }]}>
          <StatusIcon color={COLORS.white} size={28} />
        </View>
        <View>
          <Text style={[styles.statusTitle, { color: cfg.color }]}>{cfg.label}</Text>
          <Text style={styles.statusDesc}>
            {order.event_date ? `Event on ${formatDate(order.event_date)}` : 'Awaiting event date'}
          </Text>
        </View>
      </View>

      {/* Order Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Timeline</Text>
        <View style={styles.timeline}>
          {[
            { status: 'pending', label: 'Order Placed', date: order.created_at },
            { status: 'approved', label: 'Order Approved', date: order.status === 'approved' || order.status === 'processing' || order.status === 'completed' ? order.updated_at : null },
            { status: 'processing', label: 'Processing', date: order.status === 'processing' || order.status === 'completed' ? order.updated_at : null },
            { status: 'completed', label: 'Completed', date: order.status === 'completed' ? order.updated_at : null },
          ].map((step, i) => {
            const stepCfg = getStatusConfig(step.status);
            const StepIcon = stepCfg.icon;
            const isDone = step.date !== null && order.status !== 'rejected' && order.status !== 'cancelled';
            const isCurrent = order.status === step.status;
            
            return (
              <View key={i} style={styles.timelineItem}>
                <View style={[styles.timelineIcon, isDone && styles.timelineIconDone, isCurrent && { borderColor: cfg.color, borderWidth: 2 }]}>
                  <StepIcon color={isDone ? COLORS.white : COLORS.neutral[400]} size={16} />
                </View>
                {i < 3 && <View style={[styles.timelineLine, isDone && styles.timelineLineDone]} />}
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, isDone && styles.timelineLabelDone]}>
                    {step.label}
                    {isCurrent && <Text style={{ color: cfg.color, fontSize: 10, fontFamily: 'Inter-Medium' }}> • Current</Text>}
                  </Text>
                  {step.date ? (
                    <Text style={styles.timelineDate}>{formatDate(step.date)}</Text>
                  ) : (
                    <Text style={styles.timelinePending}>Pending</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Event Details */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Details</Text>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}><Calendar color={COLORS.primary[600]} size={18} /></View>
            <View style={styles.detailTextWrap}>
              <Text style={styles.detailLabel}>Event Type</Text>
              <Text style={styles.detailValue}>{order.event_type || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}><Clock color={COLORS.primary[600]} size={18} /></View>
            <View style={styles.detailTextWrap}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{order.event_date ? formatDate(order.event_date) : 'N/A'} • {formatTime(order.event_time)}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}><MapPin color={COLORS.primary[600]} size={18} /></View>
            <View style={styles.detailTextWrap}>
              <Text style={styles.detailLabel}>Venue</Text>
              <Text style={styles.detailValue}>{order.venue || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrap}><Users color={COLORS.primary[600]} size={18} /></View>
            <View style={styles.detailTextWrap}>
              <Text style={styles.detailLabel}>Guests</Text>
              <Text style={styles.detailValue}>{order.guest_count || 0}</Text>
            </View>
          </View>
          {order.special_instructions && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconWrap}><MessageCircle color={COLORS.primary[600]} size={18} /></View>
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>Special Instructions</Text>
                <Text style={styles.detailValue}>{order.special_instructions}</Text>
              </View>
            </View>
          )}
        </View>
      </View> */}

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.detailCard}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressName}>{order.address_full_name || 'N/A'}</Text>
            <Text style={styles.addressText}>{order.address_line1 || ''}</Text>
            {order.address_line2 && <Text style={styles.addressText}>{order.address_line2}</Text>}
            <Text style={styles.addressText}>{order.address_city || ''}, {order.address_state || ''} - {order.address_pincode || ''}</Text>
            <Text style={styles.addressText}>{order.address_country || 'India'}</Text>
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
                source={{ uri: item.image || 'https://via.placeholder.com/80x80?text=No+Image' }} 
                style={styles.itemImage} 
                resizeMode="cover" 
              />
              <View style={styles.itemBody}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name || 'Item'}</Text>
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
          <View style={styles.detailRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge?.toLocaleString('en-IN') || '0'}`}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.summaryLabel}>GST (18%)</Text>
            <Text style={styles.summaryValue}>₹{order.gst?.toLocaleString('en-IN') || '0'}</Text>
          </View>
          
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
            <Text style={styles.totalValue}>₹{order.grand_total?.toLocaleString('en-IN') || '0'}</Text>
          </View>
        </View>
      </View>

      {/* Invoice actions are available only after an order is completed. */}
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

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionBtnFull} 
          onPress={() => router.push('/support')}
        >
          <Phone color={COLORS.primary[600]} size={20} />
          <Text style={styles.actionText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

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

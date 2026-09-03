// import { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, Bell, CheckCheck } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { mockApi } from '@/services/api';
// import { AppNotification } from '@/types';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const iconMap: Record<string, any> = {
//   'check-circle': CheckCheck,
//   'credit-card': Bell,
//   'users': Bell,
//   'calendar': Bell,
//   'tag': Bell,
//   'sparkles': Bell,
// };

// export default function NotificationsScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const [notifications, setNotifications] = useState<AppNotification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const load = useCallback(async () => {
//     const data = await mockApi.getNotifications();
//     setNotifications(data);
//     setLoading(false);
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await load();
//     setRefreshing(false);
//   }, [load]);

//   const markAllRead = () => {
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//   };

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <ArrowLeft color={COLORS.neutral[800]} size={24} />
//         </TouchableOpacity>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.title}>Notifications</Text>
//           <Text style={styles.subtitle}>{notifications.filter(n => !n.read).length} unread</Text>
//         </View>
//         <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
//           <CheckCheck color={COLORS.primary[600]} size={20} />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={notifications}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl }}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[600]} />}
//         renderItem={({ item }) => {
//           const Icon = iconMap[item.icon] || Bell;
//           return (
//             <TouchableOpacity
//               style={[styles.notifCard, !item.read && styles.notifCardUnread]}
//               onPress={() => setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n))}
//             >
//               <View style={[styles.notifIcon, !item.read && styles.notifIconActive]}>
//                 <Icon color={!item.read ? COLORS.white : COLORS.primary[600]} size={20} />
//               </View>
//               <View style={styles.notifBody}>
//                 <View style={styles.notifHeader}>
//                   <Text style={styles.notifTitle}>{item.title}</Text>
//                   {!item.read && <View style={styles.unreadDot} />}
//                 </View>
//                 <Text style={styles.notifMessage}>{item.message}</Text>
//                 <Text style={styles.notifDate}>{item.date}</Text>
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
//   backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   markReadBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary[50], justifyContent: 'center', alignItems: 'center' },
//   notifCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
//   notifCardUnread: { backgroundColor: COLORS.primary[50] },
//   notifIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
//   notifIconActive: { backgroundColor: COLORS.primary[700] },
//   notifBody: { flex: 1, marginLeft: SPACING.md },
//   notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   notifTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
//   notifMessage: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 4, lineHeight: 18 },
//   notifDate: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
// });






// app/notifications.tsx
// app/notifications.tsx
// app/notifications.tsx
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, AppState } from 'react-native';
// import { useRouter, useFocusEffect } from 'expo-router';
// import { ArrowLeft, Bell, CheckCheck, Package, Tag, Clock, CheckCircle, XCircle, AlertCircle, ShoppingBag } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { useAuth } from '@/store/auth';
// import { useToast } from '@/store/toast';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import axios from 'axios';
// import { API_BASE_URL } from '@/services/api';

// interface Notification {
//   id: number;
//   user_id: number;
//   title: string;
//   message: string;
//   type: string;
//   icon: string;
//   data: any;
//   is_read: number;
//   created_at: string;
// }

// const iconMap: Record<string, any> = {
//   'check-circle': CheckCircle,
//   'x-circle': XCircle,
//   'clock': Clock,
//   'tag': Tag,
//   'package': Package,
//   'bell': Bell,
//   'alert-circle': AlertCircle,
//   'shopping-bag': ShoppingBag,
// };

// const getStatusColor = (type: string): string => {
//   switch (type) {
//     case 'order_approved': return COLORS.success;
//     case 'order_completed': return COLORS.success;
//     case 'order_rejected': return COLORS.error;
//     case 'order_cancelled': return COLORS.error;
//     case 'order_processing': return COLORS.gold[500];
//     case 'coupon': return COLORS.gold[500];
//     case 'order_updated': return COLORS.primary[600];
//     default: return COLORS.primary[600];
//   }
// };

// export default function NotificationsScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { state: authState } = useAuth();
//   const { show } = useToast();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const appState = useRef(AppState.currentState);

//   const customerId = authState.user?.id;

//   const fetchNotifications = useCallback(async () => {
//     if (!customerId) {
//       setNotifications([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log('📦 Fetching notifications for customer:', customerId);
//       const response = await axios.get(`${API_BASE_URL}/notifications/${customerId}`);
      
//       console.log('📦 Notifications response:', response.data);
      
//       if (response.data.success) {
//         setNotifications(response.data.data);
//         const unread = response.data.data.filter((n: Notification) => !n.is_read).length;
//         setUnreadCount(unread);
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch notifications:', error);
//       show('Failed to load notifications', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [customerId, show]);

//   // ─── Fetch on mount ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   // ─── Refetch when screen comes into focus ──────────────────────────────────
//   useFocusEffect(
//     useCallback(() => {
//       fetchNotifications();
//     }, [fetchNotifications])
//   );

//   // ─── Refetch when app comes back from background ────────────────────────────
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextAppState) => {
//       if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//         fetchNotifications();
//       }
//       appState.current = nextAppState;
//     });

//     return () => subscription.remove();
//   }, [fetchNotifications]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchNotifications();
//     setRefreshing(false);
//   }, [fetchNotifications]);

//   const markAllRead = async () => {
//     if (!customerId) return;
    
//     try {
//       await axios.put(`${API_BASE_URL}/notifications/${customerId}/read-all`);
//       setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
//       setUnreadCount(0);
//       show('All notifications marked as read');
//     } catch (error) {
//       console.error('Failed to mark all as read:', error);
//       show('Failed to mark notifications as read', 'error');
//     }
//   };

//   const markAsRead = async (id: number) => {
//     try {
//       await axios.put(`${API_BASE_URL}/notifications/${id}/read`);
//       setNotifications(notifications.map(n => 
//         n.id === id ? { ...n, is_read: 1 } : n
//       ));
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error('Failed to mark notification as read:', error);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diff = now.getTime() - date.getTime();
      
//       if (diff < 60000) return 'Just now';
//       if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
//       if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
//       if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
//       return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
//     } catch {
//       return dateString;
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.primary[600]} />
//         <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>
//           Loading notifications...
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <ArrowLeft color={COLORS.neutral[800]} size={24} />
//         </TouchableOpacity>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.title}>Notifications</Text>
//           <Text style={styles.subtitle}>
//             {unreadCount === 0 ? 'All caught up!' : `${unreadCount} unread`}
//           </Text>
//         </View>
//         {unreadCount > 0 && (
//           <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
//             <CheckCheck color={COLORS.primary[600]} size={20} />
//           </TouchableOpacity>
//         )}
//       </View>

//       <FlatList
//         data={notifications}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ 
//           paddingHorizontal: SPACING.md, 
//           paddingBottom: SPACING.xl,
//           flexGrow: notifications.length === 0 ? 1 : undefined,
//         }}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={onRefresh} 
//             tintColor={COLORS.primary[600]} 
//           />
//         }
//         renderItem={({ item }) => {
//           const Icon = iconMap[item.icon] || Bell;
//           const color = getStatusColor(item.type);
          
//           return (
//             <TouchableOpacity
//               style={[styles.notifCard, !item.is_read && styles.notifCardUnread]}
//               onPress={() => {
//                 if (!item.is_read) markAsRead(item.id);
//               }}
//               activeOpacity={0.8}
//             >
//               <View style={[styles.notifIcon, !item.is_read && { backgroundColor: color }]}>
//                 <Icon color={!item.is_read ? COLORS.white : COLORS.primary[600]} size={20} />
//               </View>
//               <View style={styles.notifBody}>
//                 <View style={styles.notifHeader}>
//                   <Text style={[styles.notifTitle, !item.is_read && { fontWeight: '700' }]}>
//                     {item.title}
//                   </Text>
//                   {!item.is_read && <View style={styles.unreadDot} />}
//                 </View>
//                 <Text style={styles.notifMessage}>{item.message}</Text>
//                 <View style={styles.notifFooter}>
//                   <Text style={styles.notifDate}>{formatDate(item.created_at)}</Text>
//                   {item.type && (
//                     <View style={[styles.typeBadge, { backgroundColor: color + '20' }]}>
//                       <Text style={[styles.typeText, { color }]}>
//                         {item.type.replace('_', ' ').toUpperCase()}
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//         keyExtractor={(item) => item.id.toString()}
//         ListEmptyComponent={
//           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 }}>
//             <Bell color={COLORS.neutral[400]} size={48} />
//             <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[700], marginTop: 16 }}>
//               No notifications
//             </Text>
//             <Text style={{ fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8, textAlign: 'center' }}>
//               You'll see notifications here when your order status changes or new offers are available.
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

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
//   title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   markReadBtn: { 
//     width: 44, 
//     height: 44, 
//     borderRadius: 22, 
//     backgroundColor: COLORS.primary[50], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   notifCard: { 
//     flexDirection: 'row', 
//     backgroundColor: COLORS.white, 
//     borderRadius: RADIUS.xl, 
//     padding: SPACING.md, 
//     marginBottom: SPACING.md, 
//     ...SHADOWS.small 
//   },
//   notifCardUnread: { backgroundColor: COLORS.primary[50] },
//   notifIcon: { 
//     width: 44, 
//     height: 44, 
//     borderRadius: 22, 
//     backgroundColor: COLORS.neutral[100], 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   notifBody: { flex: 1, marginLeft: SPACING.md },
//   notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   notifTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
//   unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
//   notifMessage: { 
//     fontSize: 13, 
//     fontFamily: 'Inter-Regular', 
//     color: COLORS.neutral[600], 
//     marginTop: 4, 
//     lineHeight: 18 
//   },
//   notifFooter: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     marginTop: 6 
//   },
//   notifDate: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400] },
//   typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm },
//   typeText: { fontSize: 9, fontFamily: 'Inter-Medium' },
// });




// app/notifications.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, AppState } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Bell, CheckCheck, Package, Tag, Clock, CheckCircle, XCircle, AlertCircle, ShoppingBag } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useToast } from '@/store/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  icon: string;
  data: any;
  is_read: number;
  created_at: string;
}

const iconMap: Record<string, any> = {
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'clock': Clock,
  'tag': Tag,
  'package': Package,
  'bell': Bell,
  'alert-circle': AlertCircle,
  'shopping-bag': ShoppingBag,
};

const getStatusColor = (type: string): string => {
  switch (type) {
    case 'order_approved': return COLORS.success;
    case 'order_completed': return COLORS.success;
    case 'order_rejected': return COLORS.error;
    case 'order_cancelled': return COLORS.error;
    case 'order_processing': return COLORS.gold[500];
    case 'coupon': return COLORS.gold[500];
    case 'order_updated': return COLORS.primary[600];
    default: return COLORS.primary[600];
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state: authState } = useAuth();
  const { show } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const appState = useRef(AppState.currentState);

  const customerId = authState.user?.id;

  // ─── Refresh badge count ─────────────────────────────────────────────────────
  const refreshBadgeCount = useCallback(async () => {
    if (!customerId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/${customerId}/unread-count`);
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Failed to refresh badge count:', error);
    }
  }, [customerId]);

  const fetchNotifications = useCallback(async () => {
    if (!customerId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📦 Fetching notifications for customer:', customerId);
      const response = await axios.get(`${API_BASE_URL}/notifications/${customerId}`);
      
      console.log('📦 Notifications response:', response.data);
      
      if (response.data.success) {
        setNotifications(response.data.data);
        const unread = response.data.data.filter((n: Notification) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      show('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  }, [customerId, show]);

  // ─── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchNotifications();
    refreshBadgeCount();
  }, [fetchNotifications, refreshBadgeCount]);

  // ─── Refetch when screen comes into focus ──────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      refreshBadgeCount();
    }, [fetchNotifications, refreshBadgeCount])
  );

  // ─── Refetch when app comes back from background ────────────────────────────
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchNotifications();
        refreshBadgeCount();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [fetchNotifications, refreshBadgeCount]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    await refreshBadgeCount();
    setRefreshing(false);
  }, [fetchNotifications, refreshBadgeCount]);

  const markAllRead = async () => {
    if (!customerId) return;
    
    try {
      await axios.put(`${API_BASE_URL}/notifications/${customerId}/read-all`);
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
      
      // ─── Refresh the tab badge ──────────────────────────────────────────────
      await refreshBadgeCount();
      
      show('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      show('Failed to mark notifications as read', 'error');
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: 1 } : n
      ));
      
      // ─── Refresh the badge count ──────────────────────────────────────────────
      await refreshBadgeCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // ─── Handle notification press - mark as read and navigate ──────────────────
  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.type === 'coupon') {
      // Navigate to coupons or show coupon details
      show(`Coupon: ${notification.data?.code || 'View coupon'}`);
    } else if (notification.type === 'order_approved' || 
               notification.type === 'order_completed' || 
               notification.type === 'order_processing' ||
               notification.type === 'order_rejected' ||
               notification.type === 'order_cancelled') {
      // Navigate to order details
      if (notification.data?.orderId) {
        router.push(`/order-details/${notification.data.orderId}`);
      } else {
        router.push('/orders');
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>
          Loading notifications...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unreadCount === 0 ? 'All caught up!' : `${unreadCount} unread`}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
            <CheckCheck color={COLORS.primary[600]} size={20} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: SPACING.md, 
          paddingBottom: SPACING.xl,
          flexGrow: notifications.length === 0 ? 1 : undefined,
        }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary[600]} 
          />
        }
        renderItem={({ item }) => {
          const Icon = iconMap[item.icon] || Bell;
          const color = getStatusColor(item.type);
          const isUnread = !item.is_read;
          
          return (
            <TouchableOpacity
              style={[styles.notifCard, isUnread && styles.notifCardUnread]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.notifIcon, isUnread && { backgroundColor: color }]}>
                <Icon color={isUnread ? COLORS.white : COLORS.primary[600]} size={20} />
              </View>
              <View style={styles.notifBody}>
                <View style={styles.notifHeader}>
                  <Text style={[styles.notifTitle, isUnread && { fontWeight: '700' }]}>
                    {item.title}
                  </Text>
                  {isUnread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <View style={styles.notifFooter}>
                  <Text style={styles.notifDate}>{formatDate(item.created_at)}</Text>
                  {item.type && (
                    <View style={[styles.typeBadge, { backgroundColor: color + '20' }]}>
                      <Text style={[styles.typeText, { color }]}>
                        {item.type.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 }}>
            <Bell color={COLORS.neutral[400]} size={48} />
            <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[700], marginTop: 16 }}>
              No notifications
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8, textAlign: 'center' }}>
              You'll see notifications here when your order status changes or new offers are available.
            </Text>
          </View>
        }
      />
    </View>
  );
}

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
  title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  markReadBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: COLORS.primary[50], 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  notifCard: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: RADIUS.xl, 
    padding: SPACING.md, 
    marginBottom: SPACING.md, 
    ...SHADOWS.small 
  },
  notifCardUnread: { backgroundColor: COLORS.primary[50] },
  notifIcon: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: COLORS.neutral[100], 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  notifBody: { flex: 1, marginLeft: SPACING.md },
  notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  notifMessage: { 
    fontSize: 13, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[600], 
    marginTop: 4, 
    lineHeight: 18 
  },
  notifFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 6 
  },
  notifDate: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[400] },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm },
  typeText: { fontSize: 9, fontFamily: 'Inter-Medium' },
});
// import { Tabs } from 'expo-router';
// import { Home, LayoutGrid, ShoppingBag, ClipboardList, User } from 'lucide-react-native';
// import { COLORS } from '@/constants/theme';
// import { useCart } from '@/store/cart';
// import { View, Text, StyleSheet } from 'react-native';

// export default function TabLayout() {
//   const { totalItems } = useCart();

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: COLORS.primary[700],
//         tabBarInactiveTintColor: COLORS.neutral[400],
//         tabBarStyle: {
//           backgroundColor: COLORS.white,
//           borderTopColor: COLORS.neutral[100],
//           borderTopWidth: 1,
//           height: 64,
//           paddingBottom: 8,
//           paddingTop: 8,
//         },
//         tabBarLabelStyle: { fontFamily: 'Inter-Medium', fontSize: 11 },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
//         }}
//       />
//       <Tabs.Screen
//         name="categories"
//         options={{
//           title: 'Categories',
//           tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
//         }}
//       />
//       <Tabs.Screen
//         name="cart"
//         options={{
//           title: 'Cart',
//           tabBarIcon: ({ color, size }) => (
//             <View>
//               <ShoppingBag color={color} size={size} />
//               {totalItems > 0 && (
//                 <View style={styles.badge}>
//                   <Text style={styles.badgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
//                 </View>
//               )}
//             </View>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="orders"
//         options={{
//           title: 'Orders',
//           tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   badge: {
//     position: 'absolute', top: -6, right: -10,
//     backgroundColor: COLORS.error, borderRadius: 10, minWidth: 20, height: 20,
//     justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
//   },
//   badgeText: { color: COLORS.white, fontSize: 10, fontFamily: 'Inter-Bold' },
// });




// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, LayoutGrid, ShoppingBag, ClipboardList, User, Bell } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function TabLayout() {
  const { totalItems } = useCart();
  const { state: authState } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const customerId = authState.user?.id;

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
        console.log('📦 Unread count:', response.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, [customerId]);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount, customerId]);

  // ─── Refetch when screen comes into focus ──────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [fetchUnreadCount])
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary[700],
        tabBarInactiveTintColor: COLORS.neutral[400],
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.neutral[100],
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: 'Inter-Medium', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingBag color={color} size={size} />
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.tabIconWrapper}>
              <Bell color={color} size={size} />
              {unreadCount > 0 && (
                <View style={[styles.badge, styles.notificationBadge]}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconWrapper: {
    position: 'relative',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadge: {
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
});
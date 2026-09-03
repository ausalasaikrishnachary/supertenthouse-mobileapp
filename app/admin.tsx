import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package, DollarSign, Users, ShoppingBag, TrendingUp, BarChart3, Settings, Bell, ChevronRight, Clock, CheckCircle, XCircle, Layers, Box } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Dimensions_width = Dimensions.get('window').width;

export default function AdminScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loggedIn, setLoggedIn] = useState(false);
  const [pass, setPass] = useState('');
  const [activeModule, setActiveModule] = useState('dashboard');

  if (!loggedIn) {
    return (
      <View style={styles.loginContainer}>
        <View style={[styles.loginCard, { marginTop: insets.top + 60 }]}>
          <View style={styles.loginLogo}>
            <Text style={styles.loginLogoText}>ST</Text>
          </View>
          <Text style={styles.loginTitle}>Admin Login</Text>
          <Text style={styles.loginSubtitle}>Super Tent House Dashboard</Text>
          <View style={styles.loginForm}>
            <Text style={styles.loginLabel}>Admin Password</Text>
            <View style={styles.loginInput}>
              <Settings color={COLORS.neutral[400]} size={20} />
              <TextInput style={styles.loginInputText} placeholder="Enter password" placeholderTextColor={COLORS.neutral[400]} value={pass} onChangeText={setPass} secureTextEntry />
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={() => { if (pass) setLoggedIn(true); else Alert.alert('Enter password'); }}>
              <Text style={styles.loginBtnText}>Access Dashboard</Text>
            </TouchableOpacity>
            <Text style={styles.loginHint}>Hint: Enter any password to continue</Text>
          </View>
        </View>
      </View>
    );
  }

  const stats = [
    { label: 'Total Orders', value: '1,248', change: '+12%', icon: ShoppingBag, color: COLORS.primary[600] },
    { label: 'Revenue', value: '₹48.2L', change: '+18%', icon: DollarSign, color: COLORS.success },
    { label: 'Customers', value: '3,562', change: '+8%', icon: Users, color: COLORS.gold[500] },
    { label: 'Products', value: '284', change: '+5', icon: Package, color: COLORS.primary[500] },
  ];

  const modules = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'products', label: 'Products', icon: Box },
    { key: 'categories', label: 'Categories', icon: Layers },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'analytics', label: 'Analytics', icon: TrendingUp },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  const recentOrders = [
    { id: 'STH20250001', customer: 'Priya Sharma', amount: '₹66,120', status: 'confirmed', date: '20 Jun' },
    { id: 'STH20250002', customer: 'Rajesh Kumar', amount: '₹1,46,998', status: 'completed', date: '15 May' },
    { id: 'STH20250003', customer: 'Anita Desai', amount: '₹28,500', status: 'pending', date: '28 Jun' },
    { id: 'STH20250004', customer: 'Vikram Singh', amount: '₹2,99,999', status: 'in_progress', date: '25 Jun' },
  ];

  const statusColors: Record<string, string> = {
    confirmed: COLORS.primary[600],
    completed: COLORS.success,
    pending: COLORS.warning,
    in_progress: COLORS.gold[600],
    cancelled: COLORS.error,
  };

  // Simple bar chart data
  const salesData = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100];
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  const topProducts = [
    { name: 'Premium Wedding Decoration', sales: 342, revenue: '₹51.3L' },
    { name: 'Crystal Chandelier', sales: 289, revenue: '₹43.2L' },
    { name: 'Luxury Royal Package', sales: 156, revenue: '₹46.7L' },
    { name: 'Birthday Decoration Set', sales: 234, revenue: '₹28.5L' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Super Tent House</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Bell color={COLORS.white} size={20} />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <View key={i} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Icon color={stat.color} size={20} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <View style={styles.statChangeWrap}>
                  <TrendingUp color={COLORS.success} size={12} />
                  <Text style={styles.statChange}>{stat.change}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Order Status Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Overview</Text>
          <View style={styles.orderStatusRow}>
            <View style={styles.orderStatusCard}>
              <Clock color={COLORS.warning} size={20} />
              <Text style={styles.orderStatusValue}>24</Text>
              <Text style={styles.orderStatusLabel}>Pending</Text>
            </View>
            <View style={styles.orderStatusCard}>
              <CheckCircle color={COLORS.success} size={20} />
              <Text style={styles.orderStatusValue}>1,156</Text>
              <Text style={styles.orderStatusLabel}>Completed</Text>
            </View>
            <View style={styles.orderStatusCard}>
              <Package color={COLORS.primary[600]} size={20} />
              <Text style={styles.orderStatusValue}>68</Text>
              <Text style={styles.orderStatusLabel}>In Progress</Text>
            </View>
          </View>
        </View>

        {/* Sales Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Sales (2025)</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartBars}>
              {salesData.map((val, i) => (
                <View key={i} style={styles.chartBarWrap}>
                  <View style={[styles.chartBar, { height: val * 1.5, backgroundColor: i === 11 ? COLORS.gold[400] : COLORS.primary[500] }]} />
                  <Text style={styles.chartLabel}>{months[i]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Selling Products</Text>
          {topProducts.map((p, i) => (
            <View key={i} style={styles.topProductCard}>
              <View style={styles.topProductRank}><Text style={styles.topProductRankText}>{i + 1}</Text></View>
              <View style={styles.topProductBody}>
                <Text style={styles.topProductName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.topProductSales}>{p.sales} sales</Text>
              </View>
              <Text style={styles.topProductRevenue}>{p.revenue}</Text>
            </View>
          ))}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrders.map((order, i) => (
            <View key={i} style={styles.recentOrderCard}>
              <View style={styles.recentOrderInfo}>
                <Text style={styles.recentOrderId}>{order.id}</Text>
                <Text style={styles.recentOrderCustomer}>{order.customer}</Text>
              </View>
              <View style={styles.recentOrderRight}>
                <Text style={styles.recentOrderAmount}>{order.amount}</Text>
                <View style={[styles.recentOrderStatus, { backgroundColor: statusColors[order.status] + '20' }]}>
                  <Text style={[styles.recentOrderStatusText, { color: statusColors[order.status] }]}>{order.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management Modules</Text>
          <View style={styles.modulesGrid}>
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <TouchableOpacity key={mod.key} style={styles.moduleCard} onPress={() => setActiveModule(mod.key)}>
                  <View style={styles.moduleIcon}><Icon color={COLORS.primary[600]} size={22} /></View>
                  <Text style={styles.moduleLabel}>{mod.label}</Text>
                  <ChevronRight color={COLORS.neutral[300]} size={16} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, backgroundColor: COLORS.primary[800], gap: SPACING.sm },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.white, flex: 1 },
  headerSubtitle: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[300] },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  notifBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, paddingTop: SPACING.md, gap: SPACING.md },
  statCard: { width: (Dimensions_width - SPACING.md * 3) / 2, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  statValue: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  statLabel: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  statChangeWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  statChange: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: COLORS.success },
  section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: SPACING.md },
  orderStatusRow: { flexDirection: 'row', gap: SPACING.md },
  orderStatusCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, alignItems: 'center', ...SHADOWS.small },
  orderStatusValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginTop: 4 },
  orderStatusLabel: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  chartCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, ...SHADOWS.small },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingVertical: SPACING.sm },
  chartBarWrap: { alignItems: 'center', flex: 1 },
  chartBar: { width: 12, borderRadius: 6, minHeight: 8 },
  chartLabel: { fontSize: 10, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], marginTop: 4 },
  topProductCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  topProductRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary[100], justifyContent: 'center', alignItems: 'center' },
  topProductRankText: { fontSize: 13, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
  topProductBody: { flex: 1, marginLeft: SPACING.md },
  topProductName: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  topProductSales: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  topProductRevenue: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.success },
  recentOrderCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  recentOrderInfo: { flex: 1 },
  recentOrderId: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  recentOrderCustomer: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  recentOrderRight: { alignItems: 'flex-end' },
  recentOrderAmount: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  recentOrderStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm, marginTop: 4 },
  recentOrderStatusText: { fontSize: 10, fontFamily: 'Inter-SemiBold' },
  modulesGrid: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, ...SHADOWS.small },
  moduleCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
  moduleIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary[50], justifyContent: 'center', alignItems: 'center' },
  moduleLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter-Medium', color: COLORS.neutral[800], marginLeft: SPACING.md },
  loginContainer: { flex: 1, backgroundColor: COLORS.primary[900], justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.lg },
  loginCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, width: '100%', ...SHADOWS.large },
  loginLogo: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary[800], justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: SPACING.md },
  loginLogoText: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.gold[400] },
  loginTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], textAlign: 'center' },
  loginSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], textAlign: 'center', marginTop: 4 },
  loginForm: { marginTop: SPACING.xl },
  loginLabel: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginBottom: 8 },
  loginInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 52, borderWidth: 1, borderColor: COLORS.neutral[200], gap: 10 },
  loginInputText: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[900] },
  loginBtn: { backgroundColor: COLORS.primary[700], paddingVertical: SPACING.md, borderRadius: RADIUS.lg, marginTop: SPACING.lg, alignItems: 'center' },
  loginBtnText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.white },
  loginHint: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[400], textAlign: 'center', marginTop: SPACING.md },
});


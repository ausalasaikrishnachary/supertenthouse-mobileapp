// app/(tabs)/profile.tsx
import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  Alert, Modal, Linking, Dimensions, ActivityIndicator, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight, Heart, MapPin, Bell, HelpCircle, FileText, Shield,
  Headphones, LogOut, Award, Package, X, Phone, MessageCircle, Camera,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useWishlist } from '@/store/wishlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addressService } from '@/services/address';
import { orderService } from '@/services/address';

const { width } = Dimensions.get('window');

// ── Policy content ────────────────────────────────────────────────────────────
const PRIVACY_CONTENT = `Last updated: June 2025

1. INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, make a booking, or contact customer support. This includes your name, email address, phone number, delivery addresses, and payment information.

2. HOW WE USE YOUR INFORMATION
We use the information we collect to:
• Process and manage your bookings and orders
• Send you booking confirmations and event reminders
• Provide customer support
• Send you promotional offers (with your consent)
• Improve our services and personalise your experience

3. SHARING OF INFORMATION
We do not sell or rent your personal information to third parties. We may share your information with trusted service partners (e.g., delivery teams, payment processors) solely to fulfil your bookings.

4. DATA SECURITY
We implement industry-standard security measures to protect your personal information from unauthorised access, disclosure, or misuse.

5. COOKIES & ANALYTICS
We use cookies and similar tracking technologies to improve your browsing experience and analyse usage patterns.

6. YOUR RIGHTS
You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@supertent.com.

7. CONTACT US
Super Tent House, Bengaluru, Karnataka 560001
Email: privacy@supertent.com
Phone: +91 98765 43210`;

const TERMS_CONTENT = `Last updated: June 2025

1. ACCEPTANCE OF TERMS
By accessing and using the Super Tent House application, you agree to be bound by these Terms and Conditions.

2. BOOKING & ORDERS
• All bookings are subject to availability and confirmation.
• A booking is confirmed only after payment is received.
• Prices displayed are inclusive of applicable taxes unless stated otherwise.

3. CANCELLATION POLICY
• Free cancellation up to 7 days before the event date.
• 50% cancellation charge if cancelled within 7 days of the event.
• 100% charge for cancellations within 48 hours of the event.
• Rescheduling is available free of charge with at least 5 days' notice.

4. DELIVERY & INSTALLATION
• Installation is included with all our products and packages.
• Delivery timelines are estimates and may vary due to factors beyond our control.
• Free delivery on orders above ₹50,000 within the city limits.

5. PAYMENT
• We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Confirmation.
• All transactions are secured by 256-bit SSL encryption.
• Refunds, where applicable, are processed within 7–10 business days.

6. INTELLECTUAL PROPERTY
All content on this application, including images, descriptions, and designs, is owned by Super Tent House and protected by copyright law.

7. LIMITATION OF LIABILITY
Super Tent House shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.

8. GOVERNING LAW
These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.

9. CONTACT
Super Tent House, Bengaluru, Karnataka 560001
Email: legal@supertent.com`;

// ── Policy Modal ──────────────────────────────────────────────────────────────
function PolicyModal({
  visible, onClose, title, content,
}: { visible: boolean; onClose: () => void; title: string; content: string }) {
  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={pm.overlay}>
        <View style={pm.sheet}>
          <View style={pm.handle} />
          <View style={pm.header}>
            <Text style={pm.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={pm.closeBtn} hitSlop={10}>
              <X color={COLORS.neutral[600]} size={22} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={pm.body}>
            {content.split('\n\n').map((para, i) => {
              const isBullet = para.startsWith('•');
              const isHeading = /^\d+\./.test(para.trim());
              if (isBullet) {
                return (
                  <View key={i} style={pm.bulletWrap}>
                    {para.split('\n').map((line, j) => (
                      <View key={j} style={pm.bulletRow}>
                        <View style={pm.bulletDot} />
                        <Text style={pm.bulletText}>{line.replace('• ', '')}</Text>
                      </View>
                    ))}
                  </View>
                );
              }
              return (
                <Text key={i} style={isHeading ? pm.paraHeading : pm.para}>{para}</Text>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.neutral[300], alignSelf: 'center', marginTop: 12 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100],
  },
  title: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center',
  },
  body: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: 40 },
  para: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[700], lineHeight: 22, marginBottom: 14 },
  paraHeading: {
    fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.neutral[900],
    lineHeight: 22, marginBottom: 6, marginTop: 4,
  },
  bulletWrap: { marginBottom: 14 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  bulletDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.gold[400], marginTop: 8 },
  bulletText: { flex: 1, fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[700], lineHeight: 22 },
});

// ── Support card ──────────────────────────────────────────────────────────────
function SupportCard() {
  const router = useRouter();

  const handleCall = () => Linking.openURL('tel:+919876543210');
  const handleWhatsApp = () => Linking.openURL('https://wa.me/919876543210');

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(400)} style={sc.card}>
      <View style={sc.cardHeader}>
        <View style={sc.cardHeaderLeft}>
          <View style={sc.iconCircle}>
            <Headphones color={COLORS.primary[600]} size={18} />
          </View>
          <View>
            <Text style={sc.cardTitle}>Customer Support</Text>
            <Text style={sc.cardSub}>Available 24 / 7</Text>
          </View>
        </View>
        <View style={sc.onlineDotWrap}>
          <View style={sc.onlineDot} />
          <Text style={sc.onlineText}>Online</Text>
        </View>
      </View>

      <View style={sc.btnRow}>
        <TouchableOpacity style={sc.btnCall} onPress={handleCall} activeOpacity={0.85}>
          <View style={sc.btnIconWrap}>
            <Phone color={COLORS.white} size={18} />
          </View>
          <View>
            <Text style={sc.btnLabel}>Call Us</Text>
            <Text style={sc.btnNumber}>+919876543210</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={sc.btnWA} onPress={handleWhatsApp} activeOpacity={0.85}>
          <View style={[sc.btnIconWrap, sc.btnIconWA]}>
            <MessageCircle color={COLORS.white} size={18} />
          </View>
          <View>
            <Text style={[sc.btnLabel, { color: COLORS.white }]}>WhatsApp</Text>
            <Text style={[sc.btnNumber, { color: 'rgba(255,255,255,0.75)' }]}>Chat instantly</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={sc.chatLink} onPress={() => router.push('/support')}>
        <Headphones color={COLORS.primary[600]} size={14} />
        <Text style={sc.chatLinkText}>Open full support centre  →</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const sc = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    padding: SPACING.md,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary[50], justifyContent: 'center', alignItems: 'center',
  },
  cardTitle: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  cardSub: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 1 },
  onlineDotWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  onlineText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.success },
  btnRow: { flexDirection: 'row', gap: SPACING.sm },
  btnCall: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.primary[800], borderRadius: RADIUS.xl, padding: SPACING.md,
  },
  btnWA: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#25D366', borderRadius: RADIUS.xl, padding: SPACING.md,
  },
  btnIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  btnIconWA: { backgroundColor: 'rgba(255,255,255,0.25)' },
  btnLabel: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.white },
  btnNumber: { fontSize: 11, fontFamily: 'Inter-Regular', color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  chatLink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginTop: SPACING.md, paddingTop: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.neutral[100],
  },
  chatLinkText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600] },
});

// ── Main profile screen ───────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, logout, uploadProfilePhoto } = useAuth();
  const { state: wishState } = useWishlist();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // State for counts
  const [orderCount, setOrderCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const customerId = state.user?.id;

  // ─── Load counts ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadCounts = async () => {
      if (!customerId) {
        setOrderCount(0);
        setAddressCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const orders = await orderService.getOrders(customerId);
        setOrderCount(orders.length);
        
        const addresses = await addressService.getAddresses(customerId);
        setAddressCount(addresses.length);
        
        console.log('✅ Counts loaded:', { orders: orders.length, addresses: addresses.length });
      } catch (error) {
        console.error('❌ Failed to load counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, [customerId]);

  // ─── Get avatar URL ──────────────────────────────────────────────────────────
  const getAvatarUrl = () => {
    if (!state.user?.avatar) {
      return 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    
    const avatar = state.user.avatar;
    
    // If it's already a full URL, return it
    if (avatar.startsWith('http')) {
      return avatar;
    }
    
    // If it's a path, prepend the server URL
    if (avatar.startsWith('/uploads/')) {
      return `http://localhost:5000${avatar}`;
    }
    
    // Fallback
    return avatar;
  };

  // ─── Upload Profile Photo ───────────────────────────────────────────────────
  const handleUploadPhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photo library to upload a profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('📸 Image picker result:', result);

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        console.log('📸 Selected image:', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          width: selectedImage.width,
          height: selectedImage.height,
          fileSize: selectedImage.fileSize
        });
        
        // Show loading
        setUploadingPhoto(true);

        try {
          // Upload using auth context method
          const avatarUrl = await uploadProfilePhoto(selectedImage.uri);
          
          if (avatarUrl) {
            Alert.alert('Success', 'Profile photo updated successfully!');
          } else {
            Alert.alert('Error', 'Failed to upload profile photo');
          }
        } catch (uploadError: any) {
          console.error('❌ Upload error:', uploadError);
          Alert.alert(
            'Upload Failed', 
            uploadError.message || 'Failed to upload profile photo. Please try again.'
          );
        }
      }
    } catch (error) {
      console.error('❌ Failed to upload profile photo:', error);
      Alert.alert('Error', 'Failed to upload profile photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ─── Menu Items ─────────────────────────────────────────────────────────────
  const menuItems = [
    { icon: Package,   label: 'My Orders',       action: () => router.push('/(tabs)/orders') },
    { icon: Heart,     label: 'Wishlist',        badge: wishState.productIds.length, action: () => router.push('/wishlist') },
    { icon: MapPin,    label: 'Saved Addresses',  action: () => router.push('/addresses') },
    { icon: Bell,      label: 'Notifications',   action: () => router.push('/notifications') },
    { icon: HelpCircle,label: 'FAQs & Support',  action: () => router.push('/support') },
    { icon: Shield,    label: 'Terms & Conditions', action: () => setShowTerms(true) },
    { icon: FileText,  label: 'Privacy Policy',  action: () => setShowPrivacy(true) },
  ];

  const performLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    router.replace('/(auth)/login');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      setShowLogoutConfirm(true);
      return;
    }

    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: () => { void performLogout(); },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <View style={styles.profileRow}>
          {/* Avatar with upload button */}
          <TouchableOpacity 
            style={styles.avatarWrapper} 
            onPress={handleUploadPhoto}
            activeOpacity={0.8}
            disabled={uploadingPhoto}
          >
            <Image
              source={{ uri: getAvatarUrl() }}
              style={styles.avatar}
              onError={(e) => {
                console.log('❌ Image loading error:', e.nativeEvent);
              }}
            />
            {uploadingPhoto ? (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator size="small" color={COLORS.white} />
              </View>
            ) : (
              <View style={styles.cameraIconContainer}>
                <Camera color={COLORS.white} size={16} />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{state.user?.name || 'Guest User'}</Text>
              {state.user?.isPremium && (
                <View style={styles.premiumBadge}>
                  <Award color={COLORS.neutral[900]} size={12} />
                  <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
              )}
            </View>
            <Text style={styles.email}>{state.user?.email || 'guest@example.com'}</Text>
            <Text style={styles.phone}>{state.user?.phone || ''}</Text>
            <TouchableOpacity onPress={handleUploadPhoto} disabled={uploadingPhoto}>
              <Text style={styles.changePhotoText}>
                {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { val: loading ? '...' : String(orderCount), lbl: 'Orders' },
          { val: String(wishState.productIds.length), lbl: 'Wishlist' },
          { val: loading ? '...' : String(addressCount), lbl: 'Addresses' },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statValue}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.lbl}</Text>
          </View>
        ))}
      </View>

      {/* Support card */}
      <SupportCard />

      {/* Menu */}
      <View style={styles.menuSection}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isLast = i === menuItems.length - 1;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrap}>
                <Icon color={COLORS.primary[600]} size={20} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.badge ? (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </Text>
                </View>
              ) : null}
              <ChevronRight color={COLORS.neutral[300]} size={20} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut color={COLORS.error} size={20} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Super Tent House v1.0.0</Text>
      <View style={{ height: 40 }} />

      <Modal
        visible={showLogoutConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Logout</Text>
            <Text style={styles.confirmMessage}>Are you sure you want to logout?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmCancelButton]}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmLogoutButton]}
                onPress={() => { void performLogout(); }}
              >
                <Text style={styles.confirmLogoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Policy modals */}
      <PolicyModal
        visible={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
        content={PRIVACY_CONTENT}
      />
      <PolicyModal
        visible={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms & Conditions"
        content={TERMS_CONTENT}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    backgroundColor: COLORS.primary[800], 
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl, 
    borderBottomLeftRadius: RADIUS.xxl, 
    borderBottomRightRadius: RADIUS.xxl,
  },
  profileRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.md 
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: { 
    width: 72, 
    height: 72, 
    borderRadius: 36, 
    borderWidth: 3, 
    borderColor: COLORS.gold[400] 
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary[600],
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: { flex: 1 },
  nameRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  name: { 
    fontSize: 20, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.white 
  },
  premiumBadge: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 3,
    backgroundColor: COLORS.gold[400], 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: RADIUS.sm,
  },
  premiumText: { 
    fontSize: 9, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.neutral[900] 
  },
  email: { 
    fontSize: 13, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[300], 
    marginTop: 4 
  },
  phone: { 
    fontSize: 13, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[300], 
    marginTop: 2 
  },
  changePhotoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.gold[400],
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  statsRow: { 
    flexDirection: 'row', 
    paddingHorizontal: SPACING.lg, 
    marginTop: -SPACING.lg, 
    gap: SPACING.md 
  },
  statCard: { 
    flex: 1, 
    backgroundColor: COLORS.white, 
    borderRadius: RADIUS.xl, 
    paddingVertical: SPACING.md, 
    alignItems: 'center', 
    ...SHADOWS.medium 
  },
  statValue: { 
    fontSize: 22, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.neutral[900] 
  },
  statLabel: { 
    fontSize: 12, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[500], 
    marginTop: 2 
  },
  menuSection: {
    backgroundColor: COLORS.white, 
    marginHorizontal: SPACING.lg, 
    marginTop: SPACING.lg,
    borderRadius: RADIUS.xl, 
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.neutral[100],
  },
  menuIconWrap: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: COLORS.primary[50], 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  menuLabel: { 
    flex: 1, 
    fontSize: 15, 
    fontFamily: 'Inter-Medium', 
    color: COLORS.neutral[800], 
    marginLeft: SPACING.md 
  },
  menuBadge: {
    backgroundColor: COLORS.error, 
    borderRadius: 10, 
    minWidth: 20, 
    height: 20,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 4, 
    marginRight: 8,
  },
  menuBadgeText: { 
    color: COLORS.white, 
    fontSize: 10, 
    fontFamily: 'Inter-Bold' 
  },
  logoutBtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
    marginHorizontal: SPACING.lg, 
    marginTop: SPACING.lg, 
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white, 
    borderRadius: RADIUS.xl, 
    ...SHADOWS.small,
  },
  logoutText: { 
    fontSize: 15, 
    fontFamily: 'Inter-SemiBold', 
    color: COLORS.error 
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  confirmTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
  },
  confirmMessage: {
    marginTop: SPACING.sm,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  confirmButton: {
    minWidth: 96,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  confirmCancelButton: { backgroundColor: COLORS.neutral[100] },
  confirmLogoutButton: { backgroundColor: COLORS.error },
  confirmCancelText: {
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[700],
  },
  confirmLogoutText: {
    fontFamily: 'Inter-SemiBold',
    color: COLORS.white,
  },
  version: { 
    textAlign: 'center', 
    fontSize: 12, 
    color: COLORS.neutral[400], 
    fontFamily: 'Inter-Regular', 
    marginTop: SPACING.lg 
  },
});

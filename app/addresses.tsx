// import { useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, Plus, MapPin, Edit3, Trash2, Check, X } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
// import { Address } from '@/types';
// import { sampleAddresses } from '@/mock/data';
// import { useToast } from '@/store/toast';
// import { Button } from '@/components/ui/Button';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function AddressesScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { show } = useToast();
//   const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
//   const [showForm, setShowForm] = useState(false);
//   const [editing, setEditing] = useState<Address | null>(null);
//   const [form, setForm] = useState({ label: '', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });

//   const openAdd = () => {
//     setEditing(null);
//     setForm({ label: '', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
//     setShowForm(true);
//   };

//   const openEdit = (addr: Address) => {
//     setEditing(addr);
//     setForm({ label: addr.label, fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode });
//     setShowForm(true);
//   };

//   const handleSave = () => {
//     if (!form.label || !form.fullName || !form.line1 || !form.city || !form.pincode) {
//       show('Please fill required fields', 'error');
//       return;
//     }
//     if (editing) {
//       setAddresses(addresses.map(a => a.id === editing.id ? { ...editing, ...form } : a));
//       show('Address updated');
//     } else {
//       setAddresses([...addresses, { ...form, id: 'addr' + Date.now(), isDefault: addresses.length === 0 }]);
//       show('Address added');
//     }
//     setShowForm(false);
//   };

//   const handleDelete = (id: string) => {
//     Alert.alert('Delete Address', 'Are you sure?', [
//       { text: 'Cancel', style: 'cancel' },
//       { text: 'Delete', style: 'destructive', onPress: () => { setAddresses(addresses.filter(a => a.id !== id)); show('Address deleted', 'info'); } },
//     ]);
//   };

//   const setDefault = (id: string) => {
//     setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
//     show('Default address updated');
//   };

//   return (
//     <View style={styles.container}>
//       <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <ArrowLeft color={COLORS.neutral[800]} size={24} />
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.title}>Saved Addresses</Text>
//           <Text style={styles.subtitle}>{addresses.length} addresses</Text>
//         </View>
//       </View>

//       <FlatList
//         data={addresses}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 100 }}
//         renderItem={({ item }) => (
//           <View style={styles.addrCard}>
//             <View style={styles.addrHeader}>
//               <View style={styles.addrLabelWrap}>
//                 <Text style={styles.addrLabel}>{item.label}</Text>
//                 {item.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultText}>DEFAULT</Text></View>}
//               </View>
//               <View style={styles.addrActions}>
//                 <TouchableOpacity style={styles.addrAction} onPress={() => openEdit(item)}>
//                   <Edit3 color={COLORS.primary[600]} size={16} />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.addrAction} onPress={() => handleDelete(item.id)}>
//                   <Trash2 color={COLORS.error} size={16} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <Text style={styles.addrName}>{item.fullName} • {item.phone}</Text>
//             <Text style={styles.addrText}>{item.line1}{item.line2 ? `, ${item.line2}` : ''}, {item.city}, {item.state} - {item.pincode}</Text>
//             {!item.isDefault && (
//               <TouchableOpacity style={styles.setDefaultBtn} onPress={() => setDefault(item.id)}>
//                 <Check color={COLORS.primary[600]} size={14} />
//                 <Text style={styles.setDefaultText}>Set as Default</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//         keyExtractor={(item) => item.id}
//       />

//       <View style={styles.addBtnWrap}>
//         <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
//           <Plus color={COLORS.white} size={24} />
//           <Text style={styles.addBtnText}>Add New Address</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Form Modal */}
//       <Modal visible={showForm} animationType="slide" transparent>
//         <View style={styles.formOverlay}>
//           <View style={styles.formSheet}>
//             <View style={styles.formHeader}>
//               <Text style={styles.formTitle}>{editing ? 'Edit Address' : 'Add Address'}</Text>
//               <TouchableOpacity onPress={() => setShowForm(false)}>
//                 <X color={COLORS.neutral[600]} size={24} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.formBody}>
//               <View style={styles.formRow}>
//                 <View style={styles.formGroup}>
//                   <Text style={styles.formLabel}>Label</Text>
//                   <TextInput style={styles.formInput} placeholder="Home, Office..." placeholderTextColor={COLORS.neutral[400]} value={form.label} onChangeText={(v) => setForm({ ...form, label: v })} />
//                 </View>
//                 <View style={styles.formGroup}>
//                   <Text style={styles.formLabel}>Pincode</Text>
//                   <TextInput style={styles.formInput} placeholder="560001" placeholderTextColor={COLORS.neutral[400]} value={form.pincode} onChangeText={(v) => setForm({ ...form, pincode: v })} keyboardType="number-pad" />
//                 </View>
//               </View>
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Full Name</Text>
//                 <TextInput style={styles.formInput} placeholder="John Doe" placeholderTextColor={COLORS.neutral[400]} value={form.fullName} onChangeText={(v) => setForm({ ...form, fullName: v })} />
//               </View>
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Phone</Text>
//                 <TextInput style={styles.formInput} placeholder="+91 98765 43210" placeholderTextColor={COLORS.neutral[400]} value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} keyboardType="phone-pad" />
//               </View>
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Address Line 1</Text>
//                 <TextInput style={styles.formInput} placeholder="House no, Street" placeholderTextColor={COLORS.neutral[400]} value={form.line1} onChangeText={(v) => setForm({ ...form, line1: v })} />
//               </View>
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Address Line 2 (Optional)</Text>
//                 <TextInput style={styles.formInput} placeholder="Area, Landmark" placeholderTextColor={COLORS.neutral[400]} value={form.line2} onChangeText={(v) => setForm({ ...form, line2: v })} />
//               </View>
//               <View style={styles.formRow}>
//                 <View style={styles.formGroup}>
//                   <Text style={styles.formLabel}>City</Text>
//                   <TextInput style={styles.formInput} placeholder="Bengaluru" placeholderTextColor={COLORS.neutral[400]} value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} />
//                 </View>
//                 <View style={styles.formGroup}>
//                   <Text style={styles.formLabel}>State</Text>
//                   <TextInput style={styles.formInput} placeholder="Karnataka" placeholderTextColor={COLORS.neutral[400]} value={form.state} onChangeText={(v) => setForm({ ...form, state: v })} />
//                 </View>
//               </View>
//               <Button onPress={handleSave} fullWidth size="lg" style={{ marginTop: SPACING.md }}>{editing ? 'Update Address' : 'Save Address'}</Button>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite },
//   header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
//   backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
//   title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
//   addrCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
//   addrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   addrLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   addrLabel: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   defaultBadge: { backgroundColor: COLORS.gold[100], paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.sm },
//   defaultText: { fontSize: 9, fontFamily: 'Inter-Bold', color: COLORS.gold[600] },
//   addrActions: { flexDirection: 'row', gap: 8 },
//   addrAction: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.neutral[100], justifyContent: 'center', alignItems: 'center' },
//   addrName: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginTop: 8 },
//   addrText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4, lineHeight: 18 },
//   setDefaultBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.sm, alignSelf: 'flex-start' },
//   setDefaultText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600] },
//   addBtnWrap: { position: 'absolute', bottom: 30, left: SPACING.lg, right: SPACING.lg },
//   addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary[700], paddingVertical: SPACING.md, borderRadius: RADIUS.xl, ...SHADOWS.medium },
//   addBtnText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.white },
//   formOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   formSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, maxHeight: '90%', paddingBottom: 40 },
//   formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.neutral[100] },
//   formTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   formBody: { padding: SPACING.lg },
//   formRow: { flexDirection: 'row', gap: SPACING.md },
//   formGroup: { flex: 1, marginBottom: SPACING.md },
//   formLabel: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginBottom: 6 },
//   formInput: { backgroundColor: COLORS.neutral[50], borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 48, fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[900], borderWidth: 1, borderColor: COLORS.neutral[200] },
// });




import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, MapPin, Edit3, Trash2, Check, X, Home, Briefcase } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useToast } from '@/store/toast';
import { Button } from '@/components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addressService, Address } from '@/services/address';
import { useAuth } from '@/store/auth';

export default function AddressesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const { state: authState } = useAuth();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState({
    label: '',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    type: 'home' as 'home' | 'office' | 'other',
    isDefault: false
  });

  const customerId = authState.user?.id;

  // ─── Load addresses ──────────────────────────────────────────────────────────
  const loadAddresses = async () => {
    if (!customerId) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📦 Loading addresses for customer:', customerId);
      const loadedAddresses = await addressService.getAddresses(customerId);
      
      // Format addresses to match the expected structure
      const formattedAddresses = loadedAddresses.map(addr => ({
        ...addr,
        id: String(addr.id),
        customerId: String(addr.customerId),
      }));
      
      setAddresses(formattedAddresses);
      console.log('✅ Addresses loaded:', formattedAddresses.length);
    } catch (error) {
      console.error('❌ Failed to load addresses:', error);
      show('Failed to load addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [customerId]);

  // ─── Get icon for address type ─────────────────────────────────────────────
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return Home;
      case 'office': return Briefcase;
      default: return MapPin;
    }
  };

  // ─── Get color for address type ────────────────────────────────────────────
  const getAddressColor = (type: string) => {
    switch (type) {
      case 'home': return '#4CAF50';
      case 'office': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      label: '',
      fullName: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      type: 'home',
      isDefault: false
    });
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setForm({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country || 'India',
      type: addr.type || 'other',
      isDefault: addr.isDefault || false
    });
    setShowForm(true);
  };

  // ─── Save address ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.label || !form.fullName || !form.line1 || !form.city || !form.pincode) {
      show('Please fill required fields', 'error');
      return;
    }

    if (!customerId) {
      show('Please login to save addresses', 'error');
      return;
    }

    try {
      if (editing) {
        // Update existing address
        const success = await addressService.updateAddress(editing.id, form);
        if (success) {
          show('Address updated successfully');
          await loadAddresses();
        } else {
          show('Failed to update address', 'error');
        }
      } else {
        // Add new address
        const newAddress = {
          label: form.label,
          fullName: form.fullName,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2 || '',
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country || 'India',
          type: form.type || 'other',
          isDefault: addresses.length === 0, // Make default if first address
        };

        const savedAddress = await addressService.addAddress(customerId, newAddress);
        if (savedAddress) {
          show('Address added successfully');
          await loadAddresses();
        } else {
          show('Failed to add address', 'error');
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error('❌ Failed to save address:', error);
      show('Failed to save address', 'error');
    }
  };

  // ─── Delete address ──────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await addressService.deleteAddress(id);
              if (success) {
                show('Address deleted');
                await loadAddresses();
              } else {
                show('Failed to delete address', 'error');
              }
            } catch (error) {
              console.error('Failed to delete address:', error);
              show('Failed to delete address', 'error');
            }
          }
        },
      ]
    );
  };

  // ─── Set default address ────────────────────────────────────────────────────
  const setDefault = async (id: string) => {
    try {
      const success = await addressService.setDefaultAddress(id);
      if (success) {
        show('Default address updated');
        await loadAddresses();
      } else {
        show('Failed to set default address', 'error');
      }
    } catch (error) {
      console.error('Failed to set default address:', error);
      show('Failed to set default address', 'error');
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>
          Loading addresses...
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
        <View>
          <Text style={styles.title}>Saved Addresses</Text>
          <Text style={styles.subtitle}>{addresses.length} addresses</Text>
        </View>
      </View>

      <FlatList
        data={addresses}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const Icon = getAddressIcon(item.type);
          const color = getAddressColor(item.type);
          return (
            <View style={styles.addrCard}>
              <View style={styles.addrHeader}>
                <View style={styles.addrLabelWrap}>
                  <View style={[styles.typeBadge, { backgroundColor: color + '20' }]}>
                    <Icon size={12} color={color} />
                    <Text style={[styles.typeBadgeText, { color }]}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.addrLabel}>{item.label}</Text>
                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addrActions}>
                  <TouchableOpacity style={styles.addrAction} onPress={() => openEdit(item)}>
                    <Edit3 color={COLORS.primary[600]} size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addrAction} onPress={() => handleDelete(item.id)}>
                    <Trash2 color={COLORS.error} size={16} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.addrName}>{item.fullName} • {item.phone}</Text>
              <Text style={styles.addrText}>
                {item.line1}{item.line2 ? `, ${item.line2}` : ''}, {item.city}, {item.state} - {item.pincode}
              </Text>
              {!item.isDefault && (
                <TouchableOpacity style={styles.setDefaultBtn} onPress={() => setDefault(item.id)}>
                  <Check color={COLORS.primary[600]} size={14} />
                  <Text style={styles.setDefaultText}>Set as Default</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.addBtnWrap}>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Plus color={COLORS.white} size={24} />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      {/* Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.formOverlay}>
          <View style={styles.formSheet}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{editing ? 'Edit Address' : 'Add Address'}</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X color={COLORS.neutral[600]} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.formBody}>
              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Label *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Home, Office..."
                    placeholderTextColor={COLORS.neutral[400]}
                    value={form.label}
                    onChangeText={(v) => setForm({ ...form, label: v })}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Pincode *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="560001"
                    placeholderTextColor={COLORS.neutral[400]}
                    value={form.pincode}
                    onChangeText={(v) => setForm({ ...form, pincode: v })}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Type</Text>
                <View style={styles.typeRow}>
                  {[
                    { key: 'home', label: 'Home', icon: Home },
                    { key: 'office', label: 'Office', icon: Briefcase },
                    { key: 'other', label: 'Other', icon: MapPin },
                  ].map(({ key, label, icon: Icon }) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.typeBtn, form.type === key && styles.typeBtnActive]}
                      onPress={() => setForm({ ...form, type: key as any })}
                    >
                      <Icon size={18} color={form.type === key ? COLORS.white : COLORS.neutral[600]} />
                      <Text style={[styles.typeText, form.type === key && styles.typeTextActive]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="John Doe"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={form.fullName}
                  onChangeText={(v) => setForm({ ...form, fullName: v })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={form.phone}
                  onChangeText={(v) => setForm({ ...form, phone: v })}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Line 1 *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="House no, Street"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={form.line1}
                  onChangeText={(v) => setForm({ ...form, line1: v })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Line 2 (Optional)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Area, Landmark"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={form.line2}
                  onChangeText={(v) => setForm({ ...form, line2: v })}
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>City *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Bengaluru"
                    placeholderTextColor={COLORS.neutral[400]}
                    value={form.city}
                    onChangeText={(v) => setForm({ ...form, city: v })}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>State *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Karnataka"
                    placeholderTextColor={COLORS.neutral[400]}
                    value={form.state}
                    onChangeText={(v) => setForm({ ...form, state: v })}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Country</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="India"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={form.country}
                  onChangeText={(v) => setForm({ ...form, country: v })}
                />
              </View>

              <Button
                onPress={handleSave}
                fullWidth
                size="lg"
                style={{ marginTop: SPACING.md }}
              >
                {editing ? 'Update Address' : 'Save Address'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
    gap: SPACING.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  addrCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  addrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addrLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
  },
  addrLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
  },
  defaultBadge: {
    backgroundColor: COLORS.gold[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  defaultText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: COLORS.gold[600],
  },
  addrActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addrAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addrName: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[700],
    marginTop: 8,
  },
  addrText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    marginTop: 4,
    lineHeight: 18,
  },
  setDefaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary[600],
  },
  addBtnWrap: {
    position: 'absolute',
    bottom: 30,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary[700],
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    ...SHADOWS.medium,
  },
  addBtnText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.white,
  },
  formOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  formSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '90%',
    paddingBottom: 40,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
  },
  formBody: {
    padding: SPACING.lg,
  },
  formRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  formGroup: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  formLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[700],
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[900],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeBtnActive: {
    backgroundColor: COLORS.primary[700],
    borderColor: COLORS.primary[700],
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[600],
  },
  typeTextActive: {
    color: COLORS.white,
  },
});
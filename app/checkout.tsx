// app/checkout.tsx
import { useState, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Dimensions, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { SlideInRight, FadeIn } from 'react-native-reanimated';
import {
  ArrowLeft, Check, MapPin, Calendar, CreditCard, ShoppingBag,
  Smartphone, Wallet, Banknote, ChevronLeft, ChevronRight, Clock, X,
  Home, Briefcase, Plus,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/store/cart';
import { useToast } from '@/store/toast';
import { useAuth } from '@/store/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addressService, orderService, Address as AddressType, AddressInput, OrderInput } from '@/services/address';

const { width } = Dimensions.get('window');

// ─── helpers ─────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function pad(n: number) {
  return String(n).padStart(2, '0');
}
function formatDisplay(d: Date) {
  return `${pad(d.getDate())} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

// ─── Calendar Modal ───────────────────────────────────────────────────────────
type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  selected: Date | null;
  onSelect: (d: Date) => void;
  minDate?: Date;
};

function CalendarModal({ visible, onClose, selected, onSelect, minDate }: CalendarModalProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const min = minDate ?? today;

  const cells = useMemo(() => {
    const first = firstWeekday(viewYear, viewMonth);
    const total = daysInMonth(viewYear, viewMonth);
    const arr: (number | null)[] = Array(first).fill(null);
    for (let d = 1; d <= total; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const m = new Date(min);
    m.setHours(0, 0, 0, 0);
    return d < m;
  };
  const isSelected = (day: number) => {
    if (!selected) return false;
    return selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day;
  };
  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const handleDay = (day: number) => {
    if (isDisabled(day)) return;
    onSelect(new Date(viewYear, viewMonth, day));
    onClose();
  };

  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={cmStyles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <Animated.View entering={FadeIn.duration(200)} style={cmStyles.sheet}>
          <View style={cmStyles.handle} />
          <View style={cmStyles.navRow}>
            <TouchableOpacity
              onPress={prevMonth}
              style={[cmStyles.navBtn, !canGoPrev && { opacity: 0.3 }]}
              disabled={!canGoPrev}
            >
              <ChevronLeft color={COLORS.primary[700]} size={22} />
            </TouchableOpacity>
            <View style={cmStyles.navCenter}>
              <Text style={cmStyles.monthText}>{MONTH_NAMES[viewMonth]}</Text>
              <Text style={cmStyles.yearText}>{viewYear}</Text>
            </View>
            <TouchableOpacity onPress={nextMonth} style={cmStyles.navBtn}>
              <ChevronRight color={COLORS.primary[700]} size={22} />
            </TouchableOpacity>
          </View>
          <View style={cmStyles.weekRow}>
            {DAY_LABELS.map(d => (
              <Text key={d} style={cmStyles.weekLabel}>{d}</Text>
            ))}
          </View>
          <View style={cmStyles.grid}>
            {cells.map((day, idx) => {
              if (day === null) return <View key={idx} style={cmStyles.cell} />;
              const disabled = isDisabled(day);
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <TouchableOpacity
                  key={idx}
                  style={cmStyles.cell}
                  onPress={() => handleDay(day)}
                  activeOpacity={disabled ? 1 : 0.7}
                >
                  <View style={[
                    cmStyles.dayInner,
                    sel && cmStyles.daySelected,
                    !sel && tod && cmStyles.dayToday,
                  ]}>
                    <Text style={[
                      cmStyles.dayText,
                      disabled && cmStyles.dayDisabled,
                      sel && cmStyles.dayTextSelected,
                      !sel && tod && cmStyles.dayTextToday,
                    ]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={cmStyles.footer}>
            <Text style={cmStyles.footerLabel}>
              {selected ? formatDisplay(selected) : 'No date selected'}
            </Text>
            <TouchableOpacity style={cmStyles.confirmBtn} onPress={onClose}>
              <Text style={cmStyles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const CELL = (width - SPACING.lg * 2 - SPACING.md * 2) / 7;

const cmStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,18,36,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.neutral[300],
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  navCenter: { alignItems: 'center' },
  monthText: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  yearText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 1 },
  weekRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  weekLabel: {
    width: CELL,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[400],
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL, height: CELL + 6, alignItems: 'center', justifyContent: 'center' },
  dayInner: { width: CELL - 4, height: CELL - 4, borderRadius: (CELL - 4) / 2, justifyContent: 'center', alignItems: 'center' },
  daySelected: { backgroundColor: COLORS.primary[700] },
  dayToday: { backgroundColor: COLORS.gold[50], borderWidth: 1.5, borderColor: COLORS.gold[400] },
  dayText: { fontSize: 14, fontFamily: 'Inter-Medium', color: COLORS.neutral[800] },
  dayTextSelected: { color: COLORS.white, fontFamily: 'Inter-Bold' },
  dayTextToday: { color: COLORS.gold[600], fontFamily: 'Inter-Bold' },
  dayDisabled: { color: COLORS.neutral[300] },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  footerLabel: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[700] },
  confirmBtn: {
    backgroundColor: COLORS.primary[700],
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.xl,
  },
  confirmText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.white },
});

// ─── Time Picker Modal ────────────────────────────────────────────────────────
type TimePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  hour: number;
  minute: number;
  meridiem: 'AM' | 'PM';
  onChange: (h: number, m: number, mer: 'AM' | 'PM') => void;
};

function TimePickerModal({ visible, onClose, hour, minute, meridiem, onChange }: TimePickerModalProps) {
  const [h, setH] = useState(hour);
  const [m, setM] = useState(minute);
  const [mer, setMer] = useState<'AM' | 'PM'>(meridiem);

  const adjustH = (delta: number) => {
    setH(prev => {
      const next = prev + delta;
      if (next > 12) return 1;
      if (next < 1) return 12;
      return next;
    });
  };
  const adjustM = (delta: number) => {
    setM(prev => {
      const next = prev + delta;
      if (next >= 60) return 0;
      if (next < 0) return 55;
      return next;
    });
  };

  const confirm = () => {
    onChange(h, m, mer);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={tpStyles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <Animated.View entering={FadeIn.duration(200)} style={tpStyles.sheet}>
          <View style={tpStyles.handle} />
          <View style={tpStyles.headerRow}>
            <Text style={tpStyles.title}>Select Time</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X color={COLORS.neutral[500]} size={22} />
            </TouchableOpacity>
          </View>

          <View style={tpStyles.pickerRow}>
            <View style={tpStyles.spinnerCol}>
              <TouchableOpacity style={tpStyles.arrowBtn} onPress={() => adjustH(1)}>
                <ChevronLeft color={COLORS.primary[700]} size={22} style={{ transform: [{ rotate: '90deg' }] }} />
              </TouchableOpacity>
              <View style={tpStyles.valueBox}>
                <Text style={tpStyles.valueText}>{pad(h)}</Text>
              </View>
              <TouchableOpacity style={tpStyles.arrowBtn} onPress={() => adjustH(-1)}>
                <ChevronLeft color={COLORS.primary[700]} size={22} style={{ transform: [{ rotate: '-90deg' }] }} />
              </TouchableOpacity>
              <Text style={tpStyles.unitLabel}>Hour</Text>
            </View>

            <Text style={tpStyles.colon}>:</Text>

            <View style={tpStyles.spinnerCol}>
              <TouchableOpacity style={tpStyles.arrowBtn} onPress={() => adjustM(5)}>
                <ChevronLeft color={COLORS.primary[700]} size={22} style={{ transform: [{ rotate: '90deg' }] }} />
              </TouchableOpacity>
              <View style={tpStyles.valueBox}>
                <Text style={tpStyles.valueText}>{pad(m)}</Text>
              </View>
              <TouchableOpacity style={tpStyles.arrowBtn} onPress={() => adjustM(-5)}>
                <ChevronLeft color={COLORS.primary[700]} size={22} style={{ transform: [{ rotate: '-90deg' }] }} />
              </TouchableOpacity>
              <Text style={tpStyles.unitLabel}>Min</Text>
            </View>

            <View style={tpStyles.meridiemCol}>
              {(['AM', 'PM'] as const).map(v => (
                <TouchableOpacity
                  key={v}
                  style={[tpStyles.meridiemBtn, mer === v && tpStyles.meridiemActive]}
                  onPress={() => setMer(v)}
                >
                  <Text style={[tpStyles.meridiemText, mer === v && tpStyles.meridiemTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={tpStyles.confirmBtn} onPress={confirm}>
            <Text style={tpStyles.confirmText}>Set Time</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const tpStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,18,36,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.neutral[300],
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  title: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  spinnerCol: { alignItems: 'center', gap: SPACING.sm },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueBox: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  valueText: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.white },
  unitLabel: { fontSize: 11, fontFamily: 'Inter-Medium', color: COLORS.neutral[400], marginTop: 2 },
  colon: { fontSize: 32, fontFamily: 'Inter-Bold', color: COLORS.neutral[400], marginBottom: 20 },
  meridiemCol: { gap: SPACING.sm, marginLeft: SPACING.sm },
  meridiemBtn: {
    width: 60,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.neutral[100],
    alignItems: 'center',
  },
  meridiemActive: { backgroundColor: COLORS.primary[700] },
  meridiemText: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.neutral[500] },
  meridiemTextActive: { color: COLORS.white },
  confirmBtn: {
    backgroundColor: COLORS.primary[700],
    paddingVertical: 14,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  confirmText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.white },
});

// ─── Add Address Modal ───────────────────────────────────────────────────────
type AddAddressModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (address: Omit<AddressType, 'id' | 'customerId'>) => void;
};

function AddAddressModal({ visible, onClose, onSave }: AddAddressModalProps) {
  const [label, setLabel] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [type, setType] = useState<'home' | 'office' | 'other'>('home');

  const handleSave = () => {
    if (!label || !fullName || !phone || !line1 || !city || !state || !pincode) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    onSave({
      label,
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      country: 'India',
      type,
      isDefault: false,
    });

    setLabel('');
    setFullName('');
    setPhone('');
    setLine1('');
    setLine2('');
    setCity('');
    setState('');
    setPincode('');
    setType('home');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={amStyles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <Animated.View entering={FadeIn.duration(200)} style={amStyles.sheet}>
          <View style={amStyles.handle} />
          <View style={amStyles.header}>
            <Text style={amStyles.title}>Add New Address</Text>
            <TouchableOpacity onPress={onClose}>
              <X color={COLORS.neutral[500]} size={22} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={amStyles.form}>
            <View style={amStyles.formGroup}>
              <Text style={amStyles.formLabel}>Address Type</Text>
              <View style={amStyles.typeRow}>
                {[
                  { key: 'home', label: 'Home', icon: Home },
                  { key: 'office', label: 'Office', icon: Briefcase },
                  { key: 'other', label: 'Other', icon: MapPin },
                ].map(({ key, label: typeLabel, icon: Icon }) => (
                  <TouchableOpacity
                    key={key}
                    style={[amStyles.typeBtn, type === key && amStyles.typeBtnActive]}
                    onPress={() => setType(key as any)}
                  >
                    <Icon size={20} color={type === key ? COLORS.white : COLORS.neutral[600]} />
                    <Text style={[amStyles.typeText, type === key && amStyles.typeTextActive]}>
                      {typeLabel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={amStyles.formGroup}>
              <Text style={amStyles.formLabel}>Address Label <Text style={amStyles.required}>*</Text></Text>
              <TextInput
                style={amStyles.input}
                placeholder="e.g., Home, Office"
                placeholderTextColor={COLORS.neutral[400]}
                value={label}
                onChangeText={setLabel}
              />
            </View>

            <View style={amStyles.formGroup}>
              <Text style={amStyles.formLabel}>Full Name <Text style={amStyles.required}>*</Text></Text>
              <TextInput
                style={amStyles.input}
                placeholder="Enter full name"
                placeholderTextColor={COLORS.neutral[400]}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={amStyles.formGroup}>
              <Text style={amStyles.formLabel}>Phone Number <Text style={amStyles.required}>*</Text></Text>
              <TextInput
                style={amStyles.input}
                placeholder="Enter phone number"
                placeholderTextColor={COLORS.neutral[400]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={amStyles.formGroup}>
              <Text style={amStyles.formLabel}>Address Line 1 <Text style={amStyles.required}>*</Text></Text>
              <TextInput
                style={amStyles.input}
                placeholder="Street address"
                placeholderTextColor={COLORS.neutral[400]}
                value={line1}
                onChangeText={setLine1}
              />
            </View>

            <View style={amStyles.formGroup}>
              <Text style={amStyles.formLabel}>Address Line 2 (Optional)</Text>
              <TextInput
                style={amStyles.input}
                placeholder="Apartment, suite, etc."
                placeholderTextColor={COLORS.neutral[400]}
                value={line2}
                onChangeText={setLine2}
              />
            </View>

            <View style={amStyles.formGroup}>
              <Text style={amStyles.formLabel}>City <Text style={amStyles.required}>*</Text></Text>
              <TextInput
                style={amStyles.input}
                placeholder="Enter city"
                placeholderTextColor={COLORS.neutral[400]}
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={amStyles.formGroup}>
              <Text style={amStyles.formLabel}>State <Text style={amStyles.required}>*</Text></Text>
              <TextInput
                style={amStyles.input}
                placeholder="Enter state"
                placeholderTextColor={COLORS.neutral[400]}
                value={state}
                onChangeText={setState}
              />
            </View>

            <View style={amStyles.formGroup}>
              <Text style={amStyles.formLabel}>Pincode <Text style={amStyles.required}>*</Text></Text>
              <TextInput
                style={amStyles.input}
                placeholder="Enter pincode"
                placeholderTextColor={COLORS.neutral[400]}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity style={amStyles.saveBtn} onPress={handleSave}>
              <Text style={amStyles.saveBtnText}>Save Address</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const amStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,18,36,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.neutral[300],
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  title: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  form: { paddingBottom: SPACING.xl },
  formGroup: { marginBottom: SPACING.md },
  formLabel: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginBottom: 6 },
  required: { color: COLORS.error },
  input: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[900],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
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
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[600],
  },
  typeTextActive: {
    color: COLORS.white,
  },
  saveBtn: {
    backgroundColor: COLORS.primary[700],
    paddingVertical: 14,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.white,
  },
});

// ─── Main checkout screen ─────────────────────────────────────────────────────
// Only showing step 0 (Address) - Steps 1, 2, and 3 are hidden/commented out
const steps = ['Address']; // Removed 'Event Details', 'Payment', 'Summary'

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, subtotal, deliveryCharge, gst, grandTotal, clearCart } = useCart();
  const { state: authState } = useAuth();
  const { show } = useToast();

  const [step, setStep] = useState(0);
  const [selectedAddr, setSelectedAddr] = useState(0);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);

  // ─── Commented out Event Details state ──────────────────────────────────────
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // const [showCal, setShowCal] = useState(false);
  // const [timeHour, setTimeHour] = useState(6);
  // const [timeMin, setTimeMin] = useState(0);
  // const [timeMer, setTimeMer] = useState<'AM' | 'PM'>('PM');
  // const [showTime, setShowTime] = useState(false);
  // const [eventType, setEventType] = useState('Wedding');
  // const [venue, setVenue] = useState('');
  // const [guestCount, setGuestCount] = useState('');
  // const [instructions, setInstructions] = useState('');
  // const [processing, setProcessing] = useState(false);

  const customerId = authState.user?.id;
  // const eventDateDisplay = selectedDate ? formatDisplay(selectedDate) : '';
  // const eventTimeDisplay = `${pad(timeHour)}:${pad(timeMin)} ${timeMer}`;
  // const eventTypes = ['Wedding', 'Reception', 'Birthday', 'Corporate', 'Festival', 'Other'];

  // ─── Load addresses from database ───────────────────────────────────────────
  useEffect(() => {
    const loadAddresses = async () => {
      if (!customerId) {
        setAddresses([]);
        setLoadingAddress(false);
        return;
      }

      try {
        console.log('📦 Loading addresses from database for customer:', customerId);
        const loadedAddresses = await addressService.getAddresses(customerId);
        
        const formattedAddresses = loadedAddresses.map(addr => ({
          ...addr,
          id: String(addr.id),
          customerId: String(addr.customerId),
        }));
        
        setAddresses(formattedAddresses);
        
        const defaultIndex = formattedAddresses.findIndex(addr => addr.isDefault);
        setSelectedAddr(defaultIndex !== -1 ? defaultIndex : 0);
        
        console.log('✅ Addresses loaded:', formattedAddresses.length);
      } catch (error) {
        console.error('❌ Failed to load addresses:', error);
      } finally {
        setLoadingAddress(false);
      }
    };

    loadAddresses();
  }, [customerId]);

  // ─── Add new address - Save to database ─────────────────────────────────────
  const addAddress = async (newAddress: Omit<AddressType, 'id' | 'customerId'>) => {
    if (!customerId) {
      show('Please login to save address', 'error');
      return;
    }

    try {
      console.log('📦 Saving address to database:', newAddress);
      
      const addressInput: AddressInput = {
        label: newAddress.label,
        fullName: newAddress.fullName,
        phone: newAddress.phone,
        line1: newAddress.line1,
        line2: newAddress.line2 || '',
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        country: newAddress.country || 'India',
        type: newAddress.type || 'other',
        isDefault: addresses.length === 0,
      };

      const savedAddress = await addressService.addAddress(customerId, addressInput);
      
      if (savedAddress) {
        const updatedAddresses = await addressService.getAddresses(customerId);
        const formattedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          id: String(addr.id),
          customerId: String(addr.customerId),
        }));
        
        setAddresses(formattedAddresses);
        setSelectedAddr(formattedAddresses.length - 1);
        show('Address saved successfully!');
      } else {
        show('Failed to save address', 'error');
      }
    } catch (error) {
      console.error('❌ Failed to save address:', error);
      show('Failed to save address', 'error');
    }
  };

  // ─── Delete address - Remove from database ──────────────────────────────────
  const deleteAddress = (index: number) => {
    const address = addresses[index];
    if (!address) return;

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
              const success = await addressService.deleteAddress(address.id);
              if (success) {
                const newAddresses = addresses.filter((_, i) => i !== index);
                setAddresses(newAddresses);
                if (selectedAddr >= newAddresses.length) {
                  setSelectedAddr(Math.max(0, newAddresses.length - 1));
                }
                show('Address deleted');
              } else {
                show('Failed to delete address', 'error');
              }
            } catch (error) {
              console.error('Failed to delete address:', error);
              show('Failed to delete address', 'error');
            }
          },
        },
      ]
    );
  };

  // ─── Set default address - Update in database ───────────────────────────────
  const setDefaultAddress = async (index: number) => {
    const address = addresses[index];
    if (!address) return;

    try {
      const success = await addressService.setDefaultAddress(address.id);
      if (success) {
        const updatedAddresses = addresses.map((addr, i) => ({
          ...addr,
          isDefault: i === index,
        }));
        setAddresses(updatedAddresses);
        show('Default address updated');
      } else {
        show('Failed to set default address', 'error');
      }
    } catch (error) {
      console.error('Failed to set default address:', error);
      show('Failed to set default address', 'error');
    }
  };

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

  // ─── Create Order ──────────────────────────────────────────────────────────────
  // ─── Commented out - moved to simplified order creation ──────────────────────
  /*
  const createOrder = async () => {
    if (!customerId) {
      show('Please login to place order', 'error');
      return;
    }

    const selectedAddress = addresses[selectedAddr];
    if (!selectedAddress) {
      show('Please select an address', 'error');
      return;
    }

    if (!selectedDate || !venue || !guestCount) {
      show('Please fill all event details', 'error');
      return;
    }

    try {
      setProcessing(true);

      const orderData: OrderInput = {
        customerId: customerId,
        customerName: authState.user?.name || '',
        customerEmail: authState.user?.email || '',
        customerPhone: authState.user?.phone || '',
        address: {
          id: selectedAddress.id,
          label: selectedAddress.label,
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          line1: selectedAddress.line1,
          line2: selectedAddress.line2 || '',
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country || 'India',
        },
        eventDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
        eventTime: eventTimeDisplay,
        eventType: eventType,
        venue: venue,
        guestCount: parseInt(guestCount) || 0,
        specialInstructions: instructions,
        items: state.items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        gst: gst,
        couponDiscount: state.couponDiscount || 0,
        couponCode: state.appliedCoupon || undefined,
        grandTotal: grandTotal,
        paymentMethod: 'cod',
        notes: '',
      };

      console.log('📦 Creating order with data:', orderData);

      const result = await orderService.createOrder(orderData);

      if (result) {
        console.log('✅ Order created:', result);
        clearCart();
        router.replace('/order-success');
        show('Order placed successfully! 🎉');
      } else {
        show('Failed to place order', 'error');
      }
    } catch (error) {
      console.error('❌ Failed to create order:', error);
      show('Failed to place order', 'error');
    } finally {
      setProcessing(false);
    }
  };
  */

  // ─── Simplified order creation - no event details required ──────────────────
  const placeOrder = async () => {
    if (!customerId) {
      show('Please login to place order', 'error');
      return;
    }

    const selectedAddress = addresses[selectedAddr];
    if (!selectedAddress) {
      show('Please select an address', 'error');
      return;
    }

    try {
      const orderData: OrderInput = {
        customerId: customerId,
        customerName: authState.user?.name || '',
        customerEmail: authState.user?.email || '',
        customerPhone: authState.user?.phone || '',
        address: {
          id: selectedAddress.id,
          label: selectedAddress.label,
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          line1: selectedAddress.line1,
          line2: selectedAddress.line2 || '',
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country || 'India',
        },
        // ─── Event details - using default/placeholder values ──────────────────
        eventDate: new Date().toISOString().split('T')[0],
        eventTime: '12:00 PM',
        eventType: 'Other',
        venue: 'Not specified',
        guestCount: 0,
        specialInstructions: '',
        items: state.items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        gst: gst,
        couponDiscount: state.couponDiscount || 0,
        couponCode: state.appliedCoupon || undefined,
        grandTotal: grandTotal,
        paymentMethod: 'cod',
        notes: '',
      };

      console.log('📦 Creating order with data:', orderData);

      const result = await orderService.createOrder(orderData);

      if (result) {
        console.log('✅ Order created:', result);
        clearCart();
        router.replace('/order-success');
        show('Order placed successfully! 🎉');
      } else {
        show('Failed to place order', 'error');
      }
    } catch (error) {
      console.error('❌ Failed to create order:', error);
      show('Failed to place order', 'error');
    }
  };

  // ─── Handle Next ──────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (addresses.length === 0) {
      show('Please add an address to continue', 'error');
      return;
    }
    // Directly place order from address step
    placeOrder();
  };

  // ─── Handle Back ──────────────────────────────────────────────────────────────
  const handleBack = () => {
    router.back();
  };

  if (loadingAddress) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={{ marginTop: 16, color: COLORS.neutral[500], fontFamily: 'Inter-Regular' }}>
          Loading your addresses...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
        >
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.stepsRow}>
        {steps.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
              {i < step
                ? <Check color={COLORS.white} size={14} />
                : <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>{i + 1}</Text>}
            </View>
            <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
            {i < steps.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineActive]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ── Step 0: Address ── */}
        {step === 0 && (
          <Animated.View entering={SlideInRight} style={styles.stepContent}>
            <View style={styles.addressHeader}>
              <Text style={styles.stepTitle}>Shipping Address</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setShowAddAddress(true)}
              >
                <Plus color={COLORS.white} size={20} />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            {addresses.length === 0 ? (
              <View style={styles.noAddressContainer}>
                <MapPin color={COLORS.neutral[400]} size={48} />
                <Text style={styles.noAddressText}>No addresses saved</Text>
                <Text style={styles.noAddressSubtext}>Tap "Add" to add your address</Text>
              </View>
            ) : (
              addresses.map((addr, i) => {
                const Icon = getAddressIcon(addr.type);
                const color = getAddressColor(addr.type);
                return (
                  <TouchableOpacity
                    key={addr.id}
                    style={[styles.addressCard, selectedAddr === i && styles.addressCardActive]}
                    onPress={() => setSelectedAddr(i)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.addressRadio}>
                      {selectedAddr === i && <View style={styles.addressRadioDot} />}
                    </View>
                    <View style={styles.addressBody}>
                      <View style={styles.addressHeaderRow}>
                        <View style={[styles.addressTypeBadge, { backgroundColor: color + '20' }]}>
                          <Icon size={14} color={color} />
                          <Text style={[styles.addressTypeText, { color }]}>
                            {addr.type.charAt(0).toUpperCase() + addr.type.slice(1)}
                          </Text>
                        </View>
                        <Text style={styles.addressLabel}>{addr.label}</Text>
                        {addr.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>DEFAULT</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.addressName}>{addr.fullName} • {addr.phone}</Text>
                      <Text style={styles.addressText}>
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                      </Text>
                      <View style={styles.addressActions}>
                        <TouchableOpacity
                          style={styles.addressActionBtn}
                          onPress={() => setDefaultAddress(i)}
                        >
                          <Check size={14} color={COLORS.primary[600]} />
                          <Text style={styles.addressActionText}>Set Default</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.addressActionBtn, styles.addressActionDelete]}
                          onPress={() => deleteAddress(i)}
                        >
                          <X size={14} color={COLORS.error} />
                          <Text style={[styles.addressActionText, { color: COLORS.error }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            {/* ─── Order Summary Preview ───────────────────────────────────── */}
            <View style={styles.summaryPreview}>
              <Text style={styles.summaryPreviewTitle}>Order Summary</Text>
              <View style={styles.summaryDivider} />
              <Row label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
              {state.couponDiscount > 0 && (
                <Row label="Discount" value={`-₹${state.couponDiscount.toLocaleString('en-IN')}`} green />
              )}
              <Row label="Delivery" value={deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`} />
              <Row label="GST (18%)" value={`₹${gst.toLocaleString('en-IN')}`} />
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
              </View>
            </View>

          </Animated.View>
        )}

        {/* ── Commented out Step 1: Event Details ────────────────────────────── */}
        {/* 
        {step === 1 && (
          <Animated.View entering={SlideInRight} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Event Details</Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Event Date <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={[styles.pickerField, selectedDate && styles.pickerFieldFilled]}
                onPress={() => setShowCal(true)}
                activeOpacity={0.8}
              >
                <View style={[styles.pickerIcon, selectedDate && styles.pickerIconFilled]}>
                  <Calendar
                    color={selectedDate ? COLORS.white : COLORS.primary[600]}
                    size={18}
                  />
                </View>
                <Text style={[styles.pickerText, !selectedDate && styles.pickerPlaceholder]}>
                  {selectedDate ? formatDisplay(selectedDate) : 'Tap to choose a date'}
                </Text>
                <ChevronRight
                  color={selectedDate ? COLORS.primary[600] : COLORS.neutral[400]}
                  size={18}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Event Time</Text>
              <TouchableOpacity
                style={[styles.pickerField, styles.pickerFieldFilled]}
                onPress={() => setShowTime(true)}
                activeOpacity={0.8}
              >
                <View style={[styles.pickerIcon, styles.pickerIconFilled]}>
                  <Clock color={COLORS.white} size={18} />
                </View>
                <Text style={styles.pickerText}>{eventTimeDisplay}</Text>
                <ChevronRight color={COLORS.primary[600]} size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Event Type</Text>
              <View style={styles.chipRow}>
                {eventTypes.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, eventType === t && styles.chipActive]}
                    onPress={() => setEventType(t)}
                  >
                    <Text style={[styles.chipText, eventType === t && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Venue Address <Text style={styles.required}>*</Text></Text>
              <View style={styles.formInput}>
                <MapPin color={COLORS.neutral[400]} size={20} />
                <TextInput
                  style={styles.formInputText}
                  placeholder="Enter venue address"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={venue}
                  onChangeText={setVenue}
                  multiline
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Guest Count <Text style={styles.required}>*</Text></Text>
              <View style={styles.formInput}>
                <ShoppingBag color={COLORS.neutral[400]} size={20} />
                <TextInput
                  style={styles.formInputText}
                  placeholder="Number of guests"
                  placeholderTextColor={COLORS.neutral[400]}
                  value={guestCount}
                  onChangeText={setGuestCount}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Special Instructions</Text>
              <View style={[styles.formInput, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
                <TextInput
                  style={[styles.formInputText, { textAlignVertical: 'top' }]}
                  placeholder="Any special requests..."
                  placeholderTextColor={COLORS.neutral[400]}
                  value={instructions}
                  onChangeText={setInstructions}
                  multiline
                />
              </View>
            </View>
          </Animated.View>
        )}
        */}

      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total</Text>
          <Text style={styles.bottomTotalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
        </View>
        <Button
          onPress={handleNext}
          variant="gold"
          size="lg"
          style={{ flex: 1, marginLeft: SPACING.md }}
        >
          {addresses.length === 0 ? 'Add Address' : 'Place Order'}
        </Button>
      </View>

      {/* ─── Commented out Calendar and Time Picker modals ─────────────────────── */}
      {/* 
      <CalendarModal
        visible={showCal}
        onClose={() => setShowCal(false)}
        selected={selectedDate}
        onSelect={setSelectedDate}
      />
      <TimePickerModal
        visible={showTime}
        onClose={() => setShowTime(false)}
        hour={timeHour}
        minute={timeMin}
        meridiem={timeMer}
        onChange={(h, m, mer) => { setTimeHour(h); setTimeMin(m); setTimeMer(mer); }}
      />
      */}

      <AddAddressModal
        visible={showAddAddress}
        onClose={() => setShowAddAddress(false)}
        onSave={addAddress}
      />
    </View>
  );
}

// tiny helper row
function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, green && { color: COLORS.success }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
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
  title: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: { backgroundColor: COLORS.primary[700] },
  stepNum: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[500] },
  stepNumActive: { color: COLORS.white },
  stepLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[400],
    marginLeft: 6,
  },
  stepLabelActive: { color: COLORS.neutral[800] },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.neutral[200],
    marginHorizontal: 4,
  },
  stepLineActive: { backgroundColor: COLORS.primary[700] },
  stepContent: { padding: SPACING.lg },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginBottom: SPACING.md,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary[700],
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },
  addressCardActive: { borderColor: COLORS.primary[600] },
  addressRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  addressRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary[700],
  },
  addressBody: { flex: 1 },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  addressTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  addressTypeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  addressLabel: {
    fontSize: 14,
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
  addressName: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[700],
    marginTop: 4,
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    marginTop: 2,
    lineHeight: 16,
  },
  addressActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: 6,
  },
  addressActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  addressActionDelete: {
    marginLeft: 'auto',
  },
  addressActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary[600],
  },
  noAddressContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  noAddressText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[700],
    marginTop: SPACING.md,
  },
  noAddressSubtext: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[400],
    marginTop: 4,
  },
  formGroup: { marginBottom: SPACING.md },
  formLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[700],
    marginBottom: 8,
  },
  required: { color: COLORS.error },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: COLORS.neutral[200],
    ...SHADOWS.small,
  },
  pickerFieldFilled: {
    borderColor: COLORS.primary[400],
    backgroundColor: COLORS.primary[50],
  },
  pickerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerIconFilled: { backgroundColor: COLORS.primary[700] },
  pickerText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900],
  },
  pickerPlaceholder: {
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[400],
  },
  formInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    gap: 10,
  },
  formInputText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[900],
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  chipActive: {
    backgroundColor: COLORS.primary[700],
    borderColor: COLORS.primary[700],
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[700],
  },
  chipTextActive: { color: COLORS.white },
  summaryPreview: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginTop: SPACING.md,
    ...SHADOWS.small,
  },
  summaryPreviewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginBottom: SPACING.sm,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
    marginVertical: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900],
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.primary[700],
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
    ...SHADOWS.large,
  },
  bottomTotalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
  },
  bottomTotalValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
  },
});
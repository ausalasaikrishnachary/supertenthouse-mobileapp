// import { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// import { useRouter } from 'expo-router';
// import Animated, { FadeInDown } from 'react-native-reanimated';
// import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
// import { COLORS, SPACING, RADIUS } from '@/constants/theme';
// import { Button } from '@/components/ui/Button';
// import { useAuth } from '@/store/auth';
// import { useToast } from '@/store/toast';

// export default function RegisterScreen() {
//   const router = useRouter();
//   const { register } = useAuth();
//   const { show } = useToast();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPass, setShowPass] = useState(false);
//   const [agree, setAgree] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // const handleRegister = async () => {
//   //   if (!name || !email || !password) {
//   //     show('Please fill all fields', 'error');
//   //     return;
//   //   }
//   //   if (!agree) {
//   //     show('Please accept terms & conditions', 'error');
//   //     return;
//   //   }
//   //   setLoading(true);
//   //   try {
//   //     await register(name, email, password);
//   //     router.push('/(auth)/otp');
//   //   } catch {
//   //     show('Registration failed', 'error');
//   //   }
//   //   setLoading(false);
//   // };
 
//   // In RegisterScreen.tsx, update the handleRegister function:

// // const handleRegister = async () => {
// //   if (!name || !email || !password) {
// //     show('Please fill all fields', 'error');
// //     return;
// //   }
// //   if (!agree) {
// //     show('Please accept terms & conditions', 'error');
// //     return;
// //   }
// //   setLoading(true);
// //   try {
// //     await register(name, email, password, phone);
// //     show('Registration successful! Please verify your email.');
// //     router.push('/(auth)/otp');
// //   } catch (error: any) {
// //     show(error.message || 'Registration failed', 'error');
// //   }
// //   setLoading(false);
// // };


// const handleRegister = async () => {
//   if (!name || !email || !password) {
//     show('Please fill all fields', 'error');
//     return;
//   }
//   if (!agree) {
//     show('Please accept terms & conditions', 'error');
//     return;
//   }
//   setLoading(true);
//   try {
//     await register(name, email, password, phone);
//     show('Registration successful! Please verify your email.');
//     // Navigate to OTP screen
//     router.push('/(auth)/otp');
//   } catch (error: any) {
//     show(error.message || 'Registration failed', 'error');
//   }
//   setLoading(false);
// };
//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <ArrowLeft color={COLORS.neutral[800]} size={24} />
//         </TouchableOpacity>

//         <View style={styles.header}>
//           <Text style={styles.title}>Create Account</Text>
//           <Text style={styles.subtitle}>Join Super Tent House today</Text>
//         </View>

//         <View style={styles.form}>
//           <Animated.View entering={FadeInDown.delay(100).duration(400)}>
//             <Text style={styles.label}>Full Name</Text>
//             <View style={styles.inputWrap}>
//               <User color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
//               <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor={COLORS.neutral[400]} value={name} onChangeText={setName} />
//             </View>
//           </Animated.View>

//           <Animated.View entering={FadeInDown.delay(150).duration(400)}>
//             <Text style={styles.label}>Email Address</Text>
//             <View style={styles.inputWrap}>
//               <Mail color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
//               <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={COLORS.neutral[400]} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
//             </View>
//           </Animated.View>

//           <Animated.View entering={FadeInDown.delay(200).duration(400)}>
//             <Text style={styles.label}>Phone Number</Text>
//             <View style={styles.inputWrap}>
//               <Phone color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
//               <TextInput style={styles.input} placeholder="+91 98765 43210" placeholderTextColor={COLORS.neutral[400]} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
//             </View>
//           </Animated.View>

//           <Animated.View entering={FadeInDown.delay(250).duration(400)}>
//             <Text style={styles.label}>Password</Text>
//             <View style={styles.inputWrap}>
//               <Lock color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
//               <TextInput style={styles.input} placeholder="Create password" placeholderTextColor={COLORS.neutral[400]} value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
//               <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
//                 {showPass ? <EyeOff color={COLORS.neutral[400]} size={20} /> : <Eye color={COLORS.neutral[400]} size={20} />}
//               </TouchableOpacity>
//             </View>
//           </Animated.View>

//           <TouchableOpacity style={styles.termsRow} onPress={() => setAgree(!agree)}>
//             <View style={[styles.checkbox, agree && styles.checkboxActive]}>
//               {agree && <View style={styles.checkmark} />}
//             </View>
//             <Text style={styles.termsText}>I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text></Text>
//           </TouchableOpacity>

//           <Button onPress={handleRegister} loading={loading} fullWidth size="lg">
//             Create Account
//           </Button>
//         </View>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>Already have an account? </Text>
//           <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
//             <Text style={styles.footerLink}>Sign In</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite, paddingHorizontal: SPACING.lg },
//   backBtn: { marginTop: SPACING.xl, width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
//   header: { marginTop: SPACING.lg, marginBottom: SPACING.xl },
//   title: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
//   form: { gap: SPACING.md },
//   label: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginBottom: 8 },
//   inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 54, borderWidth: 1, borderColor: COLORS.neutral[200] },
//   inputIcon: { marginRight: SPACING.sm },
//   input: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[900] },
//   eyeBtn: { padding: 4 },
//   termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginVertical: SPACING.sm },
//   checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: COLORS.neutral[300], justifyContent: 'center', alignItems: 'center', marginTop: 2 },
//   checkboxActive: { backgroundColor: COLORS.primary[700], borderColor: COLORS.primary[700] },
//   checkmark: { width: 6, height: 10, borderRightWidth: 2, borderBottomWidth: 2, borderColor: COLORS.white, transform: [{ rotate: '45deg' }], marginBottom: 2 },
//   termsText: { flex: 1, fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], lineHeight: 18 },
//   termsLink: { color: COLORS.primary[600], fontFamily: 'Inter-SemiBold' },
//   footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl, marginBottom: SPACING.xl },
//   footerText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
//   footerLink: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
// });




// app/(auth)/register.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft, MapPin, Home, Building, Navigation } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/auth';
import { useToast } from '@/store/toast';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { show } = useToast();
  
  // Personal Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  
  // Address Details - Now mandatory
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate required fields
    if (!name || !email || !password) {
      show('Please fill all required personal fields', 'error');
      return;
    }
    
    // Validate address fields (now mandatory)
    if (!addressLine1 || !city || !state || !pincode) {
      show('Please fill all required address fields', 'error');
      return;
    }
    
    if (!agree) {
      show('Please accept terms & conditions', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await register(
        name, 
        email, 
        password, 
        phone,
        {
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
          country
        }
      );
      show('Registration successful! Please verify your email.');
      router.push('/(auth)/otp');
    } catch (error: any) {
      show(error.message || 'Registration failed', 'error');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Super Tent House today</Text>
        </View>

        <View style={styles.form}>
          {/* ─── Personal Information ────────────────────────────── */}
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrap}>
              <User color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="John Doe" 
                placeholderTextColor={COLORS.neutral[400]} 
                value={name} 
                onChangeText={setName} 
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrap}>
              <Mail color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="you@example.com" 
                placeholderTextColor={COLORS.neutral[400]} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none" 
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrap}>
              <Phone color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="+91 98765 43210" 
                placeholderTextColor={COLORS.neutral[400]} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(400)}>
            <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrap}>
              <Lock color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Create password (min 6 characters)" 
                placeholderTextColor={COLORS.neutral[400]} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPass} 
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                {showPass ? <EyeOff color={COLORS.neutral[400]} size={20} /> : <Eye color={COLORS.neutral[400]} size={20} />}
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ─── Address Information - Now Mandatory ────────────────────────── */}
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>
              Address Details <Text style={styles.required}>*</Text>
            </Text>
            
            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
              <Text style={styles.label}>Address Line 1 <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrap}>
                <Home color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="123 Main Street" 
                  placeholderTextColor={COLORS.neutral[400]} 
                  value={addressLine1} 
                  onChangeText={setAddressLine1} 
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(350).duration(400)}>
              <Text style={styles.label}>Address Line 2 <Text style={styles.optional}>(Optional)</Text></Text>
              <View style={styles.inputWrap}>
                <Building color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Apartment, Suite, etc." 
                  placeholderTextColor={COLORS.neutral[400]} 
                  value={addressLine2} 
                  onChangeText={setAddressLine2} 
                />
              </View>
            </Animated.View>

            <View style={styles.row}>
              <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.rowItem}>
                <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrap}>
                  <Navigation color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Mumbai" 
                    placeholderTextColor={COLORS.neutral[400]} 
                    value={city} 
                    onChangeText={setCity} 
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(450).duration(400)} style={styles.rowItem}>
                <Text style={styles.label}>State <Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrap}>
                  <Navigation color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Maharashtra" 
                    placeholderTextColor={COLORS.neutral[400]} 
                    value={state} 
                    onChangeText={setState} 
                  />
                </View>
              </Animated.View>
            </View>

            <View style={styles.row}>
              <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.rowItem}>
                <Text style={styles.label}>Pincode <Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrap}>
                  <Navigation color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="400001" 
                    placeholderTextColor={COLORS.neutral[400]} 
                    value={pincode} 
                    onChangeText={setPincode} 
                    keyboardType="numeric" 
                    maxLength={6}
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(550).duration(400)} style={styles.rowItem}>
                <Text style={styles.label}>Country <Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrap}>
                  <Navigation color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="India" 
                    placeholderTextColor={COLORS.neutral[400]} 
                    value={country} 
                    onChangeText={setCountry} 
                  />
                </View>
              </Animated.View>
            </View>
          </View>

          {/* ─── Terms & Conditions ────────────────────────────── */}
          <TouchableOpacity style={styles.termsRow} onPress={() => setAgree(!agree)}>
            <View style={[styles.checkbox, agree && styles.checkboxActive]}>
              {agree && <View style={styles.checkmark} />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <Button onPress={handleRegister} loading={loading} fullWidth size="lg">
            Create Account
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  contentContainer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  backBtn: { marginTop: SPACING.xl, width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  header: { marginTop: SPACING.lg, marginBottom: SPACING.lg },
  title: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
  form: { gap: SPACING.md },
  sectionTitle: { 
    fontSize: 15, 
    fontFamily: 'Inter-SemiBold', 
    color: COLORS.neutral[800], 
    marginTop: SPACING.sm,
    marginBottom: 4 
  },
  label: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginBottom: 6 },
  required: { color: COLORS.error },
  optional: { color: COLORS.neutral[400], fontWeight: '400' },
  inputWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    borderRadius: RADIUS.lg, 
    paddingHorizontal: SPACING.md, 
    height: 54, 
    borderWidth: 1, 
    borderColor: COLORS.neutral[200] 
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[900] },
  eyeBtn: { padding: 4 },
  
  addressSection: {
    gap: SPACING.md,
    paddingTop: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  rowItem: {
    flex: 1,
  },
  
  termsRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: 8, 
    marginVertical: SPACING.sm 
  },
  checkbox: { 
    width: 20, 
    height: 20, 
    borderRadius: 6, 
    borderWidth: 2, 
    borderColor: COLORS.neutral[300], 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 2 
  },
  checkboxActive: { 
    backgroundColor: COLORS.primary[700], 
    borderColor: COLORS.primary[700] 
  },
  checkmark: { 
    width: 6, 
    height: 10, 
    borderRightWidth: 2, 
    borderBottomWidth: 2, 
    borderColor: COLORS.white, 
    transform: [{ rotate: '45deg' }], 
    marginBottom: 2 
  },
  termsText: { 
    flex: 1, 
    fontSize: 13, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[600], 
    lineHeight: 18 
  },
  termsLink: { 
    color: COLORS.primary[600], 
    fontFamily: 'Inter-SemiBold' 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: SPACING.xl, 
    marginBottom: SPACING.xl 
  },
  footerText: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[600] 
  },
  footerLink: { 
    fontSize: 14, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.primary[700] 
  },
});
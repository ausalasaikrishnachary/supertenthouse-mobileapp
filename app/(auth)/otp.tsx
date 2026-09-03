// import { useState, useRef, useEffect } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
// import { COLORS, SPACING, RADIUS } from '@/constants/theme';
// import { Button } from '@/components/ui/Button';
// import { useToast } from '@/store/toast';
// import { useAuth } from '@/store/auth';

// export default function OtpScreen() {
//   const router = useRouter();
//   const { show } = useToast();
//   const { state } = useAuth();
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const refs = useRef<(TextInput | null)[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleVerify = async () => {
//     const code = otp.join('');
//     if (code.length < 4) {
//       show('Enter complete OTP', 'error');
//       return;
//     }
//     setLoading(true);
//     await new Promise((r) => setTimeout(r, 800));
//     setLoading(false);
//     show('Account verified!');
//     router.replace('/(tabs)');
//   };

//   const handleChange = (i: number, val: string) => {
//     if (val.length > 1) return;
//     const newOtp = [...otp];
//     newOtp[i] = val;
//     setOtp(newOtp);
//     if (val && i < 3) refs.current[i + 1]?.focus();
//   };

//   const handleKeyPress = (i: number, e: any) => {
//     if (e.nativeEvent.key === 'Backspace' && !otp[i] && i > 0) {
//       refs.current[i - 1]?.focus();
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Verify Your Account</Text>
//         <Text style={styles.subtitle}>Enter the 4-digit code sent to your email</Text>
//       </View>

//       <View style={styles.otpRow}>
//         {otp.map((digit, i) => (
//           <Animated.View key={i} entering={FadeIn.delay(i * 80)}>
//             <TextInput
//               ref={(ref) => { refs.current[i] = ref; }}
//               style={[styles.otpInput, digit && styles.otpFilled]}
//               value={digit}
//               onChangeText={(v) => handleChange(i, v)}
//               onKeyPress={(e) => handleKeyPress(i, e)}
//               keyboardType="number-pad"
//               maxLength={1}
//               autoFocus={i === 0}
//             />
//           </Animated.View>
//         ))}
//       </View>

//       <View style={styles.resendRow}>
//         <Text style={styles.resendText}>Didn't receive code? </Text>
//         <TouchableOpacity onPress={() => show('OTP resent')}>
//           <Text style={styles.resendLink}>Resend</Text>
//         </TouchableOpacity>
//       </View>

//       <Button onPress={handleVerify} loading={loading} fullWidth size="lg">Verify & Continue</Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.offWhite, paddingHorizontal: SPACING.lg, justifyContent: 'center' },
//   header: { alignItems: 'center', marginBottom: SPACING.xxl },
//   title: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
//   subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8, textAlign: 'center' },
//   otpRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.xl },
//   otpInput: { width: 60, height: 70, borderRadius: RADIUS.lg, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.neutral[200], fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], textAlign: 'center' },
//   otpFilled: { borderColor: COLORS.primary[600], backgroundColor: COLORS.primary[50] },
//   resendRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl },
//   resendText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500] },
//   resendLink: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600] },
// });



import { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/auth';
import { useToast } from '@/store/toast';

export default function OTPScreen() {
  const router = useRouter();
  const { state, verifyOTP, resendOTP } = useAuth();
  const { show } = useToast();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  
  // ✅ Fixed: Use array of refs with proper type
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const email = state.registrationEmail;

  useEffect(() => {
    if (!email) {
      router.replace('/(auth)/register');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOTPChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const otpArray = text.split('').slice(0, 6);
      const newOtp = [...otp];
      otpArray.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      
      // Focus last filled input
      const lastIndex = Math.min(otpArray.length, 5);
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex]?.focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      const nextRef = inputRefs.current[index + 1];
      if (nextRef) {
        nextRef.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const prevRef = inputRefs.current[index - 1];
      if (prevRef) {
        prevRef.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      show('Please enter complete OTP', 'error');
      return;
    }

    if (!email) {
      show('Email not found. Please register again.', 'error');
      router.replace('/(auth)/register');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(email, otpString);
      show('Email verified successfully!');
      router.replace('/(tabs)');
    } catch (error: any) {
      show(error.message || 'OTP verification failed', 'error');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      const firstRef = inputRefs.current[0];
      if (firstRef) {
        firstRef.focus();
      }
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    if (!email) {
      show('Email not found. Please register again.', 'error');
      router.replace('/(auth)/register');
      return;
    }

    setResendLoading(true);
    try {
      await resendOTP(email);
      show('OTP resent successfully!');
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      const firstRef = inputRefs.current[0];
      if (firstRef) {
        firstRef.focus();
      }
      
      // Restart timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      show(error.message || 'Failed to resend OTP', 'error');
    }
    setResendLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a verification code to
          </Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        <View style={styles.form}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.label}>Enter OTP Code</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOTPChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus={index === 0}
                  textAlign="center"
                  selectionColor={COLORS.primary[500]}
                />
              ))}
            </View>
          </Animated.View>

          <View style={styles.timerContainer}>
            <Clock color={COLORS.neutral[500]} size={18} />
            <Text style={styles.timerText}>
              {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Ready to resend'}
            </Text>
          </View>

          <Button 
            onPress={handleVerifyOTP} 
            loading={loading} 
            fullWidth 
            size="lg"
          >
            Verify OTP
          </Button>

          <TouchableOpacity 
            style={[styles.resendBtn, !canResend && styles.resendBtnDisabled]} 
            onPress={handleResendOTP}
            disabled={!canResend || resendLoading}
          >
            <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResendOTP} disabled={!canResend}>
            <Text style={[styles.footerLink, !canResend && styles.resendTextDisabled]}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.offWhite, 
    paddingHorizontal: SPACING.lg 
  },
  backBtn: { 
    marginTop: SPACING.xl, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: COLORS.white, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: { 
    marginTop: SPACING.xl, 
    marginBottom: SPACING.xl 
  },
  title: { 
    fontSize: 26, 
    fontFamily: 'Inter-Bold', 
    color: COLORS.neutral[900] 
  },
  subtitle: { 
    fontSize: 14, 
    fontFamily: 'Inter-Regular', 
    color: COLORS.neutral[500], 
    marginTop: 8 
  },
  emailText: { 
    fontSize: 16, 
    fontFamily: 'Inter-SemiBold', 
    color: COLORS.primary[600], 
    marginTop: 4 
  },
  form: { 
    gap: SPACING.md 
  },
  label: { 
    fontSize: 14, 
    fontFamily: 'Inter-Medium', 
    color: COLORS.neutral[700], 
    marginBottom: 12 
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: SPACING.xs,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
  },
  resendBtn: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  resendBtnDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary[600],
  },
  resendTextDisabled: {
    color: COLORS.neutral[400],
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
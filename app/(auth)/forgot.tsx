import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/store/toast';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { show } = useToast();
  const [email, setEmail] = useState('');

  const handleSend = () => {
    if (!email) {
      show('Enter your email', 'error');
      return;
    }
    show('OTP sent to your email');
    router.push('/(auth)/otp');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive a verification code</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrap}>
            <Mail color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={COLORS.neutral[400]} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <Button onPress={handleSend} fullWidth size="lg">Send OTP</Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite, paddingHorizontal: SPACING.lg },
  backBtn: { marginTop: SPACING.xl, width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: SPACING.xl, marginBottom: SPACING.xl },
  title: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
  form: { gap: SPACING.md },
  label: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 54, borderWidth: 1, borderColor: COLORS.neutral[200] },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[900] },
});

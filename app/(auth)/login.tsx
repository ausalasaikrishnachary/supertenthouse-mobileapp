

import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Fingerprint } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/auth';
import { useToast } from '@/store/toast';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { show } = useToast();
  
  // ✅ REMOVED default credentials - now empty fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      show('Please fill all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      show('Welcome back!');
      router.replace('/(tabs)');
    } catch (error: any) {
      show(error.message || 'Login failed', 'error');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>ST</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>
        </View>

        <View style={styles.form}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.label}>Email Address</Text>
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
                autoCorrect={false}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Lock color={COLORS.neutral[400]} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={COLORS.neutral[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                {showPass ? <EyeOff color={COLORS.neutral[400]} size={20} /> : <Eye color={COLORS.neutral[400]} size={20} />}
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.rememberRow} onPress={() => setRemember(!remember)}>
              <View style={[styles.checkbox, remember && styles.checkboxActive]}>
                {remember && <View style={styles.checkmark} />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot')}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <Button onPress={handleLogin} loading={loading} fullWidth size="lg">
            Sign In
          </Button>

          <TouchableOpacity style={styles.biometricBtn} onPress={handleLogin}>
            <Fingerprint color={COLORS.primary[600]} size={22} />
            <Text style={styles.biometricText}>Use Biometric Login</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleLogin}>
            <Image source={{ uri: 'https://www.google.com/favicon.ico' }} style={styles.googleIcon} />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite, paddingHorizontal: SPACING.lg },
  backBtn: { marginTop: SPACING.xl, width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.xl },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary[800], justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  logoText: { fontSize: 28, fontFamily: 'Inter-Bold', color: COLORS.gold[400] },
  title: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4 },
  form: { gap: SPACING.md },
  label: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700], marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 54, borderWidth: 1, borderColor: COLORS.neutral[200] },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.neutral[900] },
  eyeBtn: { padding: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: SPACING.xs },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: COLORS.neutral[300], justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: COLORS.primary[700], borderColor: COLORS.primary[700] },
  checkmark: { width: 6, height: 10, borderRightWidth: 2, borderBottomWidth: 2, borderColor: COLORS.white, transform: [{ rotate: '45deg' }], marginBottom: 2 },
  rememberText: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
  forgotText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: COLORS.primary[600] },
  biometricBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary[200] },
  biometricText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.primary[700] },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.neutral[200] },
  dividerText: { fontSize: 13, color: COLORS.neutral[400], marginHorizontal: SPACING.md, fontFamily: 'Inter-Regular' },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.neutral[200] },
  googleIcon: { width: 20, height: 20 },
  googleText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[800] },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl, marginBottom: SPACING.xl },
  footerText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[600] },
  footerLink: { fontSize: 14, fontFamily: 'Inter-Bold', color: COLORS.primary[700] },
});
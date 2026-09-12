import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useAuth } from '@/store/auth';
import { useToast } from '@/store/toast';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { state, resetPassword } = useAuth();
  const { show } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password.length < 6) return show('Password must be at least 6 characters', 'error');
    if (password !== confirmPassword) return show('Passwords do not match', 'error');

    setLoading(true);
    try {
      await resetPassword(password);
      show('Password reset successfully. Please sign in.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      show(error.message || 'Password reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>Enter a new password for your customer account.</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWrap}>
          <Lock color={COLORS.neutral[400]} size={20} style={styles.icon} />
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="New password" placeholderTextColor={COLORS.neutral[400]} />
        </View>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrap}>
          <Lock color={COLORS.neutral[400]} size={20} style={styles.icon} />
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Confirm password" placeholderTextColor={COLORS.neutral[400]} />
        </View>
        <Button onPress={handleReset} loading={loading} fullWidth size="lg">Reset Password</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite, paddingHorizontal: SPACING.lg, justifyContent: 'center' },
  header: { marginBottom: SPACING.xl },
  title: { fontSize: 26, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 8 },
  form: { gap: SPACING.md },
  label: { fontSize: 13, fontFamily: 'Inter-Medium', color: COLORS.neutral[700] },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 54, paddingHorizontal: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.neutral[200], backgroundColor: COLORS.white },
  icon: { marginRight: SPACING.sm },
  input: { flex: 1, color: COLORS.neutral[900], fontFamily: 'Inter-Regular', fontSize: 15 }
});

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { CheckCircle, XCircle, Info, X } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: string; message: string; type: ToastType };

const ToastContext = createContext<{
  show: (message: string, type?: ToastType) => void;
} | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => {
          const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? XCircle : Info;
          const color = toast.type === 'success' ? COLORS.success : toast.type === 'error' ? COLORS.error : COLORS.primary[500];
          return (
            <Animated.View
              key={toast.id}
              entering={FadeInUp.duration(300)}
              exiting={FadeOutUp.duration(300)}
              style={styles.toast}
            >
              <View style={styles.toastContent}>
                <Icon color={color} size={22} />
                <Text style={styles.toastText}>{toast.message}</Text>
                <TouchableOpacity onPress={() => remove(toast.id)} hitSlop={8}>
                  <X color={COLORS.neutral[500]} size={18} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const SHADOW = {
  shadowColor: '#0A1224',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
  elevation: 8,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginVertical: 4,
    width: '90%',
    maxWidth: 400,
    ...SHADOW,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.sm,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.neutral[800],
  },
});

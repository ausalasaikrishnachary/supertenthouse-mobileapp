import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
};

export function SectionHeader({ title, subtitle, onSeeAll }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAll} hitSlop={8}>
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color={COLORS.gold[500]} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  left: { flex: 1 },
  title: { fontSize: 20, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 13, color: COLORS.neutral[500], fontFamily: 'Inter-Regular', marginTop: 2 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.gold[500] },
});

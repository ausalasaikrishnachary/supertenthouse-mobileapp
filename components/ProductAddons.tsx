import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { ProductAddon } from '../utils/productAddons';

export function ProductAddons({ addons = [], imageUrl }: { addons?: ProductAddon[]; imageUrl: (path: string) => string }) {
  if (!addons.length) return null;
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>Available Add-ons</Text>
      {addons.map(addon => (
        <View key={addon.id} style={styles.row}>
          {addon.imageUrl ? <Image source={{ uri: imageUrl(addon.imageUrl) }} accessibilityLabel={addon.name} style={styles.image} /> : <Text style={styles.icon}>{addon.icon || '📦'}</Text>}
          <View style={styles.details}>
            <Text style={styles.name}>{addon.name}</Text>
            {!!addon.description && <Text style={styles.description}>{addon.description}</Text>}
            <Text style={styles.price}>₹{addon.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginVertical: 16 },
  heading: { fontSize: 18, fontWeight: '600', color: '#0c2d67', marginBottom: 12 },
  row: { flexDirection: 'row', padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, backgroundColor: '#fff' },
  image: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  icon: { fontSize: 20, marginRight: 12, maxWidth: 70 },
  details: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  description: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  price: { fontSize: 14, fontWeight: '600', color: '#0c2d67', marginTop: 6 },
});

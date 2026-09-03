import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '@/constants/theme';

interface PlaceholderImageProps {
  size?: number;
  text?: string;
  style?: any;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
  size = 300, 
  text = 'No Image',
  style 
}) => {
  // Generate a consistent color based on text
  const getColor = (str: string) => {
    const colors = [
      '#6C63FF', '#FF6B6B', '#4ECDC4', '#45B7D1', 
      '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8A5C',
      '#A29BFE', '#FD79A8', '#00CEC9', '#FDCB6E',
      '#E17055', '#00B894', '#0984E3', '#6C5CE7',
      '#FD79A8', '#FDCB6E', '#00CEC9', '#A29BFE'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = getColor(text);
  // Get first two letters of text, or use '?' if empty
  const initials = text
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: bgColor }, style]}>
      <Text style={[styles.initials, { fontSize: Math.min(size * 0.35, 80) }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  initials: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    includeFontPadding: false,
  },
});
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';

interface ConfidenceGaugeProps {
  value: number; // 0.0 to 1.0
  size?: number;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ value, size = 120 }) => {
  const { colors } = useTheme();
  
  const percentage = Math.round(value * 100);
  
  // Dynamic color thresholds
  const getGaugeColor = () => {
    if (value >= 0.90) return colors.success;
    if (value >= 0.75) return colors.secondary;
    return colors.accent;
  };

  const ringColor = getGaugeColor();
  const innerSize = size * 0.85;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer ring representation */}
      <View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: ringColor,
            borderWidth: 6,
            backgroundColor: colors.cardSecondary,
          },
        ]}
      >
        {/* Inner circle */}
        <View
          style={[
            styles.innerCircle,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: colors.card,
            },
          ]}
        >
          <Text style={[styles.valueText, { color: colors.text, fontSize: size * 0.22 }]}>
            {percentage}%
          </Text>
          <Text style={[styles.labelText, { color: colors.textMuted, fontSize: size * 0.08 }]}>
            CONFIDENCE
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  outerRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  valueText: {
    fontWeight: '800',
  },
  labelText: {
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
export default ConfidenceGauge;

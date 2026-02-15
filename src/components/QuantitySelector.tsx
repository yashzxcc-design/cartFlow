import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  variant?: 'compact' | 'default';
  style?: ViewStyle;
}

const QuantitySelector: React.FC<Props> = ({ 
  quantity, 
  onDecrease, 
  onIncrease, 
  variant = 'default',
  style 
}) => {
  const isCompact = variant === 'compact';

  return (
    <View style={[styles.container, isCompact ? styles.compactContainer : styles.defaultContainer, style]}>
      <TouchableOpacity
        style={[styles.button, isCompact ? styles.compactButton : styles.defaultButton]}
        onPress={onDecrease}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, isCompact ? styles.compactButtonText : styles.defaultButtonText]}>−</Text>
      </TouchableOpacity>
      <Text style={[styles.quantityText, isCompact ? styles.compactQuantityText : styles.defaultQuantityText]}>
        {quantity}
      </Text>
      <TouchableOpacity
        style={[styles.button, isCompact ? styles.compactButton : styles.defaultButton]}
        onPress={onIncrease}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, isCompact ? styles.compactButtonText : styles.defaultButtonText]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#55913D',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
    justifyContent: 'center',
  },
  compactContainer: {
  },
  defaultContainer: {
    minWidth: 90,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactButton: {
    width: 24,
    height: 24,
  },
  defaultButton: {
    width: 28,
    height: 28,
  },
  buttonText: {
    color: '#55913D',
    fontWeight: '600',
  },
  compactButtonText: {
    fontSize: 16,
  },
  defaultButtonText: {
    fontSize: 18,
  },
  quantityText: {
    color: '#000000',
    fontWeight: '600',
    textAlign: 'center',
  },
  compactQuantityText: {
    fontSize: 12,
    minWidth: 24,
  },
  defaultQuantityText: {
    fontSize: 14,
    minWidth: 30,
  },
});

export default QuantitySelector;


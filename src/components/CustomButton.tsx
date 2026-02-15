import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import productDetailConfig from '../data/static/productDetailConfig.json';

interface Props {
  mode?: 'quantity' | 'button';
  quantity?: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
  
  text?: string;
  optionsCount?: number;
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'large' | 'fullWidth';
  showArrow?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  arrowStyle?: TextStyle;
  activeOpacity?: number;
}

const CustomButton: React.FC<Props> = React.memo(({
  mode = 'button',
  quantity,
  onDecrease,
  onIncrease,
  text,
  optionsCount,
  onPress,
  variant = 'default',
  showArrow,
  style,
  textStyle,
  arrowStyle,
  activeOpacity = 0.7,
}) => {
  if (mode === 'quantity' && quantity !== undefined) {
    const isCompact = variant === 'compact';
    
    return (
      <View style={[styles.quantityContainer, isCompact ? styles.quantityCompactContainer : styles.quantityDefaultContainer, style]}>
        <TouchableOpacity
          style={[styles.quantityButton, isCompact ? styles.quantityCompactButton : styles.quantityDefaultButton]}
          onPress={onDecrease}
          activeOpacity={0.7}
        >
          <Text style={[styles.quantityButtonText, isCompact ? styles.quantityCompactButtonText : styles.quantityDefaultButtonText]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.quantityText, isCompact ? styles.quantityCompactText : styles.quantityDefaultText]}>
          {quantity}
        </Text>
        <TouchableOpacity
          style={[styles.quantityButton, isCompact ? styles.quantityCompactButton : styles.quantityDefaultButton]}
          onPress={onIncrease}
          activeOpacity={0.7}
        >
          <Text style={[styles.quantityButtonText, isCompact ? styles.quantityCompactButtonText : styles.quantityDefaultButtonText]}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCompact = variant === 'compact';
  const isLarge = variant === 'large';
  const isFullWidth = variant === 'fullWidth';
  
  const shouldShowArrow = showArrow !== undefined 
    ? showArrow 
    : optionsCount !== undefined;

  const config = productDetailConfig as any;
  const optionsTemplate = config?.texts?.buttons?.options || '{count} options';
  const optionsText = optionsCount !== undefined 
    ? optionsTemplate.replace('{count}', String(optionsCount))
    : '';
  const buttonText = text || optionsText;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isCompact && styles.buttonCompact,
        isLarge && styles.buttonLarge,
        isFullWidth && styles.buttonFullWidth,
        !isCompact && !isLarge && !isFullWidth && styles.buttonDefault,
        style,
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      <Text
        style={[
          styles.text,
          isCompact && styles.textCompact,
          isLarge && styles.textLarge,
          !isCompact && !isLarge && styles.textDefault,
          shouldShowArrow && isCompact && styles.textWithArrowCompact,
          shouldShowArrow && !isCompact && !isLarge && !isFullWidth && styles.textWithArrow,
          textStyle,
        ]}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#55913D',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
    justifyContent: 'center',
  },
  quantityCompactContainer: {
  },
  quantityDefaultContainer: {
    minWidth: 90,
  },
  quantityButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityCompactButton: {
    width: 24,
    height: 24,
  },
  quantityDefaultButton: {
    width: 28,
    height: 28,
  },
  quantityButtonText: {
    color: '#55913D',
    fontWeight: '600',
  },
  quantityCompactButtonText: {
    fontSize: 16,
  },
  quantityDefaultButtonText: {
    fontSize: 18,
  },
  quantityText: {
    color: '#55913D',
    fontWeight: '600',
    textAlign: 'center',
  },
  quantityCompactText: {
    fontSize: 12,
    minWidth: 24,
  },
  quantityDefaultText: {
    fontSize: 14,
    minWidth: 30,
  },
  
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#55913D',
  },
  buttonDefault: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  buttonCompact: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLarge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 120,
  },
  buttonFullWidth: {
    paddingVertical: 14,
    borderRadius: 10,
    alignSelf: 'stretch',
    marginHorizontal: 0,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  textDefault: {
    fontSize: 14,
  },
  textCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
  textLarge: {
    fontSize: 14,
  },
  textWithArrow: {
    marginRight: 4,
  },
  textWithArrowCompact: {
    marginRight: 2,
  },
  arrow: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    paddingLeft: 4,
    lineHeight: 11,
  },
  arrowDefault: {
    fontSize: 12,
    marginLeft: 0,
  },
  arrowCompact: {
    fontSize: 10,
    marginLeft: 0,
  },
});

CustomButton.displayName = 'CustomButton';

export default CustomButton;


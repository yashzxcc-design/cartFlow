import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Props {
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

const OptionsButton: React.FC<Props> = React.memo(({
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
  const isCompact = variant === 'compact';
  const isLarge = variant === 'large';
  const isFullWidth = variant === 'fullWidth';
  
  const shouldShowArrow = showArrow !== undefined 
    ? showArrow 
    : optionsCount !== undefined;

  const buttonText = text || (optionsCount !== undefined ? `${optionsCount} options` : '');

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
      {shouldShowArrow && (
        <Text
          style={[
            styles.arrow,
            isCompact && styles.arrowCompact,
            !isCompact && styles.arrowDefault,
            arrowStyle,
          ]}
        >
          ▼
        </Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
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
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonLarge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonFullWidth: {
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: 'stretch',
    marginHorizontal: 16,
    marginVertical: 16,
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

OptionsButton.displayName = 'OptionsButton';

export default OptionsButton;


import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Coupon } from '../../../types';

interface Props {
  coupon: Coupon;
  isApplied: boolean;
  onApply: () => void;
  onRemove: () => void;
}

const CouponCard: React.FC<Props> = React.memo(({ coupon, isApplied, onApply, onRemove }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.circle}>
        <Text style={styles.discountAmount}>₹{coupon.discount} OFF</Text>
      </View>
      <Text style={styles.saveText}>Save ₹{coupon.discount}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {coupon.description || `Add items worth ₹${coupon.minOrderValue || 0} to avail this offer`}
      </Text>
      {isApplied ? (
        <TouchableOpacity
          style={styles.appliedButton}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <Text style={styles.appliedText}>Applied</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={onApply}
          activeOpacity={0.7}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    width: 150,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0C748C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountAmount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  description: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  applyButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    alignSelf: 'center',
  },
  applyText: {
    color: '#FFA500',
    fontSize: 12,
    fontWeight: '600',
  },
  appliedButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  appliedIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  appliedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

CouponCard.displayName = 'CouponCard';

export default CouponCard;


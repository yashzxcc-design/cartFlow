import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { CartItem } from '../../../types';
import { useAppDispatch } from '../../../utils/hooks';
import { updateQuantity, removeFromCart } from '../../../store/slices/cartSlice';
import { getImageSource } from '../../../utils/imageAssets';
import CustomButton from '../../../components/CustomButton';

interface Props {
  item: CartItem;
}

const CartItemCard: React.FC<Props> = React.memo(({ item }) => {
  const dispatch = useAppDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const optionText = item.selectedOption 
    ? `${item.selectedOption.name}`
    : item.product.weight || '';

  const showOriginalPrice = item.product.originalPrice && item.product.originalPrice > item.totalPrice / item.quantity;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource(item.product.image)}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.optionText}>{item.quantity}x{optionText}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <CustomButton
          mode="quantity"
          quantity={item.quantity}
          onDecrease={() => handleQuantityChange(-1)}
          onIncrease={() => handleQuantityChange(1)}
          variant="default"
          style={styles.quantitySelector}
        />
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.totalPrice}</Text>
          {showOriginalPrice && item.product.originalPrice && (
            <Text style={styles.originalPrice}>
              ₹{item.product.originalPrice * item.quantity}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  optionText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  quantitySelector: {
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

CartItemCard.displayName = 'CartItemCard';

export default CartItemCard;


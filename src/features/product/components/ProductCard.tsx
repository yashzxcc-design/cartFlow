import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { Product } from '../../../types';
import { useAppSelector, useAppDispatch } from '../../../utils/hooks';
import { updateQuantity, removeFromCart } from '../../../store/slices/cartSlice';
import { getImageSource } from '../../../utils/imageAssets';
import CustomButton from '../../../components/CustomButton';

interface Props {
  product: Product;
  onPress?: () => void;
  onAddPress?: () => void;
  onOptionsPress?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;

const ProductCard: React.FC<Props> = React.memo(({ product, onPress, onAddPress, onOptionsPress }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const hasOptions = product.options && product.options.length > 0;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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

  const cartItemForProduct = useMemo(() => {
    if (product.options && product.options.length > 0) {
      return cartItems.find(
        (item) => item.productId === product.id && item.selectedOption?.id === product.options?.[0]?.id
      );
    }
    return cartItems.find((item) => item.productId === product.id && !item.selectedOption);
  }, [cartItems, product]);

  const isProductInCart = !!cartItemForProduct;

  const handleQuantityChange = (change: number) => {
    if (!cartItemForProduct) return;
    
    const newQuantity = cartItemForProduct.quantity + change;
    if (newQuantity <= 0) {
      dispatch(removeFromCart(cartItemForProduct.id));
    } else {
      dispatch(updateQuantity({ id: cartItemForProduct.id, quantity: newQuantity }));
    }
  };

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
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flex: 1 }}>
      {product.discount && product.discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{product.discount}% OFF</Text>
        </View>
      )}
      <Image
        source={getImageSource(product.image)}
        style={styles.image}
        resizeMode="contain"
      />
      {product.brand && (
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand}
        </Text>
      )}
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      {product.weight && (
        <Text style={styles.weight} numberOfLines={1}>
          {product.weight}
        </Text>
      )}
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{product.price}</Text>
        {product.originalPrice && product.originalPrice !== product.price && (
          <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
        )}
      </View>
      {hasOptions ? (
        <CustomButton
          optionsCount={product.options?.length || 0}
          onPress={onOptionsPress}
          variant="compact"
        />
      ) : isProductInCart && cartItemForProduct ? (
        <CustomButton
          mode="quantity"
          quantity={cartItemForProduct.quantity}
          onDecrease={() => handleQuantityChange(-1)}
          onIncrease={() => handleQuantityChange(1)}
          variant="compact"
        />
      ) : (
        <CustomButton
          text="Add"
          onPress={onAddPress}
          variant="compact"
          showArrow={false}
        />
      )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0C748C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.8,
    marginBottom: 8,
  },
  brand: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
    minHeight: 32,
  },
  weight: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginRight: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;


import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { Product } from '../../../types';
import { useAppSelector, useAppDispatch } from '../../../utils/hooks';
import { updateQuantity, removeFromCart } from '../../../store/slices/cartSlice';
import CustomButton from '../../../components/CustomButton';
import productDetailConfig from '../../../data/static/productDetailConfig.json';

interface Props {
  product: Product;
  onAddToCart: () => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

const ProductBottomBar: React.FC<Props> = React.memo(({ product, onAddToCart, navigation }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const config = productDetailConfig as any;
  
  const cartItemForProduct = useMemo(() => {
    if (product.options && product.options.length > 0) {
      return cartItems.find(
        (item) => item.productId === product.id && item.selectedOption?.id === product.options?.[0]?.id
      );
    }
    return cartItems.find((item) => item.productId === product.id && !item.selectedOption);
  }, [cartItems, product]);

  const isProductInCart = !!cartItemForProduct;
  const hasItemsInCart = cartItems.length > 0;

  const showOriginalPrice = product.originalPrice && product.originalPrice > product.price;

  const handleQuantityChange = (change: number) => {
    if (!cartItemForProduct) return;
    
    const newQuantity = cartItemForProduct.quantity + change;
    if (newQuantity <= 0) {
      dispatch(removeFromCart(cartItemForProduct.id));
    } else {
      dispatch(updateQuantity({ id: cartItemForProduct.id, quantity: newQuantity }));
    }
  };

  const handleAddToCartClick = () => {
    if (isProductInCart) {
      handleQuantityChange(1);
    } else {
      onAddToCart();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.priceSection}>
        {product.weight && (
          <Text style={styles.weight}>{product.weight}</Text>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {showOriginalPrice && (
            <Text style={styles.originalPrice}>MRP ₹{product.originalPrice}</Text>
          )}
        </View>
        <Text style={styles.taxText}>Inclusive of all taxes</Text>
      </View>
      <View style={styles.actionSection}>
        <CustomButton
          mode={isProductInCart ? 'quantity' : 'button'}
          quantity={cartItemForProduct?.quantity}
          onDecrease={() => handleQuantityChange(-1)}
          onIncrease={() => handleQuantityChange(1)}
          text={config.texts?.buttons?.addToCart || "Add to cart"}
          onPress={handleAddToCartClick}
          variant="default"
          showArrow={false}
          style={isProductInCart ? undefined : styles.addButton}
        />
        {hasItemsInCart && (
          <CustomButton
            text={config.texts?.buttons?.viewCart || "View cart"}
            onPress={() => navigation.navigate('ReviewCart')}
            variant="default"
            showArrow={false}
            style={styles.viewCartButton}
            textStyle={styles.viewCartButtonText}
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 70,
  },
  priceSection: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
  },
  weight: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  taxText: {
    fontSize: 11,
    color: '#999999',
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewCartButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#55913D',
  },
  viewCartButtonText: {
    color: '#55913D',
  },
});

ProductBottomBar.displayName = 'ProductBottomBar';

export default ProductBottomBar;


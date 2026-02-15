import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Image, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { Product, ProductOption, CartItem } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { addToCart, updateQuantity, removeFromCart } from '../../../store/slices/cartSlice';
import { getImageSource } from '../../../utils/imageAssets';
import CustomButton from '../../../components/CustomButton';

interface Props {
  product: Product;
  isVisible: boolean;
  onClose: () => void;
  onSelectOption: (option: ProductOption) => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

const { width, height } = Dimensions.get('window');

const ProductOptionsModal: React.FC<Props> = ({ product, isVisible, onClose, onSelectOption, navigation }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  if (!product.options || product.options.length === 0) {
    return null;
  }

  const getCartItemForOption = (option: ProductOption): CartItem | undefined => {
    return cartItems.find(
      (item) => item.productId === product.id && item.selectedOption?.id === option.id
    );
  };

  const handleQuantityChange = (option: ProductOption, change: number) => {
    const cartItem = getCartItemForOption(option);
    if (cartItem) {
      const newQuantity = cartItem.quantity + change;
      if (newQuantity <= 0) {
        dispatch(removeFromCart(cartItem.id));
      } else {
        dispatch(updateQuantity({ id: cartItem.id, quantity: newQuantity }));
      }
    }
  };

  const handleAddToCart = (option: ProductOption) => {
    const cartItem: CartItem = {
      id: `${product.id}-${option.id}-${Date.now()}`,
      productId: product.id,
      product: product,
      quantity: 1,
      selectedOption: option,
      totalPrice: option.price,
    };
    dispatch(addToCart(cartItem));
  };

  const handleConfirm = () => {
    const itemsInCart = product.options?.filter((option) => {
      return cartItems.some(
        (item) => item.productId === product.id && item.selectedOption?.id === option.id
      );
    });

    if (itemsInCart && itemsInCart.length > 0) {
      onClose();
      navigation.navigate('ReviewCart');
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle} numberOfLines={2}>{product.name}</Text>
          </View>
          <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
            {product.options.map((option) => {
              const cartItem = getCartItemForOption(option);
              const isInCart = !!cartItem;
              const showOriginalPrice = product.originalPrice && product.originalPrice > option.price;
              
              const optionWeight = option.name || product.weight || '';
              const optionText = isInCart && cartItem 
                ? `${cartItem.quantity} X ${optionWeight}`
                : optionWeight;

              return (
                <View key={option.id} style={styles.optionItem}>
                  <View style={styles.optionImageContainer}>
                    <Image
                      source={getImageSource(product.image)}
                      style={styles.optionImage}
                      resizeMode="contain"
                    />
                    {isInCart && cartItem && (
                      <View style={styles.quantityBadge}>
                        <Text style={styles.quantityBadgeText}>{cartItem.quantity}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.optionDetails}>
                    <Text style={styles.optionText}>{optionText}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.optionPrice}>
                        ₹{isInCart && cartItem ? cartItem.totalPrice : option.price}
                      </Text>
                      {showOriginalPrice && (
                        <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.actionContainer}>
                    {isInCart && cartItem ? (
                      <CustomButton
                        mode="quantity"
                        quantity={cartItem.quantity}
                        onDecrease={() => handleQuantityChange(option, -1)}
                        onIncrease={() => handleQuantityChange(option, 1)}
                        variant="default"
                      />
                    ) : (
                      <CustomButton
                        text="Add"
                        onPress={() => handleAddToCart(option)}
                        variant="default"
                        showArrow={false}
                        style={styles.addButton}
                      />
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.confirmButtonContainer}>
            <CustomButton
              text="Confirm"
              onPress={handleConfirm}
              variant="fullWidth"
              showArrow={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.75,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  optionsContainer: {
    maxHeight: height * 0.5,
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionImageContainer: {
    width: 70,
    height: 70,
    marginRight: 12,
    position: 'relative',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  quantityBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  quantityBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  optionDetails: {
    flex: 1,
    marginRight: 12,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

export default ProductOptionsModal;

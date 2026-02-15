import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { Product, ProductOption, CartItem } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { addToCart, updateQuantity, removeFromCart } from '../../../store/slices/cartSlice';
import { getImageSource } from '../../../utils/imageAssets';
import CustomButton from '../../../components/CustomButton';
import productDetailConfig from '../../../data/static/productDetailConfig.json';

interface Props {
  product: Product;
  isVisible: boolean;
  onClose: () => void;
  onSelectOption: (option: ProductOption) => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

const { width, height } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = height * 0.45;
const SWIPE_THRESHOLD = 100;

const ProductOptionsBottomSheet: React.FC<Props> = ({
  product,
  isVisible,
  onClose,
  onSelectOption,
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const config = productDetailConfig as any;
  const translateY = React.useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: BOTTOM_SHEET_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > 0.5) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: BOTTOM_SHEET_HEIGHT,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  if (!product.options || product.options.length === 0) {
    return null;
  }

  if (!isVisible) {
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

  const handleBackdropPress = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: BOTTOM_SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <View style={styles.container} pointerEvents={isVisible ? 'auto' : 'none'}>
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {product.name}
          </Text>
        </View>

        <ScrollView
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {product.options.map((option) => {
            const cartItem = getCartItemForOption(option);
            const isInCart = !!cartItem;
            const showOriginalPrice =
              product.originalPrice && product.originalPrice > option.price;

            const optionWeight = option.name || product.weight || '';
            const optionText =
              isInCart && cartItem
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
            text={config.texts?.buttons?.confirm || "Confirm"}
            onPress={handleConfirm}
            variant="fullWidth"
            showArrow={false}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D3D3D3',
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
    flex: 1,
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
    overflow: 'visible',
    backgroundColor: '#F5F5F5',
  },
  optionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
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
    paddingHorizontal: 36,
  },
  confirmButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

export default ProductOptionsBottomSheet;


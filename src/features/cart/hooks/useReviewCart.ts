import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { ReviewCartController, RecommendedProductsResult } from '../controllers/ReviewCartController';
import { Coupon } from '../../../types';
import { LayoutAnimation, Platform, UIManager, InteractionManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const configureLayoutAnimation = () => {
  LayoutAnimation.configureNext(
    Platform.OS === 'ios'
      ? LayoutAnimation.Presets.easeInEaseOut
      : {
          duration: 400,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.scaleXY,
          },
          delete: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
            duration: 300,
          },
        }
  );
};

export const useReviewCart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartSummary = useAppSelector((state) => state.cart.summary);
  const appliedCoupon = useAppSelector((state) => state.cart.appliedCoupon);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const cartProductIds = cartItems.map((item) => item.productId);
        const result: RecommendedProductsResult = await ReviewCartController.loadReviewCartData(
          cartProductIds
        );

        configureLayoutAnimation();
        requestAnimationFrame(() => {
          setRecommendedProducts(result.products);
          setCoupons(result.coupons);
          setIsLoading(false);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setIsLoading(false);
      }
    };

    loadData();
  }, [cartItems]);
  const itemSavings = useMemo(
    () => ReviewCartController.calculateItemSavings(cartItems),
    [cartItems]
  );

  const totalSavings = useMemo(
    () => ReviewCartController.calculateTotalSavings(cartItems, cartSummary.savings || 0),
    [cartItems, cartSummary.savings]
  );

  const cashback = useMemo(
    () => ReviewCartController.calculateCashback(cartSummary.itemTotal),
    [cartSummary.itemTotal]
  );

  const freeDelivery = useMemo(
    () => ReviewCartController.checkFreeDelivery(cartSummary.itemTotal),
    [cartSummary.itemTotal]
  );
  const handleApplyCoupon = useCallback(
    (coupon: Coupon): { success: boolean; message?: string } => {
      const result = ReviewCartController.validateAndApplyCoupon(
        coupon,
        cartSummary.itemTotal,
        dispatch
      );
      return result;
    },
    [dispatch, cartSummary.itemTotal]
  );

  const handleRemoveCoupon = useCallback(() => {
    ReviewCartController.removeCouponFromCart(dispatch);
  }, [dispatch]);

  const handleAddRecommendedProduct = useCallback(
    (product: Product) => {
      ReviewCartController.addRecommendedProductToCart(product, dispatch);
    },
    [dispatch]
  );

  return {
    coupons,
    recommendedProducts,
    isLoading,
    error,
    cartItems,
    cartSummary,
    appliedCoupon,
    
    itemSavings,
    totalSavings,
    cashback,
    freeDelivery,
    
    handleApplyCoupon,
    handleRemoveCoupon,
    handleAddRecommendedProduct,
    
    freeDeliveryThreshold: ReviewCartController.getFreeDeliveryThreshold(),
    cashbackThreshold: ReviewCartController.getCashbackThreshold(),
    cashbackPercentage: ReviewCartController.getCashbackPercentage(),
  };
};


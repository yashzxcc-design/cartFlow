import { AppDispatch } from '../../../store';
import { Coupon, Product, CartItem } from '../../../types';
import { MockApiService } from '../../../services/api/mockApi';
import { CartController } from './CartController';
import { applyCoupon, removeCoupon } from '../../../store/slices/cartSlice';
import { CART_CONSTANTS } from '../constants/cartConstants';

export interface CouponValidationResult {
  success: boolean;
  message?: string;
}

export interface RecommendedProductsResult {
  products: Product[];
  coupons: Coupon[];
}

export class ReviewCartController {
  static async loadReviewCartData(
    cartProductIds: string[]
  ): Promise<RecommendedProductsResult> {
    const [couponsData, productsData] = await Promise.all([
      MockApiService.getCoupons(),
      MockApiService.getProducts(),
    ]);
    const recommended = productsData
      .filter((p) => !cartProductIds.includes(p.id))
      .slice(0, CART_CONSTANTS.MAX_RECOMMENDED_PRODUCTS);

    return {
      products: recommended,
      coupons: couponsData,
    };
  }
  static validateAndApplyCoupon(
    coupon: Coupon,
    itemTotal: number,
    dispatch: AppDispatch
  ): CouponValidationResult {
    if (coupon.minOrderValue && itemTotal < coupon.minOrderValue) {
      const remaining = coupon.minOrderValue - itemTotal;
      return {
        success: false,
        message: `Add items worth ₹${remaining} more to apply this coupon`,
      };
    }

    dispatch(applyCoupon(coupon));
    return { success: true };
  }
  static removeCouponFromCart(dispatch: AppDispatch): void {
    dispatch(removeCoupon());
  }
  static createCartItemFromProduct(
    product: Product,
    selectedOption?: Product['options'][0]
  ): CartItem {
    const option = selectedOption || (product.options && product.options[0]);
    const price = option?.price || product.price;
    const id = option
      ? `${product.id}-${option.id}-${Date.now()}`
      : `${product.id}-${Date.now()}`;

    return {
      id,
      productId: product.id,
      product,
      quantity: 1,
      selectedOption: option,
      totalPrice: price,
    };
  }
  static addRecommendedProductToCart(
    product: Product,
    dispatch: AppDispatch
  ): void {
    const cartItem = this.createCartItemFromProduct(product);
    CartController.addItemToCart(cartItem, dispatch);
  }
  static calculateItemSavings(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      const currentPrice = item.selectedOption?.price || item.product.price;
      const savings = (originalPrice - currentPrice) * item.quantity;
      return total + Math.max(0, savings);
    }, 0);
  }
  static calculateTotalSavings(
    cartItems: CartItem[],
    couponSavings: number
  ): number {
    const itemSavings = this.calculateItemSavings(cartItems);
    return itemSavings + couponSavings;
  }
  static calculateCashback(itemTotal: number): {
    amount: number;
    needsMore: boolean;
    remaining: number;
  } {
    const needsMore = itemTotal < CART_CONSTANTS.CASHBACK_THRESHOLD;
    const remaining = Math.max(0, CART_CONSTANTS.CASHBACK_THRESHOLD - itemTotal);
    const amount =
      itemTotal >= CART_CONSTANTS.CASHBACK_THRESHOLD
        ? Math.floor((itemTotal * CART_CONSTANTS.CASHBACK_PERCENTAGE) / 100)
        : 0;

    return { amount, needsMore, remaining };
  }
  static checkFreeDelivery(itemTotal: number): {
    isFree: boolean;
    remaining: number;
  } {
    const isFree = itemTotal >= CART_CONSTANTS.FREE_DELIVERY_THRESHOLD;
    const remaining = Math.max(0, CART_CONSTANTS.FREE_DELIVERY_THRESHOLD - itemTotal);
    return { isFree, remaining };
  }
  static getFreeDeliveryThreshold(): number {
    return CART_CONSTANTS.FREE_DELIVERY_THRESHOLD;
  }
  static getCashbackThreshold(): number {
    return CART_CONSTANTS.CASHBACK_THRESHOLD;
  }
  static getCashbackPercentage(): number {
    return CART_CONSTANTS.CASHBACK_PERCENTAGE;
  }
}


import { CartItem, OrderSummary, Coupon } from '../../../types';

export class CartModel {
  static calculateItemTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  static calculateDiscount(
    itemTotal: number,
    coupon?: Coupon
  ): number {
    if (!coupon) return 0;

    if (coupon.discountType === 'percentage') {
      const discount = (itemTotal * coupon.discount) / 100;
      return coupon.maxDiscount
        ? Math.min(discount, coupon.maxDiscount)
        : discount;
    }

    return coupon.discount;
  }

  static calculateTotalPayable(
    itemTotal: number,
    deliveryFee: number,
    discount: number,
    platformFee: number
  ): number {
    return itemTotal + deliveryFee - discount + platformFee;
  }

  static validateCouponApplicability(
    itemTotal: number,
    coupon: Coupon
  ): boolean {
    if (coupon.minOrderValue) {
      return itemTotal >= coupon.minOrderValue;
    }
    return true;
  }

  static getTotalItems(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}


import { AppDispatch, RootState } from '../../../store';
import { CartItem, Coupon, DeliveryOption, Address } from '../../../types';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  setDeliveryOption,
  setSelectedAddress,
  setDeliveryTime,
  loadCart,
} from '../../../store/slices/cartSlice';
import { MockApiService } from '../../../services/api/mockApi';
import { StorageService, StorageKeys } from '../../../services/storage/storage';
import { CartState } from '../../../types';

export class CartController {
  static async initializeCart(dispatch: AppDispatch): Promise<void> {
    try {
      const savedCart = await StorageService.getObject<CartState>(
        StorageKeys.CART
      );
      if (savedCart) {
        dispatch(loadCart(savedCart));
      }
    } catch (error) {
      console.error('Failed to initialize cart:', error);
    }
  }

  static async addItemToCart(
    item: CartItem,
    dispatch: AppDispatch
  ): Promise<void> {
    try {
      dispatch(addToCart(item));
      await this.persistCart(dispatch);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  }

  static async removeItemFromCart(
    itemId: string,
    dispatch: AppDispatch
  ): Promise<void> {
    try {
      dispatch(removeFromCart(itemId));
      await this.persistCart(dispatch);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  }

  static async updateItemQuantity(
    itemId: string,
    quantity: number,
    dispatch: AppDispatch
  ): Promise<void> {
    try {
      dispatch(updateQuantity({ id: itemId, quantity }));
      await this.persistCart(dispatch);
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      throw error;
    }
  }

  private static async persistCart(dispatch: AppDispatch): Promise<void> {
    try {
    } catch (error) {
      console.error('Failed to persist cart:', error);
    }
  }

  static async applyCouponToCart(
    couponCode: string,
    dispatch: AppDispatch
  ): Promise<boolean> {
    const coupon = await MockApiService.validateCoupon(couponCode);
    if (coupon) {
      dispatch(applyCoupon(coupon));
      return true;
    }
    return false;
  }

  static removeCouponFromCart(dispatch: AppDispatch): void {
    dispatch(removeCoupon());
  }

  static setDelivery(
    option: DeliveryOption,
    dispatch: AppDispatch
  ): void {
    dispatch(setDeliveryOption(option));
  }

  static async setAddress(
    address: Address,
    dispatch: AppDispatch
  ): Promise<void> {
    const deliveryTime = await MockApiService.getDeliveryTime(address);
    dispatch(setSelectedAddress(address));
    dispatch(setDeliveryTime(deliveryTime));
  }

  static getCartFromState(state: RootState): CartState {
    return state.cart;
  }

  static async checkServiceability(
    address: Address,
    dispatch: AppDispatch
  ): Promise<boolean> {
    return await MockApiService.checkLocationServiceability(address);
  }
}


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem, Coupon, DeliveryOption, Address, OrderSummary } from '../../types';
import { StorageService, StorageKeys } from '../../services/storage/storage';

const FREE_DELIVERY_THRESHOLD = 500;
const DEFAULT_DELIVERY_FEE = 50;

const calculateSummary = (
  items: CartItem[],
  appliedCoupon?: Coupon,
  deliveryOption?: DeliveryOption
): OrderSummary => {
  const itemTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  let deliveryFee = 0;
  if (itemTotal < FREE_DELIVERY_THRESHOLD) {
    deliveryFee = deliveryOption?.fee || DEFAULT_DELIVERY_FEE;
  }
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.minOrderValue && itemTotal < appliedCoupon.minOrderValue) {
      discount = 0;
    } else if (appliedCoupon.discountType === 'percentage') {
      discount = Math.min(
        (itemTotal * appliedCoupon.discount) / 100,
        appliedCoupon.maxDiscount || Infinity
      );
    } else {
      discount = appliedCoupon.discount;
    }
  }
  
  const platformFee = 10;
  const totalPayable = itemTotal + deliveryFee - discount + platformFee;
  const savings = discount;

  return {
    itemTotal,
    deliveryFee,
    discount,
    platformFee,
    totalPayable,
    savings,
  };
};

const initialState: CartState = {
  items: [],
  summary: {
    itemTotal: 0,
    deliveryFee: 0,
    discount: 0,
    platformFee: 0,
    totalPayable: 0,
  },
  deliveryTime: undefined,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.selectedOption?.id === action.payload.selectedOption?.id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        const unitPrice = existingItem.selectedOption?.price || existingItem.product.price;
        existingItem.totalPrice = existingItem.quantity * unitPrice;
      } else {
        state.items.push(action.payload);
      }

      state.summary = calculateSummary(
        state.items,
        state.appliedCoupon,
        state.deliveryOption
      );
      StorageService.saveObject(StorageKeys.CART, state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.summary = calculateSummary(
        state.items,
        state.appliedCoupon,
        state.deliveryOption
      );
      StorageService.saveObject(StorageKeys.CART, state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        const unitPrice = item.selectedOption?.price || item.product.price;
        item.totalPrice = item.quantity * unitPrice;
        state.summary = calculateSummary(
          state.items,
          state.appliedCoupon,
          state.deliveryOption
        );
        StorageService.saveObject(StorageKeys.CART, state);
      }
    },
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      state.appliedCoupon = action.payload;
      state.summary = calculateSummary(
        state.items,
        state.appliedCoupon,
        state.deliveryOption
      );
      StorageService.saveObject(StorageKeys.CART, state);
    },
    removeCoupon: (state) => {
      state.appliedCoupon = undefined;
      state.summary = calculateSummary(
        state.items,
        state.appliedCoupon,
        state.deliveryOption
      );
      StorageService.saveObject(StorageKeys.CART, state);
    },
    setDeliveryOption: (state, action: PayloadAction<DeliveryOption>) => {
      state.deliveryOption = action.payload;
      state.summary = calculateSummary(
        state.items,
        state.appliedCoupon,
        state.deliveryOption
      );
      StorageService.saveObject(StorageKeys.CART, state);
    },
    setSelectedAddress: (state, action: PayloadAction<Address>) => {
      state.selectedAddress = action.payload;
      StorageService.saveObject(StorageKeys.CART, state);
    },
    setDeliveryTime: (state, action: PayloadAction<string>) => {
      state.deliveryTime = action.payload;
      StorageService.saveObject(StorageKeys.CART, state);
    },
    loadCart: (state, action: PayloadAction<CartState>) => {
      return action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = undefined;
      state.deliveryOption = undefined;
      state.summary = {
        itemTotal: 0,
        deliveryFee: 0,
        discount: 0,
        platformFee: 0,
        totalPayable: 0,
      };
      StorageService.remove(StorageKeys.CART);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  setDeliveryOption,
  setSelectedAddress,
  setDeliveryTime,
  loadCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;


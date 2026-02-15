export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  weight?: string;
  description?: string;
  options?: ProductOption[];
  inStock: boolean;
  category?: string;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedOption?: ProductOption;
  totalPrice: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrderValue?: number;
  maxDiscount?: number;
  description?: string;
}

export interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
  isServiceable?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses?: Address[];
}

export interface DeliveryOption {
  type: 'door' | 'instant';
  label: string;
  estimatedTime?: string;
  fee: number;
}

export interface OrderSummary {
  itemTotal: number;
  deliveryFee: number;
  discount: number;
  platformFee: number;
  totalPayable: number;
  savings?: number;
}

export interface CartState {
  items: CartItem[];
  appliedCoupon?: Coupon;
  deliveryOption?: DeliveryOption;
  selectedAddress?: Address;
  deliveryTime?: string;
  summary: OrderSummary;
}

export interface AuthState {
  isAuthenticated: boolean;
  user?: User;
  token?: string;
}

export interface LocationState {
  currentLocation?: Address;
  isLocationEnabled: boolean;
  isServiceable: boolean;
}

export interface ProductState {
  products: Product[];
  selectedProduct?: Product;
  similarProducts: Product[];
}


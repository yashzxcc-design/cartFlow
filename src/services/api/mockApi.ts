import { Product, Coupon, Address, User } from '../../types';
import productsData from '../../data/static/products.json';
import couponsData from '../../data/static/coupons.json';
import addressesData from '../../data/static/addresses.json';

export class MockApiService {
  static async getProduct(productId: string): Promise<Product> {
    await this.delay(300);
    const product = productsData.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static async getSimilarProducts(productId: string): Promise<Product[]> {
    await this.delay(300);
    const product = productsData.products.find((p) => p.id === productId);
    if (!product) {
      return [];
    }
    const similar = productsData.products
      .filter((p) => p.id !== productId)
      .slice(0, 3);
    
    return similar;
  }

  static async getProducts(): Promise<Product[]> {
    await this.delay(300);
    return productsData.products;
  }

  static async getCoupons(): Promise<Coupon[]> {
    await this.delay(200);
    return couponsData.coupons;
  }

  static async validateCoupon(code: string): Promise<Coupon | null> {
    await this.delay(200);
    return couponsData.coupons.find((c) => c.code === code) || null;
  }

  static async getAddresses(userId: string): Promise<Address[]> {
    await this.delay(200);
    return addressesData.addresses;
  }

  static async checkLocationServiceability(
    address: Address
  ): Promise<boolean> {
    await this.delay(300);
    return address.isServiceable ?? true;
  }

  static async getDeliveryTime(
    address: Address
  ): Promise<string> {
    await this.delay(200);
    return '30-60 mins';
  }

  static async login(email: string, password: string): Promise<User> {
    await this.delay(500);
    return {
      id: '1',
      name: 'John Doe',
      email: email,
      phone: '+91 9876543210',
      addresses: addressesData.addresses,
    };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}


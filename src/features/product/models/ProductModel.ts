import { Product } from '../../../types';

export class ProductModel {
  static calculatePrice(product: Product, optionId?: string): number {
    const basePrice = product.price;
    if (optionId && product.options) {
      const option = product.options.find((opt) => opt.id === optionId);
      return option ? option.price : basePrice;
    }
    return basePrice;
  }

  static isAvailable(product: Product): boolean {
    return product.inStock;
  }

  static formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }
}


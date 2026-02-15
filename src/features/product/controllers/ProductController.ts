import { AppDispatch, RootState } from '../../../store';
import { Product } from '../../../types';
import { MockApiService } from '../../../services/api/mockApi';
import {
  setSelectedProduct,
  setSimilarProducts,
  setProducts,
} from '../../../store/slices/productSlice';

export class ProductController {
  static async loadProduct(
    productId: string,
    dispatch: AppDispatch
  ): Promise<Product> {
    const product = await MockApiService.getProduct(productId);
    dispatch(setSelectedProduct(product));

    const similarProducts = await MockApiService.getSimilarProducts(productId);
    dispatch(setSimilarProducts(similarProducts));

    const allProducts = await MockApiService.getProducts();
    dispatch(setProducts(allProducts));

    return product;
  }

  static getProductFromState(
    productId: string,
    state: RootState
  ): Product | undefined {
    return state.product.selectedProduct;
  }

  static getSimilarProductsFromState(state: RootState): Product[] {
    return state.product.similarProducts;
  }
}


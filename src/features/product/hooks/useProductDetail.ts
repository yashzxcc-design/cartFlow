import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { ProductController } from '../controllers/ProductController';
import { Product } from '../../../types';
import { CartController } from '../../cart/controllers/CartController';
import { ReviewCartController } from '../../cart/controllers/ReviewCartController';

interface UseProductDetailProps {
  productId: string;
}

export const useProductDetail = ({ productId }: UseProductDetailProps) => {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.product.selectedProduct);
  const similarProducts = useAppSelector((state) => state.product.similarProducts);
  const cartItems = useAppSelector((state) => state.cart.items);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await ProductController.loadProduct(productId, dispatch);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, dispatch]);
  const isProductInCart = useCallback(
    (product: Product, optionId?: string): boolean => {
      if (!product) return false;
      
      if (optionId) {
        return cartItems.some(
          (item) =>
            item.productId === product.id &&
            item.selectedOption?.id === optionId
        );
      }
      
      return cartItems.some(
        (item) =>
          item.productId === product.id && !item.selectedOption
      );
    },
    [cartItems]
  );
  const getCartItemForProduct = useCallback(
    (product: Product, optionId?: string) => {
      if (!product) return null;
      
      if (optionId) {
        return cartItems.find(
          (item) =>
            item.productId === product.id &&
            item.selectedOption?.id === optionId
        );
      }
      
      return cartItems.find(
        (item) => item.productId === product.id && !item.selectedOption
      );
    },
    [cartItems]
  );
  const handleAddToCart = useCallback(
    async (product: Product, selectedOption?: Product['options'][0]) => {
      try {
        const cartItem = ReviewCartController.createCartItemFromProduct(
          product,
          selectedOption
        );
        await CartController.addItemToCart(cartItem, dispatch);
      } catch (error) {
        console.error('Failed to add product to cart:', error);
        throw error;
      }
    },
    [dispatch]
  );

  return {
    product,
    similarProducts,
    isLoading,
    error,
    isProductInCart,
    getCartItemForProduct,
    handleAddToCart,
  };
};


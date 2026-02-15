import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductState, Product } from '../../types';

const initialState: ProductState = {
  products: [],
  similarProducts: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    setSimilarProducts: (state, action: PayloadAction<Product[]>) => {
      state.similarProducts = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = undefined;
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setSimilarProducts,
  clearSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;


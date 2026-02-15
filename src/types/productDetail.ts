export interface ProductDetailSection {
  type: 'header' | 'productImage' | 'productInfo' | 'similarProducts' | 'description' | 'customersAlsoBought';
  id: string;
  title?: string;
}

export interface ProductDetailConfig {
  sections: ProductDetailSection[];
}


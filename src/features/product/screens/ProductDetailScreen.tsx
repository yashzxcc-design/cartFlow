import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, Share } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { ProductController } from '../controllers/ProductController';
import { Product, ProductOption, CartItem } from '../../../types';
import { ProductDetailSection } from '../../../types/productDetail';
import productDetailConfig from '../../../data/static/productDetailConfig.json';

interface ProductDetailConfig {
  sections: ProductDetailSection[];
  texts: {
    share: {
      template: string;
      brandPrefix: string;
      pricePrefix: string;
      defaultMessage: string;
    };
    buttons: {
      addToCart: string;
      viewCart: string;
      options: string;
      add: string;
      confirm: string;
    };
    sections: {
      similarProducts: {
        title: string;
        defaultTitle: string;
      };
      customersAlsoBought: {
        title: string;
        defaultTitle: string;
      };
    };
  };
  options: {
    enableShare: boolean;
    enableProfileIcon: boolean;
    defaultProductId: string;
  };
}
import ProductHeader from '../components/ProductHeader';
import ProductImage from '../components/ProductImage';
import ProductInfo from '../components/ProductInfo';
import ProductList from '../components/ProductList';
import ProductDescription from '../components/ProductDescription';
import ProductBottomBar from '../components/ProductBottomBar';
import ProductDetailShimmer from '../components/ProductDetailShimmer';
import { CartController } from '../../cart/controllers/CartController';
import ProductOptionsBottomSheet from '../components/ProductOptionsBottomSheet';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

interface Props {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
}

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const productId = route.params?.productId || '1';
  const product = useAppSelector((state) => state.product.selectedProduct);
  const similarProducts = useAppSelector((state) => state.product.similarProducts);
  const allProducts = useAppSelector((state) => state.product.products);
  const [isOptionsSheetVisible, setIsOptionsSheetVisible] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProduct = async () => {
        try {
          setIsLoading(true);
          await ProductController.loadProduct(productId, dispatch);
        } catch (error) {
          console.error('Failed to load product:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadProduct();
    }, [productId, dispatch])
  );

  const handleSelectOption = useCallback((option: ProductOption) => {
    console.log('Selected option:', option);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    if (product.options && product.options.length > 0) {
      const firstOption = product.options[0];
      const cartItem: CartItem = {
        id: `${product.id}-${firstOption.id}-${Date.now()}`,
        productId: product.id,
        product: product,
        quantity: 1,
        selectedOption: firstOption,
        totalPrice: firstOption.price,
      };
      CartController.addItemToCart(cartItem, dispatch);
    } else {
      const cartItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        product: product,
        quantity: 1,
        totalPrice: product.price,
      };
      CartController.addItemToCart(cartItem, dispatch);
    }
  }, [product, dispatch]);

  const config = productDetailConfig as ProductDetailConfig;

  const handleShare = useCallback(async () => {
    if (!product || !config.options.enableShare) return;
    
    const shareTexts = config.texts.share;
    const brandText = product.brand ? `${shareTexts.brandPrefix}${product.brand}` : '';
    const priceText = product.price ? `${shareTexts.pricePrefix}${product.price}` : '';
    const shareMessage = shareTexts.template
      .replace('{productName}', product.name)
      .replace('{brand}', brandText)
      .replace('{price}', priceText || shareTexts.defaultMessage);
    
    try {
      await Share.share({
        message: shareMessage,
      });
    } catch (error: any) {
      console.error('Error sharing:', error);
    }
  }, [product, config]);

  const sections = useMemo(() => config.sections as ProductDetailSection[], [config]);

  const renderSection = useCallback(({ item }: { item: ProductDetailSection }) => {
    if (!product || product.id !== productId) {
      return null;
    }

    switch (item.type) {
      case 'header':
        return (
          <ProductHeader
            navigation={navigation}
            title={product.name}
            onShare={handleShare}
            showProfileIcon={config.options.enableProfileIcon}
          />
        );

      case 'productImage':
        return <ProductImage product={product} />;

      case 'productInfo':
        return (
          <ProductInfo
            product={product}
            onOptionsPress={() => {
              setIsOptionsSheetVisible(true);
            }}
          />
        );

      case 'similarProducts':
        return (
          <ProductList
            title={item.title || config.texts.sections.similarProducts.defaultTitle}
            products={similarProducts}
            onProductPress={(p) => {
              navigation.push('ProductDetail', { productId: p.id });
            }}
            onAddPress={(p) => {
              if (p.options && p.options.length > 0) {
                const firstOption = p.options[0];
                const cartItem: CartItem = {
                  id: `${p.id}-${firstOption.id}-${Date.now()}`,
                  productId: p.id,
                  product: p,
                  quantity: 1,
                  selectedOption: firstOption,
                  totalPrice: firstOption.price,
                };
                CartController.addItemToCart(cartItem, dispatch);
              } else {
                const cartItem: CartItem = {
                  id: `${p.id}-${Date.now()}`,
                  productId: p.id,
                  product: p,
                  quantity: 1,
                  totalPrice: p.price,
                };
                CartController.addItemToCart(cartItem, dispatch);
              }
            }}
            onOptionsPress={(p) => {
              setSelectedProductForModal(p);
              setIsOptionsSheetVisible(true);
            }}
          />
        );

      case 'description':
        return <ProductDescription product={product} />;

      case 'customersAlsoBought':
        const customersProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 5);
        return (
          <ProductList
            title={item.title || config.texts.sections.customersAlsoBought.defaultTitle}
            products={customersProducts}
            onProductPress={(p) => {
              navigation.push('ProductDetail', { productId: p.id });
            }}
            onAddPress={(p) => {
              if (p.options && p.options.length > 0) {
                const firstOption = p.options[0];
                const cartItem: CartItem = {
                  id: `${p.id}-${firstOption.id}-${Date.now()}`,
                  productId: p.id,
                  product: p,
                  quantity: 1,
                  selectedOption: firstOption,
                  totalPrice: firstOption.price,
                };
                CartController.addItemToCart(cartItem, dispatch);
              } else {
                const cartItem: CartItem = {
                  id: `${p.id}-${Date.now()}`,
                  productId: p.id,
                  product: p,
                  quantity: 1,
                  totalPrice: p.price,
                };
                CartController.addItemToCart(cartItem, dispatch);
              }
            }}
            onOptionsPress={(p) => {
              setSelectedProductForModal(p);
              setIsOptionsSheetVisible(true);
            }}
          />
        );

      default:
        return null;
    }
  }, [product, productId, similarProducts, allProducts, navigation, handleShare]);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 0,
      offset: 0,
      index,
    }),
    []
  );

  if (isLoading || !product || product.id !== productId) {
    return <ProductDetailShimmer />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.id}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={3}
        contentContainerStyle={styles.listContent}
      />
      <ProductBottomBar
        product={product}
        onAddToCart={handleAddToCart}
        navigation={navigation}
      />
      <ProductOptionsBottomSheet
        product={selectedProductForModal || product}
        isVisible={isOptionsSheetVisible}
        onClose={() => {
          setIsOptionsSheetVisible(false);
          setSelectedProductForModal(null);
        }}
        onSelectOption={handleSelectOption}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default ProductDetailScreen;

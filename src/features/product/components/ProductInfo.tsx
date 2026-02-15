import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Product } from '../../../types';
import CustomButton from '../../../components/CustomButton';

interface Props {
  product: Product;
  onOptionsPress?: () => void;
}

const ProductInfo: React.FC<Props> = React.memo(({ product, onOptionsPress }) => {
  const hasOptions = product.options && product.options.length > 0;
  const showOriginalPrice = product.originalPrice && product.originalPrice > product.price;

  return (
    <View style={styles.container}>
      {product.brand && (
        <Text style={styles.brand}>{product.brand}</Text>
      )}
      <Text style={styles.name}>{product.name}</Text>
      {product.weight && (
        <Text style={styles.weight}>{product.weight}</Text>
      )}
      <View style={styles.priceContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {showOriginalPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>
        {hasOptions && (
          <CustomButton
            optionsCount={product.options?.length || 0}
            onPress={onOptionsPress}
            variant="default"
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  brand: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  weight: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 0,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
});

ProductInfo.displayName = 'ProductInfo';

export default ProductInfo;

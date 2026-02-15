import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Product } from '../../../types';

interface Props {
  product: Product;
}

const ProductDescription: React.FC<Props> = React.memo(({ product }) => {
  if (!product.description) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Description</Text>
      <Text style={styles.description}>{product.description}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

ProductDescription.displayName = 'ProductDescription';

export default ProductDescription;


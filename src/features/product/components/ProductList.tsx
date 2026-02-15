import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Product } from '../../../types';
import ProductCard from './ProductCard';

interface Props {
  title: string;
  products: Product[];
  onProductPress?: (product: Product) => void;
  onAddPress?: (product: Product) => void;
  onOptionsPress?: (product: Product) => void;
}

const ProductList: React.FC<Props> = React.memo(({
  title,
  products,
  onProductPress,
  onAddPress,
  onOptionsPress,
}) => {
  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => onProductPress?.(item)}
      onAddPress={() => onAddPress?.(item)}
      onOptionsPress={() => onOptionsPress?.(item)}
    />
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});

ProductList.displayName = 'ProductList';

export default ProductList;


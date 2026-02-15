import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Product } from '../../../types';
import { getImageSource } from '../../../utils/imageAssets';

interface Props {
  product: Product;
}

const { width } = Dimensions.get('window');

const ProductImage: React.FC<Props> = React.memo(({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const rawImages = product.images || [product.image];
  
  const images = rawImages.length === 1 
    ? Array(4).fill(rawImages[0])
    : rawImages;

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: 0, animated: false });
        setCurrentIndex(0);
      }, 100);
    }
  }, [images.length, width]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image
              source={getImageSource(image)}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>
      {product.discount && product.discount > 0 && (
        <View style={styles.discountBadge}>
          <View style={styles.discountBadgeContent}>
            <Text style={styles.discountText}>{product.discount}% OFF</Text>
          </View>
        </View>
      )}
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.indicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    marginTop: 8,
  },
  scrollView: {
    width: width,
    height: width * 0.8,
  },
  imageWrapper: {
    width: width,
    height: width * 0.8,
    paddingHorizontal: 32,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  discountBadgeContent: {
    backgroundColor: '#0C748C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#FF6B00',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

ProductImage.displayName = 'ProductImage';

export default ProductImage;

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ProductDetailShimmer: React.FC = React.memo(() => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerShimmer}>
        <Animated.View style={[styles.shimmerBox, { width: 24, height: 24, opacity }]} />
        <Animated.View style={[styles.shimmerBox, { flex: 1, height: 16, marginHorizontal: 12, opacity }]} />
        <Animated.View style={[styles.shimmerBox, { width: 24, height: 24, opacity }]} />
      </View>

      <Animated.View style={[styles.imageShimmer, { opacity }]} />

      <View style={styles.infoContainer}>
        <Animated.View style={[styles.shimmerBox, { width: 80, height: 14, marginBottom: 8, opacity }]} />
        <Animated.View style={[styles.shimmerBox, { width: '70%', height: 20, marginBottom: 8, opacity }]} />
        <Animated.View style={[styles.shimmerBox, { width: 60, height: 14, marginBottom: 12, opacity }]} />
        <View style={styles.priceRow}>
          <Animated.View style={[styles.shimmerBox, { width: 100, height: 24, opacity }]} />
          <Animated.View style={[styles.shimmerBox, { width: 120, height: 36, borderRadius: 20, opacity }]} />
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Animated.View style={[styles.shimmerBox, { width: '100%', height: 12, marginBottom: 8, opacity }]} />
        <Animated.View style={[styles.shimmerBox, { width: '100%', height: 12, marginBottom: 8, opacity }]} />
        <Animated.View style={[styles.shimmerBox, { width: '80%', height: 12, marginBottom: 8, opacity }]} />
        <Animated.View style={[styles.shimmerBox, { width: '90%', height: 12, opacity }]} />
      </View>

      <View style={styles.similarProductsContainer}>
        <Animated.View style={[styles.shimmerBox, { width: 150, height: 20, marginBottom: 12, marginHorizontal: 16, opacity }]} />
        <View style={styles.productsRow}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.productCardShimmer}>
              <Animated.View style={[styles.shimmerBox, { width: '100%', height: 120, marginBottom: 8, borderRadius: 8, opacity }]} />
              <Animated.View style={[styles.shimmerBox, { width: '60%', height: 12, marginBottom: 4, opacity }]} />
              <Animated.View style={[styles.shimmerBox, { width: '80%', height: 14, marginBottom: 4, opacity }]} />
              <Animated.View style={[styles.shimmerBox, { width: '50%', height: 12, marginBottom: 8, opacity }]} />
              <Animated.View style={[styles.shimmerBox, { width: '100%', height: 28, borderRadius: 4, opacity }]} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerShimmer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  shimmerBox: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  imageShimmer: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  similarProductsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  productsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  productCardShimmer: {
    width: (width - 48) / 3,
    marginRight: 12,
    padding: 8,
  },
});

ProductDetailShimmer.displayName = 'ProductDetailShimmer';

export default ProductDetailShimmer;


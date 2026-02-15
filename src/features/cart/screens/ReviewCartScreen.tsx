import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, ImageBackground, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAppSelector } from '../../../utils/hooks';
import { Product, Coupon } from '../../../types';
import CartHeader from '../components/CartHeader';
import CartItemCard from '../components/CartItemCard';
import CouponCard from '../components/CouponCard';
import DeliveryInstructions from '../components/DeliveryInstructions';
import OrderSummary from '../components/OrderSummary';
import ProductList from '../../product/components/ProductList';
import CartBottomBar from '../components/CartBottomBar';
import ProductOptionsBottomSheet from '../../product/components/ProductOptionsBottomSheet';
import CustomButton from '../../../components/CustomButton';
import Toast from '../../../components/Toast';
import { useReviewCart } from '../hooks/useReviewCart';
import reviewCartConfig from '../../../data/static/reviewCartConfig.json';
import { getImageSource } from '../../../utils/imageAssets';

interface ReviewCartConfig {
  sections: {
    emptyCart: {
      title: string;
      button: {
        text: string;
        variant: string;
        showArrow: boolean;
      };
    };
    savingsBanner: {
      template: string;
      enabled: boolean;
    };
    warningBanner: {
      text: string;
      enabled: boolean;
      icon: string;
    };
    recommendedProducts: {
      title: string;
      enabled: boolean;
    };
    coupons: {
      title: string;
      viewMore: {
        text: string;
        arrow: string;
        enabled: boolean;
      };
      enabled: boolean;
    };
    couponSavingsBanner: {
      template: string;
      enabled: boolean;
    };
    cashback: {
      messages: {
        received: string;
        needsMore: string;
        willReceive: string;
      };
      subtexts: {
        received: string;
        needsMore: string;
      };
      icon: string;
      enabled: boolean;
    };
    deliveryInstructions: {
      enabled: boolean;
    };
    orderSummary: {
      enabled: boolean;
    };
    policy: {
      text: string;
      enabled: boolean;
    };
  };
  bottomBar: {
    login: {
      title: string;
      subtitle: string;
      button: {
        text: string;
        variant: string;
        showArrow: boolean;
      };
    };
    addAddress: {
      prompt: string;
      button: {
        text: string;
        variant: string;
        showArrow: boolean;
      };
    };
    delivery: {
      timeTemplate: string;
      time: string;
      lightningIcon: string;
      changeButton: string;
      serviceabilityWarning: string;
    };
    payment: {
      label: string;
      proceedButton: {
        text: string;
        variant: string;
        showArrow: boolean;
      };
    };
  };
  options: {
    defaultProductId: string;
    enableAnimations: boolean;
    toastDuration: number;
  };
}

enum ViewType {
  SAVINGS_BANNER = 'SAVINGS_BANNER',
  WARNING_BANNER = 'WARNING_BANNER',
  CART_ITEM = 'CART_ITEM',
  RECOMMENDED_PRODUCTS = 'RECOMMENDED_PRODUCTS',
  COUPONS_SECTION = 'COUPONS_SECTION',
  COUPON_SAVINGS_BANNER = 'COUPON_SAVINGS_BANNER',
  CASHBACK = 'CASHBACK',
  DELIVERY_INSTRUCTIONS = 'DELIVERY_INSTRUCTIONS',
  ORDER_SUMMARY = 'ORDER_SUMMARY',
  POLICY = 'POLICY',
}

interface ListItem {
  id: string;
  type: ViewType;
  data?: any;
}

type ReviewCartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReviewCart'>;

interface Props {
  navigation: ReviewCartScreenNavigationProp;
}


const ReviewCartScreen: React.FC<Props> = ({ navigation }) => {
  const selectedAddress = useAppSelector((state) => state.cart.selectedAddress);
  const config = reviewCartConfig as ReviewCartConfig;
  
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      navigation.navigate('ProductDetail', { productId: config.options.defaultProductId });
    });

    return unsubscribe;
  }, [navigation]);

  const {
    coupons,
    recommendedProducts,
    cartItems,
    cartSummary,
    appliedCoupon,
    itemSavings,
    totalSavings,
    cashback,
    freeDelivery,
    handleApplyCoupon: applyCouponHandler,
    handleRemoveCoupon,
    handleAddRecommendedProduct,
    freeDeliveryThreshold,
    cashbackThreshold,
    cashbackPercentage,
  } = useReviewCart();

  const handleApplyCoupon = useCallback(
    (coupon: Coupon) => {
      const result = applyCouponHandler(coupon);
      if (!result.success && result.message) {
        setToastMessage(result.message);
        setShowToast(true);
      }
    },
    [applyCouponHandler]
  );

  const listData = useMemo(() => {
    const items: ListItem[] = [];

    if (totalSavings > 0) {
      items.push({
        id: 'savings-banner-top',
        type: ViewType.SAVINGS_BANNER,
        data: { amount: totalSavings },
      });
    }

    items.push({
      id: 'warning-banner',
      type: ViewType.WARNING_BANNER,
    });

    cartItems.forEach((item) => {
      items.push({
        id: `cart-item-${item.id}`,
        type: ViewType.CART_ITEM,
        data: { item },
      });
    });

    if (recommendedProducts.length > 0) {
      items.push({
        id: 'recommended-products',
        type: ViewType.RECOMMENDED_PRODUCTS,
        data: { products: recommendedProducts },
      });
    }

    if (coupons.length > 0) {
      items.push({
        id: 'coupons-section',
        type: ViewType.COUPONS_SECTION,
        data: { coupons },
      });

      if (appliedCoupon) {
        items.push({
          id: 'coupon-savings-banner',
          type: ViewType.COUPON_SAVINGS_BANNER,
          data: { savings: cartSummary.savings || 0 },
        });
      }
    }

    items.push({
      id: 'cashback',
      type: ViewType.CASHBACK,
      data: { 
        amount: cashback.amount,
        needsMore: cashback.needsMore,
        remaining: cashback.remaining,
      },
    });

    items.push({
      id: 'delivery-instructions',
      type: ViewType.DELIVERY_INSTRUCTIONS,
    });

    items.push({
      id: 'order-summary',
      type: ViewType.ORDER_SUMMARY,
      data: {
        summary: cartSummary,
        itemTotalSavings: itemSavings,
        freeDeliveryThreshold,
      },
    });

    if (totalSavings > 0) {
      items.push({
        id: 'savings-banner-bottom',
        type: ViewType.SAVINGS_BANNER,
        data: { amount: totalSavings },
      });
    }

    items.push({
      id: 'policy',
      type: ViewType.POLICY,
    });

    return items;
  }, [
    totalSavings,
    cartItems,
    recommendedProducts,
    coupons,
    appliedCoupon,
    cartSummary,
    cashback,
    itemSavings,
    freeDeliveryThreshold,
  ]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    switch (item.type) {
      case ViewType.SAVINGS_BANNER:
        if (!config.sections.savingsBanner.enabled) return null;
        const isTopBanner = item.id === 'savings-banner-top';
        return (
          <ImageBackground
            source={getImageSource('BannerBackground.png')}
            style={[
              styles.savingsBanner,
              isTopBanner && { transform: [{ scaleY: -1 }] }
            ]}
            resizeMode="stretch"
          >
            <View style={isTopBanner ? { transform: [{ scaleY: -1 }] } : undefined}>
              <Text style={styles.savingsText}>
                {config.sections.savingsBanner.template.replace('{amount}', String(item.data?.amount || 0))}
              </Text>
            </View>
          </ImageBackground>
        );

      case ViewType.WARNING_BANNER:
        if (!config.sections.warningBanner.enabled) return null;
        return (
          <View style={styles.warningBanner}>
            <View style={styles.warningIconContainer}>
              <Text style={styles.warningIcon}>{config.sections.warningBanner.icon}</Text>
            </View>
            <Text style={styles.warningText}>
              {config.sections.warningBanner.text}
            </Text>
          </View>
        );

      case ViewType.CART_ITEM:
        return <CartItemCard item={item.data.item} />;

      case ViewType.RECOMMENDED_PRODUCTS:
        if (!config.sections.recommendedProducts.enabled) return null;
        return (
          <ProductList
            title={config.sections.recommendedProducts.title}
            products={item.data.products}
            onProductPress={(p) => {
              navigation.navigate('ProductDetail', { productId: p.id });
            }}
            onAddPress={handleAddRecommendedProduct}
            onOptionsPress={(p) => {
              setSelectedProductForModal(p);
              setIsOptionsModalVisible(true);
            }}
          />
        );

      case ViewType.COUPONS_SECTION:
        if (!config.sections.coupons.enabled) return null;
        return (
          <View style={styles.couponsContainer}>
            <Image
              source={getImageSource('TopCouponsForyou.png')}
              style={styles.couponsHeaderImage}
              resizeMode="contain"
            />
            <FlatList
              data={item.data.coupons}
              renderItem={({ item: coupon }) => (
                <CouponCard
                  coupon={coupon}
                  isApplied={appliedCoupon?.id === coupon.id}
                  onApply={() => handleApplyCoupon(coupon)}
                  onRemove={handleRemoveCoupon}
                />
              )}
              keyExtractor={(coupon) => coupon.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.couponsList}
            />
          </View>
        );

      case ViewType.COUPON_SAVINGS_BANNER:
        if (!config.sections.couponSavingsBanner.enabled) return null;
        const savingsAmount = String(item.data?.savings || 0);
        const bannerText = config.sections.couponSavingsBanner.template.replace('{savings}', savingsAmount);
        const parts = bannerText.split(/(\s*saving\s*|₹\d+)/i);
        return (
          <View style={styles.couponSavingsBanner}>
            <Image
              source={getImageSource('🎉.png')}
              style={styles.couponSavingsLeftIcon}
              resizeMode="contain"
            />
            <View style={styles.couponSavingsTextContainer}>
              {parts.map((part, index) => {
                const trimmedPart = part.trim();
                const isHighlight = /^saving$/i.test(trimmedPart) || /^₹\d+$/.test(trimmedPart);
                return (
                  <Text
                    key={index}
                    style={isHighlight ? styles.couponSavingsTextBold : styles.couponSavingsText}
                  >
                    {part}
                  </Text>
                );
              })}
            </View>
            <Image
              source={getImageSource('🎉.png')}
              style={styles.couponSavingsRightIcon}
              resizeMode="contain"
            />
          </View>
        );

      case ViewType.CASHBACK:
        if (!config.sections.cashback.enabled) return null;
        const { amount, needsMore, remaining } = item.data;
        const cashbackConfig = config.sections.cashback;
        return (
          <View style={styles.cashbackContainer}>
            <View style={styles.cashbackIconContainer}>
              <Text style={styles.cashbackIconText}>{cashbackConfig.icon}</Text>
            </View>
            <View style={styles.cashbackDetails}>
              <Text style={styles.cashbackText}>
                {amount > 0
                  ? cashbackConfig.messages.received.replace('{amount}', String(amount))
                  : needsMore
                  ? cashbackConfig.messages.needsMore.replace('{remaining}', String(remaining)).replace('{percentage}', String(cashbackPercentage))
                  : cashbackConfig.messages.willReceive.replace('{amount}', String(amount))}
              </Text>
              <Text style={styles.cashbackSubtext}>
                {amount > 0 ? cashbackConfig.subtexts.received : cashbackConfig.subtexts.needsMore}
              </Text>
            </View>
          </View>
        );

      case ViewType.DELIVERY_INSTRUCTIONS:
        if (!config.sections.deliveryInstructions.enabled) return null;
        return <DeliveryInstructions />;

      case ViewType.ORDER_SUMMARY:
        if (!config.sections.orderSummary.enabled) return null;
        return (
          <OrderSummary
            summary={item.data.summary}
            itemTotalSavings={item.data.itemTotalSavings}
            freeDeliveryThreshold={item.data.freeDeliveryThreshold}
          />
        );

      case ViewType.POLICY:
        if (!config.sections.policy.enabled) return null;
        return (
          <View style={styles.policyContainer}>
            <Text style={styles.policyText}>
              {config.sections.policy.text}
            </Text>
          </View>
        );

      default:
        return null;
    }
  }, [
    navigation,
    handleAddRecommendedProduct,
    handleApplyCoupon,
    handleRemoveCoupon,
    appliedCoupon,
    cashbackPercentage,
  ]);

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <CartHeader navigation={navigation} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{config.sections.emptyCart.title}</Text>
          <CustomButton
            text={config.sections.emptyCart.button.text}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'ProductDetail', params: { productId: config.options.defaultProductId } }],
              });
            }}
            variant={config.sections.emptyCart.button.variant as any}
            showArrow={config.sections.emptyCart.button.showArrow}
            style={styles.startShoppingButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CartHeader navigation={navigation} />
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
      <CartBottomBar navigation={navigation} />
      {selectedProductForModal && (
        <ProductOptionsBottomSheet
          product={selectedProductForModal}
          isVisible={isOptionsModalVisible}
          onClose={() => {
            setIsOptionsModalVisible(false);
            setSelectedProductForModal(null);
          }}
          onSelectOption={() => {}}
          navigation={navigation}
        />
      )}
      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
        duration={config.options.toastDuration}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 200,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 24,
    fontWeight: '500',
  },
  startShoppingButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  savingsBanner: {
    height: 60,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  warningBanner: {
    backgroundColor: '#FFF9E6',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  warningIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFB74D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warningIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  warningText: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  couponsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  couponsHeaderImage: {
    width: '100%',
    height: 40,
    marginBottom: 12,
    alignSelf: 'center',
    paddingHorizontal:16
  },
  couponsList: {
    paddingHorizontal: 16,
  },
  couponSavingsBanner: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponSavingsLeftIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  couponSavingsRightIcon: {
    width: 30,
    height: 30,
    marginLeft: 8,
  },
  couponSavingsTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  couponSavingsText: {
    fontSize: 14,
    color: '#14B8A6',
    fontWeight: '400',
  },
  couponSavingsTextBold: {
    fontSize: 14,
    color: '#0C748C',
    fontWeight: '700',
  },
  viewMoreCoupons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#55913D',
    fontWeight: '500',
    marginRight: 4,
  },
  viewMoreArrow: {
    fontSize: 16,
    color: '#55913D',
  },
  cashbackContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashbackIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cashbackIconText: {
    fontSize: 20,
  },
  cashbackDetails: {
    flex: 1,
    alignItems: 'center',
  },
  cashbackText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  cashbackSubtext: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  policyContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
  },
  policyText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default ReviewCartScreen;


import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAppSelector } from '../../../utils/hooks';
import CustomButton from '../../../components/CustomButton';
import reviewCartConfig from '../../../data/static/reviewCartConfig.json';

interface Props {
  navigation: StackNavigationProp<RootStackParamList>;
}

const CartBottomBar: React.FC<Props> = React.memo(({ navigation }) => {
  const cartSummary = useAppSelector((state) => state.cart.summary);
  const selectedAddress = useAppSelector((state) => state.cart.selectedAddress);
  const deliveryTime = useAppSelector((state) => state.cart.deliveryTime);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const config = reviewCartConfig as any;

  const handleLogin = () => {
    navigation.navigate('Profile');
  };

  const handleAddAddress = () => {
    navigation.navigate('Profile', { fromCart: true });
  };

  const handleChangeAddress = () => {
    navigation.navigate('Profile', { fromCart: true });
  };
  if (!isAuthenticated) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>{config.bottomBar.login.title}</Text>
          <Text style={styles.loginSubtitle}>
            {config.bottomBar.login.subtitle}
          </Text>
          <CustomButton
            text={config.bottomBar.login.button.text}
            onPress={handleLogin}
            variant={config.bottomBar.login.button.variant as any}
            showArrow={config.bottomBar.login.button.showArrow}
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  if (!selectedAddress) {
    return (
      <View style={styles.container}>
        <View style={styles.addAddressCard}>
          <View style={styles.addAddressContent}>
            <View style={styles.addAddressIconContainer}>
              <Text style={styles.locationIconText}>📍</Text>
            </View>
            <Text style={styles.addAddressPrompt}>
              {config.bottomBar.addAddress.prompt}
            </Text>
          </View>
          <CustomButton
            text={config.bottomBar.addAddress.button.text}
            onPress={handleAddAddress}
            variant={config.bottomBar.addAddress.button.variant as any}
            showArrow={config.bottomBar.addAddress.button.showArrow}
            style={styles.addAddressButton}
          />
        </View>
      </View>
    );
  }

  const addressText = `${selectedAddress.name} | ${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}, ${selectedAddress.city}...`;
  const isServiceable = selectedAddress.isServiceable !== false;

  return (
    <View style={styles.container}>
      <View style={styles.deliverySection}>
        <View style={styles.deliveryInfo}>
          <View style={styles.locationIconContainer}>
            <View style={styles.locationIconCircle}>
              <Text style={styles.deliveryLocationIconText}>📍</Text>
            </View>
          </View>
          <View style={styles.deliveryTextContainer}>
            {!isServiceable ? (
              <Text style={styles.serviceabilityWarning}>{config.bottomBar.delivery.serviceabilityWarning}</Text>
            ) : (
              <View style={styles.deliveryTimeRow}>
                <Text style={styles.deliveryTime}>
                  {config.bottomBar.delivery.timeTemplate.replace('{time}', deliveryTime || config.bottomBar.delivery.time)}
                  <Text style={styles.deliveryTimeBold}> {deliveryTime || config.bottomBar.delivery.time}</Text>
                </Text>
                <Text style={styles.lightningIcon}>{config.bottomBar.delivery.lightningIcon}</Text>
              </View>
            )}
            <View style={styles.addressRow}>
              <Text style={styles.addressText} numberOfLines={1}>
                {addressText}
              </Text>
              <TouchableOpacity onPress={handleChangeAddress}>
                <Text style={styles.changeText}>{config.bottomBar.delivery.changeButton}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View> 
      <View style={styles.paymentSection}>
        <View style={styles.paymentInfo}>
          <Text style={styles.toPayLabel}>{config.bottomBar.payment.label}</Text>
          <Text style={styles.totalAmount}>₹{cartSummary.totalPayable}</Text>
        </View>
        <CustomButton
          text={config.bottomBar.payment.proceedButton.text}
          onPress={isServiceable ? () => navigation.navigate('Checkout') : undefined}
          variant={config.bottomBar.payment.proceedButton.variant as any}
          showArrow={config.bottomBar.payment.proceedButton.showArrow}
          style={StyleSheet.flatten([
            styles.proceedButton,
            !isServiceable && styles.proceedButtonDisabled,
          ])}
          textStyle={!isServiceable ? styles.proceedButtonTextDisabled : undefined}
          activeOpacity={isServiceable ? 0.7 : 1}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  loginContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop:5,
  },
  addAddressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
  },
  addAddressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addAddressIconContainer: {
    marginRight: 12,
  },
  locationIconText: {
    fontSize: 24,
  },
  addAddressPrompt: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  addAddressButton: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 0,
  },
  loginTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 2,
  },
  loginSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  loginButton: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  deliverySection: {
    marginBottom: 12,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIconContainer: {
    marginRight: 12,
  },
  locationIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryLocationIconText: {
    fontSize: 18,
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 13,
    fontWeight: '400',
    color: '#000000',
    marginRight: 4,
  },
  deliveryTimeBold: {
    fontWeight: '700',
  },
  lightningIcon: {
    fontSize: 14,
  },
  serviceabilityWarning: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF0000',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 20,
  },
  addressText: {
    fontSize: 11,
    color: '#666666',
    flex: 1,
    marginRight: 8,
    lineHeight: 16,
  },
  changeText: {
    fontSize: 14,
    color: '#55913D',
    fontWeight: '500',
    lineHeight: 20,
    textAlignVertical: 'center',
  },
  paymentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentInfo: {
    alignItems: 'flex-start',
  },
  toPayLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  proceedButton: {
    minWidth: 100,
    paddingHorizontal: 38,
  },
  proceedButtonDisabled: {
    backgroundColor: '#d2e8c9',
    opacity: 0.6,
  },
  proceedButtonTextDisabled: {
    color: 'white',
  },
});

CartBottomBar.displayName = 'CartBottomBar';

export default CartBottomBar;


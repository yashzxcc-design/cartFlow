import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import CustomButton from '../../../components/CustomButton';
import { useAppDispatch } from '../../../utils/hooks';
import { clearCart } from '../../../store/slices/cartSlice';

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

interface Props {
  navigation: CheckoutScreenNavigationProp;
}

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'ProductDetail', params: { productId: '1' } }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.tickContainer}>
          <Text style={styles.tickIcon}>✓</Text>
        </View>
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.message}>
          Your order has been confirmed and will be delivered soon.
        </Text>
        <View style={styles.buttonContainer}>
          <CustomButton
            text="Continue shopping"
            onPress={handleContinueShopping}
            variant="fullWidth"
            showArrow={false}
            style={styles.continueButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  tickContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#55913D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  tickIcon: {
    fontSize: 60,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  continueButton: {
    backgroundColor: '#55913D',
  },
});

export default CheckoutScreen;


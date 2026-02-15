import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import ProductDetailScreen from '../features/product/screens/ProductDetailScreen';
import ReviewCartScreen from '../features/cart/screens/ReviewCartScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import ProfileScreen from '../features/auth/screens/ProfileScreen';
import AddressSelectionScreen from '../features/location/screens/AddressSelectionScreen';
import CheckoutScreen from '../features/checkout/screens/CheckoutScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ProductDetail"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Product Detail' }}
        />
        <Stack.Screen
          name="ReviewCart"
          component={ReviewCartScreen}
          options={{ title: 'Review Cart' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="AddressSelection"
          component={AddressSelectionScreen}
          options={{ title: 'Select Address' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


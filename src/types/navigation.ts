import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  ProductDetail: { productId?: string };
  ReviewCart: undefined;
  Checkout: undefined;
  Login: { returnScreen?: keyof RootStackParamList };
  AddressSelection: undefined;
  Home: undefined;
  Profile: { fromCart?: boolean } | undefined;
};

export type AppNavigationParamList = RootStackParamList;


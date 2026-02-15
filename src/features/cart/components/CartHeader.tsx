import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { getImageSource } from '../../../utils/imageAssets';
import { HeaderConstants } from '../../product/constants/headerConstants';

interface Props {
  navigation: StackNavigationProp<RootStackParamList>;
}

const CartHeader: React.FC<Props> = React.memo(({ navigation }) => {
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleBackPress = () => {
    navigation.navigate('ProductDetail', { productId: '1' });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton} activeOpacity={0.7}>
        <Image
          source={getImageSource('back-50.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Review Cart</Text>
      </View>
      <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton} activeOpacity={0.7}>
        <Image
          source={getImageSource('ProfileIcon.png')}
          style={styles.profileIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: HeaderConstants.spacing.containerPaddingHorizontal,
    paddingVertical: HeaderConstants.spacing.containerPaddingVertical,
    backgroundColor: HeaderConstants.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: HeaderConstants.colors.border,
  },
  backButton: {
    padding: HeaderConstants.spacing.buttonPadding,
    marginLeft: HeaderConstants.spacing.buttonMarginLeft,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: HeaderConstants.typography.titleFontSize,
    fontWeight: HeaderConstants.typography.titleFontWeight,
    color: HeaderConstants.colors.text,
  },
  profileButton: {
    padding: HeaderConstants.spacing.buttonPadding,
    marginRight: HeaderConstants.spacing.buttonMarginRight,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 20,
    height: 20,
  },
});

CartHeader.displayName = 'CartHeader';

export default CartHeader;


import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { AuthController } from '../controllers/AuthController';
import ProductHeader from '../../product/components/ProductHeader';
import { Address } from '../../../types';
import { LocationController } from '../../location/controllers/LocationController';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const selectedAddress = useAppSelector((state) => state.cart.selectedAddress);
  const fromCart = route.params?.fromCart || false;

  const addresses: Address[] = useMemo(
    () => [
      {
        id: '1',
        name: 'Home',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 9876543210',
        isDefault: true,
        isServiceable: true,
      },
      {
        id: '2',
        name: 'Office',
        addressLine1: '456 Business Park',
        addressLine2: 'Floor 5',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400070',
        phone: '+91 9876543211',
        isDefault: false,
        isServiceable: true,
      },
      {
        id: '3',
        name: 'Mom\'s Place',
        addressLine1: 'Plot no.10, Khasra no.873, Rawli Mehd',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400052',
        phone: '+91 9876543212',
        isDefault: false,
        isServiceable: false,
      },
    ],
    []
  );

  const handleSelectAddress = useCallback(
    async (address: Address) => {
      await LocationController.setLocation(address, dispatch);
      if (fromCart) {
        navigation.navigate('ReviewCart');
      }
    },
    [dispatch, navigation, fromCart]
  );

  const handleToggleLogin = useCallback(
    async (value: boolean) => {
      try {
        await AuthController.toggleLogin(value, dispatch);
      } catch (error) {
        console.error('Toggle login failed:', error);
      }
    },
    [dispatch]
  );

  return (
    <View style={styles.container}>
      <ProductHeader
        navigation={navigation}
        title="Profile"
        showProfileIcon={false}
        showShareIcon={false}
      />
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Login Status</Text>
            <Switch
              value={isAuthenticated}
              onValueChange={handleToggleLogin}
              trackColor={{ false: '#E5E5E5', true: '#55913D' }}
              thumbColor={isAuthenticated ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#E5E5E5"
            />
          </View>
          <Text style={styles.toggleDescription}>
            {isAuthenticated
              ? 'You are currently logged in'
              : 'You are currently logged out'}
          </Text>
        </View>

        {isAuthenticated && user && (
          <View style={styles.userInfoSection}>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Name:</Text>
              <Text style={styles.userInfoValue}>{user.name}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Email:</Text>
              <Text style={styles.userInfoValue}>{user.email}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Phone:</Text>
              <Text style={styles.userInfoValue}>{user.phone}</Text>
            </View>
          </View>
        )}

        {isAuthenticated && (
          <View style={styles.addressesSection}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            {addresses.map((address, index) => {
              const isSelected = selectedAddress?.id === address.id;
              return (
                <AnimatedAddressCard
                  key={address.id}
                  address={address}
                  isSelected={isSelected}
                  onPress={() => handleSelectAddress(address)}
                  delay={index * 100}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

interface AnimatedAddressCardProps {
  address: Address;
  isSelected: boolean;
  onPress: () => void;
  delay: number;
}

const AnimatedAddressCard: React.FC<AnimatedAddressCardProps> = ({ address, isSelected, onPress, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.addressCard,
        isSelected && styles.addressCardSelected,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressName}>{address.name}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>✓ Selected</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText}>
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </Text>
        <Text style={styles.addressText}>
          {address.city}, {address.state} - {address.pincode}
        </Text>
        <Text style={styles.addressPhone}>{address.phone}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  userInfoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  addressesSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  addressCardSelected: {
    borderColor: '#55913D',
    borderWidth: 2,
    backgroundColor: '#F5F9F3',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF9800',
  },
  selectedBadge: {
    backgroundColor: '#55913D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  selectedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 20,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
});

export default ProfileScreen;


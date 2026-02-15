import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Share, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { HeaderConstants } from '../constants/headerConstants';
import { getImageSource } from '../../../utils/imageAssets';

interface Props {
  navigation: StackNavigationProp<RootStackParamList>;
  title: string;
  onShare?: () => void;
  shareMessage?: string;
  showProfileIcon?: boolean;
  showShareIcon?: boolean;
}

const ProductHeader: React.FC<Props> = React.memo(({ navigation, title, onShare, shareMessage, showProfileIcon = true, showShareIcon = true }) => {
  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }

    if (shareMessage) {
      try {
        const result = await Share.share({
          message: shareMessage,
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
          } else {
          }
        } else if (result.action === Share.dismissedAction) {
        }
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
        <Image
          source={getImageSource('back-50.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
      <View style={styles.rightButtons}>
        {showShareIcon && (
          <TouchableOpacity onPress={handleShare} style={styles.shareButton} activeOpacity={0.7}>
            <Image
              source={getImageSource('share-30.png')}
              style={styles.shareIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        {showProfileIcon && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileButton}
            activeOpacity={0.7}
          >
            <Image
              source={getImageSource('ProfileIcon.png')}
              style={styles.profileIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
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
    width: 18,
    height: 18,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: HeaderConstants.spacing.titleMarginHorizontal,
    justifyContent: 'center',
  },
  title: {
    fontSize: HeaderConstants.typography.titleFontSize,
    fontWeight: HeaderConstants.typography.titleFontWeight,
    color: HeaderConstants.colors.text,
    textAlign: 'left',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    paddingVertical: HeaderConstants.spacing.buttonPadding,
    marginRight: 8,
  },
  shareIcon: {
    width: 18,
    height: 18,
  },
  profileButton: {
    padding: HeaderConstants.spacing.buttonPadding,
    marginRight: HeaderConstants.spacing.buttonMarginRight,
    backgroundColor:'white'
  },
  profileIcon: {
    width: 20,
    height: 20,
  },
});

ProductHeader.displayName = 'ProductHeader';

export default ProductHeader;

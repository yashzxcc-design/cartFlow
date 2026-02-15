const imageAssets: { [key: string]: any } = {
  'CadburyProduct.png': require('../data/static/images/CadburyProduct.png'),
  'AssamTeaProduct.png': require('../data/static/images/AssamTeaProduct.png'),
  'AppleProduct.png': require('../data/static/images/AppleProduct.png'),
  'PremiumCoffeeProduct.png': require('../data/static/images/PremiumCoffeeProduct.png'),
  'MilkProduct.png': require('../data/static/images/MilkProduct.png'),
  'back-50.png': require('../data/static/images/back-50.png'),
  'share-30.png': require('../data/static/images/share-30.png'),
  'BannerBackground.png': require('../data/static/images/BannerBackground.png'),
  'TopCouponsForyou.png': require('../data/static/images/TopCouponsForyou.png'),
  '🎉.png': require('../data/static/images/🎉.png'),
  'ProfileIcon.png': require('../data/static/images/ProfileIcon.png'),
};

const availableImages = ['CadburyProduct.png', 'AssamTeaProduct.png', 'AppleProduct.png', 'PremiumCoffeeProduct.png', 'MilkProduct.png'];

export const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  return availableImages[randomIndex];
};

export const getImageSource = (imagePath: string) => {
  const imageName = imagePath.split('/').pop() || imagePath;
  
  if (imageAssets[imageName]) {
    return imageAssets[imageName];
  }
  
  return { uri: imagePath };
};

export default imageAssets;


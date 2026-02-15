# CartFlow - E-Commerce Shopping Cart Application

A React Native e-commerce application built with TypeScript, featuring a complete shopping cart experience with product browsing, cart management, coupon application, and checkout flow.

## Table of Contents

- [Features](#features)
- [Detailed Functionality](#detailed-functionality)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Key Technologies](#key-technologies)
- [State Management](#state-management)
- [Navigation](#navigation)
- [Development Workflow](#development-workflow)

## Features

- **Product Browsing**: View product details with images, options, and pricing
- **Shopping Cart**: Add, remove, and update quantities of products
- **Product Options**: Support for products with multiple variants (size, weight, etc.)
- **Coupon System**: Apply and manage discount coupons
- **Address Management**: Save and select delivery addresses
- **Serviceability Check**: Validate if delivery is available for selected addresses
- **Order Summary**: Detailed breakdown of cart items, delivery fees, discounts, and total
- **Cashback System**: Calculate and display cashback rewards
- **User Authentication**: Login/logout toggle functionality
- **Dynamic Configuration**: JSON-based configuration for UI text and behavior
- **Animations**: Smooth transitions and layout animations throughout the app

## Detailed Functionality

### Product Detail Screen

The Product Detail Screen provides a comprehensive product viewing experience:

#### Core Features
- **Product Image Carousel**: 
  - Horizontal scrollable image carousel with pagination indicators
  - Supports multiple product images
  - Auto-duplicates single images for carousel effect
  - Discount badges overlay on images

- **Product Information**:
  - Product name, brand, and weight
  - Current price with original price strikethrough (if discounted)
  - Tax information display
  - Product description section

- **Product Options Selection**:
  - Products with multiple variants (size, weight, etc.)
  - Options button showing count of available variants
  - ProductOptionsBottomSheet for variant selection:
    - Swipe-to-dismiss functionality with PanResponder
    - Smooth animated slide-up/down transitions
    - Quantity badges on product images
    - Real-time cart quantity updates
    - Add/quantity controls for each variant
    - Confirm button to proceed to cart

- **Add to Cart Functionality**:
  - Direct add to cart for products without options
  - Opens options sheet for products with variants
  - View cart button appears when items are in cart
  - Quantity selector for items already in cart

- **Product Sections** (configurable via JSON):
  - Similar Products section
  - Customers Also Bought section
  - Product Description section

- **Header Features**:
  - Back navigation button
  - Product name title
  - Share functionality (configurable)
  - Profile icon (configurable per screen)

- **Loading State**:
  - Shimmer loading animation while fetching product data
  - Smooth transition to content

#### Navigation
- Navigates to ReviewCart after adding items
- Back button navigation support
- Deep linking support with productId parameter

### Review Cart Screen

A comprehensive cart review and checkout preparation screen:

#### Cart Display
- **Cart Items List**:
  - Individual cart item cards with animations
  - Product image, name, and selected variant
  - Quantity controls (increase/decrease)
  - Item total price
  - Remove item functionality
  - Smooth layout animations on add/remove

- **Empty Cart State**:
  - Custom empty cart message
  - "Start Shopping" button
  - Navigates to ProductDetail screen

#### Savings & Promotions
- **Top Savings Banner**:
  - Displays total savings amount
  - Uses BannerBackground.png (upside down for top banner)
  - Shows item savings + coupon savings combined

- **Warning Banner**:
  - Order delay warnings
  - High demand notifications
  - Customizable icon and text

- **Coupon Savings Banner**:
  - Appears when coupon is applied
  - Shows savings amount from coupon
  - Decorative emoji icons on sides

#### Recommended Products
- **"Did You Forget?" Section**:
  - Displays products not in cart
  - Horizontal scrollable product list
  - Add to cart directly from list
  - Opens options sheet for products with variants
  - Smooth animations when products are added/removed
  - Products automatically removed from list when added to cart

#### Coupons Section
- **Coupon Display**:
  - "Top coupons for you" header with TopCouponsForyou.png image
  - Horizontal scrollable coupon cards
  - Vertical coupon card layout:
    - Circle icon
    - Coupon text/description
    - Save amount display
    - Apply/Applied button
  - Coupon description text below circle
  - Applied state with visual feedback
  - Toast notifications for coupon validation errors

#### Cashback Section
- **Cashback Display**:
  - Center-aligned layout
  - Cashback icon (💰)
  - Dynamic messages based on status:
    - "Yay! You've received a cashback of ₹X"
    - "Add items worth ₹X more to get Y% cashback"
    - "You will get ₹X cashback on this order"
  - Subtexts for each state
  - Automatic calculation based on cart total

#### Order Summary
- **Detailed Breakdown**:
  - Item total with savings badge
  - Delivery fee with free delivery indicator
  - Discount amount (from coupons)
  - Platform fee
  - Dashed line separator
  - Total payable amount (bold, prominent)
  - Free delivery threshold messaging
  - Savings banner at bottom (normal orientation)

#### Delivery Instructions
- Delivery preferences section
- Customizable delivery options

#### Policy Section
- Cancellation policy text
- Configurable policy messages

#### Bottom Bar (CartBottomBar)
The bottom bar adapts based on user state:

- **Not Authenticated State**:
  - Login prompt card
  - "Login to proceed" title
  - "Log in or sign up to proceed with your order" subtitle
  - Login button navigates to Profile screen

- **No Address State**:
  - "Where would you like us to deliver?" prompt
  - Location icon
  - "Add address" button navigates to Profile screen

- **Authenticated with Address**:
  - **Delivery Section** (top):
    - Location icon in circular badge
    - Dynamic delivery time (fetched from API)
    - "Deliver in X-Y minutes" with lightning icon (⚡)
    - Serviceability warning for non-serviceable addresses
    - Address text (truncated with ellipsis)
    - "Change" button to modify address
  
  - **Payment Section** (bottom):
    - "To Pay" label
    - Total payable amount (₹X)
    - "Proceed" button:
      - Disabled state for non-serviceable addresses
      - Visual disabled styling (reduced opacity)
      - Navigates to Checkout screen when enabled

#### Header Features
- Back button (always navigates to ProductDetail)
- "Review Cart" title
- Profile icon (navigates to Profile screen)

#### Device Back Button Handling
- Custom back button handler
- Always navigates to ProductDetail (not previous screen)
- Prevents navigation to Profile screen via device back

### Profile Screen

User profile and address management:

#### Authentication Toggle
- Login/Logout toggle switch
- Visual feedback for authentication status
- "You are currently logged in/out" description
- Mock user creation on login

#### User Information Display
- Name, email, and phone display
- Only visible when authenticated
- Clean card-based layout

#### Address Management
- **Saved Addresses Section**:
  - Only visible when authenticated
  - List of saved addresses with animations
  - Address cards with:
    - Address name (Home, Office, etc.)
    - Full address details
    - Phone number
    - Default badge for default address
    - Selected badge for currently selected address
    - Visual selection state (green border, highlighted background)
  
- **Address Selection**:
  - Tap to select address
  - Automatic serviceability check
  - Delivery time fetching
  - Navigation back to ReviewCart if accessed from cart
  - Smooth animated card transitions

- **Non-Serviceable Address Handling**:
  - Addresses marked with `isServiceable: false`
  - Visual indication in cart bottom bar
  - Disabled proceed button when non-serviceable address selected

#### Header Features
- Back navigation
- "Profile" title
- No share icon
- No profile icon (to avoid circular navigation)

#### Navigation Flow
- Can be accessed from:
  - Cart header profile icon
  - Cart bottom bar login/add address prompts
  - Product detail header (if enabled)
- Returns to ReviewCart if `fromCart` parameter is true

### Product Options Bottom Sheet

Animated bottom sheet for product variant selection:

#### Animation Features
- Smooth slide-up animation on open
- Slide-down animation on close
- Backdrop fade in/out
- Spring animations for natural feel
- PanResponder for swipe-to-dismiss

#### Functionality
- **Product Variants Display**:
  - Scrollable list of all product options
  - Product image for each variant
  - Quantity badge overlay on images (when in cart)
  - Variant name/weight display
  - Current price display
  - Original price strikethrough (if discounted)

- **Quantity Management**:
  - Add button for items not in cart
  - Quantity selector for items in cart
  - Real-time cart updates
  - Visual feedback on quantity changes

- **Interaction**:
  - Swipe down to dismiss
  - Tap backdrop to close
  - Drag handle for visual feedback
  - Confirm button to proceed to cart

#### Visual Design
- Rounded top corners (32px radius)
- Drag handle indicator
- Product name header
- Scrollable content area
- Fixed confirm button at bottom

### Checkout Screen

Order confirmation and payment success:

#### Payment Success Display
- Large checkmark icon in green circle
- "Payment Successful!" title
- Order confirmation message
- "Continue shopping" button

#### Cart Management
- Automatically clears cart on successful payment
- Resets navigation to ProductDetail screen
- Clean state for new shopping session

### Animations

The app includes smooth animations throughout:

#### Layout Animations
- **List Item Animations**:
  - Smooth add/remove animations in cart
  - Recommended products fade out when added
  - LayoutAnimation for list updates
  - Platform-specific animation presets

#### Component Animations
- **Product Cards**:
  - Fade-in animation on mount
  - Scale animation for smooth appearance

- **Cart Item Cards**:
  - Fade-in animation
  - Slide-in animation from bottom

- **Address Cards**:
  - Staggered fade-in animations
  - Slide-up animations
  - Scale animations for depth

- **Coupon Cards**:
  - Smooth appearance animations

#### Bottom Sheet Animations
- Spring-based slide animations
- Backdrop opacity transitions
- Pan gesture animations

### Configuration System

The app uses JSON configuration files for dynamic content:

#### productDetailConfig.json
- **Section Configuration**:
  - Section types and ordering
  - Section visibility flags
  - Section titles

- **Text Templates**:
  - Share message template with placeholders
  - Button text templates
  - Section title templates

- **Feature Flags**:
  - Enable/disable share functionality
  - Enable/disable profile icon
  - Default product ID

#### reviewCartConfig.json
- **Section Enablement**:
  - Empty cart configuration
  - Savings banner settings
  - Warning banner configuration
  - Recommended products section
  - Coupons section
  - Cashback section
  - Delivery instructions
  - Order summary
  - Policy section

- **Text Templates**:
  - All banner messages with placeholders
  - Cashback messages for different states
  - Bottom bar text configurations
  - Delivery time templates

- **Animation Settings**:
  - Enable/disable animations
  - Toast duration settings

### Navigation Flows

#### Main Flow
```
ProductDetail → ReviewCart → Checkout
```

#### Profile Access
```
ProductDetail → Profile
ReviewCart → Profile → ReviewCart (after address selection)
```

#### Options Selection
```
ProductDetail → ProductOptionsBottomSheet → ReviewCart
```

#### Cart Management
```
ProductDetail → (Add to Cart) → ReviewCart
ReviewCart → (Remove Item) → ReviewCart (updated)
ReviewCart → (Add Recommended) → ReviewCart (updated)
```

### Component Library

#### CustomButton
- Multiple variants: default, compact, large, fullWidth
- Quantity selector mode
- Button mode with text
- Arrow indicator support
- Custom styling support

#### QuantitySelector
- Increase/decrease buttons
- Quantity display
- Compact and default variants
- Border styling

#### Toast
- Error/success notifications
- Auto-dismiss functionality
- Customizable duration

#### ProductCard
- Product image with discount badge
- Brand, name, weight display
- Price with original price strikethrough
- Add button or quantity selector
- Options button for products with variants
- Fade and scale animations

#### CartItemCard
- Product image
- Product name and variant
- Quantity controls
- Item total price
- Remove functionality
- Fade and slide animations

#### CouponCard
- Vertical layout
- Circle icon
- Coupon text and description
- Save amount display
- Apply/Applied button states
- Centered button alignment

### State Management Features

#### Cart State
- Persistent cart storage
- Automatic summary calculation
- Coupon application
- Address selection
- Delivery time tracking
- Serviceability status

#### Auth State
- Persistent authentication
- User data management
- Token storage

#### Product State
- Product caching
- Similar products management
- Product list management

#### Location State
- Current address tracking
- Serviceability status
- Location-based features

### API Integration

#### Mock API Service
- Product fetching with delay simulation
- Similar products retrieval
- Coupon validation
- Address serviceability checking
- Delivery time calculation
- User authentication simulation

### Image Assets

The app uses a centralized image asset system:
- Product images
- Icons (back, share, profile)
- Banner backgrounds
- Decorative images (🎉.png)
- Header images (TopCouponsForyou.png)

All images are managed through `imageAssets.ts` utility.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 22.11.0
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Java Development Kit (JDK)** 17 or higher
- **CocoaPods** (for iOS, install via `sudo gem install cocoapods`)

### Environment Setup

Follow the official React Native [Environment Setup Guide](https://reactnative.dev/docs/environment-setup) for detailed platform-specific instructions.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cartFlow
```

### 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. iOS Setup (macOS only)

Navigate to the iOS directory and install CocoaPods dependencies:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 4. Start Metro Bundler

In the project root directory, start the Metro bundler:

```bash
npm start
```

or

```bash
yarn start
```

### 5. Run the Application

#### Android

Open a new terminal and run:

```bash
npm run android
```

or

```bash
yarn android
```

#### iOS (macOS only)

```bash
npm run ios
```

or

```bash
yarn ios
```

### 6. Development Commands

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Architecture

CartFlow follows a **feature-based architecture** with clear separation of concerns, making the codebase maintainable and scalable.

### Architecture Principles

1. **Feature-Based Organization**: Code is organized by features (cart, product, auth, etc.) rather than by file type
2. **Separation of Concerns**: Business logic is separated from UI components
3. **Controller Pattern**: Controllers handle business logic and API interactions
4. **Custom Hooks**: Reusable logic is extracted into custom hooks
5. **Centralized State**: Redux Toolkit manages global application state
6. **Type Safety**: Full TypeScript support throughout the application

### Architecture Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Screens, Components, Navigation)  │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│          Business Logic Layer       │
│     (Controllers, Custom Hooks)      │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│          State Management           │
│        (Redux Toolkit Slices)      │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│          Service Layer               │
│    (API Services, Storage Service)   │
└─────────────────────────────────────┘
```

## Project Structure

```
cartFlow/
├── src/
│   ├── components/              # Shared reusable components
│   │   ├── CustomButton.tsx
│   │   ├── QuantitySelector.tsx
│   │   └── Toast.tsx
│   │
│   ├── features/                # Feature-based modules
│   │   ├── auth/                # Authentication feature
│   │   │   ├── controllers/    # Business logic
│   │   │   ├── screens/         # Screen components
│   │   │   ├── models/          # Data models
│   │   │   └── types/           # TypeScript types
│   │   │
│   │   ├── cart/                # Shopping cart feature
│   │   │   ├── components/      # Feature-specific components
│   │   │   ├── controllers/    # Cart business logic
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── screens/         # Cart screens
│   │   │   ├── constants/       # Feature constants
│   │   │   └── types/           # TypeScript types
│   │   │
│   │   ├── product/             # Product feature
│   │   │   ├── components/      # Product components
│   │   │   ├── controllers/     # Product business logic
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── screens/         # Product screens
│   │   │   └── constants/       # Feature constants
│   │   │
│   │   ├── checkout/             # Checkout feature
│   │   └── location/             # Location/Address feature
│   │
│   ├── navigation/              # Navigation configuration
│   │   └── AppNavigator.tsx
│   │
│   ├── store/                   # Redux store configuration
│   │   ├── index.ts            # Store setup
│   │   └── slices/             # Redux slices
│   │       ├── authSlice.ts
│   │       ├── cartSlice.ts
│   │       ├── locationSlice.ts
│   │       └── productSlice.ts
│   │
│   ├── services/                # External services
│   │   ├── api/                 # API services
│   │   │   └── mockApi.ts      # Mock API implementation
│   │   └── storage/             # Storage services
│   │       └── storage.ts       # AsyncStorage wrapper
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── navigation.ts
│   │   └── productDetail.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── constants.ts
│   │   ├── hooks.ts
│   │   └── imageAssets.ts
│   │
│   └── data/                    # Static data and configuration
│       └── static/
│           ├── products.json
│           ├── coupons.json
│           ├── addresses.json
│           ├── productDetailConfig.json
│           ├── reviewCartConfig.json
│           └── images/
│
├── android/                     # Android native code
├── ios/                         # iOS native code
├── App.tsx                      # Root component
├── index.js                     # Entry point
├── package.json
└── tsconfig.json
```

### Feature Module Structure

Each feature module follows a consistent structure:

```
feature/
├── components/      # Feature-specific UI components
├── controllers/     # Business logic and API interactions
├── hooks/           # Custom React hooks
├── screens/         # Screen components
├── models/          # Data models (if needed)
├── constants/       # Feature-specific constants
├── types/           # TypeScript type definitions
└── index.ts         # Public API exports
```

## Key Technologies

### Core Framework
- **React Native** 0.84.0 - Mobile app framework
- **React** 19.2.3 - UI library
- **TypeScript** 5.8.3 - Type safety

### State Management
- **Redux Toolkit** 2.11.2 - State management
- **React Redux** 9.2.0 - React bindings for Redux

### Navigation
- **React Navigation** 7.x - Navigation library
  - `@react-navigation/native` - Core navigation
  - `@react-navigation/stack` - Stack navigator

### Storage
- **AsyncStorage** 2.2.0 - Persistent storage

### Development Tools
- **ESLint** - Code linting
- **Jest** - Testing framework
- **TypeScript** - Type checking

## State Management

The application uses **Redux Toolkit** for centralized state management. The state is divided into four main slices:

### 1. Cart Slice (`cartSlice.ts`)
Manages shopping cart state:
- Cart items
- Applied coupons
- Selected address
- Delivery options
- Order summary
- Delivery time

**Key Actions:**
- `addToCart` - Add item to cart
- `removeFromCart` - Remove item from cart
- `updateQuantity` - Update item quantity
- `applyCoupon` - Apply discount coupon
- `setSelectedAddress` - Set delivery address
- `clearCart` - Clear entire cart

### 2. Auth Slice (`authSlice.ts`)
Manages authentication state:
- User authentication status
- User information
- Auth token

**Key Actions:**
- `setUser` - Set user data
- `setToken` - Set auth token
- `logout` - Clear auth data

### 3. Product Slice (`productSlice.ts`)
Manages product-related state:
- Selected product
- Similar products
- All products list

**Key Actions:**
- `setSelectedProduct` - Set current product
- `setSimilarProducts` - Set similar products
- `setProducts` - Set products list

### 4. Location Slice (`locationSlice.ts`)
Manages location and address state:
- Current location
- Serviceability status

**Key Actions:**
- `setCurrentLocation` - Set current address
- `setServiceability` - Set serviceability status

### State Persistence

Cart and authentication state are persisted using AsyncStorage:
- Cart state is saved after every modification
- Auth state is loaded on app initialization
- State is automatically restored when the app restarts

## Navigation

The app uses **React Navigation Stack Navigator** with the following screens:

1. **ProductDetail** - Product details and options
2. **ReviewCart** - Shopping cart review
3. **Profile** - User profile and address management
4. **Checkout** - Payment and order confirmation
5. **Login** - User authentication (if needed)
6. **AddressSelection** - Address selection screen

### Navigation Flow

```
ProductDetail → ReviewCart → Checkout
     ↓              ↓
  Profile    AddressSelection
```

## Controllers Pattern

Controllers encapsulate business logic and API interactions:

### CartController
- `initializeCart()` - Load cart from storage
- `addItemToCart()` - Add item with persistence
- `removeItemFromCart()` - Remove item with persistence
- `updateItemQuantity()` - Update quantity with persistence
- `applyCouponToCart()` - Validate and apply coupon
- `setAddress()` - Set delivery address and fetch delivery time

### ReviewCartController
- `loadReviewCartData()` - Load coupons and recommended products
- `validateAndApplyCoupon()` - Validate coupon eligibility
- `calculateItemSavings()` - Calculate savings from discounts
- `calculateCashback()` - Calculate cashback amount
- `checkFreeDelivery()` - Check free delivery eligibility

### ProductController
- `loadProduct()` - Fetch product details
- `loadSimilarProducts()` - Fetch similar products

### AuthController
- `initializeAuth()` - Load auth state from storage
- `login()` - Authenticate user
- `toggleLogin()` - Toggle login status (for demo)

### LocationController
- `setLocation()` - Set location and check serviceability
- `checkServiceability()` - Validate address serviceability

## Custom Hooks

### useReviewCart
Manages review cart screen logic:
- Loads coupons and recommended products
- Handles coupon application
- Calculates savings and cashback
- Manages animations for list updates

### useProductDetail
Manages product detail screen logic:
- Loads product data
- Checks if product is in cart
- Handles adding products to cart

## Configuration Files

The app uses JSON configuration files for dynamic content:

### productDetailConfig.json
- Section visibility and ordering
- Button text templates
- Share message templates
- Feature flags

### reviewCartConfig.json
- Section enablement flags
- Text templates for banners and messages
- Bottom bar configurations
- Animation settings

## Development Workflow

### Adding a New Feature

1. Create feature directory under `src/features/`
2. Add feature structure (components, controllers, screens, etc.)
3. Create Redux slice if needed
4. Add navigation route in `AppNavigator.tsx`
5. Update types in `src/types/`

### Adding a New Component

1. Create component file in appropriate location
2. Use TypeScript for type safety
3. Follow existing component patterns
4. Export from feature's `index.ts` if needed

### State Management Best Practices

1. Use Redux Toolkit slices for state
2. Keep state normalized
3. Use controllers for complex business logic
4. Persist important state to AsyncStorage
5. Use custom hooks for reusable state logic

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Keep components small and focused
- Extract reusable logic into hooks or controllers
- Use functional components with hooks

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear Metro cache
npm start -- --reset-cache
```

### Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

### iOS Build Issues
```bash
# Clean iOS build
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
```

### Node Modules Issues
```bash
# Clean install
rm -rf node_modules
npm install
```

## License

This project is private and proprietary.

## Support

For issues and questions, please contact the development team.

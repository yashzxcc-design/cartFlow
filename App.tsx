import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { CartController } from './src/features/cart/controllers/CartController';
import { AuthController } from './src/features/auth/controllers/AuthController';
import { LocationController } from './src/features/location/controllers/LocationController';

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    CartController.initializeCart(dispatch);
    AuthController.initializeAuth(dispatch);
    LocationController.initializeLocation(dispatch);
  }, [dispatch]);

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;

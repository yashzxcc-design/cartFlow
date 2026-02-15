import { AppDispatch, RootState } from '../../../store';
import { Address } from '../../../types';
import {
  setCurrentLocation,
  setLocationEnabled,
  setServiceability,
  loadLocation,
} from '../../../store/slices/locationSlice';
import { setSelectedAddress, setDeliveryTime } from '../../../store/slices/cartSlice';
import { MockApiService } from '../../../services/api/mockApi';
import { StorageService, StorageKeys } from '../../../services/storage/storage';
import { LocationState } from '../../../types';

export class LocationController {
  static async initializeLocation(dispatch: AppDispatch): Promise<void> {
    const savedAddress = await StorageService.getObject<Address>(
      StorageKeys.SELECTED_ADDRESS
    );
    const isLocationEnabled = await StorageService.getObject<boolean>(
      StorageKeys.LOCATION_ENABLED
    );

    if (savedAddress || isLocationEnabled !== null) {
      const locationState: LocationState = {
        currentLocation: savedAddress || undefined,
        isLocationEnabled: isLocationEnabled ?? false,
        isServiceable: savedAddress?.isServiceable ?? false,
      };
      dispatch(loadLocation(locationState));
    }
  }

  static async setLocation(
    address: Address,
    dispatch: AppDispatch
  ): Promise<void> {
    const isServiceable = await MockApiService.checkLocationServiceability(
      address
    );
    const deliveryTime = await MockApiService.getDeliveryTime(address);
    dispatch(setCurrentLocation(address));
    dispatch(setServiceability(isServiceable));
    dispatch(setSelectedAddress(address));
    dispatch(setDeliveryTime(deliveryTime));
  }

  static enableLocation(
    enabled: boolean,
    dispatch: AppDispatch
  ): void {
    dispatch(setLocationEnabled(enabled));
  }

  static getCurrentLocation(state: RootState): Address | undefined {
    return state.location.currentLocation;
  }

  static isLocationEnabled(state: RootState): boolean {
    return state.location.isLocationEnabled;
  }

  static isServiceable(state: RootState): boolean {
    return state.location.isServiceable;
  }
}


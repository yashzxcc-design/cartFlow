import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationState, Address } from '../../types';
import { StorageService, StorageKeys } from '../../services/storage/storage';

const initialState: LocationState = {
  isLocationEnabled: false,
  isServiceable: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Address>) => {
      state.currentLocation = action.payload;
      state.isServiceable = action.payload.isServiceable ?? false;
      StorageService.saveObject(StorageKeys.SELECTED_ADDRESS, action.payload);
    },
    setLocationEnabled: (state, action: PayloadAction<boolean>) => {
      state.isLocationEnabled = action.payload;
      StorageService.saveObject(StorageKeys.LOCATION_ENABLED, action.payload);
    },
    setServiceability: (state, action: PayloadAction<boolean>) => {
      state.isServiceable = action.payload;
    },
    loadLocation: (state, action: PayloadAction<LocationState>) => {
      return action.payload;
    },
  },
});

export const {
  setCurrentLocation,
  setLocationEnabled,
  setServiceability,
  loadLocation,
} = locationSlice.actions;

export default locationSlice.reducer;


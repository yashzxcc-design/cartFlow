import { Address } from '../../../types';

export class LocationModel {
  static formatAddress(address: Address): string {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);

    return parts.join(', ');
  }

  static validateAddress(address: Address): boolean {
    return !!(
      address.addressLine1 &&
      address.city &&
      address.state &&
      address.pincode &&
      address.phone
    );
  }

  static validatePincode(pincode: string): boolean {
    return /^\d{6}$/.test(pincode);
  }
}


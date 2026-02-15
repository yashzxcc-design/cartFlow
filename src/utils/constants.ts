export const DELIVERY_OPTIONS = {
  DOOR: {
    type: 'door' as const,
    label: 'Door delivery',
    fee: 0,
  },
  INSTANT: {
    type: 'instant' as const,
    label: 'Instant delivery',
    estimatedTime: '30-40 mins',
    fee: 20,
  },
};

export const PLATFORM_FEE = 10;
export const FONT_FAMILY = 'Plus Jakarta Sans';


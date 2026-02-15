import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderSummary as OrderSummaryType } from '../../../types';

const DashedLine: React.FC = () => {
  const dashCount = 50;
  return (
    <View style={styles.dashedLineContainer}>
      {Array.from({ length: dashCount }).map((_, index) => (
        <View key={index} style={styles.dash} />
      ))}
    </View>
  );
};

interface Props {
  summary: OrderSummaryType;
  itemTotalSavings?: number;
  freeDeliveryThreshold?: number;
}

const OrderSummary: React.FC<Props> = React.memo(({ summary, itemTotalSavings = 0, freeDeliveryThreshold = 0 }) => {
  const needsMoreForFreeDelivery = freeDeliveryThreshold > 0 && summary.itemTotal < freeDeliveryThreshold;
  const remainingForFreeDelivery = freeDeliveryThreshold - summary.itemTotal;
  const originalDeliveryFee = 40;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>₹</Text>
          </View>
          <View style={styles.labelContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Item total</Text>
              {itemTotalSavings > 0 && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsBadgeText}>Saved ₹{itemTotalSavings}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <Text style={styles.value}>₹{summary.itemTotal}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🛵</Text>
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Delivery fee</Text>
            {needsMoreForFreeDelivery && (
              <Text style={styles.deliveryInfoText}>
                Add items worth ₹{remainingForFreeDelivery} to get free delivery
              </Text>
            )}
          </View>
        </View>
        <View style={styles.valueContainer}>
          {summary.deliveryFee === 0 ? (
            <>
              <Text style={styles.strikethroughValue}>₹{originalDeliveryFee}</Text>
              <Text style={styles.freeText}>FREE</Text>
            </>
          ) : (
            <Text style={styles.value}>₹{summary.deliveryFee}</Text>
          )}
        </View>
      </View>

      {summary.discount > 0 && (
        <>
          <View style={styles.row}>
            <View style={styles.leftSection}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>%</Text>
              </View>
              <Text style={styles.label}>Discount</Text>
            </View>
            <Text style={styles.value}>-₹{summary.discount}</Text>
          </View>

        </>
      )}

      <View style={styles.row}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🏷️</Text>
          </View>
          <Text style={styles.label}>Platform fee</Text>
        </View>
        <Text style={styles.value}>₹{summary.platformFee}</Text>
      </View>

      <DashedLine />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total payable amount</Text>
        <Text style={styles.totalValue}>₹{summary.totalPayable}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  labelContainer: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '400',
  },
  savingsBadge: {
    backgroundColor: '#FFEADB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  savingsBadgeText: {
    fontSize: 11,
    color: '#FF8024',
    fontWeight: '600',
  },
  deliveryInfoText: {
    fontSize: 12,
    color: '#FF8024',
    marginTop: 4,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  strikethroughValue: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  freeText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '700',
  },
  dashedLineContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
    flexWrap: 'wrap',
  },
  dash: {
    width: 6,
    height: 1,
    backgroundColor: '#D3D3D3',
    marginRight: 3,
    marginBottom: 0,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
});

OrderSummary.displayName = 'OrderSummary';

export default OrderSummary;


import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Badge } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { DashboardStackParamList } from '../../navigation/BuyerTabNavigator';
import { mockPOs } from '../../services/mockData';
import { PO } from '../../types';
import { formatCurrency } from '../../theme';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Orders'>;

export default function OrdersScreen({ navigation }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'in_production': return 'warning';
      default: return 'default';
    }
  };

  const renderOrder = ({ item }: { item: PO }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.status === 'shipped' || item.status === 'delivered') {
          navigation.navigate('ShipmentTracking', { poId: item.id });
        } else {
          navigation.navigate('PurchaseOrder', { poId: item.id });
        }
      }}
    >
      <Card containerStyle={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.supplier}>{item.supplierName}</Text>
          </View>
          <Badge
            value={item.status.replace('_', ' ').toUpperCase()}
            status={getStatusColor(item.status) as any}
          />
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Icon name="package" size={16} color="#64748b" />
            <Text style={styles.detailText}>
              {item.items.length} item(s)
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.deliveryWindow}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="globe" size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.incoterm}</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(item.totalAmount, item.currency)}
          </Text>
        </View>

        {item.status === 'shipped' && (
          <View style={styles.trackingBanner}>
            <Icon name="truck" size={18} color="#2563eb" />
            <Text style={styles.trackingText}>Track Shipment</Text>
            <Icon name="chevron-right" size={18} color="#2563eb" />
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockPOs}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    padding: 8,
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  supplier: {
    fontSize: 15,
    color: '#64748b',
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
  },
  trackingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  trackingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
  },
});

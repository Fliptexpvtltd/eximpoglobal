import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Badge } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';
import { mockPOs } from '../../services/mockData';
import { PO } from '../../types';
import { formatCurrency } from '../../theme';

export default function SellerOrdersScreen() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'in_production': return 'warning';
      default: return 'default';
    }
  };

  const renderOrder = ({ item }: { item: PO }) => (
    <TouchableOpacity>
      <Card containerStyle={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.buyerName}>Buyer ID: {item.buyerId}</Text>
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
            <Text style={styles.detailText}>
              Delivery: {item.deliveryWindow}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="credit-card" size={16} color="#64748b" />
            <Text style={styles.detailText}>
              Payment: {item.paymentMethod.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(item.totalAmount, item.currency)}
            </Text>
          </View>
          
          {item.status === 'in_production' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>Update Status</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {item.depositPercent > 0 && (
          <View style={styles.paymentInfo}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Deposit Received:</Text>
              <Text style={styles.paymentValue}>
                ${item.depositAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Balance Due:</Text>
              <Text style={styles.paymentValue}>
                ${item.balanceAmount.toLocaleString()}
              </Text>
            </View>
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        }
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
  buyerName: {
    fontSize: 14,
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
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
  },
  actionButtons: {
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
  },
  paymentInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
});

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Divider } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { DashboardStackParamList } from '../../navigation/BuyerTabNavigator';
import { mockPOs } from '../../services/mockData';

type Props = NativeStackScreenProps<DashboardStackParamList, 'PurchaseOrder'>;

export default function PurchaseOrderScreen({ route, navigation }: Props) {
  const { poId } = route.params || {};
  const po = poId ? mockPOs.find(p => p.id === poId) : null;

  if (!po) {
    return (
      <ScrollView style={styles.container}>
        <Text h4 style={styles.header}>Create New Purchase Order</Text>
        <Text style={styles.subtitle}>Configure your purchase order details</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.statusCard}>
        <Text h4>PO #{po.id}</Text>
        <Text style={styles.status}>{po.status.replace('_', ' ').toUpperCase()}</Text>
      </Card>

      <Card containerStyle={styles.card}>
        <Text h4 style={styles.sectionTitle}>Supplier Information</Text>
        <View style={styles.infoRow}>
          <Icon name="briefcase" size={20} color="#2563eb" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Supplier</Text>
            <Text style={styles.value}>{po.supplierName}</Text>
          </View>
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <Text h4 style={styles.sectionTitle}>Order Items</Text>
        {po.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemName}>{item.productName}</Text>
            <View style={styles.itemDetails}>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              <Text style={styles.itemPrice}>${item.unitPrice.toFixed(2)}/unit</Text>
              <Text style={styles.itemTotal}>${item.total.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card containerStyle={styles.card}>
        <Text h4 style={styles.sectionTitle}>Payment Terms</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.label}>Method:</Text>
          <Text style={styles.value}>{po.paymentMethod.toUpperCase()}</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.paymentRow}>
          <Text style={styles.label}>Deposit ({po.depositPercent}%):</Text>
          <Text style={styles.value}>${po.depositAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.label}>Balance:</Text>
          <Text style={styles.value}>${po.balanceAmount.toLocaleString()}</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.paymentRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>${po.totalAmount.toLocaleString()}</Text>
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <Text h4 style={styles.sectionTitle}>Shipping Details</Text>
        <View style={styles.infoRow}>
          <Icon name="package" size={18} color="#64748b" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Incoterm</Text>
            <Text style={styles.value}>{po.incoterm}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Icon name="calendar" size={18} color="#64748b" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Delivery Window</Text>
            <Text style={styles.value}>{po.deliveryWindow}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        {po.status === 'shipped' && (
          <Button
            title="Track Shipment"
            onPress={() => navigation.navigate('ShipmentTracking', { poId: po.id })}
            icon={<Icon name="truck" size={20} color="#fff" style={{ marginRight: 8 }} />}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
  },
  subtitle: {
    paddingHorizontal: 20,
    color: '#64748b',
  },
  statusCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#eff6ff',
  },
  status: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  item: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemQty: {
    fontSize: 14,
    color: '#64748b',
  },
  itemPrice: {
    fontSize: 14,
    color: '#64748b',
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
  actions: {
    padding: 16,
    marginBottom: 24,
  },
});

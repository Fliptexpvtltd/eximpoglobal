import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Badge } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../navigation/AppNavigator';
import { mockRFQs, mockPOs } from '../../services/mockData';
import { formatCurrency } from '../../theme';

export default function SellerDashboardScreen() {
  const { user } = useContext(AuthContext);

  const incomingRFQs = mockRFQs.filter(rfq => rfq.status === 'sent');
  const activeOrders = mockPOs.filter(po => 
    po.status === 'in_production' || po.status === 'pending_payment'
  );

  const stats = [
    { label: 'Incoming RFQs', value: incomingRFQs.length, icon: 'inbox', color: '#2563eb' },
    { label: 'Active Orders', value: activeOrders.length, icon: 'package', color: '#10b981' },
    { label: 'Revenue (Month)', value: '₹45K', icon: 'dollar-sign', color: '#f59e0b' },
    { label: 'Quote Win Rate', value: '68%', icon: 'trending-up', color: '#8b5cf6' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text h4>Seller Dashboard</Text>
          <Text h3>{user?.companyName}</Text>
        </View>
        <Badge
          value={user?.role.toUpperCase()}
          badgeStyle={styles.roleBadge}
          textStyle={styles.roleBadgeText}
        />
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <Icon name={stat.icon} size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Card containerStyle={styles.card}>
        <View style={styles.cardHeader}>
          <Text h4>Quick Actions</Text>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="file-text" size={24} color="#2563eb" />
            <Text style={styles.actionText}>View RFQs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="package" size={24} color="#10b981" />
            <Text style={styles.actionText}>Manage Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="dollar-sign" size={24} color="#f59e0b" />
            <Text style={styles.actionText}>Payments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="bar-chart-2" size={24} color="#8b5cf6" />
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <View style={styles.cardHeader}>
          <Text h4>Incoming RFQs</Text>
          <Text style={styles.viewAll}>{incomingRFQs.length} New</Text>
        </View>
        {incomingRFQs.slice(0, 3).map((rfq) => (
          <View key={rfq.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>
                {rfq.products[0]?.productName || 'Product Request'}
              </Text>
              <Text style={styles.listItemSubtitle}>
                Qty: {rfq.products[0]?.quantity} • {rfq.destinationPort}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color="#94a3b8" />
          </View>
        ))}
      </Card>

      <Card containerStyle={styles.card}>
        <View style={styles.cardHeader}>
          <Text h4>Active Orders</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>
        {activeOrders.map((order) => (
          <View key={order.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>Order #{order.id}</Text>
              <Text style={styles.listItemSubtitle}>
                {formatCurrency(order.totalAmount, order.currency)}
              </Text>
            </View>
            <View style={styles.listItemRight}>
              <Badge 
                value={order.status.replace('_', ' ').toUpperCase()}
                status="warning"
              />
              <Icon name="chevron-right" size={20} color="#94a3b8" />
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#10b981',
  },
  roleBadgeText: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    margin: '1%',
    alignItems: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    color: '#2563eb',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#1e293b',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

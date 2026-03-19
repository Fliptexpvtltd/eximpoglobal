import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Badge } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../navigation/AppNavigator';
import { DashboardStackParamList } from '../../navigation/BuyerTabNavigator';
import { mockRFQs, mockPOs } from '../../services/mockData';
import { formatCurrency } from '../../theme';

type Props = NativeStackScreenProps<DashboardStackParamList, 'DashboardHome'>;

export default function BuyerDashboardScreen({ navigation }: Props) {
  const { user } = useContext(AuthContext);

  const activeRFQs = mockRFQs.filter(rfq => rfq.status !== 'draft');
  const recentOrders = mockPOs.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    else if (hour < 18) return 'Good Afternoon';
    else return 'Good Evening';
  };

  const stats = [
    { label: 'Active RFQs', value: activeRFQs.length, icon: 'file-text', color: '#2563eb' },
    { label: 'Orders', value: mockPOs.length, icon: 'package', color: '#10b981' },
    { label: 'In Transit', value: 1, icon: 'truck', color: '#f59e0b' },
    { label: 'Suppliers', value: 5, icon: 'users', color: '#8b5cf6' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quoted': return 'success';
      case 'sent': return 'warning';
      case 'draft': return 'default';
      case 'in_production': return 'primary';
      case 'shipped': return 'success';
      case 'pending_payment': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text h4>{getGreeting()},</Text>
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
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Catalog' as any)}
          >
            <Icon name="search" size={24} color="#2563eb" />
            <Text style={styles.actionText}>Browse Catalog</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Orders')}
          >
            <Icon name="package" size={24} color="#10b981" />
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Messages' as any)}
          >
            <Icon name="message-circle" size={24} color="#f59e0b" />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Analytics' as any)}
          >
            <Icon name="bar-chart-2" size={24} color="#8b5cf6" />
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <View style={styles.cardHeader}>
          <Text h4>Active RFQs</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>
        {activeRFQs.length > 0 ? (
          activeRFQs.map((rfq) => (
            <TouchableOpacity
              key={rfq.id}
              style={styles.listItem}
              onPress={() => navigation.navigate('QuoteComparison', { rfqId: rfq.id })}
            >
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>
                  {rfq.products[0]?.productName || 'Product Request'}
                </Text>
                <Text style={styles.listItemSubtitle}>
                  Qty: {rfq.products[0]?.quantity} • {rfq.incoterm}
                </Text>
              </View>
              <View style={styles.listItemRight}>
                <Badge 
                  value={getStatusText(rfq.status)} 
                  status={getStatusColor(rfq.status) as any}
                />
                <Icon name="chevron-right" size={20} color="#94a3b8" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No active RFQs</Text>
        )}
      </Card>

      <Card containerStyle={styles.card}>
        <View style={styles.cardHeader}>
          <Text h4>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.listItem}
            onPress={() => {
              if (order.status === 'shipped') {
                navigation.navigate('ShipmentTracking', { poId: order.id });
              } else {
                navigation.navigate('PurchaseOrder', { poId: order.id });
              }
            }}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{order.supplierName}</Text>
              <Text style={styles.listItemSubtitle}>
                {formatCurrency(order.totalAmount, order.currency)} • {order.incoterm}
              </Text>
            </View>
            <View style={styles.listItemRight}>
              <Badge 
                value={getStatusText(order.status)} 
                status={getStatusColor(order.status) as any}
              />
              <Icon name="chevron-right" size={20} color="#94a3b8" />
            </View>
          </TouchableOpacity>
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
    backgroundColor: '#2563eb',
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
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
    paddingVertical: 20,
  },
});

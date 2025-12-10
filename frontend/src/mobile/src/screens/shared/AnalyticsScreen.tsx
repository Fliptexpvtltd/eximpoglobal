import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';

export default function AnalyticsScreen() {
  const stats = [
    { label: 'Total Orders', value: '24', change: '+12%', icon: 'shopping-bag', color: '#2563eb' },
    { label: 'Total Spend', value: '$125K', change: '+8%', icon: 'dollar-sign', color: '#10b981' },
    { label: 'Active Suppliers', value: '12', change: '+3', icon: 'users', color: '#f59e0b' },
    { label: 'Avg Order Value', value: '$5.2K', change: '+5%', icon: 'trending-up', color: '#8b5cf6' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text h3>Analytics</Text>
        <Text style={styles.subtitle}>Track your business performance</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <Icon name={stat.icon} size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={[styles.statChange, { color: stat.color }]}>{stat.change}</Text>
          </View>
        ))}
      </View>

      <Card containerStyle={styles.card}>
        <Text h4>Order Trends</Text>
        <View style={styles.chartPlaceholder}>
          <Icon name="bar-chart-2" size={48} color="#cbd5e1" />
          <Text style={styles.placeholderText}>Chart visualization coming soon</Text>
          <Text style={styles.placeholderSubtext}>
            Integrate react-native-chart-kit for detailed analytics
          </Text>
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <Text h4>Top Suppliers</Text>
        <View style={styles.chartPlaceholder}>
          <Icon name="pie-chart" size={48} color="#cbd5e1" />
          <Text style={styles.placeholderText}>Supplier breakdown coming soon</Text>
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <Text h4>Monthly Spending</Text>
        <View style={styles.chartPlaceholder}>
          <Icon name="trending-up" size={48} color="#cbd5e1" />
          <Text style={styles.placeholderText}>Spending trends coming soon</Text>
        </View>
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
    padding: 20,
    backgroundColor: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  statsGrid: {
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
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    textAlign: 'center',
  },
  statChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginTop: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 12,
  },
  placeholderSubtext: {
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

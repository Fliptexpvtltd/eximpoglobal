import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Badge } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { RFQStackParamList } from '../../navigation/SellerTabNavigator';
import { mockRFQs } from '../../services/mockData';
import { RFQ } from '../../types';

type Props = NativeStackScreenProps<RFQStackParamList, 'RFQList'>;

export default function RFQListScreen({ navigation }: Props) {
  const renderRFQ = ({ item }: { item: RFQ }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('QuoteSubmission', { rfqId: item.id })}
    >
      <Card containerStyle={styles.rfqCard}>
        <View style={styles.rfqHeader}>
          <View style={styles.rfqInfo}>
            <Text style={styles.rfqId}>RFQ #{item.id}</Text>
            <Text style={styles.productName}>{item.products[0]?.productName}</Text>
          </View>
          <Badge
            value={item.status.toUpperCase()}
            status={item.status === 'sent' ? 'warning' : 'default'}
          />
        </View>

        <View style={styles.rfqDetails}>
          <View style={styles.detailRow}>
            <Icon name="package" size={16} color="#64748b" />
            <Text style={styles.detailText}>
              Quantity: {item.products[0]?.quantity} units
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="map-pin" size={16} color="#64748b" />
            <Text style={styles.detailText}>
              Destination: {item.destinationPort}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="globe" size={16} color="#64748b" />
            <Text style={styles.detailText}>
              Incoterm: {item.incoterm}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color="#64748b" />
            <Text style={styles.detailText}>
              Deadline: {item.deadline}
            </Text>
          </View>

          {item.targetPrice && (
            <View style={styles.detailRow}>
              <Icon name="dollar-sign" size={16} color="#64748b" />
              <Text style={styles.detailText}>
                Target Price: ${item.targetPrice}
              </Text>
            </View>
          )}
        </View>

        {item.products[0]?.specifications && (
          <View style={styles.specifications}>
            <Text style={styles.specLabel}>Specifications:</Text>
            <Text style={styles.specText}>{item.products[0].specifications}</Text>
          </View>
        )}

        <View style={styles.rfqFooter}>
          <Text style={styles.dateText}>Received: {item.createdAt}</Text>
          <View style={styles.actionButton}>
            <Text style={styles.actionText}>Submit Quote</Text>
            <Icon name="arrow-right" size={16} color="#2563eb" />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockRFQs}
        renderItem={renderRFQ}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No RFQs received yet</Text>
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
  rfqCard: {
    borderRadius: 12,
    marginBottom: 12,
  },
  rfqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  rfqInfo: {
    flex: 1,
  },
  rfqId: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  rfqDetails: {
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
  specifications: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  specText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  rfqFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  dateText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
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

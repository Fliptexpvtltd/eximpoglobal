import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Badge, Divider } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { DashboardStackParamList } from '../../navigation/BuyerTabNavigator';
import { mockRFQs, mockQuotes } from '../../services/mockData';
import { formatCurrency } from '../../theme';

type Props = NativeStackScreenProps<DashboardStackParamList, 'QuoteComparison'>;

export default function QuoteComparisonScreen({ route, navigation }: Props) {
  const { rfqId } = route.params;
  const rfq = mockRFQs.find(r => r.id === rfqId);
  const quotes = mockQuotes.filter(q => q.rfqId === rfqId);

  if (!rfq) {
    return (
      <View style={styles.container}>
        <Text>RFQ not found</Text>
      </View>
    );
  }

  const handleAcceptQuote = (quoteId: string) => {
    navigation.navigate('PurchaseOrder', { quoteId });
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.rfqCard}>
        <Text h4 style={styles.rfqTitle}>RFQ Details</Text>
        <View style={styles.rfqDetail}>
          <Text style={styles.rfqLabel}>Product:</Text>
          <Text style={styles.rfqValue}>{rfq.products[0]?.productName}</Text>
        </View>
        <View style={styles.rfqDetail}>
          <Text style={styles.rfqLabel}>Quantity:</Text>
          <Text style={styles.rfqValue}>{rfq.products[0]?.quantity} units</Text>
        </View>
        <View style={styles.rfqDetail}>
          <Text style={styles.rfqLabel}>Incoterm:</Text>
          <Text style={styles.rfqValue}>{rfq.incoterm}</Text>
        </View>
        <View style={styles.rfqDetail}>
          <Text style={styles.rfqLabel}>Destination:</Text>
          <Text style={styles.rfqValue}>{rfq.destinationPort}</Text>
        </View>
      </Card>

      <View style={styles.header}>
        <Text h4>{quotes.length} Quotes Received</Text>
        <Text style={styles.subtitle}>Compare and select the best offer</Text>
      </View>

      {quotes.map((quote, index) => (
        <Card key={quote.id} containerStyle={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <View>
              <Text h4 style={styles.supplierName}>{quote.supplierName}</Text>
              <View style={styles.rating}>
                <Icon name="star" size={16} color="#f59e0b" solid />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>
            {index === 0 && (
              <Badge value="BEST PRICE" status="success" />
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.quoteDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Unit Price</Text>
                <Text style={styles.detailValue}>
                  ${quote.unitPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Total Cost</Text>
                <Text style={[styles.detailValue, styles.totalCost]}>
                  ${quote.totalCost.toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Lead Time</Text>
                <Text style={styles.detailValue}>{quote.leadTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Valid Until</Text>
                <Text style={styles.detailValue}>{quote.validUntil}</Text>
              </View>
            </View>

            <View style={styles.additionalCosts}>
              <Text style={styles.costLabel}>Freight: ${quote.freightCost}</Text>
              <Text style={styles.costLabel}>Insurance: ${quote.insurance}</Text>
            </View>

            <View style={styles.paymentTerms}>
              <Icon name="credit-card" size={16} color="#64748b" />
              <Text style={styles.paymentText}>{quote.paymentTerms}</Text>
            </View>
          </View>

          <View style={styles.quoteActions}>
            <Button
              title="Accept Quote"
              onPress={() => handleAcceptQuote(quote.id)}
              containerStyle={styles.acceptButton}
              icon={<Icon name="check" size={18} color="#fff" style={{ marginRight: 6 }} />}
            />
            <Button
              title="Message"
              type="outline"
              onPress={() => navigation.navigate('Messages' as any)}
              containerStyle={styles.messageButton}
              icon={<Icon name="message-circle" size={18} color="#2563eb" />}
              iconPosition="left"
            />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  rfqCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  rfqTitle: {
    marginBottom: 12,
    color: '#1e293b',
  },
  rfqDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  rfqLabel: {
    fontSize: 15,
    color: '#64748b',
    width: 100,
  },
  rfqValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  header: {
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  quoteCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  supplierName: {
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  divider: {
    marginVertical: 16,
  },
  quoteDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalCost: {
    color: '#2563eb',
    fontSize: 20,
  },
  additionalCosts: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  paymentTerms: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentText: {
    fontSize: 14,
    color: '#64748b',
  },
  quoteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
  },
  messageButton: {
    flex: 0.4,
  },
});

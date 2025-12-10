import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Input, Button, Card } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { RFQStackParamList } from '../../navigation/SellerTabNavigator';
import { mockRFQs } from '../../services/mockData';

type Props = NativeStackScreenProps<RFQStackParamList, 'QuoteSubmission'>;

export default function QuoteSubmissionScreen({ route, navigation }: Props) {
  const { rfqId } = route.params;
  const rfq = mockRFQs.find(r => r.id === rfqId);

  const [unitPrice, setUnitPrice] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [incoterm, setIncoterm] = useState(rfq?.incoterm || 'FOB');
  const [leadTime, setLeadTime] = useState('');
  const [freightCost, setFreightCost] = useState('');
  const [insurance, setInsurance] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!unitPrice || !leadTime || !paymentTerms || !validUntil) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      'Quote submitted successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (!rfq) {
    return (
      <View style={styles.container}>
        <Text>RFQ not found</Text>
      </View>
    );
  }

  const quantity = rfq.products[0]?.quantity || 0;
  const unitPriceNum = parseFloat(unitPrice) || 0;
  const freightNum = parseFloat(freightCost) || 0;
  const insuranceNum = parseFloat(insurance) || 0;
  const totalCost = (quantity * unitPriceNum) + freightNum + insuranceNum;

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.rfqCard}>
        <Text h4 style={styles.rfqTitle}>RFQ Details</Text>
        <View style={styles.rfqDetail}>
          <Text style={styles.label}>Product:</Text>
          <Text style={styles.value}>{rfq.products[0]?.productName}</Text>
        </View>
        <View style={styles.rfqDetail}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{quantity} units</Text>
        </View>
        <View style={styles.rfqDetail}>
          <Text style={styles.label}>Destination:</Text>
          <Text style={styles.value}>{rfq.destinationPort}</Text>
        </View>
        {rfq.targetPrice && (
          <View style={styles.rfqDetail}>
            <Text style={styles.label}>Target Price:</Text>
            <Text style={[styles.value, styles.targetPrice]}>
              ${rfq.targetPrice}/unit
            </Text>
          </View>
        )}
      </Card>

      <Card containerStyle={styles.card}>
        <Text h4 style={styles.sectionTitle}>Your Quote</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Unit Price *</Text>
          <Input
            placeholder="Enter price per unit"
            value={unitPrice}
            onChangeText={setUnitPrice}
            keyboardType="numeric"
            leftIcon={<Icon name="dollar-sign" size={20} color="#94a3b8" />}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Currency *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currency}
              onValueChange={setCurrency}
              style={styles.picker}
            >
              <Picker.Item label="₹ INR" value="INR" />
              <Picker.Item label="$ USD" value="USD" />
              <Picker.Item label="€ EUR" value="EUR" />
              <Picker.Item label="£ GBP" value="GBP" />
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Incoterm *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={incoterm}
              onValueChange={setIncoterm}
              style={styles.picker}
            >
              <Picker.Item label="FOB" value="FOB" />
              <Picker.Item label="CIF" value="CIF" />
              <Picker.Item label="EXW" value="EXW" />
              <Picker.Item label="DDP" value="DDP" />
              <Picker.Item label="DAP" value="DAP" />
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Lead Time *</Text>
          <Input
            placeholder="e.g., 25-30 days"
            value={leadTime}
            onChangeText={setLeadTime}
            leftIcon={<Icon name="clock" size={20} color="#94a3b8" />}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Freight Cost (Optional)</Text>
          <Input
            placeholder="Enter freight cost"
            value={freightCost}
            onChangeText={setFreightCost}
            keyboardType="numeric"
            leftIcon={<Icon name="truck" size={20} color="#94a3b8" />}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Insurance (Optional)</Text>
          <Input
            placeholder="Enter insurance cost"
            value={insurance}
            onChangeText={setInsurance}
            keyboardType="numeric"
            leftIcon={<Icon name="shield" size={20} color="#94a3b8" />}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Payment Terms *</Text>
          <Input
            placeholder="e.g., 30% deposit, 70% before shipment"
            value={paymentTerms}
            onChangeText={setPaymentTerms}
            leftIcon={<Icon name="credit-card" size={20} color="#94a3b8" />}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Valid Until *</Text>
          <Input
            placeholder="YYYY-MM-DD"
            value={validUntil}
            onChangeText={setValidUntil}
            leftIcon={<Icon name="calendar" size={20} color="#94a3b8" />}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Additional Notes</Text>
          <Input
            placeholder="Any additional information..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            inputStyle={styles.textarea}
          />
        </View>

        {unitPrice && (
          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Product Total:</Text>
              <Text style={styles.totalValue}>
                ${(quantity * unitPriceNum).toLocaleString()}
              </Text>
            </View>
            {freightCost && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Freight:</Text>
                <Text style={styles.totalValue}>+${freightNum.toLocaleString()}</Text>
              </View>
            )}
            {insurance && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Insurance:</Text>
                <Text style={styles.totalValue}>+${insuranceNum.toLocaleString()}</Text>
              </View>
            )}
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.grandTotalLabel}>Total Quote:</Text>
              <Text style={styles.grandTotalValue}>
                ${totalCost.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      </Card>

      <View style={styles.actions}>
        <Button
          title="Submit Quote"
          onPress={handleSubmit}
          containerStyle={styles.actionButton}
          buttonStyle={styles.submitButton}
          icon={<Icon name="send" size={20} color="#fff" style={{ marginRight: 8 }} />}
        />
        
        <Button
          title="Cancel"
          type="outline"
          onPress={() => navigation.goBack()}
          containerStyle={styles.actionButton}
        />
      </View>
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
  label: {
    fontSize: 15,
    color: '#64748b',
    width: 100,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  targetPrice: {
    color: '#f59e0b',
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  totalCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
  actions: {
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  submitButton: {
    paddingVertical: 14,
  },
});

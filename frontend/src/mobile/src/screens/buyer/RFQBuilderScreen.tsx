import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Input, Button, Card } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import { CatalogStackParamList } from '../../navigation/BuyerTabNavigator';
import { mockProducts } from '../../services/mockData';

type Props = NativeStackScreenProps<CatalogStackParamList, 'RFQBuilder'>;

export default function RFQBuilderScreen({ route, navigation }: Props) {
  const { productId } = route.params || {};
  const product = productId ? mockProducts.find(p => p.id === productId) : null;

  const [quantity, setQuantity] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [incoterm, setIncoterm] = useState('FOB');
  const [destinationPort, setDestinationPort] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [deadline, setDeadline] = useState('');

  const incoterms = ['FOB', 'CIF', 'EXW', 'DDP', 'DAP', 'FCA'];

  const handleSubmit = () => {
    if (!quantity || !destinationPort || !deadline) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (product && quantityNum < product.moq) {
      Alert.alert(
        'MOQ Not Met',
        `Minimum order quantity for this product is ${product.moq} units. You entered ${quantityNum}.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Success',
      'RFQ submitted successfully! Suppliers will be notified.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {product && (
        <Card containerStyle={styles.productCard}>
          <Text h4 style={styles.productName}>{product.name}</Text>
          <Text style={styles.supplier}>{product.supplierName}</Text>
          <Text style={styles.moq}>MOQ: {product.moq} units</Text>
        </Card>
      )}

      <Card containerStyle={styles.card}>
        <Text h4 style={styles.sectionTitle}>Request Details</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Quantity *</Text>
          <Input
            placeholder="Enter quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            rightIcon={<Text style={styles.unit}>units</Text>}
          />
          {product && (
            <Text style={styles.hint}>Minimum Order Quantity: {product.moq}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Specifications</Text>
          <Input
            placeholder="Enter product specifications..."
            value={specifications}
            onChangeText={setSpecifications}
            multiline
            numberOfLines={4}
            inputStyle={styles.textarea}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Incoterm *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={incoterm}
              onValueChange={setIncoterm}
              style={styles.picker}
            >
              {incoterms.map(term => (
                <Picker.Item key={term} label={term} value={term} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Destination Port *</Text>
          <Input
            placeholder="e.g., Los Angeles, USA"
            value={destinationPort}
            onChangeText={setDestinationPort}
            leftIcon={<Icon name="map-pin" size={20} color="#94a3b8" />}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Target Price (Optional)</Text>
          <Input
            placeholder="Enter target price per unit"
            value={targetPrice}
            onChangeText={setTargetPrice}
            keyboardType="numeric"
            leftIcon={<Icon name="dollar-sign" size={20} color="#94a3b8" />}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Quote Deadline *</Text>
          <Input
            placeholder="YYYY-MM-DD"
            value={deadline}
            onChangeText={setDeadline}
            leftIcon={<Icon name="calendar" size={20} color="#94a3b8" />}
          />
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Submit RFQ"
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
  productCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  productName: {
    marginBottom: 8,
  },
  supplier: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  moq: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#64748b',
    marginTop: -8,
    marginLeft: 10,
  },
  unit: {
    color: '#64748b',
    fontSize: 14,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
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

import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Badge, Card, Divider } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { CatalogStackParamList } from '../../navigation/BuyerTabNavigator';
import { mockProducts } from '../../services/mockData';
import { formatCurrency } from '../../theme';

type Props = NativeStackScreenProps<CatalogStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text h3 style={styles.productName}>{product.name}</Text>
        
        <View style={styles.supplierRow}>
          <Icon name="briefcase" size={16} color="#64748b" />
          <Text style={styles.supplierName}>{product.supplierName}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#f59e0b" solid />
            <Text style={styles.rating}>{product.supplierRating}</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <View>
            <Text style={styles.priceLabel}>Unit Price</Text>
            <Text style={styles.price}>
              {formatCurrency(product.price, product.currency)}
            </Text>
          </View>
          <View>
            <Text style={styles.priceLabel}>MOQ</Text>
            <Text style={styles.moqValue}>{product.moq} units</Text>
          </View>
        </View>

        <Card containerStyle={styles.card}>
          <View style={styles.infoRow}>
            <Icon name="package" size={20} color="#2563eb" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{product.category}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="hash" size={20} color="#2563eb" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>HS Code</Text>
              <Text style={styles.infoValue}>{product.hsCode}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="clock" size={20} color="#2563eb" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Lead Time</Text>
              <Text style={styles.infoValue}>{product.leadTime}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="globe" size={20} color="#2563eb" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Origin</Text>
              <Text style={styles.infoValue}>{product.origin}</Text>
            </View>
          </View>
        </Card>

        <Card containerStyle={styles.card}>
          <Text h4 style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.certifications}>
            {product.certifications.map((cert, index) => (
              <Badge
                key={index}
                value={cert}
                badgeStyle={styles.certBadge}
                textStyle={styles.certText}
              />
            ))}
          </View>
        </Card>

        <Card containerStyle={styles.card}>
          <Text h4 style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </Card>

        {product.variants.length > 0 && (
          <Card containerStyle={styles.card}>
            <Text h4 style={styles.sectionTitle}>Available Variants</Text>
            {product.variants.map((variant, index) => (
              <View key={index} style={styles.variant}>
                <Text style={styles.variantName}>{variant.name}:</Text>
                <Text style={styles.variantValue}>{variant.value}</Text>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            title="Request Quote"
            onPress={() => navigation.navigate('RFQBuilder', { productId: product.id })}
            containerStyle={styles.actionButton}
            buttonStyle={styles.primaryButton}
            icon={<Icon name="file-text" size={20} color="#fff" style={{ marginRight: 8 }} />}
          />
          
          <Button
            title="Contact Supplier"
            type="outline"
            onPress={() => {}}
            containerStyle={styles.actionButton}
            icon={<Icon name="message-circle" size={20} color="#2563eb" style={{ marginRight: 8 }} />}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  productName: {
    marginBottom: 12,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  supplierName: {
    marginLeft: 8,
    fontSize: 16,
    color: '#64748b',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
  },
  moqValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 0,
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  certifications: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  certText: {
    color: '#2563eb',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  variant: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  variantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 8,
  },
  variantValue: {
    fontSize: 15,
    color: '#64748b',
  },
  actions: {
    marginTop: 16,
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  primaryButton: {
    paddingVertical: 14,
  },
});

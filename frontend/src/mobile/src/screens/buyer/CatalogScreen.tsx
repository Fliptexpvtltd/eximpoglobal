import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Search,
  Filter,
  Star,
  MapPin,
  X,
  ChevronDown,
  ArrowRight,
} from 'lucide-react-native';
import { CatalogStackParamList } from '../../navigation/BuyerTabNavigator';
import { mockProducts } from '../../services/mockData';
import { Product } from '../../types';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<CatalogStackParamList, 'CatalogList'>;

const categories = [
  'Electronics',
  'Textiles & Apparel',
  'Machinery',
  'Home & Garden',
  'Chemicals',
  'Automotive',
];

const certifications = ['CE', 'FDA', 'ISO 9001', 'RoHS', 'GOTS', 'FSC', 'TUV'];
const origins = ['China', 'Vietnam', 'India', 'Thailand', 'Turkey', 'USA'];

export default function CatalogScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [moqRange, setMoqRange] = useState({ min: '', max: '' });

  const toggleFilter = (value: string, list: string[], setter: (list: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter(item => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCertifications([]);
    setSelectedOrigins([]);
    setPriceRange({ min: '', max: '' });
    setMoqRange({ min: '', max: '' });
  };

  const applyFilters = () => {
    let filtered = mockProducts;

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        product.hsCode.includes(search)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.some(cat => product.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    // Certification filter
    if (selectedCertifications.length > 0) {
      filtered = filtered.filter(product =>
        selectedCertifications.some(cert => product.certifications.includes(cert))
      );
    }

    // Origin filter
    if (selectedOrigins.length > 0) {
      filtered = filtered.filter(product => selectedOrigins.includes(product.origin));
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    // MOQ range filter
    if (moqRange.min) {
      filtered = filtered.filter(product => product.moq >= parseInt(moqRange.min));
    }
    if (moqRange.max) {
      filtered = filtered.filter(product => product.moq <= parseInt(moqRange.max));
    }

    return filtered;
  };

  const filteredProducts = applyFilters();

  const activeFiltersCount = 
    selectedCategories.length +
    selectedCertifications.length +
    selectedOrigins.length +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (moqRange.min || moqRange.max ? 1 : 0);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('SupplierProfile', { supplierId: item.supplierId })}
          style={styles.supplierRow}
        >
          <Text style={styles.supplierName}>{item.supplierName}</Text>
          <ArrowRight size={14} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.productDetails}>
          <View style={styles.ratingContainer}>
            <Star size={14} fill={theme.colors.warning} color={theme.colors.warning} />
            <Text style={styles.rating}>{item.supplierRating}</Text>
          </View>
          <View style={styles.originContainer}>
            <MapPin size={14} color={theme.colors.textLight} />
            <Text style={styles.origin}>{item.origin}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
            <Text style={styles.moq}>MOQ: {item.moq}</Text>
          </View>
          <Text style={styles.leadTime}>{item.leadTime}</Text>
        </View>

        <View style={styles.certifications}>
          {item.certifications.slice(0, 3).map((cert, index) => (
            <View key={index} style={styles.certBadge}>
              <Text style={styles.certText}>{cert}</Text>
            </View>
          ))}
          {item.certifications.length > 3 && (
            <View style={styles.certBadge}>
              <Text style={styles.certText}>+{item.certifications.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={theme.colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, suppliers, HS codes..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={theme.colors.textLight}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <X size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={18} color={theme.colors.primary} />
          <Text style={styles.filterButtonText}>
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Text>
        </TouchableOpacity>
        
        {activeFiltersCount > 0 && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {filteredProducts.length} products found
      </Text>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Categories */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Category</Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      selectedCategories.includes(category) && styles.filterChipActive,
                    ]}
                    onPress={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategories.includes(category) && styles.filterChipTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Certifications */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Certifications</Text>
              <View style={styles.filterOptions}>
                {certifications.map((cert) => (
                  <TouchableOpacity
                    key={cert}
                    style={[
                      styles.filterChip,
                      selectedCertifications.includes(cert) && styles.filterChipActive,
                    ]}
                    onPress={() => toggleFilter(cert, selectedCertifications, setSelectedCertifications)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCertifications.includes(cert) && styles.filterChipTextActive,
                      ]}
                    >
                      {cert}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Origin */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Origin</Text>
              <View style={styles.filterOptions}>
                {origins.map((origin) => (
                  <TouchableOpacity
                    key={origin}
                    style={[
                      styles.filterChip,
                      selectedOrigins.includes(origin) && styles.filterChipActive,
                    ]}
                    onPress={() => toggleFilter(origin, selectedOrigins, setSelectedOrigins)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedOrigins.includes(origin) && styles.filterChipTextActive,
                      ]}
                    >
                      {origin}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range (₹)</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min"
                  keyboardType="numeric"
                  value={priceRange.min}
                  onChangeText={(text) => setPriceRange({ ...priceRange, min: text })}
                  placeholderTextColor={theme.colors.textLight}
                />
                <Text style={styles.rangeSeparator}>-</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max"
                  keyboardType="numeric"
                  value={priceRange.max}
                  onChangeText={(text) => setPriceRange({ ...priceRange, max: text })}
                  placeholderTextColor={theme.colors.textLight}
                />
              </View>
            </View>

            {/* MOQ Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>MOQ Range</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min"
                  keyboardType="numeric"
                  value={moqRange.min}
                  onChangeText={(text) => setMoqRange({ ...moqRange, min: text })}
                  placeholderTextColor={theme.colors.textLight}
                />
                <Text style={styles.rangeSeparator}>-</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max"
                  keyboardType="numeric"
                  value={moqRange.max}
                  onChangeText={(text) => setMoqRange({ ...moqRange, max: text })}
                  placeholderTextColor={theme.colors.textLight}
                />
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  filterButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  clearFiltersText: {
    color: theme.colors.error,
    fontSize: 14,
  },
  resultsCount: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.textLight,
  },
  productsList: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: theme.spacing.md,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  supplierName: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  originContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  origin: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  moq: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  leadTime: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  certifications: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  certBadge: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  certText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  filterSection: {
    marginBottom: theme.spacing.lg,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
  },
  rangeSeparator: {
    fontSize: 16,
    color: theme.colors.textLight,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  clearButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  applyButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

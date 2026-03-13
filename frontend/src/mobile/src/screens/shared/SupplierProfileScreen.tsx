// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Star,
  MapPin,
  CheckCircle,
  Award,
  TrendingUp,
  Package,
  MessageCircle,
  Mail,
  Phone,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

// Theme colors
const colors = {
  primary: '#1E90FF',
  success: '#2ECC71',
  warning: '#FFA500',
  error: '#E74C3C',
  text: '#2C3E50',
  textLight: '#7F8C8D',
  background: '#F8F9FA',
  border: '#E0E0E0',
  white: '#FFFFFF',
};

// Spacing values
const spacing = { xs: 4, sm: 8, md: 16, lg: 24 };
const borderRadius = { sm: 4, md: 8, lg: 12, full: 999 };

// Icon wrapper component to handle color prop
const IconWrapper = ({ Icon, color, size, ...props }: any) => {
  return <Icon size={size} color={color} {...props} />;
};

// Helper to create colored icons
const ColoredIcon = (IconComponent: any, color: string, size: number = 16) => (
  <IconComponent size={size} color={color} />
);

// Type definitions
interface Supplier {
  id: string;
  company_name: string;
  email?: string;
  phone?: string;
  country?: string;
  verified?: boolean;
  rating: number;
  total_reviews: number;
  years_in_business?: number;
  certifications?: string | string[];
  specializations?: string | string[];
  about?: string;
  logo_url?: string;
  banner_url?: string;
  created_at?: string;
}

interface SupplierProduct {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  moq?: number;
  unit?: string;
  images?: string[];
}

interface SupplierReview {
  id: string;
  reviewer_name: string;
  reviewer_country?: string;
  rating: number;
  comment: string;
  verified_purchase?: boolean;
  created_at: string;
}

interface SupplierProfileScreenProps {
  route: {
    params: {
      supplierId: string;
    };
  };
  navigation: any;
}

// Utility functions
const parseArrayField = (field: any): string[] => {
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [field];
    } catch {
      return field.split(',').map((s: string) => s.trim());
    }
  }
  return [];
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Main component
export default function SupplierProfileScreen({ route, navigation }: SupplierProfileScreenProps) {
  const { supplierId } = route.params;
  
  const [activeTab, setActiveTab] = useState<'about' | 'products' | 'reviews'>('about');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [reviews, setReviews] = useState<SupplierReview[]>([]);

  useEffect(() => {
    fetchAllData();
  }, [supplierId]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [supplierRes, productsRes, reviewsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/suppliers/${supplierId}`),
        fetch(`${API_BASE_URL}/suppliers/${supplierId}/products`),
        fetch(`${API_BASE_URL}/suppliers/${supplierId}/reviews?limit=5&page=1`),
      ]);

      if (!supplierRes.ok || !productsRes.ok || !reviewsRes.ok) {
        throw new Error('Failed to fetch supplier data');
      }

      const supplierData = await supplierRes.json();
      const productsData = await productsRes.json();
      const reviewsData = await reviewsRes.json();

      if (supplierData.success && supplierData.data) {
        setSupplier(supplierData.data);
      }
      if (productsData.success && Array.isArray(productsData.data)) {
        setProducts(productsData.data);
      }
      if (reviewsData.success && Array.isArray(reviewsData.data)) {
        setReviews(reviewsData.data);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to load supplier profile';
      setError(errMsg);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPress = async () => {
    if (!supplier?.email) {
      Alert.alert('No email', 'Email not available for this supplier');
      return;
    }
    try {
      await Linking.openURL(`mailto:${supplier.email}`);
    } catch {
      Alert.alert('Error', 'Unable to open email client');
    }
  };

  const handlePhonePress = async () => {
    if (!supplier?.phone) {
      Alert.alert('No phone', 'Phone not available for this supplier');
      return;
    }
    try {
      await Linking.openURL(`tel:${supplier.phone}`);
    } catch {
      Alert.alert('Error', 'Unable to open phone dialer');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= rating;
          return (
            <React.Fragment key={star}>
              <Star
                size={16}
                // @ts-ignore
                color={isFilled ? colors.warning : colors.textLight}
              />
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading supplier profile...</Text>
      </View>
    );
  }

  if (error || !supplier) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || 'Supplier not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAllData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const certifications = parseArrayField(supplier.certifications);
  const specializations = parseArrayField(supplier.specializations);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* @ts-ignore */}
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Supplier Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Cover Photo */}
        <View style={[styles.coverPhoto, { backgroundColor: colors.primary }]} />

        {/* Supplier Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoHeaderLeft}>
              <View style={styles.nameRow}>
                <Text style={styles.supplierName}>{supplier.company_name || 'Supplier'}</Text>
                {supplier.verified && (
                  /* @ts-ignore */
                  <CheckCircle size={20} color={colors.success} />
                )}
              </View>
              {supplier.country && (
                <View style={styles.locationRow}>
                  <MapPin size={14} color={colors.textLight} />
                  <Text style={styles.locationText}>{supplier.country}</Text>
                </View>
              )}
              <View style={styles.ratingRow}>
                {renderStars(Math.round(supplier.rating || 0))}
                <Text style={styles.ratingText}>
                  {(supplier.rating || 0).toFixed(1)} ({supplier.total_reviews || 0} reviews)
                </Text>
              </View>
            </View>
          </View>

          {/* Key Stats */}
          <View style={styles.statsGrid}>
            {supplier.years_in_business && (
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
                  <TrendingUp size={20} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{supplier.years_in_business}+</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
            )}
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
                <Package size={20} color={colors.success} />
              </View>
              <Text style={styles.statValue}>{products.length}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
                <MessageCircle size={20} color={colors.warning} />
              </View>
              <Text style={styles.statValue}>{reviews.length}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleEmailPress}>
              <Mail size={18} color={colors.white} />
              <Text style={styles.primaryButtonText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handlePhonePress}>
              <Phone size={18} color={colors.white} />
              <Text style={styles.primaryButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.activeTab]}
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
              Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            {/* Description */}
            {supplier.about && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Company</Text>
                <Text style={styles.description}>{supplier.about}</Text>
              </View>
            )}

            {/* Quick Facts */}
            {(specializations.length > 0 || supplier.years_in_business) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Facts</Text>
                <View style={styles.factsList}>
                  {supplier.years_in_business && (
                    <View style={styles.factItem}>
                      <TrendingUp size={16} color={colors.textLight} />
                      <Text style={styles.factLabel}>Est. Year:</Text>
                      <Text style={styles.factValue}>{new Date().getFullYear() - supplier.years_in_business}</Text>
                    </View>
                  )}
                  {specializations.length > 0 && (
                    <View style={styles.factItem}>
                      <Package size={16} color={colors.textLight} />
                      <Text style={styles.factLabel}>Specializes in:</Text>
                      <Text style={styles.factValue}>{specializations.slice(0, 2).join(', ')}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                <View style={styles.certificationsList}>
                  {certifications.map((cert, idx) => (
                    <View key={idx} style={styles.certBadge}>
                      <Award size={14} color={colors.primary} />
                      <Text style={styles.certText}>{cert}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Contact Info */}
            {(supplier.email || supplier.phone) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                {supplier.email && (
                  <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                    <Mail size={16} color={colors.primary} />
                    <Text style={styles.contactText}>{supplier.email}</Text>
                  </TouchableOpacity>
                )}
                {supplier.phone && (
                  <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
                    <Phone size={16} color={colors.primary} />
                    <Text style={styles.contactText}>{supplier.phone}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        {activeTab === 'products' && (
          <View style={styles.tabContent}>
            {products.length === 0 ? (
              <View style={styles.emptyState}>
                <Package size={48} color={colors.textLight} />
                <Text style={styles.emptyStateText}>No products listed</Text>
              </View>
            ) : (
              <View style={styles.productsList}>
                {products.map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    {product.images && product.images.length > 0 && (
                      <Image
                        source={{ uri: product.images[0] }}
                        style={styles.productImage}
                      />
                    )}
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      {product.category && (
                        <Text style={styles.productCategory}>{product.category}</Text>
                      )}
                      {product.description && (
                        <Text style={styles.productDescription} numberOfLines={2}>
                          {product.description}
                        </Text>
                      )}
                      <View style={styles.productFooter}>
                        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                        {product.moq && (
                          <Text style={styles.productMoq}>MOQ: {product.moq}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            {reviews.length === 0 ? (
              <View style={styles.emptyState}>
                <MessageCircle size={48} color={colors.textLight} />
                <Text style={styles.emptyStateText}>No reviews yet</Text>
              </View>
            ) : (
              <View style={styles.reviewsList}>
                {reviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewHeaderLeft}>
                        <Text style={styles.reviewAuthor}>{review.reviewer_name}</Text>
                        {review.reviewer_country && (
                          <View style={styles.reviewLocation}>
                            <MapPin size={12} color={colors.textLight} />
                            <Text style={styles.reviewCountry}>{review.reviewer_country}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
                    </View>
                    {renderStars(review.rating)}
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                    {review.verified_purchase && (
                      <View style={styles.verifiedBadge}>
                        <CheckCircle size={12} color={colors.success} />
                        <Text style={styles.verifiedText}>Verified Purchase</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textLight,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  coverPhoto: {
    width: '100%',
    height: 120,
  },
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: -20,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    marginBottom: spacing.md,
  },
  infoHeaderLeft: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  factsList: {
    gap: spacing.sm,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  factLabel: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
  },
  factValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 2,
  },
  certificationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  certText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  contactText: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  productsList: {
    gap: spacing.md,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.background,
  },
  productInfo: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  productCategory: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  productDescription: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  productMoq: {
    fontSize: 12,
    color: colors.textLight,
  },
  reviewsList: {
    gap: spacing.sm,
  },
  reviewCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  reviewHeaderLeft: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reviewLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  reviewCountry: {
    fontSize: 12,
    color: colors.textLight,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg * 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: spacing.md,
  },
});

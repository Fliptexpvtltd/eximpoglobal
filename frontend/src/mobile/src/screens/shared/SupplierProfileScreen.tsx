import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Star,
  MapPin,
  CheckCircle,
  Award,
  TrendingUp,
  Package,
  Users,
  Building,
  MessageCircle,
  Mail,
  Phone,
} from 'lucide-react-native';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

interface SupplierProfileScreenProps {
  route: {
    params: {
      supplierId: string;
    };
  };
  navigation: any;
}

const supplier = {
  id: 's1',
  name: 'Shanghai Textile Co., Ltd.',
  verified: true,
  rating: 4.8,
  totalReviews: 127,
  yearsInBusiness: 8,
  country: 'China',
  city: 'Shanghai',
  mainProducts: ['Textiles', 'Apparel', 'Home Textiles'],
  employeeCount: '200-500',
  annualRevenue: '₹10M - ₹50M',
  onTimeDelivery: 96,
  responseTime: '< 2 hours',
  topMarkets: ['USA', 'EU', 'Australia'],
  description: 'Leading manufacturer of organic cotton textiles with 8+ years of experience in international trade. We specialize in sustainable production methods and maintain strict quality control standards.',
  certifications: ['ISO 9001', 'GOTS', 'OEKO-TEX', 'BSCI', 'Sedex'],
  factoryImages: [
    'https://images.unsplash.com/photo-1599765824376-a87eb981b2ee?w=400',
    'https://images.unsplash.com/photo-1644079446600-219068676743?w=400',
    'https://images.unsplash.com/photo-1758691737246-95bf8f09a997?w=400',
  ],
};

const reviews = [
  {
    id: 1,
    author: 'Fashion Retail Inc.',
    country: 'USA',
    rating: 5,
    date: '2025-10-15',
    comment: 'Excellent quality and communication. Delivery was on time and product met all specifications. Highly recommended!',
  },
  {
    id: 2,
    author: 'TechWear GmbH',
    country: 'Germany',
    rating: 5,
    date: '2025-09-28',
    comment: 'Great supplier with consistent quality. This is our 3rd order and we are very satisfied with their service.',
  },
  {
    id: 3,
    author: 'Retail Corp',
    country: 'UK',
    rating: 4,
    date: '2025-09-10',
    comment: 'Good product quality and professional team. Minor delay in shipping but overall positive experience.',
  },
];

const productCategories = [
  { name: 'T-Shirts & Tops', count: 12 },
  { name: 'Hoodies & Sweatshirts', count: 8 },
  { name: 'Dresses & Skirts', count: 6 },
  { name: 'Home Textiles', count: 10 },
  { name: 'Accessories', count: 6 },
];

export default function SupplierProfileScreen({ route, navigation }: SupplierProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'products' | 'reviews'>('about');
  const { supplierId } = route.params;

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? theme.colors.warning : 'none'}
            color={star <= rating ? theme.colors.warning : theme.colors.textLight}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Supplier Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Cover Photo */}
        <View style={styles.coverPhoto} />

        {/* Supplier Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoHeaderLeft}>
              <View style={styles.nameRow}>
                <Text style={styles.supplierName}>{supplier.name}</Text>
                {supplier.verified && (
                  <CheckCircle size={20} color={theme.colors.success} />
                )}
              </View>
              <View style={styles.locationRow}>
                <MapPin size={14} color={theme.colors.textLight} />
                <Text style={styles.locationText}>{supplier.city}, {supplier.country}</Text>
              </View>
              <View style={styles.ratingRow}>
                {renderStars(Math.round(supplier.rating))}
                <Text style={styles.ratingText}>
                  {supplier.rating} ({supplier.totalReviews} reviews)
                </Text>
              </View>
            </View>
          </View>

          {/* Key Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                <TrendingUp size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statValue}>{supplier.yearsInBusiness}+</Text>
              <Text style={styles.statLabel}>Years in Business</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '15' }]}>
                <Package size={20} color={theme.colors.success} />
              </View>
              <Text style={styles.statValue}>{supplier.onTimeDelivery}%</Text>
              <Text style={styles.statLabel}>On-time Delivery</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '15' }]}>
                <Users size={20} color={theme.colors.warning} />
              </View>
              <Text style={styles.statValue}>{supplier.employeeCount}</Text>
              <Text style={styles.statLabel}>Employees</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <MessageCircle size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Contact Supplier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Mail size={18} color={theme.colors.primary} />
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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company Overview</Text>
              <Text style={styles.description}>{supplier.description}</Text>
            </View>

            {/* Quick Facts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Facts</Text>
              <View style={styles.factsList}>
                <View style={styles.factItem}>
                  <Building size={16} color={theme.colors.textLight} />
                  <Text style={styles.factLabel}>Annual Revenue:</Text>
                  <Text style={styles.factValue}>{supplier.annualRevenue}</Text>
                </View>
                <View style={styles.factItem}>
                  <Package size={16} color={theme.colors.textLight} />
                  <Text style={styles.factLabel}>Main Products:</Text>
                  <Text style={styles.factValue}>{supplier.mainProducts.join(', ')}</Text>
                </View>
                <View style={styles.factItem}>
                  <TrendingUp size={16} color={theme.colors.textLight} />
                  <Text style={styles.factLabel}>Response Time:</Text>
                  <Text style={styles.factValue}>{supplier.responseTime}</Text>
                </View>
                <View style={styles.factItem}>
                  <MapPin size={16} color={theme.colors.textLight} />
                  <Text style={styles.factLabel}>Top Markets:</Text>
                  <Text style={styles.factValue}>{supplier.topMarkets.join(', ')}</Text>
                </View>
              </View>
            </View>

            {/* Certifications */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications & Compliance</Text>
              <View style={styles.certificationsList}>
                {supplier.certifications.map((cert) => (
                  <View key={cert} style={styles.certBadge}>
                    <Award size={14} color={theme.colors.primary} />
                    <Text style={styles.certText}>{cert}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Factory Images */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Factory & Facilities</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                {supplier.factoryImages.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.factoryImage} />
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {activeTab === 'products' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Product Categories</Text>
              {productCategories.map((category) => (
                <TouchableOpacity key={category.name} style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <Package size={20} color={theme.colors.primary} />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryCount}>{category.count} items</Text>
                    <ArrowLeft size={16} color={theme.colors.textLight} style={{ transform: [{ rotate: '180deg' }] }} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewHeaderLeft}>
                      <Text style={styles.reviewAuthor}>{review.author}</Text>
                      <View style={styles.reviewLocation}>
                        <MapPin size={12} color={theme.colors.textLight} />
                        <Text style={styles.reviewCountry}>{review.country}</Text>
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  {renderStars(review.rating)}
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  coverPhoto: {
    width: '100%',
    height: 120,
    backgroundColor: theme.colors.primary,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    marginTop: -20,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.medium,
  },
  infoHeader: {
    marginBottom: theme.spacing.md,
  },
  infoHeaderLeft: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
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
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textLight,
    lineHeight: 20,
  },
  factsList: {
    gap: theme.spacing.sm,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  factLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    flex: 1,
  },
  factValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
    flex: 2,
  },
  certificationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  certText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  imageGallery: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  factoryImage: {
    width: 200,
    height: 150,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  categoryCount: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  reviewHeaderLeft: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  reviewLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  reviewCountry: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  reviewComment: {
    fontSize: 14,
    color: theme.colors.textLight,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
});

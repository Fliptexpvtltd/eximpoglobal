import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Badge } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { DashboardStackParamList } from '../../navigation/BuyerTabNavigator';
import { mockShipments } from '../../services/mockData';

type Props = NativeStackScreenProps<DashboardStackParamList, 'ShipmentTracking'>;

export default function ShipmentTrackingScreen({ route }: Props) {
  const { poId } = route.params;
  const shipment = mockShipments.find(s => s.poId === poId);

  if (!shipment) {
    return (
      <View style={styles.container}>
        <Text>Shipment not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.trackingCard}>
        <View style={styles.trackingHeader}>
          <View>
            <Text h4>Tracking Number</Text>
            <Text style={styles.trackingNumber}>{shipment.trackingNumber}</Text>
          </View>
          <Badge value={shipment.status.toUpperCase()} status="primary" />
        </View>

        <View style={styles.route}>
          <View style={styles.routePoint}>
            <Icon name="map-pin" size={20} color="#2563eb" />
            <Text style={styles.routeText}>{shipment.originPort}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <Icon name="flag" size={20} color="#10b981" />
            <Text style={styles.routeText}>{shipment.destinationPort}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mode</Text>
            <Text style={styles.infoValue}>{shipment.mode.toUpperCase()}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.infoValue}>{shipment.eta}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Forwarder</Text>
            <Text style={styles.infoValue}>{shipment.forwarder}</Text>
          </View>
          {shipment.containerType && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Container</Text>
              <Text style={styles.infoValue}>{shipment.containerType}</Text>
            </View>
          )}
        </View>
      </Card>

      <View style={styles.timeline}>
        <Text h4 style={styles.timelineTitle}>Shipment Timeline</Text>
        {shipment.milestones.map((milestone, index) => (
          <View key={index} style={styles.milestoneContainer}>
            <View style={styles.milestoneLeft}>
              <View
                style={[
                  styles.milestoneIcon,
                  milestone.completed ? styles.milestoneCompleted : styles.milestonePending,
                ]}
              >
                {milestone.completed ? (
                  <Icon name="check" size={16} color="#fff" />
                ) : (
                  <View style={styles.milestoneDot} />
                )}
              </View>
              {index < shipment.milestones.length - 1 && (
                <View
                  style={[
                    styles.milestoneLine,
                    milestone.completed ? styles.lineCompleted : styles.linePending,
                  ]}
                />
              )}
            </View>

            <View style={styles.milestoneContent}>
              <Text
                style={[
                  styles.milestoneName,
                  milestone.completed && styles.milestoneNameCompleted,
                ]}
              >
                {milestone.name}
              </Text>
              <Text style={styles.milestoneLocation}>{milestone.location}</Text>
              <Text style={styles.milestoneDate}>{milestone.date}</Text>
            </View>
          </View>
        ))}
      </View>

      <Card containerStyle={styles.documentsCard}>
        <Text h4 style={styles.documentsTitle}>Shipping Documents</Text>
        {shipment.documents.map((doc, index) => (
          <TouchableOpacity key={index} style={styles.document}>
            <Icon name="file-text" size={24} color="#2563eb" />
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{doc.name}</Text>
              <Text style={styles.documentType}>{doc.type.toUpperCase()}</Text>
            </View>
            <Icon name="download" size={20} color="#64748b" />
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
  trackingCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  trackingNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 8,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  routePoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeLine: {
    height: 2,
    width: 40,
    backgroundColor: '#2563eb',
    marginHorizontal: 8,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
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
  timeline: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  timelineTitle: {
    marginBottom: 20,
  },
  milestoneContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  milestoneLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  milestoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneCompleted: {
    backgroundColor: '#10b981',
  },
  milestonePending: {
    backgroundColor: '#e2e8f0',
  },
  milestoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#94a3b8',
  },
  milestoneLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  lineCompleted: {
    backgroundColor: '#10b981',
  },
  linePending: {
    backgroundColor: '#e2e8f0',
  },
  milestoneContent: {
    flex: 1,
    paddingBottom: 8,
  },
  milestoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 4,
  },
  milestoneNameCompleted: {
    color: '#1e293b',
  },
  milestoneLocation: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  milestoneDate: {
    fontSize: 13,
    color: '#94a3b8',
  },
  documentsCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  documentsTitle: {
    marginBottom: 16,
  },
  document: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  documentType: {
    fontSize: 12,
    color: '#64748b',
  },
});

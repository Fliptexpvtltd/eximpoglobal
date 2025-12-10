import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Input } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { AuthContext } from '../../navigation/AppNavigator';
import { UserRole } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: string;
}

const roles: RoleOption[] = [
  {
    role: 'buyer',
    title: 'Buyer (Importer)',
    description: 'Source products, request quotes, and manage imports',
    icon: 'shopping-cart',
  },
  {
    role: 'seller',
    title: 'Seller (Exporter)',
    description: 'List products, respond to RFQs, and manage exports',
    icon: 'package',
  },
  {
    role: 'both',
    title: 'Buyer & Seller',
    description: 'Access both buying and selling features',
    icon: 'repeat',
  },
  {
    role: 'ops',
    title: 'Operations / Logistics',
    description: 'Manage shipments, tracking, and logistics',
    icon: 'truck',
  },
  {
    role: 'finance',
    title: 'Finance / Compliance',
    description: 'Handle payments, compliance, and documentation',
    icon: 'dollar-sign',
  },
];

export default function RoleSelectionScreen({ navigation }: Props) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleContinue = () => {
    if (selectedRole && companyName) {
      // Create mock user
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        role: selectedRole,
        companyName,
        kycStatus: 'approved',
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Icon name="briefcase" size={50} color="#2563eb" />
        <Text h3 style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>Choose how you'll use the platform</Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.role}
            style={[
              styles.roleCard,
              selectedRole === role.role && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole(role.role)}
          >
            <View style={styles.roleIcon}>
              <Icon 
                name={role.icon} 
                size={32} 
                color={selectedRole === role.role ? '#2563eb' : '#64748b'} 
              />
            </View>
            <View style={styles.roleContent}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </View>
            {selectedRole === role.role && (
              <Icon name="check-circle" size={24} color="#10b981" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedRole && (
        <View style={styles.form}>
          <Text h4 style={styles.formTitle}>Company Information</Text>
          
          <Input
            placeholder="Company Name"
            value={companyName}
            onChangeText={setCompanyName}
            leftIcon={<Icon name="briefcase" size={20} color="#94a3b8" />}
          />
          
          <Input
            placeholder="Industry (Optional)"
            value={industry}
            onChangeText={setIndustry}
            leftIcon={<Icon name="layers" size={20} color="#94a3b8" />}
          />

          <Button
            title="Continue to Dashboard"
            onPress={handleContinue}
            disabled={!companyName}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.continueButton}
            icon={<Icon name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />}
            iconRight
          />
        </View>
      )}

      <Button
        title="Back to Login"
        type="clear"
        onPress={() => navigation.goBack()}
        containerStyle={styles.backButton}
        icon={<Icon name="arrow-left" size={18} color="#64748b" style={{ marginRight: 8 }} />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  rolesContainer: {
    marginVertical: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  roleCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  roleIcon: {
    marginRight: 16,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  form: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
  },
  formTitle: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 8,
  },
  continueButton: {
    paddingVertical: 14,
  },
  backButton: {
    marginTop: 16,
  },
});

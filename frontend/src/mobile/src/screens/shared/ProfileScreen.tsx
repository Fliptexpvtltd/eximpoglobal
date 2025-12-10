import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, ListItem, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../navigation/AppNavigator';

export default function ProfileScreen() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => setUser(null),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          size={80}
          rounded
          title={user?.companyName.substring(0, 2)}
          containerStyle={styles.avatar}
        />
        <Text h4 style={styles.companyName}>{user?.companyName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <ListItem bottomDivider>
          <Icon name="user" size={20} color="#64748b" />
          <ListItem.Content>
            <ListItem.Title>Profile Information</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem bottomDivider>
          <Icon name="shield" size={20} color="#64748b" />
          <ListItem.Content>
            <ListItem.Title>Security Settings</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem bottomDivider>
          <Icon name="bell" size={20} color="#64748b" />
          <ListItem.Content>
            <ListItem.Title>Notifications</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business</Text>
        
        <ListItem bottomDivider>
          <Icon name="briefcase" size={20} color="#64748b" />
          <ListItem.Content>
            <ListItem.Title>Company Details</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem bottomDivider>
          <Icon name="credit-card" size={20} color="#64748b" />
          <ListItem.Content>
            <ListItem.Title>Payment Methods</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem bottomDivider>
          <Icon name="file-text" size={20} color="#64748b" />
          <ListItem.Content>
            <ListItem.Title>Documents & Certificates</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <ListItem bottomDivider>
          <Icon name="help-circle" size={20} color="#64748b" />
          <ListItem.Content>
            <ListItem.Title>Help Center</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem bottomDivider>
          <Icon name="info" size={20} color="#64748b" />
          <ListItem.Content>
            <ListItem.Title>About</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>

      <View style={styles.section}>
        <Button
          title="Logout"
          type="outline"
          onPress={handleLogout}
          buttonStyle={styles.logoutButton}
          titleStyle={styles.logoutText}
          icon={<Icon name="log-out" size={20} color="#ef4444" style={{ marginRight: 8 }} />}
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
  header: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#2563eb',
  },
  companyName: {
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  roleBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  logoutButton: {
    borderColor: '#ef4444',
    marginHorizontal: 16,
  },
  logoutText: {
    color: '#ef4444',
  },
});

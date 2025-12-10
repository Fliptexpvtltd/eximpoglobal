import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('RoleSelection');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="globe" size={60} color="#2563eb" />
          <Text h2 style={styles.title}>EximpoGlobal</Text>
          <Text style={styles.subtitle}>International B2B Commerce</Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={<Icon name="mail" size={20} color="#94a3b8" />}
            autoCorrect={false}
          />
          
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Icon name="lock" size={20} color="#94a3b8" />}
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.loginButton}
          />

          <Text style={styles.orText}>OR</Text>

          <Button
            title="Sign Up / Select Role"
            type="outline"
            onPress={() => navigation.navigate('RoleSelection')}
            containerStyle={styles.buttonContainer}
            icon={<Icon name="user-plus" size={18} color="#2563eb" style={{ marginRight: 8 }} />}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure B2B platform for international trade
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  loginButton: {
    paddingVertical: 14,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#94a3b8',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, UserRole } from '../types';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';

// Main Navigation
import BuyerTabNavigator from './BuyerTabNavigator';
import SellerTabNavigator from './SellerTabNavigator';

export type RootStackParamList = {
  Login: undefined;
  RoleSelection: undefined;
  BuyerApp: undefined;
  SellerApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AuthContext = React.createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export default function AppNavigator() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          </>
        ) : user.role === 'buyer' || user.role === 'both' ? (
          <Stack.Screen name="BuyerApp" component={BuyerTabNavigator} />
        ) : (
          <Stack.Screen name="SellerApp" component={SellerTabNavigator} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}

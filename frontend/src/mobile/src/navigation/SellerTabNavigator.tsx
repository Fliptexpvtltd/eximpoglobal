import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';

// Seller Screens
import SellerDashboardScreen from '../screens/seller/SellerDashboardScreen';
import RFQListScreen from '../screens/seller/RFQListScreen';
import QuoteSubmissionScreen from '../screens/seller/QuoteSubmissionScreen';
import SellerOrdersScreen from '../screens/seller/SellerOrdersScreen';

// Shared Screens
import ChatScreen from '../screens/shared/ChatScreen';
import AnalyticsScreen from '../screens/shared/AnalyticsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

export type SellerTabParamList = {
  Dashboard: undefined;
  RFQs: undefined;
  Orders: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type RFQStackParamList = {
  RFQList: undefined;
  QuoteSubmission: { rfqId: string };
};

const Tab = createBottomTabNavigator<SellerTabParamList>();
const RFQStack = createNativeStackNavigator<RFQStackParamList>();

function RFQNavigator() {
  return (
    <RFQStack.Navigator>
      <RFQStack.Screen 
        name="RFQList" 
        component={RFQListScreen}
        options={{ title: 'Incoming RFQs' }}
      />
      <RFQStack.Screen 
        name="QuoteSubmission" 
        component={QuoteSubmissionScreen}
        options={{ title: 'Submit Quote' }}
      />
    </RFQStack.Navigator>
  );
}

export default function SellerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'RFQs') iconName = 'file-text';
          else if (route.name === 'Orders') iconName = 'package';
          else if (route.name === 'Messages') iconName = 'message-circle';
          else if (route.name === 'Profile') iconName = 'user';
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={SellerDashboardScreen} />
      <Tab.Screen name="RFQs" component={RFQNavigator} />
      <Tab.Screen name="Orders" component={SellerOrdersScreen} />
      <Tab.Screen name="Messages" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

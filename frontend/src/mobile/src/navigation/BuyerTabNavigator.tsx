import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';

// Buyer Screens
import BuyerDashboardScreen from '../screens/buyer/BuyerDashboardScreen';
import CatalogScreen from '../screens/buyer/CatalogScreen';
import ProductDetailScreen from '../screens/buyer/ProductDetailScreen';
import RFQBuilderScreen from '../screens/buyer/RFQBuilderScreen';
import QuoteComparisonScreen from '../screens/buyer/QuoteComparisonScreen';
import OrdersScreen from '../screens/buyer/OrdersScreen';
import PurchaseOrderScreen from '../screens/buyer/PurchaseOrderScreen';
import ShipmentTrackingScreen from '../screens/buyer/ShipmentTrackingScreen';

// Shared Screens
import ChatScreen from '../screens/shared/ChatScreen';
import AnalyticsScreen from '../screens/shared/AnalyticsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SupplierProfileScreen from '../screens/shared/SupplierProfileScreen';

export type BuyerTabParamList = {
  Dashboard: undefined;
  Catalog: undefined;
  Messages: undefined;
  Analytics: undefined;
  Profile: undefined;
};

export type CatalogStackParamList = {
  CatalogList: undefined;
  ProductDetail: { productId: string };
  RFQBuilder: { productId?: string };
  SupplierProfile: { supplierId: string };
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  QuoteComparison: { rfqId: string };
  Orders: undefined;
  PurchaseOrder: { quoteId?: string; poId?: string };
  ShipmentTracking: { poId: string };
};

const Tab = createBottomTabNavigator<BuyerTabParamList>();
const CatalogStack = createNativeStackNavigator<CatalogStackParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();

function CatalogNavigator() {
  return (
    <CatalogStack.Navigator>
      <CatalogStack.Screen 
        name="CatalogList" 
        component={CatalogScreen}
        options={{ title: 'Product Catalog' }}
      />
      <CatalogStack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
      <CatalogStack.Screen 
        name="RFQBuilder" 
        component={RFQBuilderScreen}
        options={{ title: 'Request Quote' }}
      />
      <CatalogStack.Screen 
        name="SupplierProfile" 
        component={SupplierProfileScreen}
        options={{ headerShown: false }}
      />
    </CatalogStack.Navigator>
  );
}

function DashboardNavigator() {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen 
        name="DashboardHome" 
        component={BuyerDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <DashboardStack.Screen 
        name="QuoteComparison" 
        component={QuoteComparisonScreen}
        options={{ title: 'Compare Quotes' }}
      />
      <DashboardStack.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'My Orders' }}
      />
      <DashboardStack.Screen 
        name="PurchaseOrder" 
        component={PurchaseOrderScreen}
        options={{ title: 'Purchase Order' }}
      />
      <DashboardStack.Screen 
        name="ShipmentTracking" 
        component={ShipmentTrackingScreen}
        options={{ title: 'Track Shipment' }}
      />
    </DashboardStack.Navigator>
  );
}

export default function BuyerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Catalog') iconName = 'shopping-bag';
          else if (route.name === 'Messages') iconName = 'message-circle';
          else if (route.name === 'Analytics') iconName = 'bar-chart-2';
          else if (route.name === 'Profile') iconName = 'user';
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardNavigator} />
      <Tab.Screen name="Catalog" component={CatalogNavigator} />
      <Tab.Screen name="Messages" component={ChatScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

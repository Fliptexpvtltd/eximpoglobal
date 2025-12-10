# Trade Platform Mobile App

This is the React Native mobile application for the International Trade B2B Platform, built with Expo.

## 📱 Features

- **Authentication**: Login and role selection
- **Buyer Features**:
  - Product catalog with search and filtering
  - Product detail pages
  - RFQ (Request for Quote) builder
  - Quote comparison
  - Purchase order management
  - Shipment tracking
  - Analytics dashboard
  - Real-time messaging

- **Seller Features**:
  - Incoming RFQ management
  - Quote submission
  - Order management
  - Analytics and reporting

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For Android: Android Studio with Android SDK
- For iOS: Xcode (Mac only)

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Running on Device/Emulator

#### Option 1: Expo Go (Easiest)
1. Install **Expo Go** app from Google Play Store (Android) or App Store (iOS)
2. Run `npm start`
3. Scan the QR code with your phone
4. App loads instantly on your device

#### Option 2: Android Emulator
1. Start Android Studio and launch an emulator
2. Run:
```bash
npm run android
```

#### Option 3: iOS Simulator (Mac only)
1. Install Xcode from Mac App Store
2. Run:
```bash
npm run ios
```

## 📂 Project Structure

```
mobile/
├── App.tsx                         # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── src/
│   ├── navigation/                 # Navigation setup
│   │   ├── AppNavigator.tsx       # Main navigator
│   │   ├── BuyerTabNavigator.tsx  # Buyer bottom tabs
│   │   └── SellerTabNavigator.tsx # Seller bottom tabs
│   ├── screens/                    # All app screens
│   │   ├── auth/                  # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RoleSelectionScreen.tsx
│   │   ├── buyer/                 # Buyer-specific screens
│   │   │   ├── BuyerDashboardScreen.tsx
│   │   │   ├── CatalogScreen.tsx
│   │   │   ├── ProductDetailScreen.tsx
│   │   │   ├── RFQBuilderScreen.tsx
│   │   │   ├── QuoteComparisonScreen.tsx
│   │   │   ├── OrdersScreen.tsx
│   │   │   ├── PurchaseOrderScreen.tsx
│   │   │   └── ShipmentTrackingScreen.tsx
│   │   ├── seller/                # Seller-specific screens
│   │   │   ├── SellerDashboardScreen.tsx
│   │   │   ├── RFQListScreen.tsx
│   │   │   ├── QuoteSubmissionScreen.tsx
│   │   │   └── SellerOrdersScreen.tsx
│   │   └── shared/                # Shared screens
│   │       ├── ChatScreen.tsx
│   │       ├── AnalyticsScreen.tsx
│   │       └── ProfileScreen.tsx
│   ├── types/                      # TypeScript interfaces
│   │   └── index.ts
│   ├── services/                   # API and mock data
│   │   └── mockData.ts
│   └── theme/                      # App theme
│       └── index.ts
└── assets/                         # Images, fonts, etc.
```

## 🎨 UI Components

The app uses **React Native Elements** for consistent UI:

- **Button**: Primary, outline, and clear variants
- **Input**: Text inputs with icons
- **Card**: Content containers
- **Badge**: Status indicators
- **SearchBar**: Product search
- **Icon**: Feather icons via react-native-vector-icons

## 🧪 Testing

### Quick Test Flow (5 minutes)

1. **Login**: Launch app, use any email/password
2. **Select Role**: Choose "Buyer (Importer)"
3. **Dashboard**: See overview with stats, RFQs, and orders
4. **Catalog**: Tap "Catalog" tab, browse products
5. **Product Detail**: Tap any product to view details
6. **Request Quote**: Tap "Request Quote" button
7. **RFQ Form**: Fill out quantity, incoterm, destination
8. **Submit**: View quote comparison
9. **Messages**: Tap "Messages" tab to see conversations
10. **Analytics**: View business metrics

### Test as Seller

1. Logout from profile menu
2. Login again and select "Seller (Exporter)"
3. View incoming RFQs
4. Submit quotes
5. Manage orders

## 📝 Mock Data

The app includes comprehensive mock data in `src/services/mockData.ts`:

- 6 sample products (various categories)
- 3 RFQs with different statuses
- Multiple quotes for comparison
- 3 purchase orders
- Shipment tracking data
- Chat conversations

## 🔧 Configuration

### App Configuration (app.json)

- **App Name**: Trade Platform
- **Package ID**: com.tradeplatform.app
- **Orientation**: Portrait
- **Permissions**: Camera, Storage (for document uploads)

### Theme Customization (src/theme/index.ts)

Modify colors, component styles, and typography:

```typescript
export const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  // ... more colors
};
```

## 🚢 Building for Production

### Android APK

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure build:
```bash
eas build:configure
```

4. Build APK (for testing):
```bash
eas build --platform android --profile preview
```

5. Build AAB (for Google Play):
```bash
eas build --platform android --profile production
```

### iOS App (Mac only)

```bash
eas build --platform ios --profile production
```

## 🔄 Syncing with Web App

To keep data in sync between web and mobile:

1. **Shared Types**: Use the same TypeScript interfaces
2. **API Layer**: When backend is added, use same API endpoints
3. **Business Logic**: Extract common logic to shared package
4. **State Management**: Consider adding Redux or Zustand

### Monorepo Setup (Recommended)

```
trade-platform/
├── packages/
│   ├── web/         ← Your existing web app
│   ├── mobile/      ← This React Native app
│   └── shared/      ← Shared types and logic
```

## 📦 Key Dependencies

- **expo**: ~50.0.0
- **react**: 18.2.0
- **react-native**: 0.73.0
- **@react-navigation/native**: Navigation
- **@react-navigation/native-stack**: Stack navigation
- **@react-navigation/bottom-tabs**: Bottom tab navigation
- **@rneui/themed**: UI component library
- **react-native-vector-icons**: Icons
- **react-native-chart-kit**: Charts for analytics
- **dayjs**: Date manipulation

## 🐛 Common Issues

### Metro Bundler Issues
```bash
# Clear cache
npx expo start --clear
```

### Android Build Errors
```bash
cd android
./gradlew clean
cd ..
npx expo start
```

### iOS Build Errors
```bash
cd ios
pod install
cd ..
npx expo start
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

## 🔐 Environment Variables

For production, add these to your Expo secrets:

- `API_URL`: Backend API endpoint
- `SUPABASE_URL`: If using Supabase
- `SUPABASE_KEY`: Supabase anon key

## 📱 Platform-Specific Features

### Android
- Material Design components
- Back button handling
- Status bar customization
- Push notifications via FCM

### iOS
- iOS native design
- Face ID / Touch ID authentication
- Apple Push Notification Service
- Safe area handling

## 🚀 Deployment

### TestFlight (iOS)
1. Build with `eas build --platform ios`
2. Upload to App Store Connect
3. Add testers in TestFlight
4. Distribute test builds

### Google Play Internal Testing
1. Build AAB with `eas build --platform android --profile production`
2. Upload to Google Play Console
3. Create internal testing track
4. Invite testers

### Production Release
1. Complete app store listings
2. Submit for review
3. Google Play: ~2-7 days review
4. App Store: ~24-48 hours review

## 📊 Analytics Integration

Add analytics to track user behavior:

```bash
npm install expo-firebase-analytics
```

Or use alternatives:
- Amplitude
- Mixpanel
- Segment

## 🔔 Push Notifications

Expo provides built-in push notifications:

```typescript
import * as Notifications from 'expo-notifications';

// Request permissions
const { status } = await Notifications.requestPermissionsAsync();

// Send notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: "New Quote Received",
    body: 'You have a new quote for RFQ #12345',
  },
  trigger: null,
});
```

## 🌐 Offline Support

Add offline capabilities:

```bash
npm install @react-native-async-storage/async-storage
```

Store critical data locally for offline access.

## 🎯 Performance Optimization

- Use `React.memo` for expensive components
- Implement `FlatList` for long lists (already done)
- Lazy load images
- Optimize bundle size with Hermes engine
- Enable ProGuard for Android

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Elements](https://reactnativeelements.com/)
- [React Native](https://reactnative.dev/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test on both Android and iOS
4. Submit pull request

## 📄 License

Same as parent project.

## 💬 Support

For issues or questions:
1. Check this README
2. Review Expo documentation
3. Check React Native community forums

---

**Happy Mobile Development! 📱✨**

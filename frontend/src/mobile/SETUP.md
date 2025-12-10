# Android App Setup Guide

## 🚀 Quick Start

### Prerequisites
```bash
# Install Node.js (v16+)
# Download from: https://nodejs.org/

# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI (for building APKs)
npm install -g eas-cli
```

### Step 1: Install Dependencies
```bash
cd mobile
npm install
```

### Step 2: Start Development Server
```bash
npx expo start
```

### Step 3: Run on Your Device

#### Option A: Expo Go (Easiest - Instant Testing)
1. Install **Expo Go** from Google Play Store
2. Scan the QR code shown in your terminal
3. App loads instantly on your phone!

#### Option B: Android Emulator
1. Install Android Studio: https://developer.android.com/studio
2. Set up Android emulator
3. Run:
```bash
npx expo run:android
```

## 📱 Building APK for Distribution

### Method 1: Using EAS Build (Recommended)

```bash
# Login to Expo
eas login

# Configure EAS (first time only)
eas build:configure

# Build preview APK for testing
eas build --platform android --profile preview

# Build production AAB for Google Play
eas build --platform android --profile production
```

The build takes ~10-15 minutes. You'll get a download link when complete.

### Method 2: Local Build

```bash
# Install dependencies
npm install

# Create local build
npx expo prebuild

# Build APK
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## 🔧 Project Structure

```
mobile/
├── App.tsx                   # Entry point
├── app.json                  # Expo config
├── package.json              # Dependencies
└── src/
    ├── navigation/           # App navigation
    ├── screens/              # All screens
    │   ├── auth/            # Login, Role Selection
    │   ├── buyer/           # Buyer screens
    │   ├── seller/          # Seller screens
    │   └── shared/          # Shared screens
    ├── types/               # TypeScript types
    ├── services/            # Mock data & APIs
    └── theme/               # App styling
```

## 📝 Required Permissions

Update `app.json` if you need additional permissions:

```json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",                    // For document scanning
        "READ_EXTERNAL_STORAGE",     // For file uploads
        "WRITE_EXTERNAL_STORAGE"     // For downloads
      ]
    }
  }
}
```

## 🎨 Customization

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change App Icon
Replace these files in `/assets`:
- `icon.png` (1024x1024)
- `splash.png` (2048x2732)
- `adaptive-icon.png` (1024x1024) for Android

### Change Theme Colors
Edit `src/theme/index.ts`:
```typescript
export const colors = {
  primary: '#2563eb',      // Change primary color
  secondary: '#64748b',    // Change secondary color
  // ... other colors
};
```

### Change Package Name (Android)
Edit `app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

## 🔐 Environment Setup

For production, create `eas.json`:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## 🧪 Testing

### Test Login Flow
1. Open app
2. Enter any email/password → Click Login
3. Select role (Buyer or Seller)
4. Enter company name → Continue
5. Explore dashboard and features

### Test as Buyer
- Browse product catalog
- View product details
- Create RFQ (Request for Quote)
- Compare quotes
- View orders
- Track shipments

### Test as Seller
- View incoming RFQs
- Submit quotes
- Manage orders
- View analytics

## 🐛 Troubleshooting

### "Metro bundler not responding"
```bash
npx expo start --clear
```

### "Module not found"
```bash
rm -rf node_modules
npm install
```

### "Android build failed"
```bash
cd android
./gradlew clean
cd ..
npx expo start
```

### "Expo Go not connecting"
- Ensure phone and computer are on same WiFi
- Try scanning QR code again
- Or manually enter URL shown in terminal

## 📦 Additional Packages

### Already Installed
- ✅ React Navigation (for navigation)
- ✅ React Native Elements (UI components)
- ✅ Vector Icons (for icons)
- ✅ React Native Chart Kit (for charts)
- ✅ Safe Area Context (for device notches)

### Optional Additions

#### Push Notifications
```bash
npx expo install expo-notifications
```

#### Camera Access
```bash
npx expo install expo-camera expo-image-picker
```

#### Document Picker
```bash
npx expo install expo-document-picker
```

#### Async Storage
```bash
npx expo install @react-native-async-storage/async-storage
```

#### Biometric Auth
```bash
npx expo install expo-local-authentication
```

## 🌐 Backend Integration

When ready to connect to real backend:

1. **Create API Service**
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api.com',
});

export const getProducts = () => api.get('/products');
export const submitRFQ = (data) => api.post('/rfqs', data);
// ... more endpoints
```

2. **Replace Mock Data**
Update screens to use real API calls instead of `mockData.ts`

3. **Add Authentication**
Implement JWT tokens, session management, etc.

## 📲 Deployment Checklist

### Before Publishing:

- [ ] Test on real Android device
- [ ] Test all user flows
- [ ] Update app name and description
- [ ] Add app icon and splash screen
- [ ] Configure package name
- [ ] Set version number
- [ ] Build production APK/AAB
- [ ] Test production build
- [ ] Create Google Play listing
- [ ] Add screenshots
- [ ] Write app description
- [ ] Submit for review

### Google Play Store Steps:

1. Create Google Play Console account ($25 one-time fee)
2. Create app in console
3. Upload AAB file (from EAS build)
4. Fill out store listing:
   - App name
   - Description
   - Screenshots (phone & tablet)
   - Category
   - Content rating
5. Set up pricing (Free or Paid)
6. Submit for review (takes 2-7 days)

## 🔗 Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [React Native Elements](https://reactnativeelements.com/)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)

## 💡 Tips

1. **Development**: Use Expo Go for instant testing while developing
2. **Testing**: Build preview APK to share with testers
3. **Production**: Use EAS Build for Google Play submission
4. **Updates**: Use Expo OTA updates to push fixes without app store review
5. **Monitoring**: Add crash reporting (Sentry, Bugsnag)
6. **Analytics**: Add analytics (Firebase, Amplitude)

## 🎯 Next Steps

1. **Complete Testing**: Test all features thoroughly
2. **Add Backend**: Connect to real API
3. **Add Auth**: Implement real authentication
4. **Polish UI**: Refine based on user feedback
5. **Add Features**: Payment integration, notifications
6. **Submit to Store**: Publish on Google Play

## ❓ FAQ

**Q: Do I need a Mac for Android development?**
A: No! You can develop and build Android apps on Windows, Mac, or Linux.

**Q: How much does it cost?**
A: Free for development. $25 one-time for Google Play. Optional: Expo paid plans for more builds.

**Q: Can I build for iOS too?**
A: Yes! Same code works for iOS. You'll need a Mac and Apple Developer account ($99/year).

**Q: How do I update the app after publishing?**
A: Build new version, increment version number, upload to Google Play.

**Q: Can I use this with my existing backend?**
A: Yes! Replace mock data with real API calls to your backend.

---

**Need Help?** Check the main README.md or Expo documentation!

**Happy Building! 🚀📱**

# Mobile Bottom Navigation

## Overview
The web app now includes a mobile-optimized bottom navigation bar that appears on devices with screens smaller than 1024px (lg breakpoint). This gives the web app a native mobile app feel.

## Features

### Bottom Tab Bar
- **5 Navigation Tabs**: Dashboard, Catalog, Messages, Analytics, Profile
- **Fixed Position**: Stays at the bottom of the screen during scrolling
- **Active State**: Currently active tab is highlighted in blue
- **Icon + Label**: Each tab shows an icon and label for clarity

### Mobile Optimizations
1. **Responsive Layout**: Bottom nav only shows on mobile/tablet (< 1024px)
2. **Safe Area Support**: Respects iOS notch and home indicator areas
3. **Touch Optimized**: 64px (h-16) touch targets for easy thumb navigation
4. **Proper Spacing**: Main content has bottom padding (pb-24) to prevent overlap

## How to Test

### On Desktop Browser
1. Open the app in Chrome/Firefox/Safari
2. Open DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
4. Select a mobile device (e.g., iPhone 12/13)
5. **OR** Resize browser window to < 1024px wide
6. Login to see the bottom navigation

### Expected Behavior
- On **screens ≥ 1024px**: Top navigation bar only (desktop mode)
- On **screens < 1024px**: Top navigation bar + bottom tab bar (mobile mode)
- Bottom bar should be visible at all times when scrolling
- Tapping a tab should navigate to that view and highlight it

## Navigation Tabs

### For Buyers
1. **Dashboard** (Home icon) - View buyer dashboard
2. **Catalog** (Shopping bag icon) - Browse products
3. **Messages** (Message circle icon) - Chat with sellers
4. **Analytics** (Bar chart icon) - View analytics
5. **Profile** (User icon) - Account settings

### For Sellers
1. **Dashboard** (Home icon) - View seller dashboard
2. **Products** (Shopping bag icon) - Manage products
3. **Messages** (Message circle icon) - Chat with buyers
4. **Analytics** (Bar chart icon) - View analytics
5. **Profile** (User icon) - Account settings

## Components Modified

### New Components
- `/components/MobileBottomNav.tsx` - Bottom navigation component
- `/components/Profile.tsx` - Profile/settings screen

### Updated Components
- `/App.tsx` - Added MobileBottomNav, Profile view, and bottom padding
- `/styles/globals.css` - Added safe-area and mobile optimizations
- `/index.html` - Updated viewport meta tag for mobile
- `/components/ChatInterface.tsx` - Mobile responsive chat
- `/components/ProductDetail.tsx` - Mobile responsive product details
- `/components/ShipmentTracking.tsx` - Mobile responsive tracking
- `/components/SellerDashboard.tsx` - Mobile responsive dashboard

## Troubleshooting

### Bottom nav not visible
1. **Check screen size**: Must be < 1024px wide
2. **Check if logged in**: Bottom nav only shows for authenticated users
3. **Check browser zoom**: Reset to 100%
4. **Clear cache**: Hard reload (Ctrl+Shift+R)

### Content hidden behind bottom bar
- Main content should have `pb-24` (96px) padding on mobile
- This is already applied in App.tsx

### Tab not highlighting
- Make sure `currentView` matches the tab's `id`
- Check browser console for any errors

## Implementation Details

### CSS Classes Used
```tsx
// Bottom Navigation
className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"

// Active Tab
className="text-blue-600"

// Inactive Tab
className="text-gray-500"

// Main Content Padding
className="pb-24 lg:pb-6"
```

### Safe Area Support
```css
.safe-area-bottom {
  padding-bottom: max(0px, env(safe-area-inset-bottom));
}
```

This ensures the navigation doesn't get hidden by iOS home indicators or Android navigation gestures.

## Future Enhancements
- [ ] Add haptic feedback on tab press
- [ ] Add smooth transitions between views
- [ ] Add badge notifications on Messages tab
- [ ] Swipe gestures for navigation
- [ ] Pull-to-refresh on list views

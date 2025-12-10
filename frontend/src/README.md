# EximpoGlobal - International Trade Platform

A comprehensive e-commerce platform for international trade with features for buyers, sellers, logistics partners, finance/compliance teams, and administrators.

## 🚀 Features

### Core Personas
- **Buyer (Importer)**: Product discovery, RFQ creation, quote comparison, purchase orders
- **Seller (Exporter)**: Product listings, quote submissions, order management
- **Ops/Logistics Partner**: Shipment tracking, document management
- **Finance/Compliance**: Payment processing, escrow, compliance checking
- **Admin**: Platform management and analytics

### Key Features
- ✅ Authentication with role selection
- ✅ Product catalog with advanced filtering (HS codes, certifications, MOQ, lead times)
- ✅ RFQ builder and management
- ✅ Quote comparison
- ✅ Secure messaging
- ✅ Purchase order creation with payment terms
- ✅ Shipment tracking
- ✅ Analytics dashboards
- ✅ Multi-currency support (Primary: INR ₹)
- ✅ Incoterms support
- ✅ International trade documentation (certificates of origin, commercial invoices, etc.)

## 📦 Tech Stack

### Web Application
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **Deployment**: Netlify

### Mobile Application
- **Framework**: React Native + Expo
- **Navigation**: React Navigation
- **UI**: React Native Elements
- **Location**: `/mobile/` directory

## 🛠️ Installation & Setup

### Web Application

#### Prerequisites
- Node.js 20 or higher
- npm or yarn

#### Install Dependencies
```bash
npm install
# or
yarn install
```

#### Development
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

#### Build for Production
```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

#### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Mobile Application

See `/mobile/README.md` and `/mobile/SETUP.md` for detailed mobile app setup instructions.

The mobile app is a separate React Native Expo project located in the `/mobile/` directory.

## 🌐 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Connect your GitHub/GitLab repository to Netlify
   - Netlify will automatically detect the build settings from `netlify.toml`

2. **Environment Variables** (if needed)
   - Set any required environment variables in Netlify dashboard
   - Go to Site Settings → Environment Variables

3. **Deploy**
   - Push to your main branch
   - Netlify will automatically build and deploy

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to your hosting provider

### Vercel Deployment

```bash
npm i -g vercel
vercel
```

## 📱 Mobile App

The mobile app is a complete React Native application with all features from the web app:

### Setup Mobile Development
```bash
cd mobile
npm install
npm start
```

For detailed mobile setup instructions, see:
- `/mobile/README.md` - Overview and features
- `/mobile/SETUP.md` - Detailed setup instructions
- `/MOBILE_MIGRATION_GUIDE.md` - Migration guide and architecture
- `/QUICK_START_MOBILE.md` - Quick start guide

## 🗂️ Project Structure

```
/
├── App.tsx                      # Main web app component
├── main.tsx                     # Web app entry point
├── index.html                   # HTML template
├── components/                  # React components
│   ├── BuyerDashboard.tsx
│   ├── Catalog.tsx
│   ├── RFQBuilder.tsx
│   ├── QuoteComparison.tsx
│   ├── PurchaseOrder.tsx
│   ├── ShipmentTracking.tsx
│   ├── SellerDashboard.tsx
│   ├── Analytics.tsx
│   ├── ChatInterface.tsx
│   ├── SupplierProfile.tsx
│   ├── MobilePreview.tsx        # Mobile app preview
│   └── ui/                      # shadcn/ui components
├── styles/
│   └── globals.css              # Global styles and Tailwind
├── mobile/                      # React Native mobile app (separate project)
│   ├── App.tsx
│   ├── package.json
│   ├── src/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── theme/
│   │   └── types/
│   └── README.md
├── package.json                 # Web app dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── netlify.toml                # Netlify configuration
└── README.md                   # This file
```

## 🔧 Configuration Files

- **package.json**: Dependencies and scripts
- **vite.config.ts**: Vite build configuration
- **tsconfig.json**: TypeScript compiler options
- **netlify.toml**: Netlify build and deployment settings
- **postcss.config.js**: PostCSS configuration for Tailwind
- **.nvmrc**: Node version specification
- **.gitignore**: Git ignore patterns

## 🌍 Internationalization

- Primary currency: INR (₹)
- Supports multiple currencies for international trade
- Incoterms support (FOB, CIF, EXW, etc.)
- Multi-country origin tracking

## 📄 License

Copyright © 2025 EximpoGlobal. All rights reserved.

## 🤝 Support

For issues or questions:
1. Check the documentation files in the repository
2. Review the migration guides for mobile development
3. Check the testing guide for quality assurance

---

**Note**: The mobile app in `/mobile/` is a separate project with its own dependencies and build process. It is not deployed with the web app but can be built separately for iOS and Android using Expo.

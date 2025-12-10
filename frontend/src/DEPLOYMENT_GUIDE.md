# Deployment Guide - EximpoGlobal

This guide covers deploying the EximpoGlobal web application to Netlify and other hosting platforms.

## 📋 Prerequisites

- Node.js 20 or higher
- npm or yarn
- Git repository (GitHub, GitLab, or Bitbucket)
- Netlify account (for Netlify deployment)

## 🚀 Netlify Deployment

### Option 1: Automatic Deployment via Git (Recommended)

1. **Push Code to Git Repository**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   
   Netlify will automatically detect settings from `netlify.toml`, but verify:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 20 (from `.nvmrc`)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site
   - You'll get a random subdomain like `random-name-123.netlify.app`

5. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 2: Netlify CLI Deployment

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 3: Manual Drag & Drop

1. **Build the Project**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop the `dist` folder
   - Your site will be live immediately

## 🔧 Build Configuration

The project includes the following configuration files:

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"
  ignore = "git diff --quiet HEAD^ HEAD -- . ':(exclude)mobile/'"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### .nvmrc
Specifies Node.js version 20 for consistent builds.

### package.json
Contains all dependencies and build scripts:
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## 🌐 Other Deployment Options

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

Or connect via [vercel.com](https://vercel.com) dashboard.

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/yourrepo"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Custom Server

1. **Build**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your server

3. **Configure Web Server**
   
   **Nginx:**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     root /path/to/dist;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

   **Apache (.htaccess):**
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

## 🐛 Troubleshooting

### Build Fails on Netlify

**Issue**: "Failed during stage 'Install dependencies'"

**Solutions**:
1. Check Node version matches `.nvmrc` (should be 20)
2. Verify `package.json` is at project root
3. Check build logs for specific error
4. Try clearing build cache: Deploy settings → Clear cache and retry

**Issue**: "Command failed with exit code 1"

**Solutions**:
1. Run `npm run build` locally to see full error
2. Check TypeScript errors
3. Verify all imports are correct
4. Check that all files are committed to Git

### Mobile Directory Causing Issues

The `/mobile/` directory is automatically excluded from web builds:
- `.gitignore` excludes `mobile/node_modules`
- `netlify.toml` ignores mobile changes
- `tsconfig.json` excludes mobile directory

If mobile files cause issues:
1. Ensure `mobile/` is in `.gitignore` for node_modules
2. Verify `netlify.toml` ignore pattern is correct
3. Check that `tsconfig.json` excludes mobile

### 404 on Page Refresh

**Issue**: Routes work on initial load but show 404 on refresh

**Solution**: Already configured in `netlify.toml` redirects:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

If still having issues, add `_redirects` file:
```
/*    /index.html   200
```

### Build Timeout

**Issue**: Build takes too long and times out

**Solutions**:
1. Increase Netlify build timeout (requires paid plan)
2. Optimize dependencies
3. Use build caching
4. Check for infinite loops in build scripts

## 📊 Environment Variables

If you need environment variables:

1. **Create `.env` file** (don't commit this):
   ```env
   VITE_API_URL=https://api.example.com
   ```

2. **Add to Netlify**:
   - Go to Site Settings → Environment Variables
   - Add each variable
   - Redeploy to apply

3. **Access in code**:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

## 🔒 Security Headers

Already configured in `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 📱 Mobile App Deployment

The React Native mobile app in `/mobile/` is deployed separately:

### Expo Build
```bash
cd mobile
npm install
eas build --platform android
eas build --platform ios
```

See `/mobile/SETUP.md` for detailed mobile deployment instructions.

## ✅ Pre-Deployment Checklist

- [ ] All code is committed to Git
- [ ] `npm run build` works locally
- [ ] No TypeScript errors
- [ ] All images load correctly
- [ ] Environment variables are configured (if needed)
- [ ] Custom domain DNS is configured (if using)
- [ ] Analytics are set up (if needed)
- [ ] Error monitoring is configured (if needed)

## 🎯 Post-Deployment

After successful deployment:

1. **Test all features**:
   - Login/authentication
   - Product catalog and filtering
   - RFQ creation
   - Quote comparison
   - Purchase orders
   - Shipment tracking
   - Analytics dashboard

2. **Check performance**:
   - Use Lighthouse for performance audit
   - Check mobile responsiveness
   - Test on different browsers

3. **Monitor**:
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Configure analytics (Google Analytics, Plausible, etc.)
   - Monitor build times and deployments

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment Guide](https://react.dev/learn/start-a-new-react-project#deploying-to-production)

---

**Need Help?**

If you encounter issues:
1. Check the Netlify deploy logs
2. Run `npm run build` locally to debug
3. Review the error message and search documentation
4. Check this guide's troubleshooting section

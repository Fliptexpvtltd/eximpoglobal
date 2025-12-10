# Troubleshooting Guide - EximpoGlobal Deployment

## Common Netlify Build Errors & Solutions

### Error: "Failed during stage 'Install dependencies'"

**Cause**: Issues with package.json, npm, or dependency installation

**Solutions**:

1. **Check Node version**
   - Ensure `.nvmrc` contains just `20`
   - In Netlify UI: Site Settings → Build & Deploy → Environment → Node version = 20

2. **Clear Netlify cache**
   - Go to: Deploys → Trigger deploy → Clear cache and deploy site

3. **Test locally**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

4. **Check .npmrc file**
   - Should contain:
   ```
   engine-strict=false
   legacy-peer-deps=false
   ```

### Error: TypeScript compilation errors

**Cause**: Type errors in code

**Solutions**:

1. **Find the errors**
   ```bash
   npx tsc --noEmit
   ```

2. **Common fixes**:
   - Missing type definitions: `npm install --save-dev @types/packagename`
   - Import errors: Check file paths and extensions
   - Strict mode errors: Add type annotations

3. **Temporary workaround** (not recommended for production):
   Edit `package.json`:
   ```json
   "scripts": {
     "build": "vite build"  // Remove "tsc &&"
   }
   ```

### Error: Module not found / Cannot find module

**Cause**: Missing dependencies or incorrect imports

**Solutions**:

1. **Check if package is installed**
   ```bash
   npm list packagename
   ```

2. **Install missing package**
   ```bash
   npm install packagename
   ```

3. **Check import paths**
   - Use relative paths: `./components/Component`
   - Not absolute paths without alias: `/components/Component`

4. **Verify path aliases in tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

### Error: PostCSS/Tailwind CSS errors

**Cause**: Tailwind CSS 4.0 configuration issues

**Solutions**:

1. **Check postcss.config.js**
   ```js
   export default {
     plugins: {
       '@tailwindcss/postcss': {},
       autoprefixer: {},
     },
   };
   ```

2. **Check package.json has correct packages**
   ```json
   {
     "devDependencies": {
       "@tailwindcss/postcss": "^4.0.0",
       "tailwindcss": "^4.0.0",
       "autoprefixer": "^10.4.20",
       "postcss": "^8.4.49"
     }
   }
   ```

3. **Check styles/globals.css starts with**
   ```css
   @import "tailwindcss";
   ```

### Error: Vite build errors

**Cause**: Vite configuration or build issues

**Solutions**:

1. **Check vite.config.ts exists and is valid**
   ```ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import path from 'path';

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './'),
       },
     },
   });
   ```

2. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

### Error: ESLint errors blocking build

**Cause**: Linting errors in code

**Solutions**:

1. **Disable ESLint in build** (temporary)
   Edit `package.json`:
   ```json
   "scripts": {
     "build": "tsc && vite build --mode production",
     "lint": "eslint . --ext ts,tsx"
   }
   ```

2. **Fix ESLint errors**
   ```bash
   npm run lint
   # Fix issues shown
   ```

3. **Auto-fix some issues**
   ```bash
   npm run lint -- --fix
   ```

### Error: Out of memory during build

**Cause**: Large dependencies or complex build

**Solutions**:

1. **Increase Node memory** in `netlify.toml`
   ```toml
   [build.environment]
     NODE_VERSION = "20"
     NODE_OPTIONS = "--max-old-space-size=4096"
   ```

2. **Optimize build in vite.config.ts**
   ```ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom'],
             'ui-vendor': ['lucide-react', 'recharts'],
           },
         },
       },
     },
   });
   ```

## Mobile Directory Issues

### Error: Mobile build affecting web build

**Solution**: Ensure proper exclusion

1. **Check .gitignore includes**
   ```
   mobile/node_modules
   mobile/dist
   mobile/.expo
   ```

2. **Check tsconfig.json excludes mobile**
   ```json
   {
     "exclude": ["node_modules", "mobile"]
   }
   ```

3. **Check netlify.toml ignores mobile**
   ```toml
   [build]
     ignore = "git diff --quiet HEAD^ HEAD -- . ':(exclude)mobile/'"
   ```

## File-Specific Checks

### .nvmrc
Should contain only:
```
20
```

### .npmrc
Should contain:
```
engine-strict=false
legacy-peer-deps=false
```

### .gitignore
Should NOT exclude:
- `package.json`
- `package-lock.json` (unless using yarn)
- `vite.config.ts`
- `tsconfig.json`
- `netlify.toml`
- Source files (`.tsx`, `.ts`, `.css`)

## Local Testing Checklist

Before deploying, test locally:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Check TypeScript
npx tsc --noEmit

# 3. Run linter
npm run lint

# 4. Build
npm run build

# 5. Preview
npm run preview
```

All commands should succeed without errors.

## Netlify-Specific Checks

1. **Build Settings in Netlify UI**
   - Base directory: (leave empty)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20

2. **Environment Variables**
   - Check if any are required
   - Add them in: Site Settings → Environment Variables

3. **Build Logs**
   - Always check full build log
   - Look for first error (not last)
   - Search for keywords: `Error`, `ERR!`, `Failed`

## Getting Help

When asking for help, provide:

1. **Full error message** from Netlify build log
2. **Local test results** (`npm run build` output)
3. **File contents** of:
   - `package.json`
   - `netlify.toml`
   - `.nvmrc`
   - `.npmrc`
4. **Node version**: `node --version`
5. **npm version**: `npm --version`

## Quick Fixes Reference

| Error Contains | Quick Fix |
|---------------|-----------|
| "Failed during stage 'Install dependencies'" | Check `.nvmrc`, clear cache, check `package.json` |
| "Cannot find module" | Install missing package: `npm install packagename` |
| "Type error" | Run `npx tsc --noEmit` and fix type errors |
| "PostCSS" | Check `postcss.config.js` and Tailwind packages |
| "Out of memory" | Add `NODE_OPTIONS` to `netlify.toml` |
| "ESLint" | Fix lint errors or disable ESLint in build |
| "Mobile" | Exclude mobile directory in configs |

## Still Having Issues?

1. **Fork the working config**
   - All config files are set up correctly
   - Try reverting your changes to config files

2. **Start fresh**
   ```bash
   git checkout main
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Check Netlify status**
   - Visit: https://www.netlifystatus.com/

4. **Try Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --build
   ```

## Success Indicators

✅ Local build succeeds: `npm run build`  
✅ No TypeScript errors: `npx tsc --noEmit`  
✅ No ESLint errors: `npm run lint`  
✅ Netlify build completes  
✅ Site loads at Netlify URL  
✅ All routes work  
✅ No console errors  

---

**Last Updated**: Based on Netlify deployment configuration  
**Project**: EximpoGlobal Web Application  
**Build Tool**: Vite 6.0  
**Node Version**: 20

# 🚀 Quick Debug Guide

## You said you ran: `netlify build --debug`

**Please paste the FULL OUTPUT here** so I can diagnose the exact issue!

## In the meantime, run these diagnostic commands:

### 1. Check Hidden Files
```bash
bash check-hidden-files.sh
```

Or manually:
```bash
echo "=== .nvmrc ==="
cat .nvmrc
echo ""
echo "=== .npmrc ==="
cat .npmrc
echo ""
echo "=== Files ===="
ls -la | grep "^\."
```

### 2. Run Pre-flight Check
```bash
npm run preflight
```

### 3. Test Local Build
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build
npm run build
```

### 4. Run Netlify Build with Debug
```bash
netlify build --debug > netlify-debug.log 2>&1
cat netlify-debug.log
```

## 🎯 What to Look For in netlify build --debug Output

### Stage 1: Dependency Installation
```
Installing dependencies
> npm install
```

**Look for**:
- ❌ `ERR!` lines - indicates npm install failures
- ⚠️ `WARN` lines - usually okay if they're peer dependency warnings
- ✅ `added X packages` - success indicator

**Common errors**:
```
npm ERR! peer dependency conflict
→ Solution: Check .npmrc has legacy-peer-deps=true

npm ERR! code ENOTFOUND
→ Solution: Network issue or package doesn't exist

npm ERR! 404 Not Found
→ Solution: Package version doesn't exist
```

### Stage 2: Build Command Execution
```
Running build command: npm run build
> vite build
```

**Look for**:
- ❌ `Error:` lines - build failures
- ✅ `✓ built in Xs` - success
- ✅ `dist/index.html X kB` - files created

**Common errors**:
```
Error: Cannot find module
→ Solution: Missing dependency or wrong import path

Error: TypeScript compilation failed
→ Solution: Type errors (but we removed tsc from build)

Error: [postcss] Cannot find module '@tailwindcss/postcss'
→ Solution: Missing PostCSS packages
```

### Stage 3: Deploy
```
Deploy succeeded
```

## 📋 Checklist Format

Copy this and fill in the results:

```
[ ] .nvmrc exists and contains: ___________
[ ] .npmrc exists and contains: ___________
[ ] node_modules exists: Yes/No
[ ] npm run preflight: Pass/Fail
[ ] npm run build locally: Success/Fail
[ ] netlify build --debug: Success/Fail
```

## 🔥 If netlify build --debug FAILS

Look at the output and find:

1. **The FIRST error line** (not the last)
2. **The stage where it failed**:
   - Install dependencies → Check .npmrc, package.json
   - Build command → Check vite.config.ts, imports
   - Deploy → Check build output

3. **Copy these sections**:
   ```
   # From the start of the failing stage to the error
   # Example:
   Installing dependencies
   > npm install
   ...
   npm ERR! code ERESOLVE
   npm ERR! ERESOLVE unable to resolve dependency tree
   ```

## 💡 Common Fixes Based on Error

### "dependency_installation script returned non-zero exit code: 1"

**Fix 1**: Check .npmrc
```bash
cat .npmrc
# Should show: legacy-peer-deps=true

# If not:
echo "legacy-peer-deps=true" > .npmrc
```

**Fix 2**: Check Node version
```bash
node -v
# Should be: v20.x.x

# If not:
nvm use 20
```

**Fix 3**: Check package.json
```bash
cat package.json | grep -A 5 '"scripts"'
# Should have: "build": "vite build"
```

### "Build script returned non-zero exit code"

**Fix 1**: Test locally
```bash
npm run build
# See the actual error
```

**Fix 2**: Check imports
```bash
# Look for bad imports
grep -r "from '@/" components/ | head -5
```

**Fix 3**: Check vite config
```bash
cat vite.config.ts
# Verify it's using node:url API
```

### "Cannot find module"

**Fix 1**: Install missing package
```bash
npm install package-name
```

**Fix 2**: Check import path
```bash
# Wrong:
import { X } from '@/components/X'
# Right:
import { X } from './components/X'
```

## 🎪 Expected Success Output

When everything works, `netlify build --debug` should show:

```
┌─────────────────────────────┐
│                             │
│   1. Loading build config   │
│                             │
└─────────────────────────────┘

  ✔ Resolved config
  ✔ Using Node version 20.11.0

┌─────────────────────────────┐
│                             │
│   2. Install dependencies   │
│                             │
└─────────────────────────────┘

  $ npm install
  
  added 423 packages in 12s

┌─────────────────────────────┐
│                             │
│   3. Build                  │
│                             │
└─────────────────────────────┘

  $ npm run build
  
  > eximpoglobal-web@1.0.0 build
  > vite build
  
  vite v6.0.5 building for production...
  ✓ 845 modules transformed.
  dist/index.html                0.45 kB │ gzip:  0.30 kB
  dist/assets/index-abc123.css  45.67 kB │ gzip: 12.34 kB
  dist/assets/index-xyz789.js  234.56 kB │ gzip: 78.90 kB
  ✓ built in 10.23s

  (build.command completed in 10.5s)

┌─────────────────────────────┐
│                             │
│   4. Deploy                 │
│                             │
└─────────────────────────────┘

  Site is live ✨
```

## 📤 What to Send Me

Please paste:

1. **Full output of**: `netlify build --debug`
2. **Output of**: `bash check-hidden-files.sh`
3. **Output of**: `npm run preflight`
4. **Your Node version**: `node -v`
5. **Your NPM version**: `npm -v`

With this information, I can give you an exact fix!

## 🏃 Quick One-Liner Diagnostics

Copy and paste this to run all checks:

```bash
echo "=== Node/NPM ===" && node -v && npm -v && \
echo "" && echo "=== .nvmrc ===" && cat .nvmrc && \
echo "" && echo "=== .npmrc ===" && cat .npmrc && \
echo "" && echo "=== Build Script ===" && cat package.json | grep '"build"' && \
echo "" && echo "=== node_modules ===" && ls -d node_modules 2>/dev/null || echo "Not found" && \
echo "" && echo "=== Test Build ===" && npm run build 2>&1 | tail -10
```

## ✅ Final Verification Steps

Before deploying to Netlify:

```bash
# 1. Verify hidden files
ls -la | grep "^\." | grep -E "nvmrc|npmrc|gitignore"

# 2. Verify content
cat .nvmrc && echo "" && cat .npmrc

# 3. Clean install
rm -rf node_modules package-lock.json && npm install

# 4. Build test
npm run build

# 5. If all pass, try Netlify
netlify build --debug
```

---

**Waiting for your `netlify build --debug` output!** 🎯

Once you paste it, I can identify the exact issue and provide a specific fix.

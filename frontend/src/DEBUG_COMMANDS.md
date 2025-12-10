# Debug Commands for Deployment Issues

## 🔍 Step-by-Step Debugging

### Step 1: Check File Structure

```bash
# List all files including hidden ones
ls -la

# Check if hidden files exist
cat .nvmrc
cat .npmrc
cat .gitignore
```

**Expected**:
- `.nvmrc` should contain: `20.11.0`
- `.npmrc` should contain: `legacy-peer-deps=true`
- `.gitignore` should exist with proper exclusions

### Step 2: Run Pre-flight Check

```bash
# Run our custom check script
npm run preflight
```

This will verify all configuration files and dependencies.

### Step 3: Check Node and NPM Versions

```bash
# Check versions
node -v    # Should be 20.x.x
npm -v     # Should be 9.x.x or 10.x.x

# If wrong version, use nvm
nvm use 20
```

### Step 4: Clean Install Dependencies

```bash
# Remove old installations
rm -rf node_modules package-lock.json

# Fresh install
npm install

# Check for errors in the output
```

**Common issues**:
- Peer dependency warnings → Normal, we handle with legacy-peer-deps
- Error ERR! → Check the specific package causing issues

### Step 5: Test Build Locally

```bash
# Build the project
npm run build

# Should create dist/ folder
ls -la dist/
```

**Success indicators**:
- No errors in console
- `dist/` folder created
- `dist/index.html` exists
- `dist/assets/` folder with JS/CSS files

### Step 6: Test with Netlify CLI (Debug Mode)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Run debug build
netlify build --debug
```

**Look for in output**:
- Which Node version is being used
- Which packages are being installed
- Any error messages during npm install
- Build command execution

### Step 7: Inspect Configuration Files

```bash
# Check package.json build script
cat package.json | grep -A 5 "scripts"

# Check netlify.toml
cat netlify.toml

# Check vite.config.ts
cat vite.config.ts
```

## 🐛 Common Error Patterns

### Error: "dependency_installation script returned non-zero exit code: 1"

**Causes**:
1. `.npmrc` file has invalid syntax
2. Node version mismatch
3. Package conflicts
4. Network issues during install

**Debug commands**:
```bash
# Check .npmrc syntax
cat .npmrc
# Should be: legacy-peer-deps=true

# Test with npm ci (more strict)
npm ci

# Test with verbose output
npm install --verbose

# Test with specific registry
npm install --registry=https://registry.npmjs.org/
```

### Error: "Module not found"

**Debug commands**:
```bash
# Check if module is in package.json
cat package.json | grep "module-name"

# Check node_modules
ls node_modules/ | grep "module-name"

# Install specific package
npm install module-name --save

# Check import paths
grep -r "from.*module-name" .
```

### Error: TypeScript compilation errors

**Debug commands**:
```bash
# Check TypeScript without building
npm run typecheck

# Check specific file
npx tsc --noEmit components/ComponentName.tsx

# Check tsconfig
cat tsconfig.json
```

### Error: PostCSS/Tailwind errors

**Debug commands**:
```bash
# Check PostCSS config
cat postcss.config.js

# Check Tailwind packages
npm list tailwindcss
npm list @tailwindcss/postcss

# Check globals.css
head -n 20 styles/globals.css
```

## 📊 Detailed Debug Output

### Get Full Dependency Tree
```bash
npm list --depth=0
```

### Check for Vulnerabilities
```bash
npm audit
```

### Check for Outdated Packages
```bash
npm outdated
```

### Verify Package Integrity
```bash
npm install --package-lock-only
```

## 🔧 Fix Common Issues

### Hidden Files Not Found

```bash
# Create .nvmrc
echo "20.11.0" > .nvmrc

# Create .npmrc
echo "legacy-peer-deps=true" > .npmrc

# Verify
cat .nvmrc
cat .npmrc
```

### Wrong Node Version

```bash
# Install nvm if not installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 20
nvm install 20

# Use Node 20
nvm use 20

# Set default
nvm alias default 20
```

### Package Lock Conflicts

```bash
# Remove lock file
rm package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps

# Commit new lock file
git add package-lock.json
git commit -m "Update package-lock.json"
```

### Netlify Cache Issues

```bash
# Clear Netlify cache via CLI
netlify build --clear-cache

# Or via UI
# Go to: Deploys → Trigger deploy → Clear cache and deploy site
```

## 📝 Collect Debug Information

When asking for help, run these commands and save output:

```bash
# System info
echo "=== System Info ===" > debug-info.txt
node -v >> debug-info.txt
npm -v >> debug-info.txt
echo "" >> debug-info.txt

# File checks
echo "=== Hidden Files ===" >> debug-info.txt
cat .nvmrc >> debug-info.txt 2>&1
cat .npmrc >> debug-info.txt 2>&1
echo "" >> debug-info.txt

# Package info
echo "=== Package.json Scripts ===" >> debug-info.txt
cat package.json | grep -A 10 "scripts" >> debug-info.txt
echo "" >> debug-info.txt

# Build test
echo "=== Build Test ===" >> debug-info.txt
npm run build >> debug-info.txt 2>&1

# Show file
cat debug-info.txt
```

## 🎯 Quick Diagnosis Script

Copy and paste this entire block:

```bash
#!/bin/bash
echo "🔍 Quick Deployment Diagnosis"
echo "=============================="
echo ""
echo "📁 Project files:"
ls -1 | head -10
echo ""
echo "🔒 Hidden files:"
ls -la | grep "^\." | grep -v "^\.$" | grep -v "^\.\.$"
echo ""
echo "📦 Node/NPM versions:"
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo ""
echo "🔢 .nvmrc content:"
cat .nvmrc 2>/dev/null || echo "File not found"
echo ""
echo "⚙️  .npmrc content:"
cat .npmrc 2>/dev/null || echo "File not found"
echo ""
echo "🏗️  Build script:"
cat package.json | grep '"build"' || echo "Build script not found"
echo ""
echo "📂 node_modules status:"
if [ -d "node_modules" ]; then
    echo "✅ Exists ($(du -sh node_modules 2>/dev/null | cut -f1))"
else
    echo "❌ Not found - run: npm install"
fi
echo ""
echo "🔨 Testing build..."
npm run build >/dev/null 2>&1 && echo "✅ Build succeeded" || echo "❌ Build failed - check logs above"
```

Save as `diagnose.sh`, make executable: `chmod +x diagnose.sh`, run: `./diagnose.sh`

## 🚀 Final Verification

Before deploying, ensure:

```bash
# 1. Check passes
npm run preflight

# 2. Build succeeds
npm run build

# 3. Files exist
ls dist/index.html

# 4. Netlify config valid
cat netlify.toml

# 5. Git status clean
git status
```

All should pass! ✅

## 📞 Getting Help

If issues persist, provide:

1. **Output of**:
   - `npm run preflight`
   - `npm run build` (full output)
   - `netlify build --debug` (full output)

2. **File contents**:
   - `cat .nvmrc`
   - `cat .npmrc`
   - `cat package.json | grep -A 15 "scripts"`

3. **Versions**:
   - `node -v`
   - `npm -v`

4. **Netlify build log**:
   - Copy from Netlify deploy page
   - Include at least 50 lines around the error

---

**Pro tip**: Most issues are fixed by:
1. Ensuring hidden files exist and have correct content
2. Using Node 20.x
3. Clean install: `rm -rf node_modules package-lock.json && npm install`
4. Building locally first: `npm run build`

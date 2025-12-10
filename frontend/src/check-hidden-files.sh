#!/bin/bash

# Check Hidden Files for Netlify Deployment
# Run this to verify your hidden config files

echo "🔍 Checking Hidden Configuration Files"
echo "======================================="
echo ""

# Check .nvmrc
echo "📄 .nvmrc:"
if [ -f .nvmrc ]; then
    echo "  ✅ File exists"
    echo "  Content: '$(cat .nvmrc)'"
    if cat .nvmrc | grep -q "^20"; then
        echo "  ✅ Node version 20.x specified"
    else
        echo "  ⚠️  Warning: Expected Node 20.x, got: $(cat .nvmrc)"
    fi
else
    echo "  ❌ File does not exist"
    echo "  Creating .nvmrc with Node 20.11.0..."
    echo "20.11.0" > .nvmrc
    echo "  ✅ Created"
fi
echo ""

# Check .npmrc
echo "📄 .npmrc:"
if [ -f .npmrc ]; then
    echo "  ✅ File exists"
    echo "  Content:"
    cat .npmrc | sed 's/^/    /'
    if cat .npmrc | grep -q "legacy-peer-deps"; then
        echo "  ✅ legacy-peer-deps configured"
    else
        echo "  ⚠️  Warning: legacy-peer-deps not found"
        echo "  Adding legacy-peer-deps..."
        echo "legacy-peer-deps=true" >> .npmrc
        echo "  ✅ Added"
    fi
else
    echo "  ❌ File does not exist"
    echo "  Creating .npmrc with legacy-peer-deps..."
    echo "legacy-peer-deps=true" > .npmrc
    echo "  ✅ Created"
fi
echo ""

# Check .gitignore
echo "📄 .gitignore:"
if [ -f .gitignore ]; then
    echo "  ✅ File exists"
    echo "  Lines: $(wc -l < .gitignore)"
    if cat .gitignore | grep -q "node_modules"; then
        echo "  ✅ Excludes node_modules"
    else
        echo "  ⚠️  Warning: node_modules not excluded"
    fi
    if cat .gitignore | grep -q "dist"; then
        echo "  ✅ Excludes dist"
    else
        echo "  ⚠️  Warning: dist not excluded"
    fi
else
    echo "  ❌ File does not exist"
    echo "  ⚠️  .gitignore should be created"
fi
echo ""

# Check other critical files
echo "📄 Other Critical Files:"
critical_files=("package.json" "netlify.toml" "vite.config.ts" "tsconfig.json" "index.html" "main.tsx")
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file MISSING"
    fi
done
echo ""

# Check node_modules
echo "📦 Dependencies:"
if [ -d node_modules ]; then
    size=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo "  ✅ node_modules exists ($size)"
else
    echo "  ⚠️  node_modules not found"
    echo "  Run: npm install"
fi
echo ""

# Summary
echo "======================================="
echo "📋 Summary:"
echo ""

all_good=true

if [ ! -f .nvmrc ]; then
    echo "❌ .nvmrc missing"
    all_good=false
fi

if [ ! -f .npmrc ]; then
    echo "❌ .npmrc missing"
    all_good=false
fi

if [ ! -f package.json ]; then
    echo "❌ package.json missing"
    all_good=false
fi

if [ ! -f netlify.toml ]; then
    echo "❌ netlify.toml missing"
    all_good=false
fi

if [ ! -d node_modules ]; then
    echo "⚠️  node_modules missing - run: npm install"
fi

if [ "$all_good" = true ]; then
    echo "✅ All critical files present!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Run: npm install (if node_modules missing)"
    echo "   2. Run: npm run build"
    echo "   3. If successful, deploy to Netlify"
else
    echo ""
    echo "⚠️  Some files are missing or need attention"
    echo "   Review the messages above"
fi
echo ""

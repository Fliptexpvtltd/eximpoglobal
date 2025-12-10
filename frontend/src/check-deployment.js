#!/usr/bin/env node

/**
 * Pre-flight Check Script for Netlify Deployment
 * Run this before deploying to catch common issues
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const checks = [];
let hasErrors = false;

function checkFile(path, name, required = true) {
  const exists = existsSync(path);
  if (exists) {
    checks.push({ status: '✅', message: `${name} exists` });
    return true;
  } else {
    checks.push({ 
      status: required ? '❌' : '⚠️', 
      message: `${name} ${required ? 'MISSING' : 'not found (optional)'}` 
    });
    if (required) hasErrors = true;
    return false;
  }
}

function checkJSON(path, name, validations = {}) {
  if (!checkFile(path, name)) return;
  
  try {
    const content = JSON.parse(readFileSync(path, 'utf-8'));
    
    // Check scripts
    if (validations.scripts) {
      for (const [script, expected] of Object.entries(validations.scripts)) {
        if (content.scripts?.[script]) {
          checks.push({ 
            status: '✅', 
            message: `  └─ Script '${script}' exists: ${content.scripts[script]}` 
          });
        } else {
          checks.push({ 
            status: '❌', 
            message: `  └─ Script '${script}' MISSING` 
          });
          hasErrors = true;
        }
      }
    }
    
    // Check dependencies
    if (validations.dependencies) {
      for (const dep of validations.dependencies) {
        if (content.dependencies?.[dep] || content.devDependencies?.[dep]) {
          checks.push({ 
            status: '✅', 
            message: `  └─ Dependency '${dep}' installed` 
          });
        } else {
          checks.push({ 
            status: '⚠️', 
            message: `  └─ Dependency '${dep}' not found` 
          });
        }
      }
    }
    
    // Check engines
    if (validations.checkEngines && content.engines?.node) {
      checks.push({ 
        status: '✅', 
        message: `  └─ Node engine specified: ${content.engines.node}` 
      });
    } else if (validations.checkEngines) {
      checks.push({ 
        status: '⚠️', 
        message: `  └─ Node engine not specified in package.json` 
      });
    }
    
  } catch (error) {
    checks.push({ 
      status: '❌', 
      message: `  └─ Failed to parse ${name}: ${error.message}` 
    });
    hasErrors = true;
  }
}

console.log('\n🔍 EximpoGlobal Deployment Pre-flight Check\n');
console.log('='.repeat(50));

// Check critical files
console.log('\n📁 Critical Files:');
checkFile('package.json', 'package.json');
checkFile('index.html', 'index.html');
checkFile('main.tsx', 'main.tsx');
checkFile('App.tsx', 'App.tsx');
checkFile('vite.config.ts', 'vite.config.ts');
checkFile('tsconfig.json', 'tsconfig.json');
checkFile('netlify.toml', 'netlify.toml');
checkFile('postcss.config.js', 'postcss.config.js');
checkFile('styles/globals.css', 'styles/globals.css');

// Check hidden files
console.log('\n🔒 Hidden Configuration Files:');
checkFile('.nvmrc', '.nvmrc', false);
checkFile('.npmrc', '.npmrc', false);
checkFile('.gitignore', '.gitignore', false);

// Check package.json details
console.log('\n📦 Package.json Validation:');
checkJSON('package.json', 'package.json', {
  scripts: {
    'build': true,
    'dev': true,
  },
  dependencies: [
    'react',
    'react-dom',
    'lucide-react',
  ],
  checkEngines: true,
});

// Check for node_modules
console.log('\n📚 Dependencies:');
if (existsSync('node_modules')) {
  checks.push({ status: '✅', message: 'node_modules exists' });
} else {
  checks.push({ status: '⚠️', message: 'node_modules not found - run: npm install' });
}

if (existsSync('package-lock.json')) {
  checks.push({ status: '✅', message: 'package-lock.json exists' });
} else {
  checks.push({ status: '⚠️', message: 'package-lock.json not found - run: npm install' });
}

// Check .nvmrc content
console.log('\n🔢 Node Version Configuration:');
if (existsSync('.nvmrc')) {
  try {
    const nvmrc = readFileSync('.nvmrc', 'utf-8').trim();
    if (nvmrc.match(/^20/)) {
      checks.push({ status: '✅', message: `.nvmrc specifies Node ${nvmrc}` });
    } else {
      checks.push({ status: '⚠️', message: `.nvmrc has unexpected version: ${nvmrc}` });
    }
  } catch (error) {
    checks.push({ status: '❌', message: `.nvmrc read error: ${error.message}` });
    hasErrors = true;
  }
}

// Check .npmrc content
console.log('\n⚙️  NPM Configuration:');
if (existsSync('.npmrc')) {
  try {
    const npmrc = readFileSync('.npmrc', 'utf-8');
    if (npmrc.includes('legacy-peer-deps')) {
      checks.push({ status: '✅', message: '.npmrc has legacy-peer-deps configured' });
    } else {
      checks.push({ status: '⚠️', message: '.npmrc exists but legacy-peer-deps not found' });
    }
  } catch (error) {
    checks.push({ status: '❌', message: `.npmrc read error: ${error.message}` });
    hasErrors = true;
  }
}

// Check netlify.toml
console.log('\n🌐 Netlify Configuration:');
if (existsSync('netlify.toml')) {
  try {
    const netlifyToml = readFileSync('netlify.toml', 'utf-8');
    
    if (netlifyToml.includes('command')) {
      checks.push({ status: '✅', message: 'Build command configured' });
    } else {
      checks.push({ status: '❌', message: 'Build command not found' });
      hasErrors = true;
    }
    
    if (netlifyToml.includes('publish')) {
      checks.push({ status: '✅', message: 'Publish directory configured' });
    } else {
      checks.push({ status: '❌', message: 'Publish directory not found' });
      hasErrors = true;
    }
    
    if (netlifyToml.includes('NODE_VERSION')) {
      const match = netlifyToml.match(/NODE_VERSION\s*=\s*"([^"]+)"/);
      if (match) {
        checks.push({ status: '✅', message: `Node version set to ${match[1]}` });
      }
    } else {
      checks.push({ status: '⚠️', message: 'NODE_VERSION not specified' });
    }
    
  } catch (error) {
    checks.push({ status: '❌', message: `netlify.toml read error: ${error.message}` });
    hasErrors = true;
  }
}

// Mobile directory check
console.log('\n📱 Mobile Directory:');
if (existsSync('mobile')) {
  checks.push({ status: '✅', message: 'Mobile directory exists (should be excluded from web build)' });
  
  // Check if tsconfig excludes mobile
  try {
    const tsconfig = JSON.parse(readFileSync('tsconfig.json', 'utf-8'));
    if (tsconfig.exclude?.includes('mobile')) {
      checks.push({ status: '✅', message: '  └─ tsconfig.json excludes mobile' });
    } else {
      checks.push({ status: '⚠️', message: '  └─ tsconfig.json should exclude mobile directory' });
    }
  } catch (error) {
    // Already reported in earlier check
  }
}

// Print all checks
console.log('\n' + '='.repeat(50));
console.log('\n📋 Results:\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.message}`);
});

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('\n❌ ERRORS FOUND - Fix the issues above before deploying');
  console.log('\n💡 Quick fixes:');
  console.log('   - Missing files: Ensure all critical files exist');
  console.log('   - Run: npm install');
  console.log('   - Check hidden files: ls -la');
  console.log('   - Verify package.json has build script');
  process.exit(1);
} else {
  console.log('\n✅ ALL CHECKS PASSED - Ready to deploy!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm run build');
  console.log('   2. If successful, deploy to Netlify');
  console.log('   3. Or run: netlify build --debug');
  console.log('');
  process.exit(0);
}

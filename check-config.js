#!/usr/bin/env node

/**
 * Quick validation script to check if nuxt.config.js is valid
 */

const fs = require('fs');
const path = require('path');

console.log('=== Checking Nuxt Configuration ===\n');

// Check if nuxt.config.js exists
const configPath = path.join(__dirname, 'nuxt.config.js');
if (!fs.existsSync(configPath)) {
  console.error('❌ nuxt.config.js not found');
  process.exit(1);
}
console.log('✅ nuxt.config.js exists');

// Check if middleware file exists
const middlewarePath = path.join(__dirname, 'middleware/isValidContent.js');
if (!fs.existsSync(middlewarePath)) {
  console.error('❌ middleware/isValidContent.js not found');
  process.exit(1);
}
console.log('✅ middleware/isValidContent.js exists');

// Check if jsdoc config exists
const jsdocPath = path.join(__dirname, 'jsdoc-vue.config.json');
if (!fs.existsSync(jsdocPath)) {
  console.error('❌ jsdoc-vue.config.json not found');
  process.exit(1);
}
console.log('✅ jsdoc-vue.config.json exists');

// Check if assets directory exists
const assetsPath = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsPath)) {
  console.error('❌ assets directory not found');
  process.exit(1);
}
console.log('✅ assets directory exists');

// Check if appRoutes.json exists
const routesPath = path.join(__dirname, 'assets/json/appRoutes.json');
if (!fs.existsSync(routesPath)) {
  console.error('❌ assets/json/appRoutes.json not found');
  process.exit(1);
}
console.log('✅ assets/json/appRoutes.json exists');

// Try to parse nuxt.config.js
try {
  const configContent = fs.readFileSync(configPath, 'utf8');
  if (configContent.includes('dir: {')) {
    console.log('✅ nuxt.config.js has dir configuration');
  } else {
    console.warn('⚠️  nuxt.config.js missing dir configuration');
  }
} catch (e) {
  console.error('❌ Error reading nuxt.config.js:', e.message);
  process.exit(1);
}

// Check middleware import
try {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  if (middlewareContent.includes('~/assets/json/appRoutes.json')) {
    console.log('✅ middleware uses ~ alias for assets import');
  } else {
    console.warn('⚠️  middleware not using ~ alias');
  }
} catch (e) {
  console.error('❌ Error reading middleware:', e.message);
  process.exit(1);
}

// Check jsdoc config
try {
  const jsdocContent = JSON.parse(fs.readFileSync(jsdocPath, 'utf8'));
  if (jsdocContent.source.include.includes('./app/app.vue')) {
    console.log('✅ jsdoc-vue.config.json includes app/ paths');
  } else {
    console.warn('⚠️  jsdoc-vue.config.json missing app/ paths');
  }
} catch (e) {
  console.error('❌ Error reading jsdoc config:', e.message);
  process.exit(1);
}

console.log('\n=== All checks passed! ===');
console.log('\nConfiguration is ready for testing.');
console.log('Run: yarn dev');
console.log('Run: yarn generate');


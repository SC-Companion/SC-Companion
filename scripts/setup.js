#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌌 SC Companion Setup Script');
console.log('=============================\n');

function runCommand(command, cwd = process.cwd()) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Failed to run: ${command}`);
    console.error(error.message);
    return false;
  }
}

function createDirectoryIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

function main() {
  console.log('1. Installing dependencies...');
  
  // Install root dependencies first
  if (!runCommand('npm install --no-workspaces')) {
    console.log('⚠️  Root install failed, trying with workspaces...');
  }
  
  // Install each workspace individually
  const workspaces = [
    'services/api',
    'packages/shared', 
    'packages/sdk'
  ];
  
  for (const workspace of workspaces) {
    console.log(`Installing dependencies for ${workspace}...`);
    if (!runCommand('npm install', path.join(__dirname, '..', workspace))) {
      console.log(`⚠️  Failed to install dependencies for ${workspace}`);
    }
  }

  console.log('\n2. Setting up API environment...');
  const apiDir = path.join(__dirname, '..', 'services', 'api');
  const envExamplePath = path.join(apiDir, '.env.example');
  const envPath = path.join(apiDir, '.env');

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Created .env file from template');
    } else {
      console.log('⚠️  .env.example not found, please create .env manually');
    }
  } else {
    console.log('✅ .env file already exists');
  }

  console.log('\n3. Creating upload directory...');
  createDirectoryIfNotExists(path.join(apiDir, 'uploads'));

  console.log('\n4. Running database migrations...');
  if (!runCommand('npm run migrate', apiDir)) {
    console.log('⚠️  Migration failed - you may need to set up your database first');
  }

  console.log('\n5. Running database seeds...');
  if (!runCommand('npm run seed', apiDir)) {
    console.log('⚠️  Seeds failed - you may need to run migrations first');
  }

  console.log('\n6. Building packages...');
  if (!runCommand('npm run build --workspace=packages/shared')) {
    console.log('⚠️  Failed to build shared package');
  }
  if (!runCommand('npm run build --workspace=packages/sdk')) {
    console.log('⚠️  Failed to build SDK package');
  }
  if (!runCommand('npm run build --workspace=services/api')) {
    console.log('⚠️  Failed to build API');
  }

  console.log('\n🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('- Edit services/api/.env if needed');
  console.log('- Run "npm run dev" to start the API');
  console.log('- Access the API at http://localhost:3001');
  console.log('- Check http://localhost:3001/health for status');
  console.log('\nTest accounts created:');
  console.log('- admin@sc-companion.com (Super Admin)');
  console.log('- moderator@sc-companion.com (Moderator)');
  console.log('- alice@example.com (User)');
  console.log('- bob@example.com (User)');
  console.log('- All passwords: password123');
  console.log('\nFly safe, citizen! o7');
}

main();
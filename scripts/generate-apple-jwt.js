#!/usr/bin/env node

/**
 * Apple Sign-In JWT Client Secret Generator
 * 
 * This script generates a JWT client secret for Apple Sign-In using your Apple Developer credentials.
 * 
 * Usage:
 * 1. Get your Apple Developer credentials:
 *    - Team ID: From Apple Developer Console (top right corner)
 *    - Client ID: Your Service ID (created in Identifiers section)
 *    - Key ID: From the key you downloaded (J9275LDFHQ in your case)
 * 
 * 2. Run this script:
 *    node scripts/generate-apple-jwt.js
 * 
 * 3. Enter your credentials when prompted
 * 4. Copy the generated JWT to your Supabase Apple Sign-In configuration
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function generateAppleJWT() {
  console.log('🍎 Apple Sign-In JWT Client Secret Generator\n');
  
  try {
    // Get Apple Developer credentials
    const teamId = await question('Enter your Apple Team ID: ');
    const clientId = await question('Enter your Apple Client ID (Service ID): ');
    const keyId = await question('Enter your Apple Key ID (J9275LDFHQ): ');
    
    // Path to your private key
    const keyPath = '/Users/gregwoulfe/Downloads/AuthKey_J9275LDFHQ.p8';
    
    // Check if key file exists
    if (!fs.existsSync(keyPath)) {
      console.error('❌ Private key file not found at:', keyPath);
      console.log('Please ensure your AuthKey_J9275LDFHQ.p8 file is in Downloads folder');
      process.exit(1);
    }
    
    // Read the private key
    const privateKey = fs.readFileSync(keyPath, 'utf8');
    
    // Generate JWT payload
    const payload = {};
    
    // JWT options
    const options = {
      algorithm: 'ES256',
      expiresIn: '180d', // Apple recommends 6 months max
      audience: 'https://appleid.apple.com',
      issuer: teamId,
      subject: clientId,
      keyid: keyId,
    };
    
    // Generate the JWT
    const token = jwt.sign(payload, privateKey, options);
    
    console.log('\n✅ Apple Sign-In JWT Client Secret Generated!\n');
    console.log('📋 Copy this JWT to your Supabase Apple Sign-In configuration:\n');
    console.log('─'.repeat(80));
    console.log(token);
    console.log('─'.repeat(80));
    
    console.log('\n📝 Configuration Details:');
    console.log(`Team ID: ${teamId}`);
    console.log(`Client ID: ${clientId}`);
    console.log(`Key ID: ${keyId}`);
    console.log(`Expires: ${new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()}`);
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to Authentication > Providers > Apple');
    console.log('3. Paste the JWT above as the "Client Secret"');
    console.log('4. Set Client ID to:', clientId);
    console.log('5. Enable the Apple provider');
    
  } catch (error) {
    console.error('❌ Error generating JWT:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the generator
generateAppleJWT();

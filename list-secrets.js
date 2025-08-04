// <SecretListingScriptSnippet>
// ES Module version - This script exports ONLY specific environment variables to a .env file
// More secure as it only exports what you explicitly need

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (needed in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=== Exporting Specific Environment Variables to .env File ===");

// Define the specific variables you want to export
const requiredVars = [
  // Microsoft Graph API (for email sending)
  'MICROSOFT_CLIENT_ID',
  'MICROSOFT_CLIENT_SECRET',
  'MICROSOFT_TENANT_ID',
  
  // OpenAI API
  'OPENAI_API_KEY',
  
  // PostgreSQL Database
  'DATABASE_URL',
  'PGHOST',
  'PGUSER',
  'PGPASSWORD',
  'PGDATABASE',
  'PGPORT',
  
  // Email Service (Resend)
  'RESEND_API_KEY',
  
  // Monitoring (Sentry)
  'SENTRY_AUTH_TOKEN',
  'SENTRY_DSN',
  'SENTRY_BACKEND_DSN',
  'VITE_SENTRY_DSN',
  'SENTRY_ORG',
  'SENTRY_PROJECT'
];

// Build the content for the .env file
let envContent = '# Environment Variables Export\n';
envContent += `# Generated on: ${new Date().toISOString()}\n`;
envContent += '# WARNING: This file contains sensitive information!\n\n';

// Group variables by category for better organization
const categories = {
  'Microsoft Graph API (for email sending)': [
    'MICROSOFT_CLIENT_ID',
    'MICROSOFT_CLIENT_SECRET', 
    'MICROSOFT_TENANT_ID'
  ],
  'OpenAI API': ['OPENAI_API_KEY'],
  'PostgreSQL Database': [
    'DATABASE_URL',
    'PGHOST',
    'PGUSER', 
    'PGPASSWORD',
    'PGDATABASE',
    'PGPORT'
  ],
  'Email Service (Resend)': ['RESEND_API_KEY'],
  'Monitoring (Sentry)': [
    'SENTRY_AUTH_TOKEN',
    'SENTRY_DSN',
    'SENTRY_BACKEND_DSN',
    'VITE_SENTRY_DSN',
    'SENTRY_ORG',
    'SENTRY_PROJECT'
  ]
};

// Track found and missing variables
let foundVars = 0;
let missingVars = [];

// Process each category
Object.entries(categories).forEach(([categoryName, vars]) => {
  envContent += `# ${categoryName}\n`;
  
  vars.forEach(varName => {
    const value = process.env[varName];
    
    if (value !== undefined && value !== '') {
      // Escape any quotes in the value and wrap in quotes if contains spaces
      const escapedValue = value.includes(' ') || value.includes('"') 
        ? `"${value.replace(/"/g, '\\"')}"` 
        : value;
      envContent += `${varName}=${escapedValue}\n`;
      foundVars++;
    } else {
      // Variable is missing or empty
      envContent += `${varName}=\n`;
      missingVars.push(varName);
    }
  });
  
  envContent += '\n';
});

// Write to .env file
const envFilePath = path.join(process.cwd(), '.env');

try {
  fs.writeFileSync(envFilePath, envContent);
  console.log(`✅ Successfully created .env file at: ${envFilePath}`);
  console.log(`📄 Variables exported: ${foundVars}/${requiredVars.length}`);
  
  if (missingVars.length > 0) {
    console.log('\n⚠️  Missing or empty variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
  }
  
  // Show the complete file content (since it's limited now)
  console.log('\n📋 File content:');
  console.log('-'.repeat(50));
  console.log(envContent);
  console.log('-'.repeat(50));
  
} catch (error) {
  console.error('❌ Error writing .env file:', error.message);
}

console.log("\n⚠️  SECURITY REMINDERS:");
console.log("1. Add .env to your .gitignore file IMMEDIATELY!");
console.log("2. Never commit this file to version control");
console.log("3. Store this file securely or delete after use");

// Check if .gitignore exists and if .env is already in it
try {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignoreContent.includes('.env')) {
      console.log("\n⚠️  .env is NOT in your .gitignore! Add it now:");
      console.log("   echo '.env' >> .gitignore");
    }
  }
} catch (error) {
  // Ignore errors reading .gitignore
}
// </SecretListingScriptSnippet>
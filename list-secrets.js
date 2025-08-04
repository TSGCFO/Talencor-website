// <SecretListingScriptSnippet>
// This script lists all environment variables available to your app
// Note: This will only show the secret names, not their values (for security)
// To see the actual values, you'll need to view them in the Replit Secrets pane

console.log("=== Available Environment Variables ===");
console.log("(This includes both regular env vars and secrets)\n");

// Get all environment variable names
const envVarNames = Object.keys(process.env).sort();

// Common Replit system variables to filter out (optional)
const systemVars = [
  'REPL_ID', 'REPL_SLUG', 'REPL_OWNER', 'REPLIT_DB_URL', 
  'HOME', 'PATH', 'NODE_ENV', 'PORT', 'HOSTNAME'
];

console.log("Your App Secrets and Custom Environment Variables:");
console.log("-".repeat(50));

envVarNames.forEach(name => {
  // Skip common system variables to focus on your secrets
  if (!systemVars.includes(name) && !name.startsWith('REPLIT_')) {
    // For security, we only show the name and first few characters
    const value = process.env[name];
    const maskedValue = value ? value.substring(0, 4) + '...' : 'undefined';
    console.log(`${name}: ${maskedValue}`);
  }
});

console.log("\nSystem Environment Variables:");
console.log("-".repeat(50));

systemVars.forEach(name => {
  if (process.env[name]) {
    console.log(`${name}: ${process.env[name]}`);
  }
});

console.log("\n⚠️  IMPORTANT SECURITY NOTES:");
console.log("1. Never share the actual secret values publicly");
console.log("2. To see full secret values, use the Replit Secrets pane");
console.log("3. Store any exported secrets in a secure location");
console.log("4. Consider using a password manager for sensitive data");
// </SecretListingScriptSnippet>
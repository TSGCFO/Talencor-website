// <AdminSeedScriptSnippet>
// This script creates an initial admin user for the system
// Think of it like creating the first key for a new lock

import { hashPassword } from './auth';
import { storage } from './storage';
import { db } from './db';

// <CreateAdminUserSnippet>
// This function creates a new admin user in the database
// It's like registering the first VIP member who can manage everything
async function createAdminUser() {
  console.log('Creating admin user...');
  
  try {
    // <DefaultCredentialsSnippet>
    // These are the default login details for the first admin
    // IMPORTANT: Change these after first login for security!
    const adminUsername = 'admin';
    const adminPassword = 'TalencorAdmin2025!'; // Strong default password
    // </DefaultCredentialsSnippet>
    
    // <CheckIfExistsSnippet>
    // First, check if an admin already exists
    // We don't want to create duplicate admin accounts
    const existingAdmin = await storage.getUserByUsername(adminUsername);
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log(`Username: ${adminUsername}`);
      console.log('Please use the existing credentials to log in.');
      return;
    }
    // </CheckIfExistsSnippet>
    
    // <HashPasswordSnippet>
    // Convert the password into a secure format
    // This scrambles it so even if someone sees the database, they can't read the password
    const hashedPassword = await hashPassword(adminPassword);
    // </HashPasswordSnippet>
    
    // <CreateUserSnippet>
    // Create the admin user in the database
    const newAdmin = await storage.createUser({
      username: adminUsername,
      password: hashedPassword,
      isAdmin: true
    });
    // </CreateUserSnippet>
    
    // <SuccessMessageSnippet>
    // Tell the user that the admin was created successfully
    console.log('✅ Admin user created successfully!');
    console.log('=====================================');
    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    console.log('=====================================');
    console.log('⚠️  IMPORTANT: Please change this password after first login!');
    console.log('To log in, visit: /admin/login');
    // </SuccessMessageSnippet>
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}
// </CreateAdminUserSnippet>

// <RunScriptSnippet>
// This part runs the function when you execute the script
// It's like pressing the "start" button
createAdminUser()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
// </RunScriptSnippet>
// </AdminSeedScriptSnippet>
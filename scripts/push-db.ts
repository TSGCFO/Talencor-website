import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function pushDbChanges() {
  console.log('Pushing database schema changes...');
  
  try {
    // Create client_activities table
    await sql`
      CREATE TABLE IF NOT EXISTS client_activities (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id),
        activity_type TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        details TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    // Create client_code_requests table
    await sql`
      CREATE TABLE IF NOT EXISTS client_code_requests (
        id SERIAL PRIMARY KEY,
        company_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        reason TEXT,
        status TEXT DEFAULT 'pending' NOT NULL,
        approved_by INTEGER REFERENCES users(id),
        approved_at TIMESTAMP,
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    // Add new columns to clients table
    await sql`
      ALTER TABLE clients 
      ADD COLUMN IF NOT EXISTS code_expires_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0 NOT NULL,
      ADD COLUMN IF NOT EXISTS max_logins INTEGER
    `;
    
    console.log('✅ Database schema updated successfully!');
  } catch (error) {
    console.error('Error updating database schema:', error);
    process.exit(1);
  }
}

pushDbChanges().then(() => process.exit(0));
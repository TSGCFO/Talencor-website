// <ClientSeedingScriptSnippet>
// This script creates test clients with access codes in the database
// It's like setting up a guest list at a party - each client gets their own special code

import { db } from "./db";
import { clients } from "@shared/schema";

async function seedClients() {
  console.log("🌱 Creating test clients with access codes...");

  try {
    // <TestClientDataSnippet>
    // These are example companies with their special access codes
    // Think of access codes like VIP passes - they let existing clients skip the line
    const testClients = [
      {
        // <AcmeClientSnippet>
        // Acme Corporation - A classic test company (like in cartoons!)
        companyName: "Acme Corporation",
        contactName: "John Smith",
        email: "john.smith@acme.com",
        phone: "416-555-0001",
        accessCode: "ACME2025", // Their special VIP code
        isActive: true
      },
      {
        // <TechStartupClientSnippet>
        // Tech Startup Inc - A modern technology company
        companyName: "Tech Startup Inc",
        contactName: "Sarah Johnson",
        email: "sarah@techstartup.com",
        phone: "647-555-0002",
        accessCode: "TECH2025", // Their special VIP code
        isActive: true
      },
      {
        // <GlobalCorpClientSnippet>
        // Global Corp - A large international company
        companyName: "Global Corp",
        contactName: "Michael Chen",
        email: "mchen@globalcorp.com",
        phone: "905-555-0003",
        accessCode: "GLOB2025", // Their special VIP code
        isActive: true
      }
    ];
    // </TestClientDataSnippet>

    // <InsertClientsSnippet>
    // Now we put these clients into our database
    // onConflictDoNothing means if they already exist, we don't create duplicates
    const insertedClients = await db
      .insert(clients)
      .values(testClients)
      .returning()
      .onConflictDoNothing(); // Skip if company already exists
    // </InsertClientsSnippet>

    // <SuccessMessageSnippet>
    // Tell us how many clients were created
    console.log(`✅ Created ${insertedClients.length} test clients`);
    
    // Show each client's details (but hide part of the access code for security)
    insertedClients.forEach(client => {
      const maskedCode = client.accessCode.slice(0, 4) + "****";
      console.log(`   - ${client.companyName} (Code: ${maskedCode})`);
    });
    // </SuccessMessageSnippet>

    // <ExistingClientsCheckSnippet>
    // If some clients already existed, let's check what we have
    if (insertedClients.length < testClients.length) {
      console.log("\n📋 Some clients already existed. Current clients:");
      
      // Get all active clients from the database
      const allClients = await db
        .select()
        .from(clients)
        .where(eq(clients.isActive, true));
      
      // Show all clients with masked access codes
      allClients.forEach(client => {
        const maskedCode = client.accessCode.slice(0, 4) + "****";
        console.log(`   - ${client.companyName} (Code: ${maskedCode})`);
      });
    }
    // </ExistingClientsCheckSnippet>

    console.log("\n✨ Client seeding completed!");
    console.log("Test access codes: ACME2025, TECH2025, GLOB2025");
    
  } catch (error) {
    console.error("❌ Error seeding clients:", error);
    throw error;
  }
}

// <ImportRequirementSnippet>
// We need to import 'eq' to check if clients are active
import { eq } from "drizzle-orm";
// </ImportRequirementSnippet>

// <RunSeedingSnippet>
// Run the seeding function and then exit
seedClients()
  .then(() => {
    console.log("\n👍 All done! Clients are ready to use their access codes.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });
// </RunSeedingSnippet>
// </ClientSeedingScriptSnippet>
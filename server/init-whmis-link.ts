import { db } from "./db";
import { dynamicLinks } from "@shared/schema";
import { eq } from "drizzle-orm";

async function initializeWhmisLink() {
  try {
    console.log("Initializing WHMIS training link...");
    
    // Check if link already exists
    const [existing] = await db
      .select()
      .from(dynamicLinks)
      .where(eq(dynamicLinks.key, "whmis_training"));
    
    const currentUrl = "https://aixsafety.com/wp-content/uploads/articulate_uploads/WMS-July27-2025Aix/story.html";
    
    if (existing) {
      // Update existing link
      await db
        .update(dynamicLinks)
        .set({
          url: currentUrl,
          lastChecked: new Date(),
          updatedAt: new Date()
        })
        .where(eq(dynamicLinks.key, "whmis_training"));
        
      console.log("Updated WHMIS training link");
    } else {
      // Insert new link
      await db
        .insert(dynamicLinks)
        .values({
          key: "whmis_training",
          url: currentUrl,
          description: "WHMIS Training - Free online training from aixsafety.com",
          lastChecked: new Date()
        });
        
      console.log("Created WHMIS training link");
    }
    
    console.log(`WHMIS link set to: ${currentUrl}`);
    process.exit(0);
  } catch (error) {
    console.error("Error initializing WHMIS link:", error);
    process.exit(1);
  }
}

initializeWhmisLink();
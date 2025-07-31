import { db } from "./db";
import { dynamicLinks } from "@shared/schema";
import { eq } from "drizzle-orm";

interface LinkUpdater {
  key: string;
  description: string;
  fetchLatestUrl: () => Promise<string | null>;
  fallbackUrl: string;
}

// Define link updaters for different dynamic links
const linkUpdaters: LinkUpdater[] = [
  {
    key: "whmis_training",
    description: "WHMIS Training - Free online training link",
    fetchLatestUrl: async () => {
      try {
        // Fetch from aixsafety.com which provides free WHMIS training
        const response = await fetch("https://aixsafety.com/free-online-whmis-training/");
        if (!response.ok) {
          // Try alternative URL
          const altResponse = await fetch("https://aixsafety.com/");
          if (!altResponse.ok) return null;
          const html = await altResponse.text();
          
          // Look for WHMIS training links on aixsafety.com
          const whmisMatch = html.match(/href=["'](https?:\/\/aixsafety\.com[^"']*whmis[^"']*?)["']/i);
          if (whmisMatch && whmisMatch[1]) {
            return whmisMatch[1];
          }
        }
        
        const html = await response.text();
        
        // Look for articulate storyline links (the format they use for training)
        const articulateMatch = html.match(/href=["'](https?:\/\/aixsafety\.com\/wp-content\/uploads\/articulate_uploads\/[^"']+\/story\.html?)["']/i);
        if (articulateMatch && articulateMatch[1]) {
          return articulateMatch[1];
        }
        
        // Look for any WHMIS training links with specific patterns
        const patterns = [
          /href=["'](https?:\/\/aixsafety\.com[^"']*WMS[^"']*story\.html?)["']/i,
          /href=["'](https?:\/\/aixsafety\.com[^"']*whmis[^"']*training[^"']*?)["']/i,
          /href=["'](https?:\/\/aixsafety\.com[^"']*free[^"']*whmis[^"']*?)["']/i,
        ];
        
        for (const pattern of patterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            return match[1];
          }
        }
        
        // Default to the known working link format
        // This will be updated when new versions are found
        return "https://aixsafety.com/wp-content/uploads/articulate_uploads/WMS-July27-2025Aix/story.html";
        
      } catch (error) {
        console.error("Error fetching WHMIS training link from aixsafety.com:", error);
        return null;
      }
    },
    fallbackUrl: "/contact"
  }
];

// Function to update a specific link
export async function updateDynamicLink(updater: LinkUpdater) {
  try {
    console.log(`Updating ${updater.key} link...`);
    
    // Fetch the latest URL
    const newUrl = await updater.fetchLatestUrl();
    
    if (!newUrl) {
      console.error(`Failed to fetch new URL for ${updater.key}`);
      return false;
    }
    
    // Check if link exists in database
    const [existing] = await db
      .select()
      .from(dynamicLinks)
      .where(eq(dynamicLinks.key, updater.key));
    
    if (existing) {
      // Update existing link
      await db
        .update(dynamicLinks)
        .set({
          url: newUrl,
          lastChecked: new Date(),
          updatedAt: existing.url !== newUrl ? new Date() : existing.updatedAt
        })
        .where(eq(dynamicLinks.key, updater.key));
        
      console.log(`Updated ${updater.key} link to: ${newUrl}`);
    } else {
      // Insert new link
      await db
        .insert(dynamicLinks)
        .values({
          key: updater.key,
          url: newUrl,
          description: updater.description,
          lastChecked: new Date()
        });
        
      console.log(`Created ${updater.key} link: ${newUrl}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating ${updater.key} link:`, error);
    return false;
  }
}

// Function to update all dynamic links
export async function updateAllDynamicLinks() {
  console.log("Starting dynamic link updates...");
  
  for (const updater of linkUpdaters) {
    await updateDynamicLink(updater);
  }
  
  console.log("Dynamic link updates completed");
}

// Function to schedule periodic updates
export function scheduleLinkUpdates() {
  // Update immediately on server start
  updateAllDynamicLinks().catch(console.error);
  
  // Schedule updates every week (7 days)
  const interval = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  
  setInterval(() => {
    updateAllDynamicLinks().catch(console.error);
  }, interval);
  
  console.log("Dynamic link updater scheduled (every 7 days)");
}
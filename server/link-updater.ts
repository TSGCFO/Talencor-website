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
        // Fetch from WHMIS.ca official website
        const response = await fetch("https://www.whmis.ca/");
        if (!response.ok) return null;
        
        const html = await response.text();
        
        // Look for free training links on the page
        // Pattern 1: Direct links to free training
        const freeTrainingMatch = html.match(/href=["']([^"']*free[^"']*training[^"']*?)["']/i);
        if (freeTrainingMatch && freeTrainingMatch[1]) {
          const url = freeTrainingMatch[1];
          // Convert relative URLs to absolute
          if (url.startsWith('/')) {
            return `https://www.whmis.ca${url}`;
          } else if (url.startsWith('http')) {
            return url;
          }
        }
        
        // Pattern 2: Look for CCOHS free training link
        const ccohsMatch = html.match(/href=["'](https?:\/\/www\.ccohs\.ca[^"']*training[^"']*?)["']/i);
        if (ccohsMatch && ccohsMatch[1]) {
          return ccohsMatch[1];
        }
        
        // Pattern 3: Generic free WHMIS training patterns
        const patterns = [
          /href=["'](https?:\/\/[^"']*whmis[^"']*free[^"']*?)["']/i,
          /href=["'](https?:\/\/[^"']*free[^"']*whmis[^"']*?)["']/i,
        ];
        
        for (const pattern of patterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            return match[1];
          }
        }
        
        // If no specific free training link found, return the main WHMIS site
        return "https://www.whmis.ca/";
        
      } catch (error) {
        console.error("Error fetching WHMIS training link:", error);
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
  
  // Schedule updates every 6 hours
  const interval = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  
  setInterval(() => {
    updateAllDynamicLinks().catch(console.error);
  }, interval);
  
  console.log("Dynamic link updater scheduled (every 6 hours)");
}
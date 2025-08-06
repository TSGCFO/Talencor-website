# WHMIS Training Link Updater - Comprehensive Documentation

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [Automated Link Fetching](#automated-link-fetching)
5. [API Endpoints](#api-endpoints)
6. [Frontend Integration](#frontend-integration)
7. [Scheduling and Automation](#scheduling-and-automation)
8. [Error Handling and Fallbacks](#error-handling-and-fallbacks)
9. [Maintenance and Monitoring](#maintenance-and-monitoring)

## Overview

The WHMIS (Workplace Hazardous Materials Information System) Training Link
Updater is an automated system designed to maintain up-to-date training links
from aixsafety.com. Since external training providers frequently update their
course URLs, this system ensures users always have access to valid training
resources without manual intervention.

### Key Features

- **Fully Automated**: Updates links every 7 days without manual intervention
- **Intelligent Scraping**: Uses multiple patterns to find valid training links
- **Database Persistence**: Stores links in PostgreSQL with timestamps
- **API Access**: RESTful endpoints for link retrieval and management
- **Fallback Mechanism**: Redirects to contact page if link unavailable
- **Audit Trail**: Tracks when links were last checked and updated

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Server Initialization                      │
│                     (server/index.ts)                            │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Link Updater Scheduler                         │
│               (scheduleLinkUpdates() called)                      │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Automated Link Fetcher                          │
│                (server/link-updater.ts)                          │
│  • Runs immediately on server start                              │
│  • Scheduled every 7 days                                        │
│  • Fetches from aixsafety.com                                   │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                            │
│                  (dynamic_links table)                           │
│  • Stores current URL                                            │
│  • Tracks last check time                                        │
│  • Records update history                                        │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Endpoints                                │
│                   (server/routes.ts)                             │
│  • GET /api/dynamic-links/whmis_training                        │
│  • PUT /api/dynamic-links/:key                                  │
│  • GET /api/dynamic-links                                       │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Components                            │
│              (client/src/pages/services/training.tsx)           │
│  • Fetches link via API                                         │
│  • Handles loading states                                        │
│  • Implements fallback behavior                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

The system uses a PostgreSQL table to store dynamic links:

```typescript
// shared/schema.ts
export const dynamicLinks = pgTable("dynamic_links", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // 'whmis_training'
  url: text("url").notNull(), // Current valid URL
  description: text("description"), // Human-readable description
  lastChecked: timestamp("last_checked") // When last verified
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at") // When URL changed
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at") // When first created
    .defaultNow()
    .notNull(),
});
```

### Sample Database Entry

```json
{
  "id": 1,
  "key": "whmis_training",
  "url": "https://aixsafety.com/wp-content/uploads/articulate_uploads/WMS-July27-2025Aix/story.html",
  "description": "WHMIS Training - Free online training from aixsafety.com",
  "lastChecked": "2025-07-31T18:40:51.000Z",
  "updatedAt": "2025-07-31T18:40:51.000Z",
  "createdAt": "2025-07-31T15:00:00.000Z"
}
```

## Automated Link Fetching

The core of the automation lies in `server/link-updater.ts`:

### 1. Link Updater Configuration

```typescript
interface LinkUpdater {
  key: string; // Unique identifier
  description: string; // Human-readable description
  fetchLatestUrl: () => Promise<string | null>; // Fetching logic
  fallbackUrl: string; // Fallback if fetch fails
}
```

### 2. WHMIS Training Link Fetcher

The system employs a multi-strategy approach to find valid training links:

```typescript
const linkUpdaters: LinkUpdater[] = [
  {
    key: "whmis_training",
    description: "WHMIS Training - Free online training link",
    fetchLatestUrl: async () => {
      try {
        // Primary URL fetch
        const response = await fetch(
          "https://aixsafety.com/free-online-whmis-training/"
        );

        if (!response.ok) {
          // Fallback to homepage
          const altResponse = await fetch("https://aixsafety.com/");
          // ... search for WHMIS links on homepage
        }

        const html = await response.text();

        // Strategy 1: Look for Articulate Storyline links
        // These are interactive training modules
        const articulateMatch = html.match(
          /href=["'](https?:\/\/aixsafety\.com\/wp-content\/uploads\/articulate_uploads\/[^"']+\/story\.html?)["']/i
        );

        // Strategy 2: Try multiple patterns
        const patterns = [
          /href=["'](https?:\/\/aixsafety\.com[^"']*WMS[^"']*story\.html?)["']/i,
          /href=["'](https?:\/\/aixsafety\.com[^"']*whmis[^"']*training[^"']*?)["']/i,
          /href=["'](https?:\/\/aixsafety\.com[^"']*free[^"']*whmis[^"']*?)["']/i,
        ];

        // Return first matching link or default
        // ...
      } catch (error) {
        console.error("Error fetching WHMIS training link:", error);
        return null;
      }
    },
    fallbackUrl: "/contact",
  },
];
```

### 3. Update Process

The update process handles both creation and updates:

```typescript
export async function updateDynamicLink(updater: LinkUpdater) {
  // 1. Fetch latest URL
  const newUrl = await updater.fetchLatestUrl();

  // 2. Check if link exists in database
  const [existing] = await db
    .select()
    .from(dynamicLinks)
    .where(eq(dynamicLinks.key, updater.key));

  if (existing) {
    // 3a. Update only if URL changed
    await db
      .update(dynamicLinks)
      .set({
        url: newUrl,
        lastChecked: new Date(),
        updatedAt: existing.url !== newUrl ? new Date() : existing.updatedAt,
      })
      .where(eq(dynamicLinks.key, updater.key));
  } else {
    // 3b. Create new entry
    await db.insert(dynamicLinks).values({
      key: updater.key,
      url: newUrl,
      description: updater.description,
      lastChecked: new Date(),
    });
  }
}
```

## API Endpoints

### 1. Get Specific Dynamic Link

**Endpoint**: `GET /api/dynamic-links/:key`

**Example**: `GET /api/dynamic-links/whmis_training`

**Response**:

```json
{
  "success": true,
  "link": {
    "id": 1,
    "key": "whmis_training",
    "url": "https://aixsafety.com/wp-content/uploads/articulate_uploads/WMS-July27-2025Aix/story.html",
    "description": "WHMIS Training - Free online training from aixsafety.com",
    "lastChecked": "2025-07-31T18:40:51.000Z",
    "updatedAt": "2025-07-31T18:40:51.000Z",
    "createdAt": "2025-07-31T15:00:00.000Z"
  }
}
```

### 2. Update Dynamic Link (Manual Override)

**Endpoint**: `PUT /api/dynamic-links/:key`

**Body**:

```json
{
  "url": "https://aixsafety.com/new-training-url/story.html"
}
```

### 3. Get All Dynamic Links

**Endpoint**: `GET /api/dynamic-links`

**Response**:

```json
{
  "success": true,
  "links": [
    {
      "key": "whmis_training",
      "url": "..."
      // ... other fields
    }
  ]
}
```

## Frontend Integration

The training page (`client/src/pages/services/training.tsx`) integrates with the
API:

```typescript
function TrainingPage() {
  const [whmisLink, setWhmisLink] = useState<string | null>(null);
  const [isLoadingLink, setIsLoadingLink] = useState(true);

  useEffect(() => {
    const fetchDynamicLink = async () => {
      try {
        const response = await fetch("/api/dynamic-links/whmis_training");
        const data = await response.json();

        if (data.success && data.link) {
          setWhmisLink(data.link.url);
        } else {
          // Fallback to contact page
          setWhmisLink("/contact");
        }
      } catch (error) {
        console.error("Failed to fetch WHMIS link:", error);
        setWhmisLink("/contact");
      } finally {
        setIsLoadingLink(false);
      }
    };

    fetchDynamicLink();
  }, []);

  // Button implementation
  const handleWhmisClick = () => {
    if (!isLoadingLink && whmisLink) {
      window.open(whmisLink, "_blank", "noopener,noreferrer");
    }
  };
}
```

## Scheduling and Automation

### Server Initialization

In `server/index.ts`:

```typescript
import { scheduleLinkUpdates } from "./link-updater";

// Start the automated link updater
scheduleLinkUpdates();
```

### Scheduling Logic

```typescript
export function scheduleLinkUpdates() {
  // 1. Update immediately on server start
  updateAllDynamicLinks().catch(console.error);

  // 2. Schedule weekly updates
  const interval = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  setInterval(() => {
    updateAllDynamicLinks().catch(console.error);
  }, interval);

  console.log("Dynamic link updater scheduled (every 7 days)");
}
```

### Update Frequency Rationale

- **Weekly (7 days)**: Balances between keeping links fresh and avoiding
  excessive requests
- **On server restart**: Ensures links are current when deploying updates
- **Manual override**: Available via API for immediate updates if needed

## Error Handling and Fallbacks

### 1. Fetch Failures

```typescript
try {
  const response = await fetch("https://aixsafety.com/...");
  if (!response.ok) {
    // Try alternative URLs
  }
} catch (error) {
  console.error("Error fetching WHMIS training link:", error);
  return null; // Will keep existing link in database
}
```

### 2. Database Failures

- If database update fails, error is logged but server continues
- Previous valid link remains in database

### 3. Frontend Fallbacks

- Loading state while fetching
- Falls back to `/contact` page if:
  - API request fails
  - No link found in database
  - Link is invalid

### 4. Default URL Pattern

```typescript
// Hardcoded fallback based on known URL pattern
return "https://aixsafety.com/wp-content/uploads/articulate_uploads/WMS-July27-2025Aix/story.html";
```

## Maintenance and Monitoring

### 1. Console Logging

The system provides detailed logging:

```
Starting dynamic link updates...
Updating whmis_training link...
Updated whmis_training link to: https://aixsafety.com/...
Dynamic link updates completed
```

### 2. Database Monitoring

Check link freshness:

```sql
SELECT
  key,
  url,
  lastChecked,
  updatedAt,
  EXTRACT(DAY FROM NOW() - lastChecked) as days_since_check
FROM dynamic_links
WHERE key = 'whmis_training';
```

### 3. Manual Link Verification

```bash
# Check if automated fetching is working
curl http://localhost:5000/api/dynamic-links/whmis_training

# Manually update if needed
curl -X PUT http://localhost:5000/api/dynamic-links/whmis_training \
  -H "Content-Type: application/json" \
  -d '{"url": "https://aixsafety.com/new-url/story.html"}'
```

### 4. Common Issues and Solutions

**Issue**: Link returns 404

- **Cause**: aixsafety.com changed their URL structure
- **Solution**: Update regex patterns in link-updater.ts

**Issue**: Fetch timeout

- **Cause**: Network issues or site down
- **Solution**: System keeps previous valid link

**Issue**: Wrong link captured

- **Cause**: Page structure changed
- **Solution**: Adjust regex patterns or add new search strategies

### 5. Future Enhancements

- Add email notifications when links fail to update
- Implement link validation (check if training page loads)
- Add support for multiple training providers
- Create admin dashboard for link management
- Add metrics tracking (update success rate, link uptime)

## Conclusion

The WHMIS Training Link Updater provides a robust, automated solution for
maintaining valid training links. By combining intelligent web scraping,
database persistence, and fallback mechanisms, it ensures users always have
access to training resources while minimizing manual maintenance.

The system's modular design allows for easy extension to support additional
dynamic links beyond WHMIS training, making it a scalable solution for managing
external resources that frequently change URLs.

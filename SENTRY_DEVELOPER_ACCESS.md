# Sentry Developer Access Guide

## Overview

The Sentry integration is configured for developer-only access to monitor project issues, errors, and user feedback. This integration provides real-time error tracking and performance monitoring for both frontend and backend.

## Important Limitations

### User Feedback Issues
**Note:** User feedback issues in Sentry cannot be resolved programmatically through the API due to Sentry's API limitations. These issues:
- Return 403 Forbidden or 405 Method Not Allowed errors when attempting to resolve via API
- Must be handled manually in the Sentry UI
- Can have comments added but cannot be marked as resolved through API calls

**Workaround:** When fixing bugs reported through user feedback:
1. Fix the underlying issue in the codebase
2. Add a comment to the Sentry issue documenting the fix
3. The issue will remain open in Sentry but the actual bug is resolved
4. Manually close the feedback in Sentry UI if needed

## API Endpoints Available

### 1. Get All Issues and Feedback
```bash
GET http://localhost:5000/api/sentry-feedback
```

Returns:
- All unresolved issues from your Sentry project
- User feedback reports
- Summary statistics (total issues, open/resolved counts)

### 2. Get Actual Sentry Issues
```bash
GET http://localhost:5000/api/sentry/actual/issues
```

Fetches the latest unresolved issues directly from Sentry API.

### 3. Resolve Single Issue
```bash
PATCH http://localhost:5000/api/sentry/actual/issues/:issueId/resolve
```

Body:
```json
{
  "status": "resolved",
  "comment": "Fixed in latest release"
}
```

### 4. Bulk Resolve Issues
```bash
POST http://localhost:5000/api/sentry/actual/issues/bulk-resolve
```

Body:
```json
{
  "issueIds": ["issue1", "issue2"],
  "status": "resolved",
  "comment": "Batch resolution"
}
```

### 5. Add Comment to Issue
```bash
POST http://localhost:5000/api/sentry/actual/issues/:issueId/comment
```

Body:
```json
{
  "comment": "Investigation notes..."
}
```

## Environment Variables Configured

- `SENTRY_DSN` - Backend error tracking
- `VITE_SENTRY_DSN` - Frontend error tracking  
- `SENTRY_AUTH_TOKEN` - API authentication
- `SENTRY_ORG` - Your organization slug
- `SENTRY_PROJECT` - Your project slug

## Accessing Sentry Data

### Option 1: Direct API Access
Use the API endpoints above with tools like curl or Postman:

```bash
# Get all issues and feedback
curl http://localhost:5000/api/sentry-feedback

# Get specific issues from Sentry
curl http://localhost:5000/api/sentry/actual/issues
```

### Option 2: Sentry Dashboard
Access your project directly at:
```
https://sentry.io/organizations/[YOUR_ORG]/issues/?project=[YOUR_PROJECT_ID]
```

### Option 3: Command Line
Monitor issues via command line:

```bash
# Watch for new issues (refresh every 30 seconds)
watch -n 30 'curl -s http://localhost:5000/api/sentry-feedback | jq ".summary"'
```

## What's Being Tracked

### Frontend (React)
- JavaScript errors and exceptions
- Performance metrics (Core Web Vitals)
- User sessions and interactions
- Network request failures
- Component render errors

### Backend (Express)
- Server errors (5xx)
- Database connection issues
- API endpoint failures
- Request/response performance
- Unhandled promise rejections

## Current Status

As of the last check:
- **9 active issues** in your Sentry project
- **0 user feedback reports**
- Real-time monitoring active with 30-second refresh

The integration is fully operational and monitoring all production errors and performance metrics.
# Sentry Configuration Guide

## Overview

Sentry has been integrated into both the frontend (React) and backend (Express) of your Talencor Staffing website. This document explains how to complete the setup and use Sentry effectively.

## Environment Variables Required

To activate Sentry, you need to add these environment variables:

### Backend (Server)
```
SENTRY_DSN=https://your-dsn-key@o123456.ingest.sentry.io/123456
NODE_ENV=production  # (or development)
```

### Frontend (Client)
```
VITE_SENTRY_DSN=https://your-dsn-key@o123456.ingest.sentry.io/123456
VITE_APP_VERSION=1.0.0  # Optional: for release tracking
```

## How to Get Your Sentry DSN

1. **Create a Sentry Account**: Go to [sentry.io](https://sentry.io) and sign up
2. **Create a New Project**: 
   - Choose "React" for frontend project
   - Choose "Express" for backend project
3. **Get DSN**: In your project settings, you'll find the DSN under "Client Keys (DSN)"

## Features Integrated

### Backend Error Monitoring
- **Automatic Error Capture**: All unhandled server errors are sent to Sentry
- **Performance Monitoring**: HTTP requests are tracked for performance insights
- **Enhanced Context**: Errors include request details and user context
- **Health Check Filtering**: Health check endpoints are excluded from error reporting

### Frontend Error Monitoring
- **React Error Boundary**: Catches and reports React component errors
- **User-Friendly Fallback**: Shows a helpful error page when something breaks
- **Performance Tracking**: Monitors page load times and user interactions
- **Session Replay**: Records user sessions for debugging (when enabled)

### Additional Features
- **Custom Error Logging**: Helper functions for manual error reporting
- **User Context**: Track specific users when they interact with your site
- **Breadcrumbs**: Track user actions leading up to errors
- **Environment Separation**: Different handling for development vs production

## Testing Sentry Integration

Once you've added the environment variables, you can test the integration:

### Backend Test
Add this test route temporarily to `server/routes.ts`:
```typescript
app.get('/api/test-error', () => {
  throw new Error('Test error for Sentry');
});
```

### Frontend Test
Add this test component temporarily:
```typescript
<button onClick={() => { throw new Error('Test frontend error'); }}>
  Test Error
</button>
```

## Helper Functions Available

### Backend (`server/sentry.ts`)
```typescript
import { captureError, captureEvent, setSentryUser, addBreadcrumb } from './sentry';

// Log custom events
captureEvent('User action completed', { userId: '123', action: 'form_submit' });

// Report errors with context
captureError(new Error('Something went wrong'), { userId: '123', page: 'contact' });

// Set user context
setSentryUser({ id: '123', email: 'user@example.com' });

// Add breadcrumbs
addBreadcrumb('User clicked submit button', 'user', { formId: 'contact-form' });
```

### Frontend (`client/src/lib/sentry.ts`)
```typescript
import { captureError, captureEvent, setSentryUser, addBreadcrumb } from '@/lib/sentry';

// Same helper functions available on frontend
```

## Benefits for Your Website

1. **Proactive Issue Detection**: Know about problems before users report them
2. **Better User Experience**: Quick error resolution improves site reliability
3. **Performance Insights**: Identify slow-loading pages and API calls
4. **User Context**: Understand which users are affected by issues
5. **Release Tracking**: Monitor error rates across different deployments

## Privacy Considerations

- Sentry is configured to mask sensitive information
- No passwords or payment details are captured
- Session replay can be disabled if privacy is a concern
- All data is encrypted in transit and at rest

## Next Steps

1. **Set Environment Variables**: Add the DSN keys to your Replit environment
2. **Test Integration**: Verify errors are being captured in Sentry dashboard
3. **Set Up Alerts**: Configure email/Slack notifications for critical errors
4. **Review Performance**: Use Sentry's performance monitoring to optimize your site
5. **Team Access**: Invite team members to your Sentry organization

## Support

If you need help with Sentry setup or have questions about the integration, refer to:
- [Sentry Documentation](https://docs.sentry.io/)
- [React Integration Guide](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Node.js Integration Guide](https://docs.sentry.io/platforms/node/)
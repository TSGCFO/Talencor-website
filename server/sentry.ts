import * as Sentry from "@sentry/node";

// Initialize Sentry for Node.js/Express backend
export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.warn("SENTRY_DSN environment variable not found. Sentry will not be initialized.");
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      // Performance monitoring
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Environment
    environment: process.env.NODE_ENV || "development",
    // Release tracking
    release: process.env.npm_package_version,
    // Enhanced error context
    beforeSend(event) {
      // Filter out health check endpoints
      if (event.request?.url?.includes('/health') || event.request?.url?.includes('/ping')) {
        return null;
      }
      return event;
    },
  });

  console.log("Sentry initialized for backend");
}

// Express error handler middleware
export const sentryErrorHandler = Sentry.expressErrorHandler({
  shouldHandleError(error: any) {
    // Only capture 5xx errors
    const status = error.status || error.statusCode || 500;
    return status >= 500;
  },
});

// Request handler middleware  
export const sentryRequestHandler = Sentry.setupExpressErrorHandler;

// Helper to capture custom events
export function captureEvent(message: string, extra?: Record<string, any>) {
  Sentry.captureMessage(message, {
    extra,
    level: "info",
  });
}

// Helper to capture errors with context
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Helper to set user context
export function setSentryUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

// Helper to add breadcrumb
export function addBreadcrumb(message: string, category?: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category: category || "custom",
    data,
    level: "info",
  });
}
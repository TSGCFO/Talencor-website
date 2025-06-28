import * as Sentry from "@sentry/react";
import React from "react";

// Initialize Sentry for React frontend
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn("VITE_SENTRY_DSN environment variable not found. Sentry will not be initialized.");
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      // Browser tracing for performance monitoring
      Sentry.browserTracingIntegration(),
      // Replay integration for session recordings (optional)
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Session Replay (optional)
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    // Environment
    environment: import.meta.env.MODE,
    // Release tracking
    release: import.meta.env.VITE_APP_VERSION,
    // Enhanced error context
    beforeSend(event) {
      // Filter out development errors
      if (import.meta.env.DEV && event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value?.includes('ResizeObserver') || 
            error?.value?.includes('Non-Error promise rejection')) {
          return null;
        }
      }
      return event;
    },
    // User context
    initialScope: {
      tags: {
        component: "frontend",
      },
    },
  });

  console.log("Sentry initialized for frontend");
}

// React Error Boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary;

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
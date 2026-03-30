import * as Sentry from "@sentry/react";
import React from "react";

// Initialize Sentry for React frontend with production-optimized configuration
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.warn("VITE_SENTRY_DSN environment variable not found. Sentry will not be initialized.");
    }
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      // Performance monitoring with route tracking
      Sentry.browserTracingIntegration({
        enableLongTask: true,
        enableInp: true,
      }),
      // Session replay for debugging (production optimized)
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: true,
        maskAllInputs: true,
        // Capture console logs and network requests
        networkDetailAllowUrls: [window.location.origin],
        networkCaptureBodies: false,
      }),
      // Browser profiling for performance insights
      Sentry.browserProfilingIntegration(),
      // Feedback integration for user reports
      Sentry.feedbackIntegration({
        colorScheme: "system",
        showBranding: false,
      }),
    ],
    // Performance monitoring rates
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    profilesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    
    // Environment and release tracking
    environment: import.meta.env.MODE,
    release: `talencor-frontend@${import.meta.env.VITE_APP_VERSION || "1.0.0"}`,
    
    // Enhanced error filtering and context
    beforeSend(event, hint) {
      // Filter out common development and browser errors
      if (event.exception) {
        const error = event.exception.values?.[0];
        const errorMessage = error?.value || "";
        
        // Skip common browser/dev errors
        if (
          errorMessage.includes('ResizeObserver') ||
          errorMessage.includes('Non-Error promise rejection') ||
          errorMessage.includes('Script error') ||
          errorMessage.includes('ChunkLoadError') ||
          (import.meta.env.DEV && errorMessage.includes('HMR'))
        ) {
          return null;
        }
      }
      
      // Add additional context for production errors
      if (import.meta.env.PROD && event.request) {
        event.extra = {
          ...event.extra,
          buildVersion: import.meta.env.VITE_APP_VERSION,
          deploymentTime: import.meta.env.VITE_DEPLOYMENT_TIME,
        };
      }
      
      return event;
    },
    
    // Initial scope configuration
    initialScope: {
      tags: {
        component: "frontend",
        version: import.meta.env.VITE_APP_VERSION || "1.0.0",
        deployment: import.meta.env.PROD ? "production" : "development",
      },
      contexts: {
        app: {
          name: "Talencor Staffing Website",
          version: import.meta.env.VITE_APP_VERSION || "1.0.0",
        },
      },
    },

    // Advanced configuration
    sendDefaultPii: false, // Privacy compliance
    attachStacktrace: true,
    
    // Debug mode for development
    debug: import.meta.env.DEV,
  });

  // Set additional context with error handling
  try {
    Sentry.setContext("browser", {
      name: navigator.userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to set Sentry browser context:", error);
    }
  }

  if (import.meta.env.DEV) {
    console.log("Sentry initialized for frontend with enhanced configuration");
  }
}

// React Error Boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Helper to capture custom events
export function captureEvent(message: string, extra?: Record<string, any>) {
  try {
    Sentry.captureMessage(message, {
      extra,
      level: "info",
    });
  } catch (error) {
    // If Sentry itself fails, log to console in development
    if (import.meta.env.DEV) {
      console.warn("Sentry captureMessage failed:", error);
      console.log("Original message:", message, extra);
    }
    // Don't throw the error to prevent breaking the application flow
  }
}

// Helper to capture errors with context
export function captureError(error: Error, context?: Record<string, any>) {
  try {
    Sentry.captureException(error, {
      extra: context,
    });
  } catch (sentryError) {
    // If Sentry itself fails, log to console in development
    if (import.meta.env.DEV) {
      console.warn("Sentry captureException failed:", sentryError);
      console.error("Original error:", error, context);
    }
    // Don't throw the error to prevent breaking the application flow
  }
}

// Helper to set user context
export function setSentryUser(user: { id: string; email?: string; username?: string }) {
  try {
    Sentry.setUser(user);
  } catch (error) {
    // If Sentry itself fails, log to console in development
    if (import.meta.env.DEV) {
      console.warn("Sentry setUser failed:", error);
      console.log("User data:", user);
    }
    // Don't throw the error to prevent breaking the application flow
  }
}

// Helper to add breadcrumb
export function addBreadcrumb(message: string, category?: string, data?: Record<string, any>) {
  try {
    Sentry.addBreadcrumb({
      message,
      category: category || "custom",
      data,
      level: "info",
    });
  } catch (error) {
    // If Sentry itself fails, log to console in development
    if (import.meta.env.DEV) {
      console.warn("Sentry addBreadcrumb failed:", error);
      console.log("Breadcrumb data:", { message, category, data });
    }
    // Don't throw the error to prevent breaking the application flow
  }
}
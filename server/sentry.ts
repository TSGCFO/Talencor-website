import * as Sentry from "@sentry/node";

// Initialize Sentry for Node.js/Express backend with production-optimized configuration
export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    if (process.env.NODE_ENV === "development") {
      console.warn("SENTRY_DSN environment variable not found. Sentry will not be initialized.");
    }
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      // HTTP and Express monitoring
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
      // Database monitoring
      Sentry.postgresIntegration(),
      // File system monitoring
      Sentry.fsIntegration(),
      // Console integration for enhanced logging
      Sentry.consoleIntegration(),
      // Local variables integration for enhanced debugging
      Sentry.localVariablesIntegration({
        captureAllExceptions: false,
        maxExceptionsPerSecond: 5,
      }),
    ],
    
    // Performance monitoring rates
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Environment and release tracking
    environment: process.env.NODE_ENV || "development",
    release: `talencor-backend@${process.env.npm_package_version || "1.0.0"}`,
    serverName: process.env.REPL_SLUG || "talencor-backend",
    
    // Enhanced error filtering and context
    beforeSend(event, hint) {
      // Filter out non-critical endpoints
      if (event.request?.url) {
        const url = event.request.url;
        if (
          url.includes('/health') || 
          url.includes('/ping') || 
          url.includes('/favicon') ||
          url.includes('/robots.txt') ||
          url.includes('/sitemap.xml')
        ) {
          return null;
        }
      }
      
      // Add server context for production
      if (process.env.NODE_ENV === "production") {
        event.extra = {
          ...event.extra,
          nodeVersion: process.version,
          platform: process.platform,
          architecture: process.arch,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
        };
      }
      
      // Enhanced database error context
      if (hint.originalException && hint.originalException.toString().includes('database')) {
        event.extra = {
          ...event.extra,
          databaseContext: true,
          connectionString: process.env.DATABASE_URL ? '[REDACTED]' : 'Not configured',
        };
      }
      
      return event;
    },
    
    // Initial scope configuration
    initialScope: {
      tags: {
        component: "backend",
        version: process.env.npm_package_version || "1.0.0",
        deployment: process.env.NODE_ENV === "production" ? "production" : "development",
        runtime: `node-${process.version}`,
      },
      contexts: {
        app: {
          name: "Talencor Staffing API",
          version: process.env.npm_package_version || "1.0.0",
        },
        server: {
          name: process.env.REPL_SLUG || "talencor-backend",
          version: process.env.npm_package_version || "1.0.0",
        },
      },
    },

    // Advanced configuration
    sendDefaultPii: false, // Privacy compliance - no personally identifiable information
    attachStacktrace: true,
    
    // Debug mode for development
    debug: process.env.NODE_ENV === "development",
    
    // Transport options for reliability
    maxBreadcrumbs: 100,
    maxValueLength: 8192,
  });

  // Set server context
  Sentry.setContext("server", {
    name: "Talencor Staffing Backend",
    version: process.env.npm_package_version || "1.0.0",
    runtime: `Node.js ${process.version}`,
    platform: process.platform,
    architecture: process.arch,
  });

  // Set deployment context
  if (process.env.REPL_ID) {
    Sentry.setContext("deployment", {
      environment: "replit",
      replId: process.env.REPL_ID,
      replSlug: process.env.REPL_SLUG,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Sentry initialized for backend with enhanced configuration");
  }
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
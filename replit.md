# Talencor Staffing Website

## Overview

This project is a professional staffing agency website for Talencor Staffing, designed as a modern full-stack application. Its primary purpose is to serve as a marketing and lead generation platform, offering information on services, company details, and a contact form for potential clients and job seekers. The platform also includes advanced AI-powered career tools to assist job seekers.

## User Preferences

Preferred communication style: Simple, everyday language.

You are required to always generate code that is self-documenting using XML-style tags. This is a mandatory rule for all development work, across all programming languages and use cases.

Each code snippet must include:

- Clear XML-style section tags (e.g., `<emailoptionssnippet>, <userauthconfigsnippet>`) to define logical blocks.

- Inline comments written in simple, easy-to-understand language with no technical jargon.

- Descriptions that explain the purpose of each part of the code as if explaining to someone new to programming.

- Consistent formatting and structure across all snippets.

Refer to the following examples as a guide for style and expectations:

**Example 1 (TypeScript):**

```typescript

// <emailoptionssnippet></emailoptionssnippet>

// This section creates a template for what information every email needs

// It's like a checklist that makes sure we don't forget any important parts of an email

export interface EmailOptions {

to: string;      // Who gets the email (like writing the address on an envelope)

subject: string; // The title of the email (what people see before opening it)

text: string;    // The plain message (like a simple letter)

html?: string;   // A fancy version with colors and pictures (the ? means we don't always need this)

}

// </EmailOptionsSnippet>
```

**Example 2 (TypeScript):**

```typescript
// <GetUserSnippet>
// This function gets information about the current user
// It asks for only a few details to keep things simple and fast
export async function getUserAsync(): Promise<User> {
  // Make sure the client is ready
  if (!_userClient) {
    throw new Error('Graph has not been initialized for user auth');
  }

  return _userClient.api('/me')
    // Only request specific properties
    .select(['displayName', 'mail', 'userPrincipalName'])
    .get();
}
// </GetUserSnippet>
```

**Example 3 (Python):**

```python
# <GetInboxSnippet>
# This function checks the user's inbox and gets the latest 25 emails
# It only asks for important details like who sent it, when it arrived, and the subject
async def get_inbox(self):
    query_params = MessagesRequestBuilder.MessagesRequestBuilderGetQueryParameters(
        select=['from', 'isRead', 'receivedDateTime', 'subject'],
        top=25,
        orderby=['receivedDateTime DESC']
    )
    request_config = MessagesRequestBuilder.MessagesRequestBuilderGetRequestConfiguration(
        query_parameters=query_params
    )

    messages = await self.user_client.me.mail_folders.by_mail_folder_id('inbox').messages.get(
            request_configuration=request_config)
    return messages
# </GetInboxSnippet>
```

This documentation style must be applied universally, regardless of the language or use case. Always prioritize clarity, simplicity, and completeness.

## System Architecture

The application utilizes a monorepo structure with a clear separation of concerns, built on a modern full-stack architecture.

**Key Architectural Decisions:**
- **Full-Stack Monorepo:** Combines React frontend, Express.js backend, and PostgreSQL database within a single repository for streamlined development.
- **TypeScript First:** All components, frontend, and backend, are written in TypeScript for enhanced type safety and maintainability.
- **RESTful API:** The backend exposes RESTful endpoints for data exchange, primarily for contact form submissions and AI tool interactions.
- **Modern Frontend Stack:** Leverages React 18, Wouter for routing, Tailwind CSS for styling, Radix UI/shadcn/ui for accessible components, and TanStack Query for server state management.
- **Robust Form Handling:** Employs React Hook Form with Zod validation for secure and efficient form processing.
- **ORM for Database Interaction:** Drizzle ORM is used for type-safe interaction with PostgreSQL, with shared TypeScript schemas between client and server.
- **AI Integration:** Incorporates OpenAI's gpt-4o model for intelligent features such as resume enhancement, interview simulation, and dynamic question generation.
- **UI/UX Design:** Features a golden/orange color palette consistent with Talencor's branding, responsive design for optimal viewing across devices, and engaging micro-interactions and animated loading states for an enhanced user experience.
- **SEO Optimization:** Comprehensive SEO strategy including meta tags, structured data (Schema.org), XML sitemap, and Google-specific optimizations to maximize visibility.

**Core Features:**
- **Service Information & Company Details:** Dedicated sections for Talencor's offerings and corporate information.
- **Contact Form Functionality:** Secure submission and storage of inquiries with proper form validation and error handling.
- **AI-Powered Career Tools:**
    - **Resume Enhancement Wizard:** Utilizes AI for ATS optimization, keyword enhancement, and industry-specific improvements.
    - **Dynamic Interview Preparation Simulator:** Provides AI-generated personalized interview questions, real-time AI feedback with scoring, and voice recording capabilities.
    - **Customizable Interview Question Bank:** A CRUD system for managing and filtering interview questions by category, difficulty, and tags.
- **Job Listings Page:** Displays job postings with search functionality.
- **Dynamic External Links Management:** Database-driven system for managing external links that change periodically (e.g., WHMIS training links), with automatic updates and fallback mechanisms.
- **Job Posting System:** Comprehensive job submission workflow allowing businesses to post job openings, with client status detection, form validation, email notifications, honeypot spam prevention, and internal status tracking.

**Recent Updates (August 6, 2025):**
- Resolved additional Sentry error issues:
  - Fixed TypeError "'/api/resume/session' is not a valid HTTP method" by adding argument validation to apiRequest function
  - Added comprehensive error checking to prevent incorrect argument order in API calls
  - Resolved WebSocket connection error (environment-specific Vite HMR issue)
  - Cleaned up 6 informational Sentry logs about successful contact form submissions
- All Sentry error issues are now resolved with a clean error dashboard

**Recent Updates (August 5, 2025):**
- Fixed all unresolved Sentry user feedback issues:
  - Resume Wizard "Get Keywords" error: Fixed React rendering by properly handling keyword objects (keyword.term)
  - Employers page excessive white space: Reduced padding from py-20 to py-12 on sections
  - Job Seekers industry filter: Implemented working filter with URL parameters and visual indicator
  - Added comprehensive error handling to prevent crashes in Resume Wizard
- All 4 critical user feedback issues have been resolved and marked as such in Sentry

**Recent Updates (August 4, 2025):**
- Completed migration from Resend to Microsoft Graph API for email notifications:
  - Replaced Resend SDK with Microsoft Graph client using Azure AD app-only authentication
  - Updated email system to send from no-reply@talencor.com using Microsoft credentials
  - Enhanced email templates with professional HTML formatting and Talencor branding
  - Changed internal notification recipient from recruiting@talencor.com to info@talencor.com
  - Successfully tested both new client and existing client email workflows
  - Created comprehensive email system documentation (see EMAIL_SETUP_INSTRUCTIONS.md)
  - Maintained error handling and graceful fallbacks to prevent job posting failures
- Verified and documented Client Access Code system implementation:
  - Confirmed all core features are fully operational (database, API, frontend, admin)
  - Created seed script for test clients with self-documenting XML comments
  - Discovered existing test clients in database (Acme Corporation, Tech Solutions Inc, Global Manufacturing Ltd)
  - Created comprehensive documentation with XML tags and simple explanations (see CLIENT_ACCESS_CODE_DOCUMENTATION.md)
  - System allows existing clients to fast-track job postings using access codes
  - Fixed critical URL issue in internal email notifications:
    - Created getBaseUrl() function that automatically detects deployment environment
    - Production deployments use https://talencor.com
    - Replit preview deployments use REPLIT_DEV_DOMAIN
    - Local development uses http://localhost:5000
    - Internal emails now always link to the correct admin dashboard URL

**Recent Updates (August 3, 2025):**
- Completed comprehensive Job Posting System implementation:
  - Built full job posting submission form with real-time validation
  - Implemented email format and employment type validation (permanent, temporary, contract-to-hire)
  - Added honeypot spam prevention to block automated submissions
  - Created dual email notification system (confirmation to submitter, alert to recruiting@talencor.com)
  - Built admin dashboard for managing job postings with status tracking
  - Implemented 5-stage status workflow: new → contacted → contract_pending → posted → closed
  - Fixed validation bugs ensuring proper error handling for invalid inputs
  - Added comprehensive error handling including 404 responses for non-existent postings
  - Created detailed feature documentation (see JOB_POSTING_FEATURE_DOCUMENTATION.md)
- Enhanced Job Posting System with Client Access Code feature:
  - Implemented secure client access code verification system using PostgreSQL
  - Created dedicated clients table with company info and unique access codes
  - Added access code field to job posting form with real-time verification
  - Auto-populates form fields when valid access code is entered
  - Fast-tracks verified clients' job postings to "contacted" status
  - Sample access codes for testing: ACME2025, TECH2025, GLOB2025

**Recent Updates (July 31, 2025):**
- Fixed Submit Resume button to redirect to Resume Wizard (/resume-wizard) instead of contact page
- Implemented comprehensive dynamic link management system with PostgreSQL storage for URLs that change periodically
- Fixed WHMIS training link 404 error by fetching dynamic links from database with automatic fallback to contact page
- Fixed contact form submission failure by changing AnimatedButton from onClick handler to proper form submit type
- Resolved double form handling issue that prevented proper contact form submission
- Enhanced dynamic link system with automated updates:
  - Created automatic link updater that fetches latest WHMIS training links from aixsafety.com every 7 days
  - Integrated link updater with server startup to ensure links are always current
  - Set current WHMIS link to: https://aixsafety.com/wp-content/uploads/articulate_uploads/WMS-July27-2025Aix/story.html
- Maintained Sentry feedback widget (Report a Bug button) functionality
- Implemented AI-powered Resume Enhancement Wizard with OpenAI integration:
  - Real-time resume analysis and scoring
  - Section-by-section enhancement suggestions
  - ATS optimization recommendations
  - Industry-specific keyword suggestions
- Fixed Resume Wizard critical bugs (August 1, 2025):
  - Resolved database connection stability issues with improved pooling
  - Fixed "No values to set" errors with proper data validation
  - Enhanced AI response handling with fallback mechanisms
  - Improved error handling and user feedback throughout
- Created comprehensive documentation:
  - WHMIS link updater system (see WHMIS_LINK_UPDATER_DOCUMENTATION.md)
  - Resume Wizard complete guide (see RESUME_WIZARD_DOCUMENTATION.md)

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **@sentry/node**: Backend error monitoring and performance tracking
- **@sentry/react**: Frontend error monitoring
- **@sentry/vite-plugin**: Vite plugin for Sentry integration
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler
- **OpenAI API**: For AI-powered career tools (Resume Enhancement and Interview Simulator)
- **@microsoft/microsoft-graph-client**: Microsoft Graph SDK for email functionality
- **@azure/identity**: Azure authentication library for app-only Graph API access
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
- **RESTful API:** The backend exposes RESTful endpoints for data exchange.
- **Modern Frontend Stack:** Leverages React 18, Wouter for routing, Tailwind CSS for styling, Radix UI/shadcn/ui for accessible components, and TanStack Query for server state management.
- **Robust Form Handling:** Employs React Hook Form with Zod validation for secure and efficient form processing.
- **ORM for Database Interaction:** Drizzle ORM is used for type-safe interaction with PostgreSQL, with shared TypeScript schemas between client and server.
- **AI Integration:** Incorporates OpenAI's gpt-4.1-2025-04-14 model for intelligent features such as resume enhancement, interview simulation, and dynamic question generation.
- **UI/UX Design:** Features a golden/orange color palette consistent with Talencor's branding, responsive design for optimal viewing across devices, and engaging micro-interactions and animated loading states for an enhanced user experience.
- **SEO Optimization:** Comprehensive SEO strategy including meta tags, structured data (Schema.org), XML sitemap, and Google-specific optimizations to maximize visibility.

**Core Features:**
- **Service Information & Company Details:** Dedicated sections for Talencor's offerings and corporate information.
- **Contact Form Functionality:** Secure submission and storage of inquiries with proper form validation and error handling.
- **AI-Powered Career Tools:** Includes Resume Enhancement Wizard (ATS optimization, keyword enhancement) and Dynamic Interview Preparation Simulator (AI-generated personalized questions, real-time AI feedback, voice recording).
- **Customizable Interview Question Bank:** A CRUD system for managing and filtering interview questions by category, difficulty, and tags.
- **Job Listings Page:** Displays job postings with search functionality.
- **Dynamic External Links Management:** Database-driven system for managing external links (e.g., WHMIS training links), with automatic updates and fallback mechanisms.
- **Job Posting System:** Comprehensive job submission workflow with client status detection, form validation, email notifications, honeypot spam prevention, and internal status tracking. Includes a client portal with authentication, access codes, and an admin management dashboard.

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
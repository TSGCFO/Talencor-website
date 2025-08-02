# Talencor Staffing Website

## Overview

This project is a professional staffing agency website for Talencor Staffing, designed as a modern full-stack application. Its primary purpose is to serve as a marketing and lead generation platform, offering information on services, company details, and a contact form for potential clients and job seekers. The platform also includes advanced AI-powered career tools to assist job seekers.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **OpenAI API**: For AI-powered career tools (Resume Enhancement and Interview Simulator).